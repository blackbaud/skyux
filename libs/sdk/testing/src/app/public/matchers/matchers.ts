import {
  TestBed
} from '@angular/core/testing';

import {
  SkyAppResourcesService
} from '@skyux/i18n';

import {
  Observable
} from 'rxjs';

import {
  SkyA11yAnalyzer
} from '../a11y/a11y-analyzer';

import {
  SkyA11yAnalyzerConfig
} from '../a11y/a11y-analyzer-config';

const windowRef: any = window;

function getResourcesObservable(name: string, args: any[] = []): Observable<string> {
  const resourcesService = TestBed.inject(SkyAppResourcesService);
  return resourcesService.getString(name, ...args);
}

const matchers: jasmine.CustomMatcherFactories = {
  toBeAccessible(): jasmine.CustomMatcher {
    return {
      compare(
        element: any,
        callback: () => void = () => { },
        config?: SkyA11yAnalyzerConfig
      ): jasmine.CustomMatcherResult {

        SkyA11yAnalyzer.run(element, config)
          .then(() => callback())
          .catch((err) => {
            windowRef.fail(err.message);
            callback();
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
          pass: true
        };
      }
    };
  },

  toBeVisible(): jasmine.CustomMatcher {
    return {
      compare(el: Element): jasmine.CustomMatcherResult {
        const result = {
          pass: false,
          message: ''
        };

        result.pass = !!el;

        let computedStyle: CSSStyleDeclaration; // Only get this once, not a trivial thing to get
        if (result.pass) {
          computedStyle = getComputedStyle(el); // Only get computed style if passing
          // el style check, does NOT check parents in all cases
          result.pass = (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden');
        }

        if (result.pass) {
          // Checks if the el has a physical presence.
          let box: DOMRect = el.getBoundingClientRect();
          result.pass = !(box.height + box.width === 0);
        }

        result.message = result.pass ?
          'Expected element to not be visible' :
          'Expected element to be visible';

        return result;
      }
    };
  },

  toExist(): jasmine.CustomMatcher {
    return {
      compare(el: any): jasmine.CustomMatcherResult {
        const result = {
          pass: false,
          message: ''
        };

        result.pass = !!el;

        result.message = result.pass ?
          'Expected element not to exist' :
          'Expected element to exist';

        return result;
      }
    };
  },

  toHaveCssClass(): jasmine.CustomMatcher {
    return {
      compare(el: any, expectedClassName: string): jasmine.CustomMatcherResult {
        const result = {
          pass: false,
          message: ''
        };

        if (expectedClassName.indexOf('.') === 0) {
          throw new Error('Please remove the leading dot from your class name.');
        }

        result.pass = el.classList.contains(expectedClassName);

        result.message = result.pass ?
          `Expected element not to have CSS class "${expectedClassName}"` :
          `Expected element to have CSS class "${expectedClassName}"`;

        return result;
      }
    };
  },

  toHaveStyle(): jasmine.CustomMatcher {
    return {
      compare(el: any, expectedStyles: { [index: string]: string }): jasmine.CustomMatcherResult {
        const message: string[] = [];

        let hasFailure = false;

        Object.keys(expectedStyles).forEach((styleName: string) => {
          const styles = windowRef.getComputedStyle(el);
          const actualStyle = styles[styleName];
          const expectedStyle = expectedStyles[styleName];

          if (actualStyle !== expectedStyle) {
            if (!hasFailure) {
              hasFailure = true;
            }

            message.push(
              `Expected element not to have CSS style "${styleName}: ${expectedStyle}"`
            );
          } else {
            message.push(
              `Expected element to have CSS style "${styleName}: ${expectedStyle}"`
            );
          }

          message.push(
            `Actual styles are: "${styleName}: ${actualStyle}"`
          );
        });

        const result = {
          pass: !hasFailure,
          message: message.join('\n')
        };

        return result;
      }
    };
  },

  toHaveText(): jasmine.CustomMatcher {
    return {
      compare(el: any, expectedText: string, trimWhitespace = true): jasmine.CustomMatcherResult {
        const result = {
          pass: false,
          message: ''
        };

        let actualText = el.textContent;

        if (trimWhitespace) {
          actualText = actualText.trim();
        }

        result.pass = actualText === expectedText;

        result.message = result.pass ?
          `Expected element's inner text not to be: "${expectedText}"` :
          `Expected element's inner text to be: "${expectedText}"\n` +
          `Actual element's inner text was: "${actualText}"`;

        return result;
      }
    };
  },

  toEqualResourceText(): jasmine.CustomMatcher {
    return {
      compare(
        actual: string,
        name: string,
        args?: any[],
        callback: () => void = () => { }
      ): jasmine.CustomMatcherResult {

        getResourcesObservable(name, args).toPromise().then(message => {
          if (actual !== message) {
            windowRef.fail(`Expected "${actual}" to equal "${message}"`);
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
          pass: true
        };
      }
    };
  },

  toHaveResourceText(): jasmine.CustomMatcher {
    return {
      compare(
        el: any,
        name: string,
        args?: any[],
        trimWhitespace: boolean = true,
        callback: () => void = () => { }
      ): jasmine.CustomMatcherResult {
        let actual = el.textContent;

        if (trimWhitespace) {
          actual = actual.trim();
        }

        getResourcesObservable(name, args).toPromise().then(message => {
          if (actual !== message) {
            windowRef.fail(`Expected element's inner text to be "${message}"`);
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
          pass: true
        };
      }
    };
  }
};

const asyncMatchers: jasmine.CustomAsyncMatcherFactories = {
  toBeAccessible(): jasmine.CustomAsyncMatcher {
    return {
      compare<T>(element: T, config?: SkyA11yAnalyzerConfig): Promise<jasmine.CustomMatcherResult> {
        return new Promise((resolve) => {
          SkyA11yAnalyzer.run(element, config)
            .then(() => {
              resolve({
                pass: true
              });
            })
            .catch((err) => {
              resolve({
                pass: false,
                message: err.message
              });
            });
        });
      }
    };
  },

  toEqualResourceText(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        actual: string,
        name: string,
        args?: any[]
      ): Promise<jasmine.CustomMatcherResult> {

        return new Promise((resolve) => {
          getResourcesObservable(name, args).toPromise().then(message => {
            if (actual === message) {
              resolve({
                pass: true
              });
            } else {
              resolve({
                pass: false,
                message: `Expected "${actual}" to equal "${message}"`
              });
            }
          });
        });
      }
    };
  },

  toHaveResourceText(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        element: any,
        name: string,
        args?: any[],
        trimWhitespace: boolean = true
      ): Promise<jasmine.CustomMatcherResult> {

        return new Promise((resolve) => {
          let actual = element.textContent;
          if (trimWhitespace) {
            actual = actual.trim();
          }

          getResourcesObservable(name, args).toPromise().then(message => {
            if (actual === message) {
              resolve({
                pass: true
              });
            } else {
              resolve({
                pass: false,
                message: `Expected element's inner text to be "${message}"`
              });
            }
          });
        });
      }
    };
  }
};

windowRef.beforeEach(() => {
  jasmine.addMatchers(matchers);
  jasmine.addAsyncMatchers(asyncMatchers);
});

/**
 * Interface for "asynchronous" custom Sky matchers which cannot be paired with a `.not` operator.
 */
export interface SkyAsyncMatchers<T> {

  /**
   * Invert the matcher following this `expect`
   */
  not: SkyAsyncMatchers<T>;

  /**
   * `expect` an element to be accessible based on Web Content Accessibility
   * Guidelines 2.0 (WCAG20) Level A and AA success criteria.
   * @param config The configuration settings for overwriting or turning off specific accessibility checks.
   * @see https://developer.blackbaud.com/skyux/learn/get-started/advanced/accessibility-unit-tests
   */
  toBeAccessible(config?: SkyA11yAnalyzerConfig): Promise<jasmine.CustomMatcherResult>;

  /**
   * `expect` the actual text to equal the text for the expected resource string.
   * Uses `SkyAppResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares using ===.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param args The string replacement arguments for the expected resource string.
   */
  toEqualResourceText(name: string, args?: any[]): Promise<jasmine.CustomMatcherResult>;

  /**
   * `expect` the actual element to have the text for the expected resource string.
   * Uses `SkyAppResourcesService.getString(name, args)` to fetch the expected resource string
   * and compares using ===.
   * @param name The resource string to fetch from the resource file and compare against.
   * @param args The string replacement arguments for the expected resource string.
   * @param trimWhitespace [true] Whether or not to trim whitespace from the actual element text before comparison.
   */
  toHaveResourceText(name: string, args?: any[], trimWhitespace?: boolean): Promise<jasmine.CustomMatcherResult>;

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
  toBeVisible(): void;

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
  toHaveStyle(expectedStyles: { [index: string]: string }): void;

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
  toHaveResourceText(name: string, args?: any[], trimWhitespace?: boolean, callback?: () => void): void;
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
export function expectAsync<T>(actual: T): SkyAsyncMatchers<T> {
  return windowRef.expectAsync(actual);
}
