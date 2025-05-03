const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const user = require("../models/user");

const connectionRequest = require("../models/connectionRequest")

requestRouter.post(
    "/request/send/:status/:toUserId", 
    userAuth, 
    async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid Status type " + status });
        }

        //check whether the user exist in the DB 
        const toUser = await user.findById(toUserId);
        if(!toUser) {
            return res.status(400).json({ message: "User not found!",});
        }

        // If there is an existing connection request
        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
               { fromUserId, toUserId },
               { fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest) {
            return res.status(400).send({ message: "COnnection request already exist!!"})
        }

        const ConnectionRequestInstance = new connectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await ConnectionRequestInstance.save();

        res.json({
            message: req.user.firstName + " is "+status+ " in "+ toUser.firstName,
            data,
        })

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
    });


module.exports = requestRouter;