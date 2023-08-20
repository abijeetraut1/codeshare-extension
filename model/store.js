const { default: mongoose } = require("mongoose");
const monogose = require("mongoose");

const soreData = mongoose.Schema({
    code: {
        type: Number,
        require: true
    },
    text: {
        type: String,
        require: true

    }
});

const storeSend = new mongoose.model("sendcode", storeData);
module.exports = storeSend;