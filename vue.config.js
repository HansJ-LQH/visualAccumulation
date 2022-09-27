const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    lintOnSave: true,
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    configureWebpack: {
        resolve: {
            alias: {
                src: '@',
                components: '@/components',
                views: '@/views',
            },
        },
        plugins: [
            new CompressionPlugin({
                algorithm: 'gzip', // 使用gzip压缩
                test: /\.js$|\.html$|\.css$/, // 匹配文件名
                filename: '[path].gz[query]', // 压缩后的文件名(保持原文件名，后缀加.gz)
                minRatio: 1, // 压缩率小于1才会压缩
                threshold: 0, // 对所有文件都压缩，不限制大小
                deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
            }),
        ],
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `
              @import "@/assets/scss/main.scss";
            `,
            },
        },
    },
};
