const config = require('../../../eslint-libs.config');

module.exports = [
  ...config,
  {
    // SKY UX's HTML layers (data points, legend, and data table) must not
    // depend on Chart.js, which keeps clear where native Chart.js stops. Only
    // the plots that build Chart.js configuration, chart-js/, and
    // chart-js-plugins/ may import it.
    files: [
      '**/src/lib/chart-data-points/**/*.ts',
      '**/src/lib/chart-legend/**/*.ts',
      '**/src/lib/chart-table/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'chart.js',
              message:
                'The HTML layers must not depend on Chart.js. Move Chart.js logic to chart-js/ or chart-js-plugins/.',
            },
          ],
        },
      ],
    },
  },
];
