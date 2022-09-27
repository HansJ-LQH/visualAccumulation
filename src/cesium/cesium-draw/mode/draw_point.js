/* eslint-disable class-methods-use-this */
import ModeBase from './ModeBase';
import { getLngLat } from '../sdkRelative/utils';

class DrawPoint extends ModeBase {
    constructor(mapDraw) {
        super(mapDraw);
        this.modeName = 'draw_point';
    }

    onSetup() {
        this.changeCursor('crosshair');
        this.feature = {
            drawType: this.constants.modes.DRAW_POINT,
            geojsonType: this.constants.geojsonTypes.POINT,
            coordinates: [],
            drawStep: [],
            customStyle: {},
        };
    }

    onClick(e) {
        const lngLat = getLngLat(e.position);
        this.currentVertexPosition += 1;
        this.addFeature(lngLat);
        this.onComplete();
    }

    addFeature(coordinates) {
        this.addPoint(coordinates);
        this.parent.feature = {
            ...this.feature,
            coordinates,
            id: this.parent.id,
            drawStep: [coordinates],
            ctx: this,
        };
        this.symbolPublisher.symbolAdded(this.parent);
    }
}

export default DrawPoint;
