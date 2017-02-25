'use strict';
const _ = require('underscore');

class View {
    constructor({viewID, level, dataTypeConfigs}) {
        this._id = viewID;
        this._level = level;
        this._dataTypeConfigs = dataTypeConfigs;
    }

    get viewID() {
        return this._id;
    }

    get level() {
        return this._level;
    }

    get dataTypeConfigs() {
        return this._dataTypeConfigs;
    }

    isChange(level, dataTypeConfigs) {
        if (this._level != level) {
            return true;
        }
        if (JSON.stringify(this._dataTypeConfigs) != JSON.stringify(dataTypeConfigs)) {
            return true;
        }
        return false;
    }
}

module.exports = View;