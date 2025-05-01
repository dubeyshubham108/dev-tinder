const express=require('express');

const app = express();

app.get("/", (req, res) => {
    res.send("Namaste");
});

app.get("/hello", (req,res) => {
    res.send("Hello world");
})

app.get("/test", (req, res) => {
    res.send("Testing data..");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000...");
});

