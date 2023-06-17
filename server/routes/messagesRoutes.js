const { addMessage, getAllMessages, deleteMessage } = require("../controllers/messagesControllers");

const router = require("express").Router();

router.post("/addmessage", addMessage);
router.post("/getmessage", getAllMessages);
router.delete("/deletemessage/:id", deleteMessage);

module.exports = router;
