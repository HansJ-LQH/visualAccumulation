const { THREE } = window;

class ThreeSdk extends EventTarget {
    constructor() {
        super();
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.controls = null;
        window.threeSdk = this;
    }

    init() {
        this.initScene();
        this.initLight();
        this.initCamera();
        this.initAxesHelper();
        this.addMesh();
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initLight() {
        // 点光源
        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(400, 200, 300); // 点光源位置
        this.scene.add(pointLight); // 点光源添加到场景中
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x444444);
        this.scene.add(ambientLight);
    }

    initCamera() {
        const width = window.innerWidth; // 窗口宽度
        const height = window.innerHeight; // 窗口高度
        const k = width / height; // 窗口宽高比
        const s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
        // 创建相机对象
        this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
        this.camera.position.set(200, 300, 200); // 设置相机位置
        this.camera.lookAt(this.scene.position); // 设置相机方向(指向的场景对象)
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height); // 设置渲染区域尺寸
        this.renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
        document.getElementById('three-container').appendChild(this.renderer.domElement); // body元素中插入canvas对象
        this.render();
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement); // 创建控件对象
        this.controls.addEventListener('change', this.render); // 监听鼠标、键盘事件
    }

    initAxesHelper() {
        this.scene.add(new THREE.AxesHelper(250));
    }

    // eslint-disable-next-line class-methods-use-this
    render() {
        window.threeSdk.renderer.render(window.threeSdk.scene, window.threeSdk.camera); // 执行渲染操作
    }

    addMesh() {
        // 添加正方形
        this.scene.add(
            new THREE.Mesh(
                new THREE.BoxGeometry(30, 40, 50),
                new THREE.MeshLambertMaterial({
                    color: 0xffffff,
                    specular: 0x4488ee,
                    shininess: 12,
                })
            )
        );
        this.scene.add(
            new THREE.Mesh(
                new THREE.SphereGeometry(30, 30, 30),
                new THREE.MeshLambertMaterial({
                    color: 0xe84133,
                    opacity: 0.7,
                    transparent: true,
                })
            ).translateY(50)
        );
        this.scene.add(
            new THREE.Mesh(
                new THREE.CylinderGeometry(50, 50, 100, 25),
                new THREE.MeshLambertMaterial({
                    color: 0xe84133,
                    opacity: 0.7,
                    wireframe: true,
                })
            ).translateX(-80)
        );
        this.render();
    }

    destroy() {
        this.controls.dispose();
    }
}

export default new ThreeSdk();
