'use strict';
const _ = require('underscore');
const co = require('co');
const should = require('should');
const express = require('express');
const HttpDataCollectServiceGateway = require('../../../lib/infrastructure/serviceGateway/httpDataCollectServiceGateway');
const {TraceContext} = require('gridvo-common-js');

describe('HttpDataCollectServiceGateway use case test', () => {
    let app;
    let server;
    let gateway;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.get('/data-sources', (req, res) => {
                    if (req.query.station && req.query.dataType) {
                        res.json({
                            errcode: 0,
                            errmsg: "ok",
                            dataSources: [{
                                id: "NWH-SW-SH",
                                dataType: req.query.dataType,
                                station: req.query.station,
                                lessee: "LHNY"
                            }, {
                                id: "NWH-SW-SQ",
                                dataType: req.query.dataType,
                                station: req.query.station,
                                lessee: "LHNY"
                            }]
                        });
                    }
                    else {
                        res.json({
                            errcode: 400,
                            errmsg: "fail"
                        });
                    }
                });
                server = app.listen(3001, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* setup() {
            yield setupExpress();
        };
        co(setup).then(() => {
            gateway = new HttpDataCollectServiceGateway();
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('getDataSources(queryOpts, traceContext, callback)', () => {
        let traceContext = new TraceContext({
            traceID: "aaa",
            parentID: "bbb",
            spanID: "ccc",
            flags: 1,
            step: 3
        });
        context('get data sources)', () => {
            it('should return null if queryOpts no "dataType and lessee or station or dataSourceID"', done => {
                let queryOpts = {};
                gateway.getDataSources(queryOpts, traceContext, (err, dataSourcesJSON) => {
                    _.isNull(dataSourcesJSON).should.be.eql(true);
                    done();
                });
            });
            it('is ok', done => {
                let queryOpts = {};
                queryOpts.dataType = "SW";
                queryOpts.station = "NWH";
                gateway.getDataSources(queryOpts, traceContext, (err, dataSourcesJSON) => {
                    dataSourcesJSON.length.should.be.eql(2);
                    dataSourcesJSON[0].dataType.should.eql("SW");
                    dataSourcesJSON[0].station.should.eql("NWH");
                    done();
                });
            });
        });
    });
    after(done => {
        function teardownExpress() {
            return new Promise((resolve, reject) => {
                server.close(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* teardown() {
            yield teardownExpress();
        };
        co(teardown).then(() => {
            done();
        }).catch(err => {
            done(err);
        })
    });
});