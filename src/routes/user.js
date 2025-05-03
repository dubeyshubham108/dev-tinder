const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
// const ConnectionRequest = require("../models/connectionRequest");

// Get all the pending connections request of logged in user.

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";


userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName"]);

         res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
         })
    } catch(err) {
        req.statusCode(400).send("ERROR: " + err.message); }

});

userRouter.get("/user/connection", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id, status: "accepted"}
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
              return row.toUserId;
            }
            return row.fromUserId;
          });

        res.json({ data });
    }
    catch(err) {
        res.status(400).send({ message: err.message});
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {

        // user should see all the cards except
        // 0. his own cards
        // 1. his connections
        // 2. ignored cards
        // 3. already sent connection request to

        const  loggedInUser = req.user;

        // feed?page=1&limit=10
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        
        // Find all the connections request ( sent + received )
        const connectionRequests = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        })
        .select("fromUserId toUserId");
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName");

        // for unique entries
        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUserFromFeed)}},
                {_id: { $ne: loggedInUser._id}},
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send(users);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
})

module.exports = userRouter;