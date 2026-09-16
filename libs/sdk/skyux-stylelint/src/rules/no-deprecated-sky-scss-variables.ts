import stylelint, { Rule, RuleBase } from 'stylelint';

import { getRuleMeta } from '../utility/meta.js';
import { withNamespace } from '../utility/namespace.js';
import { deprecatedScssVarMap } from '../utility/style-public-api.js';

const ruleId = 'no-deprecated-sky-scss-variables';
export const ruleName = withNamespace(ruleId);

const STYLE_API_DOCS_URL =
  'https://developer.blackbaud.com/skyux/design/styles';

// Matches an optional Sass module namespace (e.g. `variables.` or `v.`) followed by
// the `$sky-` variable itself. Capture group 1 is the bare variable name, used to look
// up replacements in `deprecatedScssVarMap`; the full match (including the namespace)
// is what gets replaced when fixing.
const SCSS_VAR_PATTERN = /(?:[\w-]+\.)?(\$sky-[a-z0-9-]+)/g;

// Global (un-namespaced) Sass/CSS functions whose arguments are color
// channels/components rather than whole colors, including the legacy global
// equivalents of the `sass:color` module functions and the color-channel getters
// (e.g. `red($color)`). Replacing a `$sky-*` variable with `var(--sky-theme-*)`
// inside one of these produces syntactically valid SCSS that compiles to invalid
// CSS (e.g. `rgba(var(--sky-theme-color-text-action), 0.25)`), so such occurrences
// are reported but never auto-fixed.
const GLOBAL_COLOR_FUNCTIONS = new Set([
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'mix',
  'darken',
  'lighten',
  'saturate',
  'desaturate',
  'adjust-hue',
  'complement',
  'invert',
  'grayscale',
  'opacify',
  'fade-in',
  'transparentize',
  'fade-out',
  'change-color',
  'adjust-color',
  'scale-color',
  'red',
  'green',
  'blue',
  'hue',
  'saturation',
  'lightness',
  'whiteness',
  'blackness',
  'alpha',
  'opacity',
  'ie-hex-str',
]);

// Bare function names from Sass's built-in `sass:color` module (see
// https://sass-lang.com/documentation/modules/color/). These are matched against
// the segment after the *last* `.` of the identifier preceding `(`, regardless of
// what namespace/alias precedes it (e.g. both `color.adjust(...)` and, after
// `@use 'sass:color' as c;`, `c.adjust(...)`), since the rule has no way to
// resolve which `@use` alias refers to `sass:color`. Being alias-agnostic can only
// cause a false positive (an occurrence is reported but left unfixed even though
// it wasn't actually inside a `sass:color` call), never a false negative that
// would auto-fix invalid code.
const COLOR_MODULE_FUNCTIONS = new Set([
  'adjust',
  'change',
  'scale',
  'mix',
  'complement',
  'grayscale',
  'invert',
  'ie-hex-str',
  'channel',
  'red',
  'green',
  'blue',
  'hue',
  'saturation',
  'lightness',
  'whiteness',
  'blackness',
  'alpha',
  'opacity',
]);

/** Whether the identifier immediately preceding a `(` names a color function. */
function isColorFunctionName(name: string): boolean {
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex === -1) {
    return GLOBAL_COLOR_FUNCTIONS.has(name);
  }
  return COLOR_MODULE_FUNCTIONS.has(name.slice(dotIndex + 1));
}

const messages = stylelint.utils.ruleMessages(ruleName, {
  deprecatedWithReplacement: (variable: string, replacement: string) =>
    `"${variable}" is deprecated. Use "var(${replacement})" instead.`,
  deprecatedNoReplacement: (variable: string) =>
    `"${variable}" is deprecated with no direct replacement. See the style API documentation: ${STYLE_API_DOCS_URL}`,
  privateVariable: (variable: string) =>
    `"${variable}" is a private or obsolete SKY UX SCSS variable. To find an alternative, see the style API documentation: ${STYLE_API_DOCS_URL}`,
});

/** Finds the end index (exclusive) of a `//` line comment starting at `start`. */
function findLineCommentEnd(value: string, start: number): number {
  const newline = value.indexOf('\n', start);
  /* v8 ignore next -- @preserve */
  return newline === -1 ? value.length : newline;
}

