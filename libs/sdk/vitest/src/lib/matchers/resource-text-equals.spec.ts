import { resourceTextEquals } from './resource-text-equals.js';

describe('resourceTextEquals', () => {
  const resolveGreeting = (): Promise<string> => Promise.resolve('Hello World');

  it('should return pass: true when text matches the resource', async () => {
    const result = await resourceTextEquals(
      'Hello World',
      resolveGreeting,
      'greeting',
    );

    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected "Hello World" not to equal "Hello World"',
    );
  });

  it('should return pass: false when text does not match the resource', async () => {
    const result = await resourceTextEquals(
      'Goodbye',
      resolveGreeting,
      'greeting',
    );

    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Expected "Goodbye" to equal "Hello World"');
  });

  it('should pass the resource key and args to the resolver', async () => {
    const resolve = vi.fn().mockResolvedValue('Hello Alice');

    await resourceTextEquals('Hello Alice', resolve, 'greeting', ['Alice']);

    expect(resolve).toHaveBeenCalledWith('greeting', ['Alice']);
  });
});
