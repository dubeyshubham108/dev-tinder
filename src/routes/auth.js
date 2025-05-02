const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user  = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid Credential");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid) {

            // Create a JWT token
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder8080");
            console.log(token);

            // Add the token to cookie and send the response back to the user
            res.cookie("token", token);
            res.send("Login Successful!!!");
        } else {
            throw new Error("Invalid Credential");
        }
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send();
})


module.exports = authRouter;