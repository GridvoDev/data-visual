'use strict';
const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const {VisualConfig} = require('../../domain');
const {tracer} = require('../../util');

class Repository {
    constructor() {
        this._dbName = "DataVisual";
        this._collectionName = "VisualConfig";
        this._serviceName = "data-visual";
    }

    save(visualConfig, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            let {viewID, viewUserID, configs}= visualConfig;
            let updateOperations = {
                configs
            };
            collection.updateOne({
                    viewID,
                    viewUserID
                },
                {
                    $set: updateOperations
                },
                {
                    upsert: true
                },
                (err, result) => {
                    if (err) {
                        callback(err);
                        db.close();
                        return;
                    }
                    if (result.result.n == 1) {
                        callback(null, true);
                    }
                    else {
                        callback(null, false);
                    }
                    db.close();
                });
        }).catch(err => {
            callback(err);
        });
    }

    getVisualConfig(viewID, viewUserID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.findOne({viewID, viewUserID}, {limit: 1}, (err, document) => {
                    if (err) {
                        callback(err, null);
                        db.close();
                        return;
                    }
                    if (_.isNull(document)) {
                        callback(null, null);
                        db.close();
                        return;
                    }
                    let visualConfig = new VisualConfig(document);
                    callback(null, visualConfig);
                    db.close();
                }
            );
        }).catch(err => {
            callback(err);
        });
    }
}

module.exports = Repository;