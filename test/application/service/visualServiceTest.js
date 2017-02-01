'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const View = require('../../../lib/domain/view');
const VisualConfig = require('../../../lib/domain/visualConfig');
const VisualService = require('../../../lib/application/service/visualService');

describe('VisualService use case test', () => {
    let service;
    before(() => {
        service = new VisualService();
    });
    describe('#provideViewVisualConfigToViewUser(viewID, viewUserID, visualOptions, traceContext, callback)', () => {
        context('provide view visual config to view user', () => {
            it('if no "viewID viewUserID visualOptions" or visualOptions no "level dataTypeConfigs",is return null', done => {
                let visualOptions = {};
                service.provideViewVisualConfigToViewUser("viewID", "viewUserID", visualOptions, {}, (err, visualConfigJSON) => {
                    if (err) {
                        done(err);
                    }
                    _.isNull(visualConfigJSON).should.be.eql(true);
                    done();
                });
            });
            it('it can save view and visualConfig by default value when first view request', done => {
                let currentDoneCount = 0;

                function doneMore(err) {
                    currentDoneCount++;
                    if (currentDoneCount == 6) {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    }
                };
                let mockViewRepository = {};
                mockViewRepository.getViewByID = (viewID, traceContext, callback) => {
                    callback(null, null);
                    doneMore();
                };
                mockViewRepository.save = (view, traceContext, callback) => {
                    callback(null, true);
                    doneMore();
                };
                muk(service, "_viewRepository", mockViewRepository);
                let mockVisualConfigRepository = {};
                mockVisualConfigRepository.save = (visualConfig, traceContext, callback) => {
                    should.exist(visualConfig);
                    visualConfig.viewID.should.eql("viewID");
                    visualConfig.viewUserID.should.eql("viewUserID");
                    callback(null, true);
                    doneMore();
                };
                muk(service, "_visualConfigRepository", mockVisualConfigRepository);
                let mockDataCollectServiceGateway = {};
                mockDataCollectServiceGateway.getDataSources = (queryOpts, traceContext, callback) => {
                    queryOpts.station.should.eql("viewUserID");
                    should.exist(queryOpts.dataType);
                    if (queryOpts.dataType == "YL") {
                        callback(null, [{
                            dataSourceID: "NWH-YL",
                            dataType: "YL",
                            station: "NWH",
                            lessee: "LHNY"
                        }]);
                    } else {
                        callback(null, [{
                            dataSourceID: "NWH-SW-SQ",
                            dataType: "SW",
                            station: "NWH",
                            lessee: "LHNY"
                        }, {
                            dataSourceID: "NWH-SW-SH",
                            dataType: "SW",
                            station: "NWH",
                            lessee: "LHNY"
                        }]);
                    }
                    doneMore();
                };
                muk(service, "_dataCollectServiceGateway", mockDataCollectServiceGateway);
                let viewID = "viewID";
                let viewUserID = "viewUserID";
                let visualOptions = {
                    level: "station",
                    dataTypeConfigs: {
                        YL: {
                            readableName: "",
                            maxValue: 5000,
                            minValue: 2000,
                            interval: 500,
                            splitNumber: 6
                        },
                        SW: {
                            readableName: "",
                            maxValue: 500,
                            minValue: 100,
                            interval: 100,
                            splitNumber: 5
                        }
                    }
                };
                service.provideViewVisualConfigToViewUser("viewID", "viewUserID", visualOptions, {}, (err, visualConfigJSON) => {
                    if (err) {
                        doneMore(err);
                    }
                    _.isNull(visualConfigJSON).should.be.eql(false);
                    should.exist(visualConfigJSON["NWH-YL"]);
                    should.exist(visualConfigJSON["NWH-SW-SQ"]);
                    should.exist(visualConfigJSON["NWH-SW-SH"]);
                    doneMore();
                });
            });
            it('if view is no change it can provide visualConfig when view request', done => {
                let currentDoneCount = 0;

                function doneMore(err) {
                    currentDoneCount++;
                    if (currentDoneCount == 3) {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    }
                };
                let mockViewRepository = {};
                mockViewRepository.getViewByID = (viewID, traceContext, callback) => {
                    callback(null, new View({
                        viewID: "viewID",
                        level: "station",
                        dataTypeConfigs: {
                            YL: {
                                readableName: "",
                                maxValue: 5000,
                                minValue: 2000,
                                interval: 500,
                                splitNumber: 6
                            }
                        }
                    }));
                    doneMore();
                };
                muk(service, "_viewRepository", mockViewRepository);
                let mockVisualConfigRepository = {};
                mockVisualConfigRepository.getVisualConfig = (viewID, viewUserID, traceContext, callback) => {
                    callback(null, new VisualConfig({
                        viewID: "viewID",
                        viewUserID: "viewUserID",
                        configs: {
                            "NWH-YL": {
                                readableName: "雨量",
                                maxValue: 5000,
                                minValue: 2000,
                                interval: 500,
                                splitNumber: 6
                            }
                        }
                    }));
                    doneMore();
                };
                muk(service, "_visualConfigRepository", mockVisualConfigRepository);
                let viewID = "viewID";
                let viewUserID = "viewUserID";
                let visualOptions = {
                    level: "station",
                    dataTypeConfigs: {
                        YL: {
                            readableName: "",
                            maxValue: 5000,
                            minValue: 2000,
                            interval: 500,
                            splitNumber: 6
                        }
                    }
                };
                service.provideViewVisualConfigToViewUser("viewID", "viewUserID", visualOptions, {}, (err, visualConfigJSON) => {
                    if (err) {
                        doneMore(err);
                    }
                    _.isNull(visualConfigJSON).should.be.eql(false);
                    should.exist(visualConfigJSON["NWH-YL"]);
                    visualConfigJSON["NWH-YL"].readableName.should.eql("雨量");
                    doneMore();
                });
            });
            it('it can save view and visualConfig when view is change', done => {
                let currentDoneCount = 0;

                function doneMore(err) {
                    currentDoneCount++;
                    if (currentDoneCount == 6) {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    }
                };
                let mockViewRepository = {};
                mockViewRepository.getViewByID = (viewID, traceContext, callback) => {
                    callback(null, new View({
                        viewID: "viewID",
                        level: "station",
                        dataTypeConfigs: {
                            YL: {
                                readableName: ""
                            }
                        }
                    }));
                    doneMore();
                };
                mockViewRepository.save = (view, traceContext, callback) => {
                    callback(null, true);
                    doneMore();
                };
                muk(service, "_viewRepository", mockViewRepository);
                let mockVisualConfigRepository = {};
                mockVisualConfigRepository.save = (visualConfig, traceContext, callback) => {
                    should.exist(visualConfig);
                    visualConfig.viewID.should.eql("viewID");
                    visualConfig.viewUserID.should.eql("viewUserID");
                    callback(null, true);
                    doneMore();
                };
                muk(service, "_visualConfigRepository", mockVisualConfigRepository);
                let mockDataCollectServiceGateway = {};
                mockDataCollectServiceGateway.getDataSources = (queryOpts, traceContext, callback) => {
                    queryOpts.station.should.eql("viewUserID");
                    should.exist(queryOpts.dataType);
                    if (queryOpts.dataType == "YL") {
                        callback(null, [{
                            dataSourceID: "NWH-YL",
                            dataType: "YL",
                            station: "NWH",
                            lessee: "LHNY"
                        }]);
                    } else {
                        callback(null, [{
                            dataSourceID: "NWH-SW-SQ",
                            dataType: "SW",
                            station: "NWH",
                            lessee: "LHNY"
                        }, {
                            dataSourceID: "NWH-SW-SH",
                            dataType: "SW",
                            station: "NWH",
                            lessee: "LHNY"
                        }]);
                    }
                    doneMore();
                };
                muk(service, "_dataCollectServiceGateway", mockDataCollectServiceGateway);
                let viewID = "viewID";
                let viewUserID = "viewUserID";
                let visualOptions = {
                    level: "station",
                    dataTypeConfigs: {
                        YL: {
                            readableName: "",
                            maxValue: 5000,
                            minValue: 2000,
                            interval: 500,
                            splitNumber: 6
                        },
                        SW: {
                            readableName: "",
                            maxValue: 500,
                            minValue: 100,
                            interval: 100,
                            splitNumber: 5
                        }
                    }
                };
                service.provideViewVisualConfigToViewUser("viewID", "viewUserID", visualOptions, {}, (err, visualConfigJSON) => {
                    if (err) {
                        doneMore(err);
                    }
                    _.isNull(visualConfigJSON).should.be.eql(false);
                    should.exist(visualConfigJSON["NWH-YL"]);
                    should.exist(visualConfigJSON["NWH-SW-SQ"]);
                    should.exist(visualConfigJSON["NWH-SW-SH"]);
                    doneMore();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});