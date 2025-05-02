const express=require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require('./utils/validation');
const bcrypt = require("bcrypt");
const validator = require('validator');

app.use(express.json());

app.post("/signup", async (req, res) => {

    const { firstName, lastName, emailId, password} = req.body;

    try {

        // validation of the data
        validateSignupData(req);

        //Encryption of the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        // Creting a new instacne of the User model
        const user = new User ({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully!");
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/login", async (req, res) => {

    
    try {
        const { emailId, password } = req.body;

        const user  = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid Credential");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid) {
            res.send("Login Successful!!!");
        } else {
            throw new Error("Invalid Credential");
        }
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

// Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.find({emailId: userEmail});
        if(users.length === 0) {
            res.status(404).send("User not found")
        } else {
            res.send(users);
        }

        // // checking for duplicate email id
        // const existingUser = await User.findOne({ emailId });
        // if (existingUser) {
        //     return res.status(400).send("Email already in use");
        // }
    }
    catch (err){
        res.status(400).send("Something went wrong");
    }
});

// Feed API - get all the user from database
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// Delete a user
app.delete("/delete", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
})

//Update data of the user
app.patch("/user", async(req, res) => {
    const userId = req.body.userId
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({_id: userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully!");
        
    } catch(err) {
        res.status(400).send("UPDATE FAILED:" +     err.message);
    }
})

connectDB()
    .then(() => {
        console.log("Database connection established..");
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777...");
        });
    })
    .catch(err => {
        console.log("Database cannot be connected!!");
    });
