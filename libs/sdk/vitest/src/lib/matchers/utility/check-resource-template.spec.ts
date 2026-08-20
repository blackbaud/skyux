import { of } from 'rxjs';

import { provideAppResources } from '../../../testing/provide-resources';
import { checkResourceTemplate } from './check-resource-template';

describe('checkResourceTemplate', () => {
  it('should return pass: true when element text matches the template', async () => {
    provideAppResources(() => of('Hello {0}, welcome to {1}'));

    const el = document.createElement('div');
    el.textContent = 'Hello Alice, welcome to Wonderland';

    const result = await checkResourceTemplate(el, 'greeting');

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected element\'s text "Hello Alice, welcome to Wonderland" not to match "Hello {0}, welcome to {1}"',
    );
  });

  it('should return pass: false when element text does not match the template', async () => {
    provideAppResources(() => of('Hello {0}, welcome to {1}'));

    const el = document.createElement('div');
    el.textContent = 'Goodbye';

    const result = await checkResourceTemplate(el, 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message).toBe(
      'Expected element\'s text "Goodbye" to match "Hello {0}, welcome to {1}"',
    );
  });

  it('should look up the resource for the resource key', async () => {
    const getString = vi.fn().mockReturnValue(of('template'));

    provideAppResources(getString);

    const el = document.createElement('div');
    el.textContent = 'template';

    await checkResourceTemplate(el, 'my_key');

    expect(getString).toHaveBeenCalledWith('my_key');
  });

  it('should treat null textContent as empty string', async () => {
    provideAppResources(() => of('template'));

    const el = document.createElement('div');
    Object.defineProperty(el, 'textContent', { value: null });

    const result = await checkResourceTemplate(el, 'my_key');

    expect(result.pass).toBe(false);
    expect(result.message).toContain('""');
  });
});
