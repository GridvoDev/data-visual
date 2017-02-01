'use strict';
const MongoClient = require('mongodb').MongoClient;
const _ = require('underscore');
const should = require('should');
const View = require('../../../lib/domain/view');
const mongoDBViewRepository = require('../../../lib/infrastructure/repository/mongoDBViewRepository');

describe('mongoDBViewRepository use case test', () => {
    let Repository;
    before(() => {
        Repository = new mongoDBViewRepository();
    });
    describe('#save(view, traceContext, cb)', () => {
        context('save a view', () => {
            it('should return true if save success', done => {
                let view = new View({
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
                });
                Repository.save(view, {}, (err, isSuccess) => {
                    if (err) {
                        done(err);
                    }
                    isSuccess.should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getViewByID(id, traceContext, cb)', () => {
        context('get a view for id', () => {
            it('should return null if no this view', done => {
                let viewID = "noViewID";
                Repository.getViewByID(viewID, {}, (err, view) => {
                    _.isNull(view).should.be.eql(true);
                    done();
                });
            });
            it('should return view', done => {
                let id = "viewID";
                Repository.getViewByID(id, {}, (err, view) => {
                    view.viewID.should.be.eql("viewID");
                    view.level.should.be.eql("station");
                    should.exist(view.dataTypeConfigs);
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
            db.collection('View').drop((err, response) => {
                if (err) {
                    done(err);
                }
                db.close();
                done();
            });
        });
    });
});