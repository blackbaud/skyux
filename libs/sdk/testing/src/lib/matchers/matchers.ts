import { TestBed } from '@angular/core/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  _SkyA11yAnalyzer,
  _skyTestingCheckAccessibility,
  _skyTestingCheckExistence,
  _skyTestingCheckVisibility,
  _skyTestingHasCssClass,
  _skyTestingHasStyle,
  _skyTestingHasText,
} from '@skyux-sdk/testing/private';
import { SkyAppResourcesService, SkyLibResourcesService } from '@skyux/i18n';

import axe from 'axe-core';
import { firstValueFrom } from 'rxjs';

import type { SkyA11yAnalyzerConfig } from './a11y-analyzer-config';
import type { SkyToBeVisibleOptions } from './to-be-visible-options';

const windowRef: any = window;

function getResources(name: string, args: any[] = []): Promise<string> {
  const resourcesService = TestBed.inject(SkyAppResourcesService);
  return firstValueFrom(resourcesService.getString(name, ...args));
}

function getLibResources(name: string, args: any[] = []): Promise<string> {
  const resourcesService = TestBed.inject(SkyLibResourcesService);
  return firstValueFrom(resourcesService.getString(name, ...args));
}

function isTemplateMatch(sample: string, template: string): boolean {
  let matches = true;
  const templateTokens = template.split(new RegExp('{\\d+}')).reverse();
  let currentToken = templateTokens.pop();
  let lastPosition = 0;
  while (currentToken !== undefined && matches) {
    const tokenPosition: number = sample.indexOf(currentToken, lastPosition);
    matches = tokenPosition >= lastPosition;
    lastPosition = tokenPosition + currentToken.length;
    currentToken = templateTokens.pop();
  }
  return matches;
}

