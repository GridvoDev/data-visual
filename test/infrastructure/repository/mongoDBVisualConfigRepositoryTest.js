'use strict';
const MongoClient = require('mongodb').MongoClient;
const _ = require('underscore');
const should = require('should');
const VisualConfig = require('../../../lib/domain/visualConfig');
const mongoDBVisualConfigRepository = require('../../../lib/infrastructure/repository/mongoDBVisualConfigRepository');

describe('mongoDBVisualConfigRepository use case test', () => {
    let Repository;
    before(() => {
        Repository = new mongoDBVisualConfigRepository();
    });
    describe('#save(visualConfig, traceContext, cb)', () => {
        context('save a visualConfig', () => {
            it('should return true if save success', done => {
                let visualConfig = new VisualConfig({
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
                });
                Repository.save(visualConfig, {}, (err, isSuccess) => {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getVisualConfig(viewID, viewUserID, traceContext, cb)', () => {
        context('get a visualConfig', () => {
            it('should return null if no this visualConfig', done => {
                let viewID = "noVisualConfigID";
                let viewUserID = "noVisualConfigID";
                Repository.getVisualConfig(viewID, viewUserID, {}, (err, visualConfig) => {
                    _.isNull(visualConfig).should.be.eql(true);
                    done();
                });
            });
            it('should return visualConfig', done => {
                let viewID = "viewID";
                let viewUserID = "viewUserID";
                Repository.getVisualConfig(viewID, viewUserID, {}, (err, visualConfig) => {
                    visualConfig.viewID.should.be.eql("viewID");
                    visualConfig.viewUserID.should.be.eql("viewUserID");
                    should.exist(visualConfig.configs);
                    done();
                });
            });
        });
    });
    after(done => {
        let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/DataVisual`, (err, db) => {
            if (err) {
                done(err);
            }
            db.collection('VisualConfig').drop((err, response) => {
                if (err) {
                    done(err);
                }
                db.close();
                done();
            });
        });
    });
});