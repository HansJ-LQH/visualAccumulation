/* eslint-disable no-underscore-dangle */
import { geojsonTypes } from '../constants';
import { pointSelectStyle, pointStyle } from './customStyle';

const _getCesiumLngLatHeight = p => {
    if (!p) return {};
    const ray = window.viewer.camera.getPickRay(p);
    const position = window.viewer.scene.globe.pick(ray, window.viewer.scene);
    if (!position) return null;
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    const lng = Cesium.Math.toDegrees(cartographic.longitude);
    const height = window.viewer.camera.positionCartographic.height / 1000;
    return { lng, lat, height };
};

export const getLngLatHeight = p => {
    const { lng, lat, height } = _getCesiumLngLatHeight(p);
    return [Number(lng), Number(lat), Number(height)];
};

export const getLngLat = p => {
    const { lng, lat } = _getCesiumLngLatHeight(p);
    return [Number(lng), Number(lat)];
};

export const getCesiumEntity = e => {
    if (!e) return null;
    const pointPosition = e.endPosition || e.position;
    const pick = window.viewer.scene.pick(pointPosition) || {};
    const { lng, lat, height } = _getCesiumLngLatHeight(pointPosition) || {};
    if (!lng || !lat || !height) return null;
    pick.clickLngLat = [lng, lat, height];
    pick.entityList = window.viewer?.scene.drillPick(pointPosition);
    return pick;
};

export const getLngLatDifference = (startPosition, endPosition) => {
    const startLnglat = _getCesiumLngLatHeight(startPosition);
    const endLnglat = _getCesiumLngLatHeight(endPosition);
    if (!startLnglat || !endLnglat) return null;
    return [startLnglat.lng - endLnglat.lng, startLnglat.lat - endLnglat.lat];
};

export const changePointStyle = (children, isSelect) => {
    if (!children) return;
    const style = isSelect ? pointSelectStyle : pointStyle;
    Object.keys(style).forEach(key => {
        children.point[key] = style[key];
    });
};
function changeLineStyle(childrens, isSelect) {}

export const changeEntityStyle = (entity, isSelect) => {
    if (!entity) return;
    const { geojsonType } = entity.feature;
    switch (geojsonType) {
        case geojsonTypes.POINT:
            changePointStyle(entity._children, isSelect);
            break;
        case geojsonTypes.LINE_STRING:
            changeLineStyle(entity._children, isSelect);
            break;
        default:
            break;
    }
};

export const moveVertex = (position, parent, vertex) => {
    console.log(`HJJ -> 移动feature`, position, parent, vertex);
    const lngLat = getLngLat(position);
    const difference = [lngLat[0] - vertex.lng, lngLat[1] - vertex.lat];
    parent._children.forEach(children => {
        switch (children.featureType) {
            case geojsonTypes.POINT:
                children.position = Cesium.Cartesian3.fromDegrees(
                    ...[children.lng + difference[0], children.lat + difference[1]]
                );
                break;

            default:
                break;
        }
    });
};

export const moveFeature = (position, parent, vertex) => {
    console.log(`HJJ -> 移动feature`, position, parent, vertex);
    const lngLat = getLngLat(position);
    const difference = [lngLat[0] - vertex.lng, lngLat[1] - vertex.lat];
    parent._children.forEach(children => {
        switch (children.featureType) {
            case geojsonTypes.POINT:
                children.position = Cesium.Cartesian3.fromDegrees(
                    ...[children.lng + difference[0], children.lat + difference[1]]
                );
                break;

            default:
                break;
        }
    });
};

export const updateFeature = (entity, position) => {
    if (!entity) return;
    const { geojsonType } = entity.feature;
    const lngLat = getLngLat(position);
    switch (geojsonType) {
        case geojsonTypes.POINT:
            entity.feature.coordinates = [lngLat.lng, lngLat.lat];
            entity.feature.drawStep = [[lngLat.lng, lngLat.lat]];
            break;

        default:
            break;
    }
};
