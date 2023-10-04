const express = require('express');
const app = express();
const mongoose = require("mongoose");
const allRouter = require("./router/allRoutes");
const bodyParser = require("body-parser");
const port = 9980;

mongoose.connect(`connection url`).then(() => {
    console.log("connected to database");
}).catch(err => {
    console.log("failed to connect to database " + err);
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.use("/api/vscodeExtensions/v1/sendandstore", allRouter);

app.listen(port, () => {
    console.log("server is running at port: "+ port);
})
