module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint',
		sourceType: 'module'
	},
	env: {
		browser: true,
	 },
	settings: {
		'import/resolver': {
		  webpack: {
			config: 'build/webpack.base.conf.js'
		  }
		}
	  },
	extends: [
		'eslint:recommended',
		'plugin:vue/strongly-recommended'
	],
	globals:{
		"require": false,
		"Vue": false,
		"Vuex": false,
		"VueRouter": false,
		"_": false,
		"io": false,
		"axios": false,
		"Bloodhound": false,
		"throttledQueue": false,
		"introJs": false,
		"cl": false,
		"process":false,
		"EXTENSION_CLIENT_ID": false
	},
	rules: {
		// override/add rules settings here, such as:
		// 'vue/no-unused-vars': 'error'
		"vue/name-property-casing": ["error", "kebab-case"],
		'vue/attribute-hyphenation': [2,'never'],
		"eqeqeq": 1,
		"no-var": 1,
		"require-await": 1,
		"yoda": 1,
		"prefer-const": 1,
		"prefer-arrow-callback": 1,
		"object-shorthand": 1,
		"vue/max-attributes-per-line":0,
		"vue/order-in-components": 0,
		"vue/html-indent": 0,
		"vue/require-default-prop": 0,
		"no-mixed-spaces-and-tabs": 0,
		"no-console": 0
	}
}
