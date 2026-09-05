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

// Sass/CSS functions whose arguments are color channels/components rather than whole
// colors. Replacing a `$sky-*` variable with `var(--sky-theme-*)` inside one of these
// produces syntactically valid SCSS that compiles to invalid CSS (e.g.
// `rgba(var(--sky-theme-color-text-action), 0.25)`), so such occurrences are reported
// but never auto-fixed.
const COLOR_FUNCTIONS = new Set([
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
  'color.adjust',
  'color.change',
  'color.scale',
  'color.mix',
]);

const messages = stylelint.utils.ruleMessages(ruleName, {
  deprecatedWithReplacement: (variable: string, replacement: string) =>
    `"${variable}" is deprecated. Use "var(${replacement})" instead.`,
  deprecatedNoReplacement: (variable: string) =>
    `"${variable}" is deprecated with no direct replacement. See the style API documentation: ${STYLE_API_DOCS_URL}`,
  privateVariable: (variable: string) =>
    `"${variable}" is a private or obsolete SKY UX SCSS variable. To find an alternative, see the style API documentation: ${STYLE_API_DOCS_URL}`,
});

/**
 * Finds the `[start, end)` index ranges within `value` that fall inside a block
 * comment, so those regions can be ignored elsewhere without altering `value`'s
 * original offsets (comment text is left in place, just skipped over). Only block
 * comments are handled because `decl.raws.value.raw` (the raw text this rule scans)
 * is produced by postcss-scss, which always normalizes `//` line comments to block
 * comments before exposing it.
 */
function findCommentRanges(value: string): [number, number][] {
  const ranges: [number, number][] = [];
  let i = 0;

  while (i < value.length) {
    if (value[i] === '/' && value[i + 1] === '*') {
      // `/*` without a later `*/` can occur in valid SCSS (e.g. inside a quoted
      // string like `content: "/*"`); treat the rest of the value as commented.
      const close = value.indexOf('*/', i + 2);
      if (close === -1) {
        ranges.push([i, value.length]);
        break;
      }
      const end = close + 2;
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
 * Finds the `[start, end)` index ranges within `value` that fall inside a call to one
 * of `COLOR_FUNCTIONS`, so occurrences within those ranges can be excluded from fixing.
 * Characters inside `commentRanges` are skipped so that comment text (e.g. a stray `)`)
 * can't affect paren-matching or be mistaken for a function name.
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
        isColorFunction: !!name && COLOR_FUNCTIONS.has(name),
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
      // `decl.raws.value.raw` preserves the exact source text (including inline
      // comments) that `decl.toString()` renders, whereas `decl.value` may have
      // comments stripped. Matching/index computation must use the raw text so
      // reported offsets line up with the actual rendered declaration.
      const value = decl.raws.value?.raw ?? decl.value;
      // Offset of `value` within `decl.toString()`, used so each warning/fix targets
      // only its matched variable instead of the whole declaration. Without this, all
      // warnings on a declaration share the same (whole-node) position, which breaks
      // down once some occurrences are fixed and others are not.
      const valueStart = decl.prop.length + (decl.raws.between?.length ?? 0);
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
