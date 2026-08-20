import { of } from 'rxjs';

import { provideLibResources } from '../../../testing/provide-resources';
import { checkLibResourceTemplate } from './check-lib-resource-template';

describe('checkLibResourceTemplate', () => {
  it('should return pass: true when element text matches the lib template', async () => {
    provideLibResources(() => of('Hello {0}, welcome to {1}'));

    const el = document.createElement('div');
    el.textContent = 'Hello Alice, welcome to Wonderland';

    const result = await checkLibResourceTemplate(el, 'greeting');

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected element\'s text "Hello Alice, welcome to Wonderland" not to match "Hello {0}, welcome to {1}"',
    );
  });

  it('should return pass: false when element text does not match the lib template', async () => {
    provideLibResources(() => of('Hello {0}, welcome to {1}'));

    const el = document.createElement('div');
    el.textContent = 'Goodbye';

    const result = await checkLibResourceTemplate(el, 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message).toBe(
      'Expected element\'s text "Goodbye" to match "Hello {0}, welcome to {1}"',
    );
  });

  it('should look up the lib resource for the resource key', async () => {
    const getString = vi.fn().mockReturnValue(of('template'));

    provideLibResources(getString);

    const el = document.createElement('div');
    el.textContent = 'template';

    await checkLibResourceTemplate(el, 'my_key');

    expect(getString).toHaveBeenCalledWith('my_key');
  });

  it('should treat null textContent as empty string', async () => {
    provideLibResources(() => of('template'));

    const el = document.createElement('div');
    Object.defineProperty(el, 'textContent', { value: null });

    const result = await checkLibResourceTemplate(el, 'my_key');

    expect(result.pass).toBe(false);
    expect(result.message).toContain('""');
  });
});
