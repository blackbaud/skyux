import {
  SkyA11yAnalyzer,
  SkyA11yAnalyzerConfig
} from '../a11y';

const windowRef: any = window;

const matchers: jasmine.CustomMatcherFactories = {
  toBeAccessible(): jasmine.CustomMatcher {
    return {
      compare(
        element: any,
        callback: () => void = () => {},
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
        // checking if an element is not accessibile may be irrelevent.
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

        result.pass = getComputedStyle(el).display !== 'none';

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
      compare(el: any, expectedStyles: any): jasmine.CustomMatcherResult {
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
          `Expected element's inner text not to be ${expectedText}` :
          `Expected element's inner text to be: "${expectedText}"\n` +
          `Actual element's inner text was: "${actualText}"`;

        return result;
      }
    };
  }
};

windowRef.beforeEach(() => {
  jasmine.addMatchers(matchers);
});

export const expect: Function = windowRef.expect;
