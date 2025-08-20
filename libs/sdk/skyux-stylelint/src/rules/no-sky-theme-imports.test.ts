import { describe } from 'vitest';

import { testRule } from '../testing/test-rule.js';

import plugin, { ruleName } from './no-sky-theme-imports.js';

describe(ruleName, () => {
  testRule({
    plugins: [plugin],
    ruleName,
    config: true,
    accept: [
      {
        code: `@import '@skyux/theme/scss/responsive-container.scss';`,
        description:
          'should allow responsive-container.scss import with extension',
      },
      {
        code: `@import '@skyux/theme/scss/responsive-container';`,
        description:
          'should allow responsive-container import without extension',
      },
      {
        code: `@use '@skyux/theme/scss/responsive-container.scss';`,
        description: 'should allow responsive-container.scss with @use',
      },
      {
        code: `@use '@skyux/theme/scss/responsive-container';`,
        description:
          'should allow responsive-container with @use (no extension)',
      },
      {
        code: `@forward '@skyux/theme/scss/responsive-container.scss';`,
        description: 'should allow responsive-container.scss with @forward',
      },
      {
        code: `@forward '@skyux/theme/scss/responsive-container';`,
        description:
          'should allow responsive-container with @forward (no extension)',
      },
      {
        code: `@import '@angular/material/theming';`,
        description: 'should allow imports from other packages',
      },
      {
        code: `@import '@skyux/theme';`,
        description: 'should allow imports from @skyux/theme without scss path',
      },
      {
        code: `
          .my-class {
            color: red;
          }

          @media (max-width: 768px) {
            .responsive {
              display: none;
            }
          }
        `,
        description: 'should allow unrelated CSS rules',
      },
    ],
    reject: [
      {
        code: `@import '@skyux/theme/scss/mixins.scss';`,
        message: `Direct imports from "@skyux/theme/scss/mixins.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should reject mixins.scss import',
      },
      {
        code: `@import '@skyux/theme/scss/variables.scss';`,
        message: `Direct imports from "@skyux/theme/scss/variables.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should reject variables.scss import',
      },
      {
        code: `@import '@skyux/theme/scss/variables';`,
        message: `Direct imports from "@skyux/theme/scss/variables" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should reject variables import without extension',
      },
      {
        code: `@import '@skyux/theme/scss/mixins';`,
        message: `Direct imports from "@skyux/theme/scss/mixins" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should reject mixins import without extension',
      },
      {
        code: `@use '@skyux/theme/scss/_compat/_mixins.scss';`,
        message: `Direct imports from "@skyux/theme/scss/_compat/_mixins.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should reject compat mixins import with @use',
      },
      {
        code: `@forward '@skyux/theme/scss/_compat/_variables.scss';`,
        message: `Direct imports from "@skyux/theme/scss/_compat/_variables.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should reject compat variables import with @forward',
      },
      {
        code: `@import '@skyux/theme/scss/themes/modern/_compat/_mixins.scss';`,
        message: `Direct imports from "@skyux/theme/scss/themes/modern/_compat/_mixins.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should reject modern theme compat mixins import',
      },
      {
        code: `@import '@skyux/theme/scss/themes/modern/_compat/_variables.scss';`,
        message: `Direct imports from "@skyux/theme/scss/themes/modern/_compat/_variables.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should reject modern theme compat variables import',
      },
      {
        code: `@import "@skyux/theme/scss/mixins.scss";`,
        message: `Direct imports from "@skyux/theme/scss/mixins.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should handle double quotes',
      },
      {
        code: `@use '@skyux/theme/scss/variables.scss' as *;`,
        message: `Direct imports from "@skyux/theme/scss/variables.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should handle imports with additional options',
      },
      {
        code: `@forward '@skyux/theme/scss/mixins.scss' hide some-mixin;`,
        message: `Direct imports from "@skyux/theme/scss/mixins.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should handle @forward with configuration',
      },
      {
        code: `@import '@skyux/theme/scss/variables.scss'`,
        message: `Direct imports from "@skyux/theme/scss/variables.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should handle imports without semicolon',
      },
      {
        code: `@import '@skyux/theme/scss/some/deeply/nested/path.scss';`,
        message: `Direct imports from "@skyux/theme/scss/some/deeply/nested/path.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description: 'should handle complex nested paths',
      },
      {
        code: `
          @import '@skyux/theme/scss/responsive-container.scss';
          @import '@skyux/theme/scss/mixins.scss';
        `,
        message: `Direct imports from "@skyux/theme/scss/mixins.scss" are not allowed. Only "@skyux/theme/scss/responsive-container" is permitted for direct import.`,
        description:
          'should handle mixed content with allowed and disallowed imports',
      },
    ],
  });

  testRule({
    plugins: [plugin],
    ruleName,
    config: 'some-invalid-value',
    reject: [
      {
        code: "@import '@skyux/theme/scss/mixins.scss';",
        description: 'should not validate when config invalid',
        message: `Invalid option value "some-invalid-value" for rule "${ruleName}"`,
      },
    ],
  });
});
