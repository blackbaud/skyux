import publicApiStylesJson from '@blackbaud/skyux-design-tokens/bundles/public-api-styles.json';

interface PublicApiStyle {
  name: string;
  className?: string;
  deprecatedClassNames?: string[];
  obsoleteClassNames?: string[];
}

interface PublicApiStyleGroup {
  name: string;
  groups?: PublicApiStyleGroup[];
  styles?: PublicApiStyle[];
}

interface PublicApiStyles {
  groups?: PublicApiStyleGroup[];
  styles?: PublicApiStyle[];
}

const publicApiStyles = publicApiStylesJson as PublicApiStyles;

function walkStyles(
  groups: PublicApiStyleGroup[] | undefined,
  styles: PublicApiStyle[] | undefined,
  callback: (style: PublicApiStyle) => void,
): void {
  for (const style of styles ?? []) {
    callback(style);
  }
  for (const group of groups ?? []) {
    walkStyles(group.groups, group.styles, callback);
  }
}

export const deprecatedStyleClassMap: Map<string, string | undefined> =
  new Map();

export const validPublicClassNames: Set<string> = new Set();

walkStyles(publicApiStyles.groups, publicApiStyles.styles, (style) => {
  if (style.className) {
    validPublicClassNames.add(style.className);
  }
  for (const cls of style.deprecatedClassNames ?? []) {
    deprecatedStyleClassMap.set(cls, style.className);
  }
  for (const cls of style.obsoleteClassNames ?? []) {
    deprecatedStyleClassMap.set(cls, style.className);
  }
});

export const WHITELISTED_SKY_CLASSES: Set<string> = new Set([
  'sky-btn',
  'sky-btn-block',
  'sky-btn-block-logo',
  'sky-btn-borderless',
  'sky-btn-borderless-inline',
  'sky-btn-danger',
  'sky-btn-default',
  'sky-btn-icon',
  'sky-btn-icon-borderless',
  'sky-btn-link',
  'sky-btn-link-inline',
  'sky-btn-primary',
  'sky-btn-sm',
  'sky-control-help', // content projection selector
  'sky-control-label', // content projection selector
  'sky-control-label-required',
  'sky-error-indicator', // content projection selector
  'sky-error-label', // content projection selector; deprecate maybe?
  'sky-form-control',
  'sky-form-group',
  'sky-input-box-btn-inset', // content projection selector
  'sky-input-box-btn-left', // content projection selector
  'sky-input-box-icon-inset', // content projection selector
  'sky-input-box-icon-inset-left', // content projection selector
  'sky-input-group',
  'sky-input-group-btn', // content projection selector
  'sky-input-group-icon', // content projection selector
  'sky-pull-right', // add to style API in future
  'sky-screen-reader-only',
]);

export type SkyClassNameCheck =
  | { type: 'valid' }
  | { type: 'unknownThemeClass'; className: string }
  | {
      type: 'deprecatedWithReplacement';
      className: string;
      replacement: string;
    }
  | { type: 'deprecatedNoReplacement'; className: string }
  | { type: 'privateClass'; className: string };

export function checkSkyClassName(className: string): SkyClassNameCheck {
  if (className.startsWith('sky-theme-')) {
    return validPublicClassNames.has(className)
      ? { type: 'valid' }
      : { type: 'unknownThemeClass', className };
  }

  if (deprecatedStyleClassMap.has(className)) {
    const replacement = deprecatedStyleClassMap.get(className);
    return replacement !== undefined
      ? { type: 'deprecatedWithReplacement', className, replacement }
      : { type: 'deprecatedNoReplacement', className };
  }

  return WHITELISTED_SKY_CLASSES.has(className)
    ? { type: 'valid' }
    : { type: 'privateClass', className };
}

export const STYLE_API_DOCS_URL =
  'https://developer.blackbaud.com/skyux/design/styles';

export const SKY_CLASSNAME_MESSAGES = {
  deprecatedWithReplacement:
    '"{{className}}" is deprecated. Use "{{replacement}}" instead.',
  deprecatedNoReplacement:
    '"{{className}}" is deprecated with no direct replacement. See the style API documentation: {{docsUrl}}',
  unknownThemeClass:
    '"{{className}}" is not a known sky-theme- class. See the style API documentation for valid class names: {{docsUrl}}',
  privateClass:
    '"{{className}}" is a private SKY UX class and should not be used directly. See the style API documentation for alternatives: {{docsUrl}}',
} as const;
