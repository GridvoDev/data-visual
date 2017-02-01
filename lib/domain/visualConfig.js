'use strict';
const _ = require('underscore');

class VisualConfig {
    constructor({viewID, viewUserID, configs}) {
        this._viewID = viewID;
        this._viewUserID = viewUserID;
        this._configs = configs;
    }

    get viewID() {
        return this._viewID;
    }

    get viewUserID() {
        return this._viewUserID;
    }

    get configs() {
        return this._configs;
    }
}

module.exports = VisualConfig;