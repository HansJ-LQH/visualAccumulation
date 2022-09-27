/* eslint-disable class-methods-use-this */
import modes from '../mode/index';

const { Cesium } = window;

class EventHandler {
    init(options) {
        const { viewer, mapDraw } = options;
        this.viewer = viewer;
        this.mapDraw = mapDraw;
        this.currentModeName = 'simple_select';
        this.currentMode = new modes.simple_select(mapDraw);
        this.lastTimestamp = 0;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.events = [
            ['LEFT_CLICK', this.onClick],
            ['LEFT_DOWN', this.onMouseDown],
            ['LEFT_UP', this.onMouseUp],
            ['MOUSE_MOVE', this.onMouseMove],
            ['RIGHT_CLICK', this.onRightClick],
        ];
        this.events.forEach(event => {
            this.handler.setInputAction(event[1].bind(this), Cesium.ScreenSpaceEventType[event[0]]);
        });
    }

    changeMode(mode) {
        // this.currentMode.onStop();
        this.currentMode = new modes[mode](this.mapDraw);
        this.currentModeName = this.currentMode.modeName;
    }

    onClick(e) {
        const timeDifference = new Date().getTime() - this.lastTimestamp;
        if (timeDifference < 250) this.onDoubleClick(e);
        else {
            this.currentMode.onClick(e);
        }
        this.lastTimestamp = new Date().getTime();
    }

    onMouseDown(e) {
        this.currentMode.onMouseDown(e);
    }

    onMouseMove(e) {
        this.currentMode.onMouseMove(e);
    }

    onMouseUp(e) {
        this.currentMode.onMouseUp(e);
    }

    onRightClick(e) {
        this.currentMode.onRightClick(e);
    }

    onDoubleClick(e) {
        console.log(`HJJ -> EventHandler -> onDoubleClick`, e);
    }
}

export default new EventHandler();
