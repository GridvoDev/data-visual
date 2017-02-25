const _ = require('underscore');
const co = require('co');
const should = require('should');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const visualConfigRouter = require('../../../lib/express/routes/visualConfig');
const {expressZipkinMiddleware, createZipkinTracer} = require("gridvo-common-js");

describe('visualConfigRouter use case test', () => {
    let app;
    let server;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.use(bodyParser.json());
                app.use(expressZipkinMiddleware({
                    tracer: createZipkinTracer({}),
                    serviceName: 'test-service'
                }));
                app.use('/visual-config', visualConfigRouter);
                let mockVisualService = {};
                mockVisualService.provideViewVisualConfigToViewUser = function (viewOptions, dataTypeConfigs, traceContext, callback) {
                    if (!viewOptions || !viewOptions.viewID || !viewOptions.viewUserID || !viewOptions.level || !dataTypeConfigs) {
                        callback(null, null);
                        return;
                    }
                    callback(null, {
                        "NWH-YL": {
                            readableName: "雨量",
                            maxValue: 5000,
                            minValue: 2000,
                            interval: 500,
                            splitNumber: 6
                        }
                    });
                }
                app.set('visualService', mockVisualService);
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
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('#post:/visual-config/load', () => {
        context('load a visual config', () => {
            it('should response fail', done => {
                request(server)
                    .post(`/visual-config/load`)
                    .send({})
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(400);
                        res.body.errmsg.should.be.eql("fail");
                        done();
                    });
            });
            it('should response ok', done => {
                request(server)
                    .post(`/visual-config/load`)
                    .send({
                        viewOptions: {
                            viewID: "viewID",
                            viewUserID: "viewUserID",
                            level: "station"
                        },
                        dataTypeConfigs: {
                            YL: {
                                readableName: "",
                                maxValue: 5000,
                                minValue: 2000,
                                interval: 500,
                                splitNumber: 6
                            }
                        }
                    })
                    .set('Accept', 'application/json')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(0);
                        res.body.errmsg.should.be.eql("ok");
                        should.exist(res.body.visualConfig);
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
        });
    });
});