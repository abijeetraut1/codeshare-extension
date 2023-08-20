const express = require('express');
const app = express();
const mongoose = require("mongoose");
const allRouter = require("./router/allRoutes");
const bodyParser = require("body-parser");
const port = 9980;

mongoose.connect(`mongodb+srv://guymail349:rWuqWVWW3Pvee4vm@codesend.c0tsj4d.mongodb.net`).then(() => {
    console.log("connected to database");
}).catch(err => {
    console.log("failed to connect to database " + err);
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("*", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    next();
})

app.use("/api/vscodeExtensions/v1/sendandstore", allRouter);

app.listen(port, () => {
    console.log("server is running at port: "+ port);
})