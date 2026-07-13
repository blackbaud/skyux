import { TestBed } from '@angular/core/testing';

import FontFaceObserver from 'fontfaceobserver';
import { Subject } from 'rxjs';

import { SkyAppStyleLoader } from './style-loader';
import { SkyThemeService } from './theming/theme.service';

function createStyleLoader(themeSvc?: SkyThemeService): SkyAppStyleLoader {
  TestBed.configureTestingModule({
    providers: themeSvc
      ? [{ provide: SkyThemeService, useValue: themeSvc }]
      : [],
  });
  const styleLoader = TestBed.runInInjectionContext(
    () => new SkyAppStyleLoader(),
  );
  TestBed.resetTestingModule();
  return styleLoader;
}

describe('Style loader', () => {
  it('should resolve a promise after loading fonts', async () => {
    spyOn(FontFaceObserver.prototype, 'load').and.returnValue(
      Promise.resolve(),
    );

    const styleLoader = createStyleLoader();

    await styleLoader.loadStyles();

    expect(styleLoader.isLoaded).toBe(true);
  });

  it('should pass errors to the resolve', async () => {
    spyOn(Promise, 'all').and.callFake(() => {
      return Promise.reject(new Error('Fonts not loaded.'));
    });

    const styleLoader = createStyleLoader();
    const response = await styleLoader.loadStyles();

    expect(response.error.message).toBe('Fonts not loaded.');
  });

  it('should resolve the promise if the fonts are not loaded within the timeout', async () => {
    const sampleObserver = new FontFaceObserver('SampleFont');

    spyOn(Promise, 'all').and.callFake((): Promise<any> => {
      return sampleObserver.load(undefined, 1);
    });

    const styleLoader = createStyleLoader();
    const result = await styleLoader.loadStyles();

    expect(result.error).toBeDefined();
  });

  it('should resolve if fonts already loaded', async () => {
    const spy = spyOn(FontFaceObserver.prototype, 'load').and.returnValue(
      Promise.resolve(),
    );

    const styleLoader = createStyleLoader();
    styleLoader.isLoaded = true;

    await styleLoader.loadStyles();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should resolve a promise after initial theme settings have been provided', async () => {
    spyOn(FontFaceObserver.prototype, 'load').and.returnValue(
      Promise.resolve(),
    );

    const mockThemeSvc: any = {
      settingsChange: new Subject<any>(),
    };

    const styleLoader = createStyleLoader(mockThemeSvc);

    const resolve = styleLoader.loadStyles();
    expect(styleLoader.isLoaded).toBe(false);

    mockThemeSvc.settingsChange.next({});

    await resolve;
    expect(styleLoader.isLoaded).toBe(true);
  });
});
