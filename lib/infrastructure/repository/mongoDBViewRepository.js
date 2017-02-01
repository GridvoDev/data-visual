'use strict';
const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const {View} = require('../../domain');
const {tracer} = require('../../util');

class Repository {
    constructor() {
        this._dbName = "DataVisual";
        this._collectionName = "View";
        this._serviceName = "data-visual";
    }

    save(view, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            let {viewID, level, dataTypeConfigs}=view;
            let updateOperations = {
                level,
                dataTypeConfigs
            };
            collection.updateOne({
                    viewID
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

    getViewByID(viewID, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: this._collectionName,
            serviceName: this._serviceName
        });
        mongoClient.then(({db, collection}) => {
            collection.findOne({viewID}, {limit: 1}, (err, document) => {
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
                    let view = new View(document);
                    callback(null, view);
                    db.close();
                }
            );
        }).catch(err => {
            callback(err);
        });
    }
}

module.exports = Repository;