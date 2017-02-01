'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {expressZipkinMiddleware} = require("gridvo-common-js");
const {logger, tracer} = require('./lib/util');
const {visualConfigRouter} = require('./lib/express');
const {createVisualService} = require('./lib/application');

let app;
app = express();
app.use(bodyParser.json());
app.use(expressZipkinMiddleware({
    tracer: tracer,
    serviceName: 'data-visual'
}));
app.use('/visual-config', visualConfigRouter);
let visualService = createVisualService();
app.set('visualService', visualService);
app.listen(3001, (err) => {
    if (err) {
        logger.error(err.message);
    }
    else {
        logger.info("express server is starting");
    }
});