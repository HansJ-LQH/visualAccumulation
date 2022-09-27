/* eslint-disable class-methods-use-this */
import * as Constants from '../constants';
import * as customStyle from '../sdkRelative/customStyle';
import symbolPublisher from '../sdkRelative/symbolPublisher';

class ModeBase {
    constructor(mapDraw) {
        this.modeName = '';
        this.api = mapDraw;
        this.viewer = mapDraw.viewer;
        this.constants = Constants;
        this.customStyle = customStyle;
        this.symbolPublisher = symbolPublisher;
        this.currentVertexPosition = 0;
        this.drawStep = [];
        this.onSetup();
        this.parent = this.viewer.entities.getOrCreateEntity();
    }

    onSetup() {}

    onClick(e) {}

    onMouseDown(e) {}

    onMouseMove(e) {}

    onMouseUp(e) {}

    onRightClick(e) {}

    onDoubleClick(e) {}

    onStop() {
        this.parent?._children.forEach(children => {
            this.viewer.entities.remove(children);
        });
        this.viewer.entities.remove(this.parent);
    }

    onComplete() {
        this.changeCursor('default');
        this.api.changeMode('simple_select');
    }

    /**
     * 切换鼠标指针样式
     * @param {string} type 指针样式: 1. crosshair / 十字线; 2. pointer / 手; 3. move / 可移动; 4. default / 默认
     */
    changeCursor(type) {
        this.viewer.scene.canvas.style.cursor = type;
    }

    mapControllerEnable(isMove) {
        this.viewer.scene.screenSpaceCameraController.enableRotate = isMove;
        this.viewer.scene.screenSpaceCameraController.enableZoom = isMove;
    }

    addPoint(coordinates) {
        this.viewer.entities.add({
            name: 'Draw Point',
            type: 'cesium-draw',
            position: Cesium.Cartesian3.fromDegrees(...coordinates),
            point: this.customStyle.pointStyle,
            parent: this.parent,
            featureType: this.constants.geojsonTypes.POINT,
            lng: coordinates[0],
            lat: coordinates[1],
            currentVertexPosition: this.currentVertexPosition,
        });
    }

    addLine() {
        this.viewer.entities.add({
            name: 'Draw Line',
            type: 'cesium-draw',
            polyline: {
                ...this.customStyle.lineStyle,
                // positions: Cesium.Cartesian3.fromDegreesArray([...startPosition, ...endPosition]),
                positions: new Cesium.CallbackProperty(
                    () => Cesium.Cartesian3.fromDegreesArray(this.drawStep.flat()),
                    false
                ),
            },
            parent: this.parent,
            featureType: this.constants.geojsonTypes.LINE_STRING,
        });
    }
}

export default ModeBase;
