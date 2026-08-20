import { of } from 'rxjs';

import { provideAppResources } from '../../../testing/provide-resources';
import { hasResourceText } from './has-resource-text';

describe('hasResourceText', () => {
  it('should return pass: true when element text matches the resource', async () => {
    provideAppResources(() => of('Hello World'));

    const el = document.createElement('div');
    el.textContent = 'Hello World';

    const result = await hasResourceText(el, 'greeting', [], true);

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected element\'s inner text "Hello World" not to be "Hello World"',
    );
  });

  it('should return pass: false when element text does not match the resource', async () => {
    provideAppResources(() => of('Hello World'));

    const el = document.createElement('div');
    el.textContent = 'Goodbye';

    const result = await hasResourceText(el, 'greeting', [], true);

    expect(result.pass).toBe(false);
    expect(result.message).toBe(
      'Expected element\'s inner text "Goodbye" to be "Hello World"',
    );
  });

  it('should trim whitespace by default', async () => {
    provideAppResources(() => of('Hello World'));

    const el = document.createElement('div');
    el.textContent = '  Hello World  ';

    const result = await hasResourceText(el, 'greeting', [], true);

    expect(result.pass).toBe(true);
  });

  it('should not trim whitespace when trimWhitespace is false', async () => {
    provideAppResources(() => of('Hello World'));

    const el = document.createElement('div');
    el.textContent = '  Hello World  ';

    const result = await hasResourceText(el, 'greeting', [], false);

    expect(result.pass).toBe(false);
  });

  it('should pass resource args through', async () => {
    const getString = vi.fn().mockReturnValue(of('Hello Alice'));

    provideAppResources(getString);

    const el = document.createElement('div');
    el.textContent = 'Hello Alice';

    await hasResourceText(el, 'greeting', ['Alice'], true);

    expect(getString).toHaveBeenCalledWith('greeting', 'Alice');
  });

  it('should treat null textContent as empty string', async () => {
    provideAppResources(() => of('Hello World'));

    const el = document.createElement('div');
    Object.defineProperty(el, 'textContent', { value: null });

    const result = await hasResourceText(el, 'greeting', [], true);

    expect(result.pass).toBe(false);
    expect(result.message).toContain('""');
  });
});
