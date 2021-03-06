'use strict';
const _ = require('underscore');
const co = require('co');
const {View, VisualConfig} = require('../../domain');
const {
    createViewRepository,
    createVisualConfigRepository,
    createDataCollectServiceGateway
} = require('../../infrastructure');

class Service {
    constructor() {
        this._viewRepository = createViewRepository();
        this._visualConfigRepository = createVisualConfigRepository();
        this._dataCollectServiceGateway = createDataCollectServiceGateway();
    }

    provideViewVisualConfigToViewUser(viewOptions, dataTypeConfigs, traceContext, callback) {
        if (!viewOptions || !viewOptions.viewID || !viewOptions.viewUserID || !viewOptions.level || !dataTypeConfigs) {
            callback(null, null);
            return;
        }
        let self = this;
        let {viewID, viewUserID, level}= viewOptions;

        function getViewFromRepository() {
            return new Promise((resolve, reject) => {
                self._viewRepository.getViewByID(viewID, traceContext, (err, view) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(view);
                });
            });
        }

        function saveView(view) {
            return new Promise((resolve, reject) => {
                self._viewRepository.save(view, traceContext, (err, isSuccess) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function getVisualConfigFromRepository() {
            return new Promise((resolve, reject) => {
                self._visualConfigRepository.getVisualConfig(viewID, viewUserID, traceContext, (err, visualConfig) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(visualConfig);
                });
            });
        }

        function getDataSourcesFromServiceGateway(queryOpts) {
            return new Promise((resolve, reject) => {
                self._dataCollectServiceGateway.getDataSources(queryOpts, traceContext, (err, dataSourcesJSON) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(dataSourcesJSON);
                });
            });
        }

        function saveVisualConfig(visualConfig) {
            return new Promise((resolve, reject) => {
                self._visualConfigRepository.save(visualConfig, traceContext, (err, isSuccess) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(isSuccess);
                });
            });
        }

        function* provideVisualConfig() {
            let visualConfigJSON;
            let visualConfig;
            let view = yield getViewFromRepository();
            if (!view || view.isChange(level, dataTypeConfigs)) {
                view = new View({viewID, level, dataTypeConfigs});
                yield saveView(view);
            }
            else {
                visualConfig = yield getVisualConfigFromRepository();
                if (visualConfig) {
                    let {configs} = visualConfig;
                    visualConfigJSON = configs;
                    return visualConfigJSON;
                }
            }
            let getDataSourcesFs = [];
            for (let key of _.keys(dataTypeConfigs)) {
                let queryOpts = {};
                queryOpts.dataType = key;
                if (level == "lessee") {
                    queryOpts.lessee = viewUserID;
                }
                if (level == "station") {
                    queryOpts.station = viewUserID;
                }
                if (level == "data-source") {
                    queryOpts.dataSourceID = viewUserID;
                }
                getDataSourcesFs.push(getDataSourcesFromServiceGateway(queryOpts));
            }
            let dataSourcesJSON = yield getDataSourcesFs;
            dataSourcesJSON = _.compact(_.flatten(dataSourcesJSON));
            let configs = {};
            for (let dataSourceJSON of dataSourcesJSON) {
                let dataSourceID = dataSourceJSON.dataSourceID;
                configs[dataSourceID] = dataTypeConfigs[dataSourceJSON.dataType];
            }
            visualConfig = new VisualConfig({viewID, viewUserID, configs});
            let isSuccess = saveVisualConfig(visualConfig);
            if (isSuccess) {
                visualConfigJSON = configs;
                return visualConfigJSON;
            }
            else {
                return null;
            }
        };
        co(provideVisualConfig).then((visualConfigJSON) => {
            callback(null, visualConfigJSON);
        }).catch(err => {
            callback(err);
        });
    }
}

module.exports = Service;