const matchers: jasmine.CustomMatcherFactories = {
  toBeAccessible(): jasmine.CustomMatcher {
    return {
      compare(
        element: any,
        callback?: () => void,
        config?: SkyA11yAnalyzerConfig,
      ): jasmine.CustomMatcherResult {
        _SkyA11yAnalyzer
          .run(element, config)
          .then(() => {
            /*istanbul ignore else*/
            if (callback) {
              callback();
            }
          })
          .catch((err) => {
            windowRef.fail(err.message);
            /*istanbul ignore else*/
            if (callback) {
              callback();
            }
          });

        // Asynchronous matchers are currently unsupported, but
        // the method above works to fail the specific test in the
        // callback manually, if checks do not pass.
        // ---
        // A side effect of this technique is the matcher cannot be
        // paired with a `.not.toBeAccessible` operator (since the returned
        // result is always `true`). For this particular matcher,
        // checking if an element is not accessible may be irrelevant.
        return {
          message: '',
          pass: true,
        };
      },
    };
  },

  toBeVisible(): jasmine.CustomMatcher {
    return {
      compare(
        el: Element,
        options?: SkyToBeVisibleOptions,
      ): jasmine.CustomMatcherResult {
        const { pass, message } = _skyTestingCheckVisibility(el, options);

        return {
          pass,
          message,
        };
      },
    };
  },

  toExist(): jasmine.CustomMatcher {
    return {
      compare(el: any): jasmine.CustomMatcherResult {
        const { pass, message } = _skyTestingCheckExistence(el);

        return { pass, message };
      },
    };
  },

  toHaveCssClass(): jasmine.CustomMatcher {
    return {
      compare(el: any, expectedClassName: string): jasmine.CustomMatcherResult {
        const { pass, message } = _skyTestingHasCssClass(el, expectedClassName);

        return { pass, message };
      },
    };
  },

  toHaveStyle(): jasmine.CustomMatcher {
    return {
      compare(
        el: any,
        expectedStyles: Record<string, string>,
      ): jasmine.CustomMatcherResult {
        const { pass, message } = _skyTestingHasStyle(el, expectedStyles);

        return {
          pass,
          message,
        };
      },
    };
  },

  toHaveText(): jasmine.CustomMatcher {
    return {
      compare(
        el: any,
        expectedText: string,
        trimWhitespace = true,
      ): jasmine.CustomMatcherResult {
        const { pass, message } = _skyTestingHasText(
          el,
          expectedText,
          trimWhitespace,
        );

        return { pass, message };
      },
    };
  },

  toEqualResourceText(): jasmine.CustomMatcher {
    return {
      compare(
        actual: string,
        name: string,
        args?: any[],
        callback?: () => void,
      ): jasmine.CustomMatcherResult {
        void getResources(name, args).then((message) => {
          /*istanbul ignore else*/
          if (actual !== message) {
            windowRef.fail(`Expected "${actual}" to equal "${message}"`);
          }
          /*istanbul ignore else*/
          if (callback) {
            callback();
          }
        });

        // Asynchronous matchers are currently unsupported, but
        // the method above works to fail the specific test in the
        // callback manually, if checks do not pass.
        // ---
        // A side effect of this technique is the matcher cannot be
        // paired with a `.not.toHaveResourceText` operator (since the returned
        // result is always `true`).
        return {
          message: '',
          pass: true,
        };
      },
    };
  },

  toHaveResourceText(): jasmine.CustomMatcher {
    return {
      compare(
        el: any,
        name: string,
        args?: any[],
        trimWhitespace = true,
        callback?: () => void,
      ): jasmine.CustomMatcherResult {
        let actual = el.textContent;

        if (trimWhitespace) {
          actual = actual.trim();
        }

        void getResources(name, args).then((message) => {
          if (actual !== message) {
            windowRef.fail(
              `Expected element's inner text "${el.textContent}" to be "${message}"`,
            );
          }
          /*istanbul ignore else*/
          if (callback) {
            callback();
          }
        });

        // Asynchronous matchers are currently unsupported, but
        // the method above works to fail the specific test in the
        // callback manually, if checks do not pass.
        // ---
        // A side effect of this technique is the matcher cannot be
        // paired with a `.not.toHaveResourceText` operator (since the returned
        // result is always `true`).
        return {
          message: '',
          pass: true,
        };
      },
    };
  },

  toMatchResourceTemplate(): jasmine.CustomMatcher {
    return {
      compare(
        el: any,
        name: string,
        callback?: () => void,
      ): jasmine.CustomMatcherResult {
        const actual = el.textContent;

        void getResources(name).then((message) => {
          if (!isTemplateMatch(actual, message)) {
            windowRef.fail(
              `Expected element's text "${actual}" to match "${message}"`,
            );
          }
          /*istanbul ignore else*/
          if (callback) {
            callback();
          }
        });

        // Asynchronous matchers are currently unsupported, but
        // the method above works to fail the specific test in the
        // callback manually, if checks do not pass.
        // ---
        // A side effect of this technique is the matcher cannot be
        // paired with a `.not.toHaveResourceText` operator (since the returned
        // result is always `true`).
        return {
          message: '',
          pass: true,
        };
      },
    };
  },
};

const asyncMatchers: jasmine.CustomAsyncMatcherFactories = {
  toBeAccessible(): jasmine.CustomAsyncMatcher {
    return {
      async compare<T extends axe.ElementContext>(
        element: T,
        config?: SkyA11yAnalyzerConfig,
      ): Promise<jasmine.CustomMatcherResult> {
        const { pass, message } = await _skyTestingCheckAccessibility(
          element as Element | Document,
          config,
        );

        return { pass, message };
      },
    };
  },

  toEqualResourceText(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        actual: string,
        name: string,
        args?: any[],
      ): Promise<jasmine.CustomMatcherResult> {
        return getResources(name, args).then((message) => {
          if (actual === message) {
            return {
              pass: true,
            };
          } else {
            return {
              pass: false,
              message: `Expected "${actual}" to equal "${message}"`,
            };
          }
        });
      },
    };
  },

  toEqualLibResourceText(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        actual: string,
        name: string,
        args?: any[],
      ): Promise<jasmine.CustomMatcherResult> {
        return getLibResources(name, args).then((message) => {
          if (actual === message) {
            return {
              pass: true,
            };
          } else {
            return {
              pass: false,
              message: `Expected "${actual}" to equal "${message}"`,
            };
          }
        });
      },
    };
  },

  toHaveResourceText(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        element: any,
        name: string,
        args?: any[],
        trimWhitespace = true,
      ): Promise<jasmine.CustomMatcherResult> {
        return getResources(name, args).then((message) => {
          let actual = element.textContent;
          if (trimWhitespace) {
            actual = actual.trim();
          }

          if (actual === message) {
            return {
              pass: true,
            };
          } else {
            return {
              pass: false,
              message: `Expected element's inner text "${actual}" to be "${message}"`,
            };
          }
        });
      },
    };
  },

  toHaveLibResourceText(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        element: any,
        name: string,
        args?: any[],
        trimWhitespace = true,
      ): Promise<jasmine.CustomMatcherResult> {
        return getLibResources(name, args).then((message) => {
          let actual = element.textContent;
          if (trimWhitespace) {
            actual = actual.trim();
          }
          if (actual === message) {
            return {
              pass: true,
            };
          } else {
            return {
              pass: false,
              message: `Expected element's inner text "${actual}" to be "${message}"`,
            };
          }
        });
      },
    };
  },

  toMatchResourceTemplate(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        element: any,
        name: string,
      ): Promise<jasmine.CustomMatcherResult> {
        return getResources(name).then((message) => {
          const actual = element.textContent;
          if (isTemplateMatch(actual, message)) {
            return {
              pass: true,
            };
          } else {
            return {
              pass: false,
              message: `Expected element's text "${actual}" to match "${message}"`,
            };
          }
        });
      },
    };
  },

  toMatchLibResourceTemplate(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        element: any,
        name: string,
      ): Promise<jasmine.CustomMatcherResult> {
        return getLibResources(name).then((message) => {
          const actual = element.textContent;
          if (isTemplateMatch(actual, message)) {
            return {
              pass: true,
            };
          } else {
            return {
              pass: false,
              message: `Expected element's text "${actual}" to match "${message}"`,
            };
          }
        });
      },
    };
  },
};

