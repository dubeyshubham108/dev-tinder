const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");


requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    // Sending the connection request
    console.log("Sending a connection request");

    res.send(user.firstName + "sent  the connection request!");
});

module.exports = requestRouter;