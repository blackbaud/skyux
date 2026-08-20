import { of } from 'rxjs';

import { provideLibResources } from '../../testing/provide-resources';
import { libResourceTextEquals } from './lib-resource-text-equals';

describe('libResourceTextEquals', () => {
  it('should return pass: true when text matches the lib resource', async () => {
    provideLibResources(() => of('Hello World'));

    const result = await libResourceTextEquals('Hello World', 'greeting');

    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected "Hello World" not to equal "Hello World"',
    );
  });

  it('should return pass: false when text does not match the lib resource', async () => {
    provideLibResources(() => of('Hello World'));

    const result = await libResourceTextEquals('Goodbye', 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Expected "Goodbye" to equal "Hello World"');
  });

  it('should pass resource args through', async () => {
    const getString = vi.fn().mockReturnValue(of('Hello Alice'));

    provideLibResources(getString);

    await libResourceTextEquals('Hello Alice', 'greeting', ['Alice']);

    expect(getString).toHaveBeenCalledWith('greeting', 'Alice');
  });
});
