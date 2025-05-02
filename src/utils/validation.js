const validator = require('validator');
// const { validate: validateUserModeul } = require('../models/user');



const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName) {
        throw new Error("Enter valid name");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter strong password.");
    }
}

module.exports = {
    validateSignupData,
};