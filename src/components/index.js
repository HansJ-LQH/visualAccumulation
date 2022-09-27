// require.context参数：1. 文件夹所在位置  2. 是否加载子目录true/false  3. 加载的正则匹配(以.vue为结尾的文件)
const referComponent = require.context('../components', true, /\.vue$/);
export default {
    install(app) {
        // 批量注册全局组件
        referComponent.keys().forEach(key => {
            // 导入组件
            const component = referComponent(key).default;
            // 注册组件
            app.component(component.name, component);
        });
    },
};
