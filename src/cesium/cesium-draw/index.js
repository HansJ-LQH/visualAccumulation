/* eslint-disable class-methods-use-this */
import Pubsub from 'pubsub-js';
import symbolPublisher from './sdkRelative/symbolPublisher';
import eventHandler from './sdkRelative/eventHandler';
import eventTopics from './sdkRelative/eventTopics';

const { Cesium } = window;

class CesiumDraw {
    constructor(options) {
        this.viewer = options.viewer || window.viewer;
        this.eventTopics = eventTopics;
        this.pubsub = Pubsub;
        symbolPublisher.init({ mapDraw: this });
        this.eventHandler = eventHandler;
        this.eventHandler.init({ mapDraw: this, viewer: this.viewer });
    }

    changeMode(mode) {
        eventHandler.changeMode(mode);
    }
}

export default CesiumDraw;
