module.exports = {
    env: {
        node: true
    },
    parserOptions: {
        "ecmaVersion": 2018,
    },
    plugins: ["node"],
    extends: ["eslint:recommended", "plugin:node/recommended", "standard"],
    rules: {
        "prefer-const": 1,
        "node/exports-style": ["error", "module.exports"],
		"node/no-unpublished-require": "warn",
		"eqeqeq": ["error","smart"],
        "no-mixed-spaces-and-tabs": 0,
        "indent": ["error", 4],
    }
}