/**
 * Finds the end index (exclusive) of a `/* *\/` block comment starting at `start`.
 * A `/*` without a later `*\/` shouldn't survive postcss-scss parsing, but guard
 * against it (treat the rest of the value as commented) rather than risk an
 * infinite loop.
 */
function findBlockCommentEnd(value: string, start: number): number {
  const close = value.indexOf('*/', start);
  return close === -1 ? value.length : close + 2;
}

/** Finds the index just past the closing quote matching the one at `start`. */
function skipQuotedString(value: string, start: number): number {
  const quote = value[start];
  let i = start + 1;
  while (i < value.length && value[i] !== quote) {
    i += value[i] === '\\' ? 2 : 1;
  }
  return i + 1;
}

/**
 * Finds the `[start, end)` index ranges within `value` that fall inside a comment
 * (block `/* *\/` or line `//`), so those regions can be ignored elsewhere without
 * altering `value`'s original offsets (comment text is left in place, just skipped
 * over). `value` is expected to be `decl.raws.value.scss` when present (the
 * original, un-normalized SCSS source) rather than `.raw`, since postcss-scss
 * rewrites `//` line comments into `/* *\/` block comments in `.raw`, which would
 * shift offsets and corrupt `--fix` output for values containing `//` comments.
 */
function findCommentRanges(value: string): [number, number][] {
  const ranges: [number, number][] = [];
  let i = 0;

  while (i < value.length) {
    const char = value[i];

    if (char === '\\') {
      // Skip the escaped character so an escaped quote can't end a string.
      i += 2;
    } else if (char === '"' || char === "'") {
      // Skip over the quoted string so `/*` or `//` inside it isn't treated as a
      // comment. An unterminated string can't occur here: postcss-scss would fail
      // to parse the declaration before `value` is ever produced.
      i = skipQuotedString(value, i);
    } else if (char === '/' && value[i + 1] === '/') {
      const end = findLineCommentEnd(value, i + 2);
      ranges.push([i, end]);
      i = end;
    } else if (char === '/' && value[i + 1] === '*') {
      const end = findBlockCommentEnd(value, i + 2);
      ranges.push([i, end]);
      i = end;
    } else {
      i++;
    }
  }

  return ranges;
}

/** Whether `index` falls inside one of the given `[start, end)` ranges. */
function isInsideRanges(index: number, ranges: [number, number][]): boolean {
  return ranges.some(([start, end]) => index >= start && index < end);
}

/**
 * Finds the `[start, end)` index ranges within `value` that fall inside a call to a
 * color function (per `isColorFunctionName`), so occurrences within those ranges can
 * be excluded from fixing. Characters inside `commentRanges` are skipped so that
 * comment text (e.g. a stray `)`) can't affect paren-matching or be mistaken for a
 * function name.
 */
function findColorFunctionRanges(
  value: string,
  commentRanges: [number, number][],
): [number, number][] {
  const ranges: [number, number][] = [];
  const stack: { isColorFunction: boolean; argsStart: number }[] = [];

  for (let i = 0; i < value.length; i++) {
    if (isInsideRanges(i, commentRanges)) {
      continue;
    }

    const char = value[i];

    if (char === '(') {
      const precedingIdentifier = /([\w.-]+)$/.exec(value.slice(0, i));
      const name = precedingIdentifier?.[1].toLowerCase();
      stack.push({
        isColorFunction: !!name && isColorFunctionName(name),
        argsStart: i + 1,
      });
    } else if (char === ')') {
      const frame = stack.pop();
      if (frame?.isColorFunction) {
        ranges.push([frame.argsStart, i]);
      }
    }
  }

  return ranges;
}

/**
 * Finds all `$sky-*` variable occurrences in `value` (via `SCSS_VAR_PATTERN`),
 * excluding any that only appear inside a comment (per `commentRanges`).
 */
