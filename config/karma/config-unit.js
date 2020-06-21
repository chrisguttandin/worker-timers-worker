const { env } = require('process');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserNoActivityTimeout: 20000,

        client: {
            mochaWebWorker: {
                evaluate: {
                    // This is basically a part of the functionality which karma-sinon-chai would provide in a Window.
                    beforeRun: `(function(self) {
                        self.should = null;
                        self.should = self.chai.should();
                        self.expect = self.chai.expect;
                        self.assert = self.chai.assert;
                    })(self);`
                },
                pattern: ['**/chai/**', '**/leche/**', '**/lolex/**', '**/sinon/**', '**/sinon-chai/**', 'test/unit/**/*.js']
            }
        },

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: true,
                watched: true
            },
            {
                included: false,
                pattern: 'test/unit/**/*.js',
                served: true,
                watched: true
            }
        ],

        frameworks: ['mocha-webworker', 'sinon-chai'],

        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },

        preprocessors: {
            'src/**/!(*.d).ts': 'webpack',
            'test/unit/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader'
                        }
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.ts']
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.TRAVIS) {
        config.set({
            browsers: ['ChromeSauceLabs', 'FirefoxSauceLabs', 'SafariSauceLabs'],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'macOS 10.15'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'macOS 10.15'
                },
                SafariSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'safari',
                    platform: 'macOS 10.15'
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER
        });
    } else {
        config.set({
            browsers: ['ChromeHeadless', 'ChromeCanaryHeadless', 'FirefoxHeadless', 'FirefoxDeveloperHeadless', 'Safari'],

            concurrency: 2
        });
    }
};
