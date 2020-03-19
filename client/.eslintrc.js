module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/essential',
		'@vue/standard'
	],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		"prefer-const": 1,
		"node/exports-style": ["error", "module.exports"],
		"node/no-unpublished-require": "warn",
		"eqeqeq": ["error","smart"],
		"no-mixed-spaces-and-tabs": 0,
		"indent": ["error", 4],
	},
	overrides: [
		{
		files: [
			'**/__tests__/*.{j,t}s?(x)',
			'**/tests/unit/**/*.spec.{j,t}s?(x)'
		],
		env: {
			mocha: true
		}
		}
	]
}
