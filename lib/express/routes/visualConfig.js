'use strict';
const _ = require('underscore');
const express = require('express');
const {errCodeTable} = require('../util');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../util');

let router = express.Router();

router.post("/load", (req, res) => {
    let {viewOptions, dataTypeConfigs} = req.body;
    let visualService = req.app.get('visualService');
    let traceContext = traceContextFeach(req);
    let resultJSON = {};
    visualService.provideViewVisualConfigToViewUser(viewOptions, dataTypeConfigs, traceContext, (err, visualConfigJSON) => {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!visualConfigJSON) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error("load visual config fail", traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.visualConfig = visualConfigJSON;
        res.json(resultJSON);
        logger.info("load visual config success", traceContext);
    });
});

module.exports = router;