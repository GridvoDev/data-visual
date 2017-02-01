'use strict';
const {
    createViewRepository,
    createVisualConfigRepository
} = require("./repository");

const {
    createDataCollectServiceGateway
} = require("./serviceGateway");

module.exports = {
    createViewRepository,
    createVisualConfigRepository,
    createDataCollectServiceGateway
};