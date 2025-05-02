const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://Namastenode:2vEcmjUW6iyDAbl8@namastenode.yg26xgu.mongodb.net/devTinder"
    );
};

module.exports = connectDB;
