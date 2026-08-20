import { checkResourceText } from './check-resource-text';
import * as i18nUtils from './i18n-utils';

vi.mock('./i18n-utils');

describe('checkResourceText', () => {
  it('should return pass: true when text matches the resource', async () => {
    vi.spyOn(i18nUtils, 'getResourceString').mockResolvedValue('Hello World');

    const result = await checkResourceText('Hello World', 'greeting');

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected "Hello World" not to equal "Hello World"',
    );
  });

  it('should return pass: false when text does not match the resource', async () => {
    vi.spyOn(i18nUtils, 'getResourceString').mockResolvedValue('Hello World');

    const result = await checkResourceText('Goodbye', 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Expected "Goodbye" to equal "Hello World"');
  });

  it('should pass resource args through', async () => {
    const spy = vi
      .spyOn(i18nUtils, 'getResourceString')
      .mockResolvedValue('Hello Alice');

    await checkResourceText('Hello Alice', 'greeting', ['Alice']);

    expect(spy).toHaveBeenCalledWith('greeting', ['Alice']);
  });
});
