const router = require("express").Router();
const codeStoreModel = require("./../model/saveCode");
const catchAsync = require("./../utils/catchAsync");

function statusFunc(res, statusCode, status){
    res.status(statusCode).json({
        status: status
    })
}

router.get("/extractSendData", catchAsync(async (req, res) => {
    const getData = await codeStoreModel.findOne({
        code: req.body.code
    }).select(["-__v", "-_id"]);

    if (!getData) {
        statusFunc(res, 400, "failed");
    }

    statusFunc(res, 200, "success");
}));

router.post("/saveTheSendData", catchAsync(async (req, res) => {
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