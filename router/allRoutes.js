const router = require("express").Router();
const codeStoreModel = require("./../model/saveCode");
const catchAsync = require("./../utils/catchAsync");

function statusFunc(res, statusCode, status) {
    res.status(statusCode).json({
        status: status
    })
}

function statusFuncWithMessage(res, statusCode, status, message) {
    res.status(statusCode).json({
        status: status,
        message: message
    })
}

router.get("/extractSendData/:code", catchAsync(async (req, res) => {
    console.log(req.params);
    const paramCode = req.params.code * 1;
    const getData = await codeStoreModel.findOne({
        code: paramCode
    }).select(["-__v", "-_id"]);
    console.log(getData)
    if (!getData) {
        statusFunc(res, 400, "failed");
    }

    statusFuncWithMessage(res, 200, "success", getData);
}));

router.post("/saveTheSendData", catchAsync(async (req, res) => {
    console.log(req.body);

    await codeStoreModel.create({
        code: req.body.code,
        text: req.body.text
    }).then(() => {
        statusFunc(res, 200, "success");
    }).catch(err => {
        statusFunc(res, 400, "failed");
    })
}));

module.exports = router;