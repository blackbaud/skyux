import { elementHasCssClass } from './element-has-css-class.js';

describe('elementHasCssClass', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('should return pass: true when element has the CSS class', () => {
    el.classList.add('my-class');
    const result = elementHasCssClass(el, 'my-class');

    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected element not to have CSS class "my-class"',
    );
  });

  it('should return pass: false when element does not have the CSS class', () => {
    const result = elementHasCssClass(el, 'my-class');

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element to have CSS class "my-class"',
    );
  });

  it('should throw an error if the class name has a leading dot', () => {
    expect(() => elementHasCssClass(el, '.my-class')).toThrowError(
      'Please remove the leading dot from your class name.',
    );
  });
});
