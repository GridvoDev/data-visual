'use strict';
const MongoDBViewRepository = require("./mongoDBViewRepository");
const MongoDBVisualConfigRepository = require("./mongoDBVisualConfigRepository");

let mongoDBViewRepository = null;
function createViewRepository(single = true) {
    if (single && mongoDBViewRepository) {
        return mongoDBViewRepository;
    }
    mongoDBViewRepository = new MongoDBViewRepository();
    return mongoDBViewRepository;
};

let mongoDBVisualConfigRepository = null;
function createVisualConfigRepository(single = true) {
    if (single && mongoDBVisualConfigRepository) {
        return mongoDBVisualConfigRepository;
    }
    mongoDBVisualConfigRepository = new MongoDBVisualConfigRepository();
    return mongoDBVisualConfigRepository;
};

module.exports = {
    createViewRepository,
    createVisualConfigRepository
};