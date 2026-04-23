import { _skyTestingCheckResourceText } from './check-resource-text';
import * as i18nUtils from './i18n-utils';

vi.mock('./i18n-utils');

describe('checkResourceText', () => {
  it('should return pass: true when text matches the resource', async () => {
    vi.spyOn(i18nUtils, 'getResourceString').mockResolvedValue('Hello World');

    const result = await _skyTestingCheckResourceText(
      'Hello World',
      'greeting',
    );

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected "Hello World" not to equal "Hello World"',
    );
  });

  it('should return pass: false when text does not match the resource', async () => {
    vi.spyOn(i18nUtils, 'getResourceString').mockResolvedValue('Hello World');

    const result = await _skyTestingCheckResourceText('Goodbye', 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Expected "Goodbye" to equal "Hello World"');
  });

  it('should pass resource args through', async () => {
    const spy = vi
      .spyOn(i18nUtils, 'getResourceString')
      .mockResolvedValue('Hello Alice');

    await _skyTestingCheckResourceText('Hello Alice', 'greeting', ['Alice']);

    expect(spy).toHaveBeenCalledWith('greeting', ['Alice']);
  });
});
