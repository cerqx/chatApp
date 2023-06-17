const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }

    if (emailCheck) {
      return res.json({ msg: "Email already used", status: false });
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    delete user.password;
    res.status(201).json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect username or password", status: false });
    }

    delete user.password;

    res.status(201).json({ status: true, user });
  } catch (err) {
    //next(err);
    res.status(404).json({ msg: "User not found!", status: false });
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ msg: "User not found!", status: false });
    }

    return res.status(200).json({ msg: "User deleted!", status: true });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select(["email", "username", "avatarImage", "_id"]);
    return res.json(users);
  } catch (err) {
    // res.json(404).json({ msg: "Contacts not found", status: false });
    next(err);
  }
};

module.exports.users = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