/**
 * @internal
 */
export function registerJasmineMatchers(): void {
  if (typeof jasmine !== 'undefined') {
    windowRef.beforeEach(() => {
      jasmine.addMatchers(matchers);
      jasmine.addAsyncMatchers(asyncMatchers);
    });
  }
}

registerJasmineMatchers();

/**
 * Interface for "asynchronous" custom Sky matchers which cannot be paired with a `.not` operator.
 */
export interface SkyAsyncMatchers<T, U> extends jasmine.AsyncMatchers<T, U> {
  /**
   * Invert the matcher following this `expect`
   */
  not: SkyAsyncMatchers<T, U>;

  /**
   * `expect` an element to be accessible based on Web Content Accessibility
   * Guidelines 2.0 (WCAG20) Level A and AA success criteria.
   * @param config The configuration settings for overwriting or turning off specific accessibility checks.
   * @see https://developer.blackbaud.com/skyux/learn/get-started/advanced/accessibility-unit-tests
   */
  toBeAccessible(
    config?: SkyA11yAnalyzerConfig,
  ): Promise<jasmine.CustomMatcherResult>;

  /**
   * `expect` the actual text to equal the text for the expected resource string.
   * Uses `SkyAppResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares using ===.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param args The string replacement arguments for the expected resource string.
   */
  toEqualResourceText(
    name: string,
    args?: any[],
  ): Promise<jasmine.CustomMatcherResult>;

  /**
   * `expect` the actual text to equal the text for the expected resource string.
   * Uses `SkyLibResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares using ===.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param args The string replacement arguments for the expected resource string.
   */
  toEqualLibResourceText(
    name: string,
    args?: any[],
  ): Promise<jasmine.CustomMatcherResult>;

  /**
   * `expect` the actual element to have the text for the expected resource string.
   * Uses `SkyAppResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares using ===.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param args The string replacement arguments for the expected resource string.
   * @param trimWhitespace [true] Whether or not to trim whitespace from the actual element text before comparison.
   */
  toHaveResourceText(
    name: string,
    args?: any[],
    trimWhitespace?: boolean,
  ): Promise<jasmine.CustomMatcherResult>;

  /**
   * `expect` the actual element to have the text for the expected resource string.
   * Uses `SkyLibResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares using ===.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param args The string replacement arguments for the expected resource string.
   * @param trimWhitespace [true] Whether or not to trim whitespace from the actual element text before comparison.
   */
  toHaveLibResourceText(
    name: string,
    args?: any[],
    trimWhitespace?: boolean,
  ): Promise<jasmine.CustomMatcherResult>;

  /**
   * `expect` the actual element to have the text for the expected resource string.
   * Uses `SkyAppResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares the tokenized element text against the template.
   * Essentially this matches any text that has the non-parameterized text of the template in the order of the template,
   * regardless of the value of each of the parameters.
   * @param name The resource string to fetch from the resource file and compare against.
   */
  toMatchResourceTemplate(name: string): Promise<jasmine.CustomMatcherResult>;

