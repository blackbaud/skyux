const config = require('../../../eslint-libs.config');

module.exports = [
  ...config,
  {
    files: ['**/datepicker-calendar.component.html'],
    rules: {
      // todo: find an alternative to using autofocus
      '@angular-eslint/template/no-autofocus': 'off',
    },
  },
];
