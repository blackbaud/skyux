import { of } from 'rxjs';

import { provideAppResources } from '../../../testing/provide-resources';
import { checkResourceText } from './check-resource-text';

describe('checkResourceText', () => {
  it('should return pass: true when text matches the resource', async () => {
    provideAppResources(() => of('Hello World'));

    const result = await checkResourceText('Hello World', 'greeting');

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected "Hello World" not to equal "Hello World"',
    );
  });

  it('should return pass: false when text does not match the resource', async () => {
    provideAppResources(() => of('Hello World'));

    const result = await checkResourceText('Goodbye', 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Expected "Goodbye" to equal "Hello World"');
  });

  it('should pass resource args through', async () => {
    const getString = vi.fn().mockReturnValue(of('Hello Alice'));

    provideAppResources(getString);

    await checkResourceText('Hello Alice', 'greeting', ['Alice']);

    expect(getString).toHaveBeenCalledWith('greeting', 'Alice');
  });
});
