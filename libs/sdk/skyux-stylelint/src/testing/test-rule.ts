/* eslint-disable complexity */
/**
 * Adapted from stylelint-test-rule-node to work with vitest.
 * @see https://github.com/stylelint/stylelint-test-rule-node/tree/main
 */
import { inspect } from 'node:util';
import stylelint, { LinterResult } from 'stylelint';
import { describe, expect, it } from 'vitest';

import {
  AcceptTestCase,
  RejectTestCase,
  TestCase,
  TestSchema,
} from './types.js';

const { lint } = stylelint;

export function testRule(schema: TestSchema): void {
  const {
    ruleName,
    config,
    plugins,
    customSyntax,
    codeFilename,
    fix,
    accept = [],
    reject = [],
  } = schema;

  describe(`${ruleName}`, () => {
    const stylelintConfig = {
      plugins,
      rules: { [ruleName]: config },
    };

    setupTestCases({
      name: 'accept',
      cases: accept,
      schema,
      comparisons: (testCase: AcceptTestCase) => async (): Promise<void> => {
        const { code } = testCase;
        const stylelintOptions = {
          code,
          config: stylelintConfig,
          customSyntax,
          codeFilename: testCase.codeFilename || codeFilename,
        };

        const { results } = await lint(stylelintOptions);
        const [result] = results;

        expect(result).toBeTruthy();

        const { warnings, parseErrors, invalidOptionWarnings } = result;

        expect(warnings).toEqual([]);
        expect(parseErrors).toEqual([]);
        expect(invalidOptionWarnings).toEqual([]);

        if (!fix) {
          return;
        }

        // Check that --fix doesn't change code
        const outputAfterFix = await lint({ ...stylelintOptions, fix: true });
        const fixedCode = getOutputCss(outputAfterFix);

        expect(fixedCode).toEqual(code);
      },
    });

    setupTestCases({
      name: 'reject',
      cases: reject,
      schema,
      comparisons: (testCase: RejectTestCase) => async (): Promise<void> => {
        const { code, fixed, unfixable, warnings } = testCase;
        const stylelintOptions = {
          code,
          config: stylelintConfig,
          customSyntax,
          codeFilename: testCase.codeFilename || codeFilename,
          computeEditInfo: schema.computeEditInfo,
        };

        const { results } = await lint(stylelintOptions);
        const [result] = results;

        expect(result).toBeTruthy();

        const {
          warnings: resultWarnings,
          parseErrors,
          invalidOptionWarnings,
        } = result;

        expect(parseErrors).toEqual([]);

        const actualWarnings = [...invalidOptionWarnings, ...resultWarnings];
        const expectedWarnings = warnings ?? [testCase];

        expect(actualWarnings.length).toEqual(expectedWarnings.length);

        for (const [i, expected] of expectedWarnings.entries()) {
          const actualWarning = actualWarnings[i];

          expect(actualWarning).toBeTruthy();
          expect(expected.message).toBeTruthy();

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(actualWarning.text.startsWith(expected.message!)).toEqual(
            true,
          );

          if ('line' in actualWarning && 'line' in expected) {
            expect(actualWarning.line).toEqual(expected.line);
          }

          if ('column' in actualWarning && 'column' in expected) {
            expect(actualWarning.column).toEqual(expected.column);
          }

          if ('endLine' in actualWarning && 'endLine' in expected) {
            expect(actualWarning.endLine).toEqual(expected.endLine);
          }

          if ('endColumn' in actualWarning && 'endColumn' in expected) {
            expect(actualWarning.endColumn).toEqual(expected.endColumn);
          }

          if ('fix' in actualWarning && 'fix' in expected) {
            expect(actualWarning.fix).toEqual(expected.fix);
          }
        }

        if (!fix) {
          return;
        }

        expect(typeof fixed === 'string' || unfixable).toBeTruthy();

        const outputAfterFix = await lint({ ...stylelintOptions, fix: true });
        const fixedCode = getOutputCss(outputAfterFix);

        if (!unfixable) {
          expect(fixedCode).toEqual(fixed);
          expect(fixedCode).not.toEqual(code);
        } else {
          // can't fix
          if (fixed) {
            expect(fixedCode).toEqual(fixed);
          }

          expect(fixedCode).toEqual(code);
        }

        // Checks whether only errors other than those fixed are reported
        const outputAfterLintOnFixedCode = await lint({
          ...stylelintOptions,
          code: fixedCode,
          fix: unfixable,
        });

        const [fixedResult] = outputAfterLintOnFixedCode.results;

        expect(fixedResult).toBeTruthy();

        expect(fixedResult.warnings).toEqual(
          outputAfterFix.results[0]?.warnings,
        );

        expect(fixedResult.parseErrors).toEqual([]);
      },
    });
  });
}

function setupTestCases(args: {
  name: string;
  cases: TestCase[];
  schema: TestSchema;
  comparisons: (testCase: TestCase) => () => void;
}): void {
  const { cases, comparisons, name, schema } = args;

  if (cases.length === 0) return;

  const testGroup = schema.only
    ? describe.only
    : schema.skip
      ? describe.skip
      : describe;

  testGroup(`${name}`, () => {
    cases.forEach((testCase) => {
      if (testCase) {
        const spec = testCase.only ? it.only : testCase.skip ? it.skip : it;

        describe(`${inspect(schema.config)}`, () => {
          describe(`${inspect(testCase.code)}`, () => {
            spec(
              testCase.description || 'no description',
              comparisons(testCase),
            );
          });
        });
      }
    });
  });
}

function getOutputCss({ results }: LinterResult): string {
  expect(results[0]).toBeTruthy();
  const { _postcssResult: result } = results[0];

  expect(result).toBeTruthy();
  expect(result?.root).toBeTruthy();
  expect(result?.opts).toBeTruthy();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result!.root.toString(result!.opts.syntax);
}

// /** @type {import('./index.d.ts').testRuleConfigs} */
// export function testRuleConfigs({
//   ruleName,
//   plugins,
//   accept = [],
//   reject = [],
//   only = false,
//   skip = false,
// }) {
//   assert.ok(accept.length > 0 || reject.length > 0, 'No test cases provided');

//   const testGroup = only ? describe.only : skip ? describe.skip : describe;

//   testGroup(`${ruleName} configs`, () => {
//     /**
//      * @param {import('./index.d.ts').RuleConfigTestCase} case
//      * @param {(warnings: Array<{ text: string }>) => void} comparison
//      */
//     function testConfig(
//       { config, description, only: onlyTest, skip: skipTest },
//       comparison,
//     ) {
//       const testFn = onlyTest ? it.only : skipTest ? it.skip : it;

//       testFn(`${description || inspect(config)}`, async () => {
//         const lintConfig = {
//           plugins,
//           rules: { [ruleName]: config },
//         };
//         const { results } = await lint({ code: '', config: lintConfig });
//         const [result] = results;

//         assert.ok(result, 'No lint result');

//         comparison(result.invalidOptionWarnings);
//       });
//     }

//     describe('accept', () => {
//       accept.forEach((c) => {
//         testConfig(c, (warnings) => {
//           assert.deepEqual(warnings, [], 'Config is invalid');
//         });
//       });
//     });

//     describe('reject', () => {
//       reject.forEach((c) => {
//         testConfig(c, (warnings) => {
//           assert.notDeepEqual(warnings, [], 'Config is invalid');
//         });
//       });
//     });
//   });
// }
