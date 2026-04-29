describe('Vitest setupFiles integration', () => {
  it('should resolve the matchers-setup.js subpath at compile time', () => {
    type SetupMatchersModule =
      typeof import('@skyux-sdk/testing/vitest/matchers-setup.js');

    const resolved = true as boolean | SetupMatchersModule;

    expect(resolved).toBe(true);
  });

  it('should define the matchers-setup.js subpath export', async () => {
    const { readFile } = await import('node:fs/promises');
    const { resolve } = await import('node:path');

    const pkgPath = resolve(
      __dirname,
      '../../../../../dist/libs/sdk/testing/package.json',
    );

    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

    expect(pkg.exports['./vitest/matchers-setup.js']).toBeDefined();
  });

  describe('toBeAccessible', () => {
    it('should pass for accessible content', async () => {
      const container = document.createElement('div');
      container.innerHTML = '<button aria-label="Save"></button>';
      document.body.append(container);

      try {
        await expect(container).toBeAccessible();
      } finally {
        container.remove();
      }
    });

    it('should fail for inaccessible content', async () => {
      const container = document.createElement('div');
      container.innerHTML = '<button></button>';
      document.body.append(container);

      try {
        await expect(container).not.toBeAccessible();
      } finally {
        container.remove();
      }
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
});
