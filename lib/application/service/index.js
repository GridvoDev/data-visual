'use strict';
const VisualService = require("./visualService");

let visualService = null;
function createVisualService(single = true) {
    if (single && visualService) {
        return visualService;
    }
    visualService = new VisualService();
    return visualService;
};

module.exports = {
    createVisualService
};