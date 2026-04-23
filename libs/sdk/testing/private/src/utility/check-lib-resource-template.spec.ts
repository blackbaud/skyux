import { _skyTestingCheckLibResourceTemplate } from './check-lib-resource-template';
import * as i18nUtils from './i18n-utils';

vi.mock('./i18n-utils');

describe('checkLibResourceTemplate', () => {
  it('should return pass: true when element text matches the lib template', async () => {
    vi.spyOn(i18nUtils, 'getLibResourceString').mockResolvedValue(
      'Hello {0}, welcome to {1}',
    );
    vi.spyOn(i18nUtils, 'isTemplateMatch').mockReturnValue(true);

    const el = document.createElement('div');
    el.textContent = 'Hello Alice, welcome to Wonderland';

    const result = await _skyTestingCheckLibResourceTemplate(el, 'greeting');

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected element\'s text "Hello Alice, welcome to Wonderland" not to match "Hello {0}, welcome to {1}"',
    );
  });

  it('should return pass: false when element text does not match the lib template', async () => {
    vi.spyOn(i18nUtils, 'getLibResourceString').mockResolvedValue(
      'Hello {0}, welcome to {1}',
    );
    vi.spyOn(i18nUtils, 'isTemplateMatch').mockReturnValue(false);

    const el = document.createElement('div');
    el.textContent = 'Goodbye';

    const result = await _skyTestingCheckLibResourceTemplate(el, 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message).toBe(
      'Expected element\'s text "Goodbye" to match "Hello {0}, welcome to {1}"',
    );
  });

  it('should call getLibResourceString with the resource key', async () => {
    const spy = vi
      .spyOn(i18nUtils, 'getLibResourceString')
      .mockResolvedValue('template');
    vi.spyOn(i18nUtils, 'isTemplateMatch').mockReturnValue(true);

    const el = document.createElement('div');
    el.textContent = 'template';

    await _skyTestingCheckLibResourceTemplate(el, 'my_key');

    expect(spy).toHaveBeenCalledWith('my_key');
  });

  it('should treat null textContent as empty string', async () => {
    vi.spyOn(i18nUtils, 'getLibResourceString').mockResolvedValue('template');
    vi.spyOn(i18nUtils, 'isTemplateMatch').mockReturnValue(false);

    const el = document.createElement('div');
    Object.defineProperty(el, 'textContent', { value: null });

    const result = await _skyTestingCheckLibResourceTemplate(el, 'my_key');

    expect(result.pass).toBe(false);
    expect(result.message).toContain('""');
  });
});
