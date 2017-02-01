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

    isChange(visualOptions) {
        if (this._level != visualOptions.level) {
            return true;
        }
        if (JSON.stringify(this._dataTypeConfigs) != JSON.stringify(visualOptions.dataTypeConfigs)) {
            return true;
        }
        return false;
    }
}

module.exports = View;