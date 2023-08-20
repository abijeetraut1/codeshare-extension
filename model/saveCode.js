const mongoose = require("mongoose");

const sendCodeSchema = mongoose.Schema({
    code: {
        type: Number,
        require: true
    },
    text: {
        type: String,
        require: true
    }
});

const sendCode = new mongoose.model("hostCodeSchema", sendCodeSchema);
module.exports = sendCode;

