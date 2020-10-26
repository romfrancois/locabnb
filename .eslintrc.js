module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        es6: true,
        browser: true,
        es2021: true,
        node: true,
    },
    plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    rules: {
        'react/jsx-one-expression-per-line': 'off',
        indent: ['error', 4, { ignoredNodes: ['JSXElement *'], SwitchCase: 1 }],
        'react/jsx-props-no-spreading': [1],
        'no-shadow': 'off',
        'react/jsx-indent': [0],
        'react/jsx-indent-props': [1, 4],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-filename-extension': [
            1,
            {
                extensions: ['.tsx'],
            },
        ],
        'import/prefer-default-export': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
                tsx: 'never',
            },
        ],
        'prettier/prettier': 'error',
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
        'import/resolver': {
            webpack: {
                paths: ['src'],
                extensions: ['.ts', '.tsx'],
            },
            node: {
                paths: ['src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
};
