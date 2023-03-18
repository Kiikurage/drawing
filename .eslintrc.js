module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/prefer-namespace-keyword': 'off',
        '@typescript-eslint/no-namespace': 'off',
    },
    overrides: [
        {
            files: ['**/.eslintrc.js', '**/babel.config.js', '**/webpack.config.js'],
            env: { node: true },
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
