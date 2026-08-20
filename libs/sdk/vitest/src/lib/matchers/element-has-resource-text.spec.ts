import { elementHasResourceText } from './element-has-resource-text';

describe('elementHasResourceText', () => {
  const resolveGreeting = (): Promise<string> => Promise.resolve('Hello World');

  it('should return pass: true when element text matches the resource', async () => {
    const el = document.createElement('div');
    el.textContent = 'Hello World';

    const result = await elementHasResourceText(
      el,
      resolveGreeting,
      'greeting',
      [],
      true,
    );

    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected element\'s inner text "Hello World" not to be "Hello World"',
    );
  });

  it('should return pass: false when element text does not match the resource', async () => {
    const el = document.createElement('div');
    el.textContent = 'Goodbye';

    const result = await elementHasResourceText(
      el,
      resolveGreeting,
      'greeting',
      [],
      true,
    );

    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected element\'s inner text "Goodbye" to be "Hello World"',
    );
  });

  it('should trim whitespace when trimWhitespace is true', async () => {
    const el = document.createElement('div');
    el.textContent = '  Hello World  ';

    const result = await elementHasResourceText(
      el,
      resolveGreeting,
      'greeting',
      [],
      true,
    );

    expect(result.pass).toBe(true);
  });

  it('should not trim whitespace when trimWhitespace is false', async () => {
    const el = document.createElement('div');
    el.textContent = '  Hello World  ';

    const result = await elementHasResourceText(
      el,
      resolveGreeting,
      'greeting',
      [],
      false,
    );

    expect(result.pass).toBe(false);
  });

  it('should pass the resource key and args to the resolver', async () => {
    const resolve = vi.fn().mockResolvedValue('Hello Alice');

    const el = document.createElement('div');
    el.textContent = 'Hello Alice';

    await elementHasResourceText(el, resolve, 'greeting', ['Alice'], true);

    expect(resolve).toHaveBeenCalledWith('greeting', ['Alice']);
  });

  it('should treat null textContent as empty string', async () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'textContent', { value: null });

    const result = await elementHasResourceText(
      el,
      resolveGreeting,
      'greeting',
      [],
      true,
    );

    expect(result.pass).toBe(false);
    expect(result.message()).toContain('""');
  });
});
