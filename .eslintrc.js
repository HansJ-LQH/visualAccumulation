module.exports = {
    env: {
        node: true,
        browser: true,
        es6: true,
        commonjs: true,
    },
    extends: ['airbnb-base', 'prettier', 'prettier/vue'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['vue', 'import'],
    rules: {
        'linebreak-style': [0, 'error', 'windows'],
        'no-console': 'off',
        'max-len': [
            'error',
            {
                comments: 300,
                ignoreStrings: true,
                ignoreUrls: true,
                code: 120,
            },
        ],
        'no-underscore-dangle': ['error', { allowAfterThis: true }],
        'import/extensions': 'off',
        'no-param-reassign': ['error', { props: false }],
        'no-unused-vars': 'warn',
    },
};
