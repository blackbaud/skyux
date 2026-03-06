import { describe, expect, it } from 'vitest';

describe('Vitest setupFiles integration', () => {
  it('should resolve the setup-matchers.js subpath at compile time', () => {
    type SetupMatchersModule =
      typeof import('@skyux-sdk/testing/vitest/setup-matchers.js');

    const resolved = true as boolean | SetupMatchersModule;

    expect(resolved).toBe(true);
  });

  it('registers toBeAccessible and passes for accessible content', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<button aria-label="Save"></button>';
    document.body.append(container);

    await expect(container).toBeAccessible();

    container.remove();
  });

  it('registers toBeAccessible and fails for inaccessible content', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<button></button>';
    document.body.append(container);

    await expect(container).not.toBeAccessible();

    container.remove();
  });

  it('should provide a descriptive error message for inaccessible content', async () => {
    const container = document.createElement('div');
    container.innerHTML = '<button></button>';
    document.body.append(container);

    try {
      await expect(container).toBeAccessible();
      expect.unreachable('Expected toBeAccessible to fail.');
    } catch (err) {
      expect((err as Error).message).toContain(
        'Expected element to pass accessibility checks.',
      );
      expect((err as Error).message).toContain("Rule: 'button-name'");
    } finally {
      container.remove();
    }
  });
});
