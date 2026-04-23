import { _skyTestingHasLibResourceText } from './has-lib-resource-text';
import * as i18nUtils from './i18n-utils';

vi.mock('./i18n-utils');

describe('hasLibResourceText', () => {
  it('should return pass: true when element text matches the lib resource', async () => {
    vi.spyOn(i18nUtils, 'getLibResourceString').mockResolvedValue(
      'Hello World',
    );

    const el = document.createElement('div');
    el.textContent = 'Hello World';

    const result = await _skyTestingHasLibResourceText(
      el,
      'greeting',
      [],
      true,
    );

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected element\'s inner text "Hello World" to be "Hello World"',
    );
  });

  it('should return pass: false when element text does not match the lib resource', async () => {
    vi.spyOn(i18nUtils, 'getLibResourceString').mockResolvedValue(
      'Hello World',
    );

    const el = document.createElement('div');
    el.textContent = 'Goodbye';

    const result = await _skyTestingHasLibResourceText(
      el,
      'greeting',
      [],
      true,
    );

    expect(result.pass).toBe(false);
    expect(result.message).toBe(
      'Expected element\'s inner text "Goodbye" to be "Hello World"',
    );
  });

  it('should trim whitespace by default', async () => {
    vi.spyOn(i18nUtils, 'getLibResourceString').mockResolvedValue(
      'Hello World',
    );

    const el = document.createElement('div');
    el.textContent = '  Hello World  ';

    const result = await _skyTestingHasLibResourceText(
      el,
      'greeting',
      [],
      true,
    );

    expect(result.pass).toBe(true);
  });

  it('should not trim whitespace when trimWhitespace is false', async () => {
    vi.spyOn(i18nUtils, 'getLibResourceString').mockResolvedValue(
      'Hello World',
    );

    const el = document.createElement('div');
    el.textContent = '  Hello World  ';

    const result = await _skyTestingHasLibResourceText(
      el,
      'greeting',
      [],
      false,
    );

    expect(result.pass).toBe(false);
  });

  it('should pass resource args through', async () => {
    const spy = vi
      .spyOn(i18nUtils, 'getLibResourceString')
      .mockResolvedValue('Hello Alice');

    const el = document.createElement('div');
    el.textContent = 'Hello Alice';

    await _skyTestingHasLibResourceText(el, 'greeting', ['Alice'], true);

    expect(spy).toHaveBeenCalledWith('greeting', ['Alice']);
  });
});
