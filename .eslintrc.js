module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'airbnb-base',
        'prettier'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'no-alert': 'off',
        'no-plusplus': 'off',
        'no-param-reassign': 'off',
        'no-shadow': 'off',
        'no-use-before-define': 'off',
        'import/prefer-default-export': 'off',
        'no-empty-function': 'off', // Allow empty functions for mocks in tests
        'global-require': 'off', // Allow require() in tests
        'import/extensions': 'off' // Allow .js extension in require/import paths
    }
};