  /**
   * `expect` the actual element to have the text for the expected resource string.
   * Uses `SkyLibResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares the tokenized element text against the template.
   * Essentially this matches any text that has the non-parameterized text of the template in the order of the template,
   * regardless of the value of each of the parameters.
   * @param name The resource string to fetch from the resource file and compare against.
   */
  toMatchLibResourceTemplate(
    name: string,
  ): Promise<jasmine.CustomMatcherResult>;
}

/**
 * Interface for "normal" custom Sky matchers (includes original jasmine matchers).
 */
export interface SkyMatchers<T> extends jasmine.Matchers<T> {
  /**
   * Invert the matcher following this `expect`
   */
  not: SkyMatchers<T>;

  /**
   * `expect` the actual element to be visible.
   * Checks elements style display and visibility and bounding box width/height.
   */
  toBeVisible(options?: SkyToBeVisibleOptions): void;

  /**
   * `expect` the actual element to exist.
   */
  toExist(): void;

  /**
   * `expect` the actual element to have the expected css class.
   * @param expectedClassName The css class name to check for.
   */
  toHaveCssClass(expectedClassName: string): void;

  /**
   * `expect` the actual element to have the expected style(s).
   * @param expectedStyles An object representing the style(s) to check for.
   */
  toHaveStyle(expectedStyles: Record<string, string>): void;

  /**
   * `expect` the actual element to have the expected text.
   * @param expectedText The text to check for in the actual element.
   * @param trimWhitespace [true] Whether or not to trim whitespace from the actual element text before comparison.
   */
  toHaveText(expectedText: string, trimWhitespace?: boolean): void;

  /**
   * `expect` the actual component to be accessible based on Web Content Accessibility
   * Guidelines 2.0 (WCAG20) Level A and AA success criteria.
   * @deprecated Use `await expectAsync(element).toBeAccessible()` instead.
   * @param callback The callback to execute after accessibility checks run.
   * @param config The configuration settings for overwriting or turning off specific accessibility checks.
   * @see https://developer.blackbaud.com/skyux/learn/get-started/advanced/accessibility-unit-tests
   */
  toBeAccessible(callback?: () => void, config?: SkyA11yAnalyzerConfig): void;

  /**
   * `expect` the actual text to equal the text for the expected resource string.
   * Uses `SkyAppResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares using ===.
   * @deprecated Use `await expectAsync('Some message.').toEqualResourceText('foo_bar_key')` instead.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param args The string replacement arguments for the expected resource string.
   * @param callback The callback to execute when the comparison fails.
   */
  toEqualResourceText(name: string, args?: any[], callback?: () => void): void;

  /**
   * `expect` the actual element to have the text for the expected resource string.
   * Uses `SkyAppResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares using ===.
   * @deprecated Use `await expectAsync(element).toHaveResourceText('foo_bar_key')` instead.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param args The string replacement arguments for the expected resource string.
   * @param trimWhitespace [true] Whether or not to trim whitespace from the actual element text before comparison.
   * @param callback The callback to execute when the comparison fails.
   */
  toHaveResourceText(
    name: string,
    args?: any[],
    trimWhitespace?: boolean,
    callback?: () => void,
  ): void;

  /**
   * `expect` the actual element to have the text for the expected resource string.
   * Uses `SkyAppResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares the tokenized element text against the template.
   * Essentially this matches any text that has the non-parameterized text of the template in the order of the template,
   * regardless of the value of each of the parameters.
   * @deprecated Use `await expectAsync(element).toMatchResourceTemplate('foo_bar_key')` instead.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param callback The callback to execute when the comparison fails.
   */
  toMatchResourceTemplate(name: string, callback?: () => void): void;
}

/**
 * Create an expectation for a spec.
 * @param actual Actual computed value to test expectations against.
 */
export function expect<T>(actual: T): SkyMatchers<T> {
  return windowRef.expect(actual);
}

/**
 * Create an async expectation for a spec.
 * @param actual Actual computed value to test expectations against.
 */
export function expectAsync<T, U>(
  actual: T | PromiseLike<T>,
): SkyAsyncMatchers<T, U> {
  return windowRef.expectAsync(actual);
}
