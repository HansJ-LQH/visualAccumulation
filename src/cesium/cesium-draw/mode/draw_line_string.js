/* eslint-disable class-methods-use-this */
import ModeBase from './ModeBase';
import { getLngLat } from '../sdkRelative/utils';

class DrawLineString extends ModeBase {
    constructor(mapDraw) {
        super(mapDraw);
        this.modeName = 'draw_point';
    }

    onSetup() {
        this.changeCursor('crosshair');
        this.feature = {
            drawType: this.constants.modes.DRAW_LINE_STRING,
            geojsonType: this.constants.geojsonTypes.LINE_STRING,
            coordinates: [],
            drawStep: this.drawStep,
            customStyle: {},
        };
    }

    onClick(e) {
        const lngLat = getLngLat(e.position);
        this.drawStep.push(lngLat);
        this.addPoint(lngLat);
        if (this.currentVertexPosition > 0) {
            this.addLine();
        }
        this.currentVertexPosition += 1;
    }

    onRightClick() {
        this.addFeature();
        this.onStop();
    }

    getCoordinates() {
        return this.drawStep;
    }

    addFeature() {
        this.parent.feature = {
            ...this.feature,
            coordinates: this.getCoordinates(),
            id: this.parent.id,
            drawStep: this.drawStep,
            ctx: this,
        };
        this.symbolPublisher.symbolAdded(this.parent);
    }
}

export default DrawLineString;
