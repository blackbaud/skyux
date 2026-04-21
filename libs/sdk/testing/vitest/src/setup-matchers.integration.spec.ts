describe('Vitest setupFiles integration', () => {
  it('should resolve the matchers-setup.js subpath at compile time', () => {
    type SetupMatchersModule =
      typeof import('@skyux-sdk/testing/vitest/matchers-setup.js');

    const resolved = true as boolean | SetupMatchersModule;

    expect(resolved).toBe(true);
  });

  describe('toBeAccessible', () => {
    it('should pass for accessible content', async () => {
      const container = document.createElement('div');
      container.innerHTML = '<button aria-label="Save"></button>';
      document.body.append(container);

      await expect(container).toBeAccessible();

      container.remove();
    });

    it('should fail for inaccessible content', async () => {
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

  describe('toBeVisible', () => {
    it('should pass for a visible element', () => {
      const el = document.createElement('div');
      el.textContent = 'Hello';
      document.body.append(el);

      expect(el).toBeVisible();

      el.remove();
    });

    it('should fail for display:none', () => {
      const el = document.createElement('div');
      el.style.display = 'none';
      document.body.append(el);

      expect(el).not.toBeVisible();

      el.remove();
    });

    it('should fail for visibility:hidden when checkCssVisibility is true', () => {
      const el = document.createElement('div');
      el.style.visibility = 'hidden';
      document.body.append(el);

      expect(el).not.toBeVisible({
        checkCssVisibility: true,
      });

      el.remove();
    });

    it('should fail for zero dimensions when checkDimensions is true', () => {
      const el = document.createElement('div');
      el.style.width = '0px';
      el.style.height = '0px';
      document.body.append(el);

      expect(el).not.toBeVisible({
        checkDimensions: true,
      });

      el.remove();
    });

    it('should fail for null element when checkExists is true', () => {
      expect(null).not.toBeVisible({
        checkCssDisplay: false,
        checkExists: true,
      });
    });
  });
});
