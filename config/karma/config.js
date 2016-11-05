module.exports = function (config) {

    config.set({

        basePath: '../../',

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: true,
                watched: true
            },
            'test/unit/**/*.js'
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        preprocessors: {
            'src/**/*.ts': 'typescript',
            'test/unit/**/*.js': 'webpack'
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browsers: [
                'ChromeSauceLabs',
                'FirefoxSauceLabs',
                'SafariSauceLabs'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.11'
                },
                FirefoxDeveloperSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.11',
                    version: 'dev'
                },
                SafariSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'safari',
                    platform: 'OS X 10.11'
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'Chrome',
                'ChromeCanary',
                'Firefox',
                'FirefoxDeveloper',
                'Safari'
            ]

        });

    }

};
