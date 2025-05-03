const express=require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require('./utils/validation');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use("/", authRouter, profileRouter, requestRouter, userRouter);

// Get user by email
// app.get("/user", async (req, res) => {
//     const userEmail = req.body.emailId;

//     try {
//         const users = await User.find({emailId: userEmail});
//         if(users.length === 0) {
//             res.status(404).send("User not found")
//         } else {
//             res.send(users);
//         }

//         // // checking for duplicate email id
//         // const existingUser = await User.findOne({ emailId });
//         // if (existingUser) {
//         //     return res.status(400).send("Email already in use");
//         // }
//     }
//     catch (err){
//         res.status(400).send("Something went wrong");
//     }
// });

// // Feed API - get all the user from database
// app.get("/feed", async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (err) {
//         res.status(400).send("Something went wrong");
//     }
// });

// // Delete a user
// app.delete("/delete", async (req, res) => {
//     const userId = req.body.userId;
//     try {
//         const user = await User.findByIdAndDelete(userId);
//     } catch(err) {
//         res.status(400).send("Something went wrong");
//     }
// })

// //Update data of the user
// app.patch("/user", async(req, res) => {
//     const userId = req.body.userId
//     const data = req.body;
//     try {
//         const user = await User.findByIdAndUpdate({_id: userId}, data, {
//             returnDocument: "after",
//             runValidators: true,
//         });
//         console.log(user);
//         res.send("User updated successfully!");
        
//     } catch(err) {
//         res.status(400).send("UPDATE FAILED:" +     err.message);
//     }
// })

connectDB()
    .then(() => {
        console.log("Database connection established..");
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777...");
        });
    })
    .catch(err => {
        console.log("Database cannot be connected!!");
        console.error(err);  
    });
