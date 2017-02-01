'use strict';
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const {restZipkinInterceptor} = require('gridvo-common-js');
const {tracer} = require('../../util');

const {DATA_COLLECT_SERVICE_HOST = "127.0.0.1", DATA_COLLECT_SERVICE_PORT = "3001"} = process.env;
class Gateway {
    constructor() {
        this._httpRequest = rest;
    }

    getDataSources(queryOpts, traceContext, callback) {
        if (!queryOpts || !queryOpts.dataType || (!queryOpts.lessee && !queryOpts.station && !queryOpts.dataSourceID)) {
            callback(null, null);
            return;
        }
        let queryLevelKey = queryOpts.lessee ? "lessee" : (queryOpts.station ? "station" : "dataSourceID");
        let queryLevelValue = queryOpts[queryLevelKey];
        var url = `http://${DATA_COLLECT_SERVICE_HOST}:${DATA_COLLECT_SERVICE_PORT}/data-sources?dataType=${queryOpts.dataType}&${queryLevelKey}=${queryLevelValue}`;
        var options = {
            method: "GET",
            path: url
        };
        let request = this._httpRequest.wrap(restZipkinInterceptor, {
            tracer,
            traceContext,
            serviceName: 'data-visual',
            remoteServiceName: 'data-collect'
        }).wrap(mime);
        request(options).then(response => {
            let {dataSources, errcode, errmsg} = response.entity;
            if (errcode == "0" && errmsg == "ok") {
                callback(null, dataSources);
            }
            else {
                callback(null, null);
            }
        }).catch(err => {
            callback(err);
        });
    }
}

module.exports = Gateway;