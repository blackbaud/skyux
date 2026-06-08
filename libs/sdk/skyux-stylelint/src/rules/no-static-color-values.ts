import stylelint, { Rule, RuleBase } from 'stylelint';

import { getRuleMeta } from '../utility/meta.js';
import { withNamespace } from '../utility/namespace.js';

const ruleId = 'no-static-color-values';
export const ruleName = withNamespace(ruleId);

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (property: string, value: string) =>
    `Unexpected static color value "${value}" for property "${property}". Use SKY UX approved custom properties instead.`,
});

// Properties that only assign color values (non-shorthand)
const DIRECT_COLOR_PROPERTIES = new Set([
  'color',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
]);

// Shorthand properties that can assign color values.
const SHORTHAND_COLOR_PROPERTIES = new Set(['background', 'border']);

// Properties that should not have static color values
const COLOR_PROPERTIES = new Set([
  ...DIRECT_COLOR_PROPERTIES,
  ...SHORTHAND_COLOR_PROPERTIES,
]);

// Allowed CSS keywords that should not be flagged
const ALLOWED_KEYWORDS = new Set([
  'inherit',
  'initial',
  'unset',
  'revert',
  'currentcolor', // normalized to lowercase for consistent comparison
  'transparent',
]);

// Regular expressions to detect static color values
const COLOR_VALUE_PATTERNS = [
  // Hex colors: #fff, #ffffff, #FFF, #FFFFFF
  /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/,
  // RGB/RGBA: rgb(255, 255, 255), rgba(255, 255, 255, 0.5)
  /^rgba?\([^)]+\)$/,
  // HSL/HSLA: hsl(0, 0%, 100%), hsla(0, 0%, 100%, 0.5)
  /^hsla?\([^)]+\)$/,
];

/**
 * Check if a value is a CSS named color.
 * Note: CSS named colors are standardized and stable since CSS 2.1/3.0 (2011).
 * This list is complete and unlikely to change.
 */
function isNamedColor(value: string): boolean {
  const namedColorPattern =
    /^(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/i;

  return namedColorPattern.test(value.toLowerCase());
}

const APPROVED_CUSTOM_PROPERTIES = [
  /^var\(\s*--sky-category-color-/,
  /^var\(\s*--sky-color-/,
  /^var\(\s*--sky-background-color-/,
  /^var\(\s*--sky-border-color-/,
  /^var\(\s*--sky-highlight-color-/,
  /^var\(\s*--sky-text-color-/,
];

function isStaticColorValue(value: string): boolean {
  const trimmedValue = value.trim();

  if (COLOR_VALUE_PATTERNS.some((pattern) => pattern.test(trimmedValue))) {
    return true;
  }

  return isNamedColor(trimmedValue);
}

function isApprovedCustomProperty(value: string): boolean {
  // Normalize whitespace: remove newlines and extra spaces, but preserve single spaces
  const normalizedValue = value.replace(/\s+/g, ' ').trim();

  return APPROVED_CUSTOM_PROPERTIES.some((pattern) =>
    pattern.test(normalizedValue),
  );
}

function extractColorValues(value: string): string[] {
  const colorValues: string[] = [];

  // First, check for function-based colors like rgb(), rgba(), hsl(), hsla()
  const functionColorPattern = /(rgba?\([^)]+\)|hsla?\([^)]+\))/gi;
  let match;
  while ((match = functionColorPattern.exec(value)) !== null) {
    const colorValue = match[1];
    /* v8 ignore else -- @preserve */
    if (isStaticColorValue(colorValue)) {
      colorValues.push(colorValue);
    }
  }

  // Then check for hex colors and named colors by splitting on spaces
  // but skip parts that are already matched by function patterns
  const parts = value.split(/\s+/);
  for (const part of parts) {
    if (isStaticColorValue(part)) {
      colorValues.push(part);
    }
  }

  return colorValues;
}

const ruleBase: RuleBase = (options) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: options,
      possible: [true],
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls((decl) => {
      const { prop, value } = decl;
      const lowerProp = prop.toLowerCase();

      if (!COLOR_PROPERTIES.has(lowerProp)) {
        return;
      }

      if (isApprovedCustomProperty(value)) {
        return;
      }

      const lowerValue = value.toLowerCase();
      if (ALLOWED_KEYWORDS.has(lowerValue)) {
        return;
      }

      if (DIRECT_COLOR_PROPERTIES.has(lowerProp)) {
        /* v8 ignore else -- @preserve */
        if (isStaticColorValue(value)) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.rejected(prop, value),
            node: decl,
          });
        }
        return;
      }

      /* v8 ignore else -- @preserve */
      if (SHORTHAND_COLOR_PROPERTIES.has(lowerProp)) {
        const colorValues = extractColorValues(value);
        for (const colorValue of colorValues) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.rejected(prop, colorValue),
            node: decl,
          });
        }
      }
    });
  };
};

const rule = ruleBase as Rule;

rule.messages = messages;
rule.meta = getRuleMeta({ ruleId });
rule.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, rule);
