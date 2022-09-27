import plotUtil from '../util/plotUtil';
import { HALF_PI } from '../util/plotConstants';

const tailWidthFactor = 0.2;
const neckWidthFactor = 0.25;
const headWidthFactor = 0.3;
const headAngle = Math.PI / 4;
const neckAngle = Math.PI * 0.17741;

function generateAssaultDirection(option) {
    const { startPoint, endPoint } = option;
    if (!startPoint || !endPoint) {
        return null;
    }

    const len = plotUtil.getBaseLength([startPoint, endPoint]);
    const tailWidth = len * tailWidthFactor;
    const neckWidth = len * neckWidthFactor;
    const headWidth = len * headWidthFactor;
    const tailLeft = plotUtil.getThirdPoint(endPoint, startPoint, HALF_PI, tailWidth, true);
    const tailRight = plotUtil.getThirdPoint(endPoint, startPoint, HALF_PI, tailWidth, false);
    const headLeft = plotUtil.getThirdPoint(startPoint, endPoint, headAngle, headWidth, false);
    const headRight = plotUtil.getThirdPoint(startPoint, endPoint, headAngle, headWidth, true);
    const neckLeft = plotUtil.getThirdPoint(startPoint, endPoint, neckAngle, neckWidth, false);
    const neckRight = plotUtil.getThirdPoint(startPoint, endPoint, neckAngle, neckWidth, true);
    return [tailLeft, neckLeft, headLeft, endPoint, headRight, neckRight, tailRight, tailLeft];
}

export default { generateAssaultDirection };
