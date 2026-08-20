import { of } from 'rxjs';

import { provideAppResources } from '../../testing/provide-resources';
import { resourceTextEquals } from './resource-text-equals';

describe('resourceTextEquals', () => {
  it('should return pass: true when text matches the resource', async () => {
    provideAppResources(() => of('Hello World'));

    const result = await resourceTextEquals('Hello World', 'greeting');

    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected "Hello World" not to equal "Hello World"',
    );
  });

  it('should return pass: false when text does not match the resource', async () => {
    provideAppResources(() => of('Hello World'));

    const result = await resourceTextEquals('Goodbye', 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Expected "Goodbye" to equal "Hello World"');
  });

  it('should pass resource args through', async () => {
    const getString = vi.fn().mockReturnValue(of('Hello Alice'));

    provideAppResources(getString);

    await resourceTextEquals('Hello Alice', 'greeting', ['Alice']);

    expect(getString).toHaveBeenCalledWith('greeting', 'Alice');
  });
});
