const { register, login, setAvatar, getAllUsers, deleteUser } = require("../controllers/usersControllers");
const { users } = require("../controllers/usersControllers");

const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.get("/users", users);

router.post("/setAvatar/:id", setAvatar);

router.get("/allusers/:id", getAllUsers);

router.delete("/user/:id", deleteUser);

module.exports = router;
