import { skyE2ePreset } from './cypress-preset';

describe('skyE2ePreset', () => {
  const originalCI = process.env['CI'];

  afterEach(() => {
    if (originalCI === undefined) {
      delete process.env['CI'];
    } else {
      process.env['CI'] = originalCI;
    }
  });

  it('should expose local screenshots when not running in CI', () => {
    delete process.env['CI'];

    expect(skyE2ePreset(__dirname).expose).toEqual({
      skyLocalScreenshots: true,
    });
  });

  it('should not expose local screenshots when running in CI', () => {
    process.env['CI'] = 'true';

    expect(skyE2ePreset(__dirname).expose).toEqual({
      skyLocalScreenshots: false,
    });
  });

  it('should run the provided setupNodeEvents', async () => {
    const setupNodeEvents = jest.fn();
    const on = jest.fn();
    const config = {} as Cypress.PluginConfigOptions;

    await skyE2ePreset(__dirname, { setupNodeEvents }).setupNodeEvents?.(
      on,
      config,
    );

    expect(setupNodeEvents).toHaveBeenCalledWith(on, config);
  });

  describe('before:browser:launch', () => {
    async function launch(
      browser: Partial<Cypress.Browser>,
    ): Promise<{ args: string[]; preferences: Record<string, unknown> }> {
      const on = jest.fn();
      await skyE2ePreset(__dirname).setupNodeEvents?.(
        on,
        {} as Cypress.PluginConfigOptions,
      );
      const launchOptions = { args: [] as string[], preferences: {} };
      on.mock.calls[0][1](browser, launchOptions);
      return launchOptions;
    }

    it('should size headless chrome', async () => {
      expect(await launch({ name: 'chrome', isHeadless: true })).toEqual({
        args: ['--window-size=1280,1280', '--force-device-scale-factor=2'],
        preferences: {},
      });
    });

    it('should size headless electron', async () => {
      expect(await launch({ name: 'electron', isHeadless: true })).toEqual({
        args: [],
        preferences: { width: 1280, height: 1280 },
      });
    });

    it('should size headless firefox', async () => {
      expect(await launch({ name: 'firefox', isHeadless: true })).toEqual({
        args: ['--width=1280', '--height=1350'],
        preferences: {},
      });
    });

    it('should leave headed browsers unchanged', async () => {
      expect(await launch({ name: 'chrome', isHeadless: false })).toEqual({
        args: [],
        preferences: {},
      });
    });
  });
});
