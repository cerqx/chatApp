const Messages = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message added successfully" });
    }

    return res.json({ msg: "Failed to add message" });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectMessages);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Messages.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ msg: "Message not found!", status: false });
    }

    return res.status(200).json({ msg: "Message deleted!", status: true });
  } catch (err) {
    next(err);
  }
};
