/* eslint-disable class-methods-use-this */
import Pubsub from 'pubsub-js';
import eventTopics from './eventTopics';

class SymbolPublisher {
    init(options) {
        const { mapDraw } = options;
        this.mapDraw = mapDraw;
    }

    symbolAdded(option){
        Pubsub.publish(eventTopics.symbolCreated, option);
    }

    symbolSelected(option){
        Pubsub.publish(eventTopics.symbolSelected, option);
    }

    symbolUpdated(option){
        Pubsub.publish(eventTopics.symbolUpdated, option);
    }

    symbolRemoved(option){
        Pubsub.publish(eventTopics.symbolRemoved, option);
    }

}

export default new SymbolPublisher();
