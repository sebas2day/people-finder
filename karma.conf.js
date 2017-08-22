module.exports = function (config) {
  config.set({

    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      { pattern: 'base.spec.ts' },
      { pattern: 'src/app/**/*.+(ts|html)' }
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,

        transforms: [
          require('karma-typescript-es6-transform')(),
          require('karma-typescript-angular2-transform')
        ]
      },
      coverageOptions: {
        instrumentation: true
      },
      tsconfig: './tsconfig.json'
    },

    reporters: ['progress', 'karma-typescript'],

    browsers: ['Chrome']
  });
};