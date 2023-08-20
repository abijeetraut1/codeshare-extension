const router = require("express").Router();
const codeStoreModel = require("./../model/saveCode");
const catchAsync = require("./../utils/catchAsync");

router.get("/extractSendData", catchAsync(async (req, res) => {
    const getData = await codeStoreModel.findOne({
        code: req.body.code
    }).select(["-__v", "-_id"]);

    if (!getData) {
        res.status(200).json({
            status: "failed"
        })
    }

    res.status(200).json({
        status: "success",
        getData
    })
}));

router.post("/saveTheSendData", catchAsync(async (req, res) => {
    await codeStoreModel.create({
        code: req.body.code,
        text: req.body.text
    }).then(() => {
        res.status(200).json({
            status: "success",
        })
    }).catch(err => {
        res.status(200).json({
            status: "failed",
        })
    })

}));

module.exports = router;