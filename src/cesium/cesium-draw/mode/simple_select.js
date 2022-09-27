/* eslint-disable class-methods-use-this */
import ModeBase from './ModeBase';
import symbolPublisher from '../sdkRelative/symbolPublisher';
import {
    getCesiumEntity,
    changeEntityStyle,
    moveFeature,
    updateFeature,
    changePointStyle,
} from '../sdkRelative/utils';

class SimpleSelect extends ModeBase {
    constructor(mapDraw) {
        super(mapDraw);
        this.modeName = 'simple_select';
        this.isSelect = false;
        this.isEdit = false;
        this.currentSelectFeature = null;
        this.currentSelectVertex = null;
        this.lastSelectFeature = null;
    }

    onSetup() {}

    onClick(e) {
        const info = getCesiumEntity(e);
        console.log(`HJJ -> SimpleSelect -> onClick -> info`, info);
        const entity = info?.id;
        if (!entity) {
            // 清除选中状态
            this.currentSelectVertex =
                this.currentSelectVertex && changePointStyle(this.currentSelectVertex, false);
            return;
        }
        this.isSelect = !!entity.parent && entity.type === 'cesium-draw';
        this.currentSelectFeature = this.isSelect ? entity.parent : null;
        if (this.isSelect) {
            // 是否选中cesium-draw
            symbolPublisher.symbolSelected(entity.parent);
            // 选中关键点改变关键点样式
            if (this.currentSelectVertex?.id !== entity.id)
                changePointStyle(this.currentSelectVertex, false);
            this.currentSelectVertex = entity.currentVertexPosition ? entity : null;
            changePointStyle(this.currentSelectVertex, true);
        }
        this.lastSelectFeature = this.currentSelectFeature;
    }

    onMouseDown(e) {
        const entity = getCesiumEntity(e);
        const isEqual = entity?.id?.parent?.id === this.currentSelectFeature?.id;
        if (this.isSelect && this.currentSelectFeature && isEqual) {
            this.mapControllerEnable(false);
            this.isEdit = true;
        }
    }

    onMouseMove(e) {
        if (!e) return;
        const info = getCesiumEntity(e);
        if (!info) return;
        const entity = info?.id;
        if (this.isSelect && this.currentSelectVertex?.id === entity?.id)
            this.changeCursor(entity ? 'move' : 'default');
        else this.changeCursor(entity ? 'pointer' : 'default');
        if (this.isEdit) {
            moveFeature(e.endPosition, this.currentSelectFeature, this.currentSelectVertex);
        }
    }

    onMouseUp(e) {
        if (this.isEdit) {
            // moveFeature(e.position, this.currentSelectFeature, this.currentSelectVertex);
            // updateFeature(this.currentSelectFeature, e.position);
            this.mapControllerEnable(true);
            this.isEdit = false;
            symbolPublisher.symbolUpdated(this.currentSelectFeature);
        }
    }

    onComplete() {
        this.changeCursor('default');
        this.api.changeMode('simple_select');
        console.log('HJJ 111');
        this.currentSelectVertex =
            this.currentSelectVertex && changePointStyle(this.currentSelectVertex, false);
    }
}

export default SimpleSelect;
