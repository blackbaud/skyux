import { elementMatchesResourceTemplate } from './element-matches-resource-template.js';

describe('elementMatchesResourceTemplate', () => {
  const resolveGreeting = (): Promise<string> =>
    Promise.resolve('Hello {0}, welcome to {1}');

  it('should return pass: true when element text matches the template', async () => {
    const el = document.createElement('div');
    el.textContent = 'Hello Alice, welcome to Wonderland';

    const result = await elementMatchesResourceTemplate(
      el,
      resolveGreeting,
      'greeting',
    );

    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected element\'s text "Hello Alice, welcome to Wonderland" not to match "Hello {0}, welcome to {1}"',
    );
  });

  it('should return pass: false when element text does not match the template', async () => {
    const el = document.createElement('div');
    el.textContent = 'Goodbye';

    const result = await elementMatchesResourceTemplate(
      el,
      resolveGreeting,
      'greeting',
    );

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element\'s text "Goodbye" to match "Hello {0}, welcome to {1}"',
    );
  });

  it('should pass the resource key to the resolver', async () => {
    const resolve = vi.fn().mockResolvedValue('template');

    const el = document.createElement('div');
    el.textContent = 'template';

    await elementMatchesResourceTemplate(el, resolve, 'my_key');

    expect(resolve).toHaveBeenCalledWith('my_key');
  });

  it('should treat null textContent as empty string', async () => {
    const resolve = (): Promise<string> => Promise.resolve('template');

    const el = document.createElement('div');
    Object.defineProperty(el, 'textContent', { value: null });

    const result = await elementMatchesResourceTemplate(el, resolve, 'my_key');

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('""');
  });
});
