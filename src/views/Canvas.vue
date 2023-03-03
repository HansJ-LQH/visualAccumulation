<template>
    <div class="canvas">
        <!-- <canvas id="webgl" width="500" height="500" style="background-color: blue"></canvas> -->
        <button @click="init">生成格子</button>
        <button @click="startFindPath">测试按钮</button>
        <div>开启列表：{{ openIdList }}</div>
        <div>关闭列表：{{ closeIdList }}</div>
        <div class="canvas-body">
            <span
                :class="
                    `cube ${item.id === startNum ? 'start' : ''} ${item.id === endNum ? 'end' : ''}`
                "
                v-for="item in data"
                :key="item.id"
            >
                <p class="f">{{ item.f }}</p>
                <p class="g">{{ item.g }}</p>
                <p class="h">{{ item.h }}</p>
                <p class="id">{{ item.id }}</p>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name: '',
    data() {
        return {
            data: [],
            startNum: undefined,
            endNum: undefined,
            maxX: 10,
            maxY: 10,
            cubeObj: {
                // 方块对象实例
                id: 0,
                x: 0,
                y: 0,
                isImpassable: true, // 是否不可通行
                f: null, // 从起点到达终点的总路径，f = g + h
                g: null, // 距离起始点的路径
                h: null, // 距离终点的路径
                parentId: 0, // 父节点
            },
            openIdList: [], // 开启列表
            closeIdList: [], // 关闭列表
        };
    },

    components: {},

    methods: {
        init() {
            const { maxY } = this;
            this.data = Array.from(
                { length: 100 },
                (item, index) =>
                    (item = {
                        id: index + 1,
                        x: (index % maxY) + 1,
                        y: Math.floor(index / maxY) + 1,
                        isImpassable: false,
                        name: `cube${index + 1}`,
                        f: 0,
                        g: 0,
                        h: 0,
                    })
            );
            this.startNum = this.getRandomNum();
            this.endNum = this.getRandomNum();
        },
        getRandomNum(minNum = 1, maxNum = 100) {
            return Math.floor(Math.random() * (maxNum - minNum + 1)) + 1;
        },
        // #region ------------------------- A Start 寻路算法 -------------------------

        // 主程序
        startFindPath() {
            const startCube = this.data.find(i => i.id === this.startNum);
            const endCube = this.data.find(i => i.id === this.endNum);
            this.startCube = startCube;
            this.endCube = endCube;
            this.currentCube = startCube;
            // 将起始点加入开启列表
            this.time = setInterval(this.handle.bind(this), 500);
        },

        handle() {
            console.log('HJJ 寻路中');
            const { currentCube } = this;
            if (this.closeIdList.includes(currentCube.id)) {
                // 关闭列表包含当前方块，不需要再处理此方块
                console.log('HJJ 关闭列表包含当前方块，不需要再处理此方块', currentCube.id);
                clearInterval(this.time);
                return;
            }
            if (!this.openIdList.includes(currentCube.id)) this.openIdList.push(currentCube.id);
            const surroundCube = this.openSurroundCube(currentCube);

            const nextCube = this.getMinFCube(surroundCube);
            // 从开启列表中移除当前方块，并将其加入关闭列表
            this.openIdList.splice(this.openIdList.indexOf(currentCube.id), 1);
            this.closeIdList.push(currentCube.id);
            this.currentCube = nextCube;

            // 结束寻路
            if (surroundCube.filter(i => i.id === this.endCube.id).length > 0) {
                console.log('HJJ 结束寻路');
                const path = this.getMinPath();
                console.log(`HJJ -> handle -> path`, path);
                clearInterval(this.time);
                return;
            }
        },

        // 获取最短路径
        getMinPath() {
            const pathList = [];
            const { startCube, endCube } = this;
            let index = 0;
            const getParentId = cube => {
                console.log(`HJJ -> getParentId -> cube`, index, cube);
                pathList.push(cube.parentId);
                if (cube.parentId === startCube.id || index > 5) return;
                const nextCube = this.data.find(i => i.id === cube.parentId);
                index += 1;
                getParentId(nextCube);
                console.log(`HJJ -> getParentId -> nextCube`, nextCube);
            };
            getParentId(endCube);
            return pathList;
        },

        // 获取F值最小的方块作为下一个处理的方块
        getMinFCube(cubeList) {
            let nextCube = cubeList[0];
            cubeList.forEach(cube => {
                if (cube.f < nextCube.f) nextCube = cube;
            });
            return nextCube;
        },

        // 开启当前方块周围方块进行处理
        openSurroundCube(currentCube) {
            const surroundCube = this.getSurroundCube(currentCube);
            surroundCube.map(cube => {
                const newCube = this.formatCube(currentCube, cube);
                if (!this.openIdList.includes(newCube.id) && !this.closeIdList.includes(newCube.id))
                    this.openIdList.push(newCube.id);
                this.data[newCube.id - 1] = newCube;
            });
            return surroundCube;
        },

        // 处理开启方块
        formatCube(currentCube, cube) {
            cube.g = this._getSurroundPath(currentCube, cube);
            cube.h = this._getEndPath(cube);
            cube.f = cube.g + cube.h;
            cube.parentId = currentCube.id;
            cube.isImpassable = false;
            return cube;
        },

        // 计算当前方块G值
        _getSurroundPath(currentCube, targetCube) {
            return currentCube.x === targetCube.x || currentCube.y === targetCube.y ? 10 : 14;
        },

        // 计算当前方块H值
        _getEndPath(currentCube) {
            return (
                (Math.abs(currentCube.x - this.endCube.x) +
                    Math.abs(currentCube.y - this.endCube.y)) *
                10
            );
        },

        // 获取周围的格子
        getSurroundCube(currentCube) {
            const { x, y } = currentCube;
            return this.data
                .filter(i => i.x >= x - 1 && i.x <= x + 1 && i.y >= y - 1 && i.y <= y + 1) // 获取包括自己在内八个方向上共九个格子
                .filter(i => i.x !== x || i.y !== y) // 排除自己
                .filter(i => !i.isImpassable); // 排除不可穿越的方块
        },

        test() {},

        // #endregion ---------------------- A Start 寻路算法 -------------------------
    },
};
</script>
<style lang="scss" scoped>
.canvas-body {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 520px;
    height: 520px;
    .cube {
        display: block;
        width: 50px;
        height: 50px;
        border: 1px solid black;
        position: relative;
        .id {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .f {
            position: absolute;
            top: 0;
            left: 0;
        }
        .g {
            position: absolute;
            bottom: 0;
            left: 0;
        }
        .h {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
    .start {
        background-color: greenyellow;
    }
    .end {
        background-color: red;
    }
}
</style>
