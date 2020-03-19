module.exports = {
    env: {
        node: true
    },
    parserOptions: {
        "ecmaVersion": 2018,
    },
    plugins: ["node"],
    extends: ["eslint:recommended", "plugin:node/recommended", "standard"],
    globals: {
        cl: true
    }
}
