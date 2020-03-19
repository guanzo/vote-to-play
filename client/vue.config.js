const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ZipPlugin = require('zip-webpack-plugin')

const IS_PROD = process.env.NODE_ENV === 'production'
const abspath = (p = '') => path.resolve(__dirname, p)

const projectRootPath = (p = '') => path.resolve(__dirname, '../', p)

const baseConfig = {
    externals: {
        '@sentry/browser': 'Sentry'
    },
    resolve: {
        alias: {
            '@shared': abspath('../shared')
        }
    },
}

const devConfig = {
}

const prodConfig = {
    output: {
        filename: 'js/app.[hash].js',
    },
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
    },
    plugins: [
        new ZipPlugin({
            filename: '../votetoplay.zip'
        })
    ]
}

const pageOpts = {
    entry: 'src/main.js',
    minify: false,
    template: 'public/index.html'
}

module.exports = {
    publicPath: './', // Relative to the twitch extension root
    lintOnSave: false,
    pages: {
        viewer: pageOpts,
        config: pageOpts,
        liveconfig: pageOpts,
        mobile: pageOpts,
    },
    devServer: {
        port: 8060,
        https: {
            key: fs.readFileSync(abspath('../certs/private.key')),
            cert: fs.readFileSync(abspath('../certs/public.crt'))
        },
    },
    css: {
        extract: {
            filename: 'css/app.[hash].css',
        },
    },
    configureWebpack () {
        const configs = [baseConfig]
        if (IS_PROD) {
            configs.push(prodConfig)
        } else {
            configs.push(devConfig)
        }
        return merge(...configs)
    },
    chainWebpack: config => {
        config.optimization.minimize(false)

        // https://cli.vuejs.org/guide/css.html#automatic-imports
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
    },
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: false
        }
    }
}

function addStyleResource (rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/assets/scss/variables.scss'),
            ],
        })
}
