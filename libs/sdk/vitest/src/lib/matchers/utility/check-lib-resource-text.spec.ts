import { of } from 'rxjs';

import { provideLibResources } from '../../../testing/provide-resources';
import { checkLibResourceText } from './check-lib-resource-text';

describe('checkLibResourceText', () => {
  it('should return pass: true when text matches the lib resource', async () => {
    provideLibResources(() => of('Hello World'));

    const result = await checkLibResourceText('Hello World', 'greeting');

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected "Hello World" not to equal "Hello World"',
    );
  });

  it('should return pass: false when text does not match the lib resource', async () => {
    provideLibResources(() => of('Hello World'));

    const result = await checkLibResourceText('Goodbye', 'greeting');

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Expected "Goodbye" to equal "Hello World"');
  });

  it('should pass resource args through', async () => {
    const getString = vi.fn().mockReturnValue(of('Hello Alice'));

    provideLibResources(getString);

    await checkLibResourceText('Hello Alice', 'greeting', ['Alice']);

    expect(getString).toHaveBeenCalledWith('greeting', 'Alice');
  });
});