function findVariableMatches(
  value: string,
  commentRanges: [number, number][],
): RegExpExecArray[] {
  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;

  SCSS_VAR_PATTERN.lastIndex = 0;
  while ((match = SCSS_VAR_PATTERN.exec(value)) !== null) {
    // Skip `$sky-*` text that only appears inside a comment; it isn't real SCSS
    // and must be left untouched (neither reported nor rewritten).
    if (!isInsideRanges(match.index, commentRanges)) {
      matches.push(match);
    }
  }

  return matches;
}

/**
 * The offset of a declaration's value within `decl.toString()`, used so each
 * warning/fix targets only its matched variable instead of the whole declaration.
 * Without this, all warnings on a declaration share the same (whole-node)
 * position, which breaks down once some occurrences are fixed and others are not.
 */
function getValueStart(decl: {
  prop: string;
  raws: { between?: string };
}): number {
  /* v8 ignore next -- @preserve: raws.between is always populated by the postcss/postcss-scss parsers */
  return decl.prop.length + (decl.raws.between ?? ': ').length;
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
      // `decl.raws.value` preserves the exact source text (including inline
      // comments) that `decl.toString()` renders, whereas `decl.value` may have
      // comments stripped. Matching/index computation must use this raw text so
      // reported offsets line up with the actual rendered declaration. Prefer
      // `.scss` over `.raw`: postcss-scss normalizes `//` line comments into
      // `/* */` block comments in `.raw` (only populating `.scss` with the
      // original text when it differs), which would shift offsets and cause
      // `--fix` to rewrite `//` comments as block comments. postcss's types
      // don't include this postcss-scss-specific raw, so cast it locally.
      const rawValue = decl.raws.value as
        { raw: string; value: string; scss?: string } | undefined;
      const value = rawValue?.scss ?? rawValue?.raw ?? decl.value;
      // Offset of `value` within `decl.toString()`; see `getValueStart`.
      const valueStart = getValueStart(decl);
      const commentRanges = findCommentRanges(value);
      const colorFunctionRanges = findColorFunctionRanges(value, commentRanges);
      const matches = findVariableMatches(value, commentRanges);

      if (matches.length === 0) {
        return;
      }

      // Precompute the fully-fixed value once, up front, by replacing only the
      // fixable occurrences and leaving everything else untouched. Every fixable
      // match's `fix()` callback sets `decl.value` to this same precomputed string,
      // so applying one or all of them is idempotent and never corrupts overlapping
      // variable names (unlike a sequential `String.replace`).
      let fixedValue = '';
      let cursor = 0;
      const isFixableByIndex: boolean[] = [];

      for (const m of matches) {
        const variable = m[1];
        const start = m.index;
        const end = start + m[0].length;
        const replacement = deprecatedScssVarMap.get(variable);
        const insideColorFunction = colorFunctionRanges.some(
          ([rangeStart, rangeEnd]) => start >= rangeStart && start < rangeEnd,
        );
        const isFixable =
          deprecatedScssVarMap.has(variable) &&
          !!replacement &&
          !insideColorFunction;

        isFixableByIndex.push(isFixable);
        fixedValue += value.slice(cursor, start);
        fixedValue += isFixable ? `var(${replacement})` : m[0];
        cursor = end;
      }
      fixedValue += value.slice(cursor);

      matches.forEach((m, index) => {
        const variable = m[1];
        const start = valueStart + m.index;
        const end = start + m[0].length;

        if (!deprecatedScssVarMap.has(variable)) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.privateVariable(variable),
            node: decl,
            index: start,
            endIndex: end,
          });
          return;
        }

        const replacement = deprecatedScssVarMap.get(variable);

        if (!replacement) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.deprecatedNoReplacement(variable),
            node: decl,
            index: start,
            endIndex: end,
          });
          return;
        }

        stylelint.utils.report({
          result,
          ruleName,
          message: messages.deprecatedWithReplacement(variable, replacement),
          node: decl,
          index: start,
          endIndex: end,
          ...(isFixableByIndex[index] && {
            fix(): void {
              decl.value = fixedValue;
            },
          }),
        });
      });
    });
  };
};

const rule = ruleBase as Rule;

rule.messages = messages;
rule.meta = getRuleMeta({ fixable: true, ruleId });
rule.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, rule);
