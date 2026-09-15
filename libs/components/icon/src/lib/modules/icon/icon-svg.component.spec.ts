import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconSvgComponent } from './icon-svg.component';
import { SkyIconModule } from './icon.module';

describe('Icon SVG component', () => {
  let resolverSvc: jasmine.SpyObj<SkyIconSvgResolverService>;
  let fixture: ComponentFixture<SkyIconSvgComponent>;
  let settingsChange: BehaviorSubject<SkyThemeSettingsChange>;

  function detectUrlChanges(): void {
    fixture.detectChanges();

    // Resolve icon ID Observable and apply changes.
    tick();
    fixture.detectChanges();
  }

  function getSvgEl(): SVGElement {
    return fixture.nativeElement.querySelector('.sky-icon-svg-img');
  }

  function validateIconId(expectedId: string): void {
    const useEl = getSvgEl().querySelector<SVGUseElement>('use');

    expect(useEl?.href.baseVal).toBe(expectedId);
  }

  function setThemeMode(mode: SkyThemeMode): void {
    settingsChange.next({
      currentSettings: new SkyThemeSettings(SkyTheme.presets.modern, mode),
      previousSettings: settingsChange.value.currentSettings,
    });
  }

  beforeEach(() => {
    settingsChange = new BehaviorSubject<SkyThemeSettingsChange>({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      ),
      previousSettings: undefined,
    });

    resolverSvc = jasmine.createSpyObj<SkyIconSvgResolverService>(
      'SkyIconSvgResolverService',
      ['resolveHref'],
    );

    // Mirror the real resolver, which appends `-dark` to the icon ID when dark
    // mode is requested and the icon has a dark mode version.
    resolverSvc.resolveHref.and.callFake((src, size, variant, darkMode) => {
      const darkSuffix = darkMode ? '-dark' : '';

      return Promise.resolve(
        `#${src}-${size}-${variant ?? 'line'}${darkSuffix}`,
      );
    });

    TestBed.configureTestingModule({
      imports: [SkyIconModule],
      providers: [
        {
          provide: SkyIconSvgResolverService,
          useValue: resolverSvc,
        },
        { provide: SkyThemeService, useValue: { settingsChange } },
      ],
    });

    fixture = TestBed.createComponent(SkyIconSvgComponent);
  });

  it('should display the resolved icon by ID', fakeAsync(() => {
    fixture.componentRef.setInput('iconName', 'test');
    detectUrlChanges();

    validateIconId('#test-20-line');
  }));

  it('should display the resolved icon by ID and iconSize', fakeAsync(() => {
    fixture.componentRef.setInput('iconName', 'test');
    fixture.componentRef.setInput('iconSize', 'l');
    detectUrlChanges();

    validateIconId('#test-24-line');
  }));

  it('should display the resolved icon by ID and variant', fakeAsync(() => {
    fixture.componentRef.setInput('iconName', 'test');
    fixture.componentRef.setInput('iconVariant', 'solid');
    detectUrlChanges();

    validateIconId('#test-20-solid');
  }));

  it('should display the resolved icon by ID, iconSize, and variant', fakeAsync(() => {
    fixture.componentRef.setInput('iconName', 'test');
    fixture.componentRef.setInput('iconSize', 'l');
    fixture.componentRef.setInput('iconVariant', 'solid');
    detectUrlChanges();

    validateIconId('#test-24-solid');
  }));

  it('should resolve the icon again when the theme mode changes', fakeAsync(() => {
    fixture.componentRef.setInput('iconName', 'test');
    detectUrlChanges();

    validateIconId('#test-20-line');

    setThemeMode(SkyThemeMode.presets.dark);
    detectUrlChanges();

    validateIconId('#test-20-line-dark');

    setThemeMode(SkyThemeMode.presets.light);
    detectUrlChanges();

    validateIconId('#test-20-line');
  }));

  it('should handle errors', fakeAsync(() => {
    resolverSvc.resolveHref.and.throwError('Icon could not be resolved');

    fixture.componentRef.setInput('iconName', 'test');
    detectUrlChanges();

    validateIconId('');
  }));

  // The specs above stub the resolver. This block wires the real resolver to a
  // theme service and a stubbed sprite so the whole chain is covered: a theme
  // change must reach the rendered `use` element without the page reloading.
  describe('with the real resolver service', () => {
    let realResolverSvc: SkyIconSvgResolverService;

    function buildSymbolHtml(name: string, size: number, dark = false): string {
      const id = `sky-i-${name}-${size}-line${dark ? '-dark' : ''}`;

      return `<symbol viewBox="0 0 ${size} ${size}" id="${id}"><path d="1 1 0 0"></path></symbol>`;
    }

    function renderIconHref(): void {
      fixture.detectChanges();

      // Flush the sprite fetch and the resolveHref() promise chain.
      tick();
      fixture.detectChanges();
    }

    beforeEach(async () => {
      spyOn(window, 'fetch').and.resolveTo(
        new Response(
          `<svg id="sky-icon-svg-sprite" width="0" height="0" style="position:absolute">
    ${buildSymbolHtml('themed', 20)}
    ${buildSymbolHtml('themed', 20, true)}
    ${buildSymbolHtml('light-only', 20)}
  </svg>`,
        ),
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [SkyIconModule],
        providers: [{ provide: SkyThemeService, useValue: { settingsChange } }],
      });

      fixture = TestBed.createComponent(SkyIconSvgComponent);
      realResolverSvc = TestBed.inject(SkyIconSvgResolverService);

      // The fetch spy resolves on a promise created outside the fakeAsync
      // zone, which tick() cannot flush. Load the sprite here so the specs
      // below only have to flush the resolveHref() promise.
      await realResolverSvc.resolveHref('themed', 20, 'line');
    });

    afterEach(() => {
      realResolverSvc.resetIconMap();
      document
        .querySelectorAll('#sky-icon-svg-sprite')
        .forEach((el) => el.remove());
    });

    it('should swap to the dark mode icon when the theme mode changes after the icon has rendered', fakeAsync(() => {
      fixture.componentRef.setInput('iconName', 'themed');
      renderIconHref();

      validateIconId('#sky-i-themed-20-line');

      // No reload; only the theme mode changes.
      setThemeMode(SkyThemeMode.presets.dark);
      renderIconHref();

      validateIconId('#sky-i-themed-20-line-dark');

      setThemeMode(SkyThemeMode.presets.light);
      renderIconHref();

      validateIconId('#sky-i-themed-20-line');
    }));

    it('should keep the default icon through a theme mode change when the icon has no dark mode version', fakeAsync(() => {
      fixture.componentRef.setInput('iconName', 'light-only');
      renderIconHref();

      validateIconId('#sky-i-light-only-20-line');

      setThemeMode(SkyThemeMode.presets.dark);
      renderIconHref();

      validateIconId('#sky-i-light-only-20-line');
    }));
  });

  describe('a11y', () => {
    async function detectUrlChanges(): Promise<void> {
      fixture.detectChanges();

      // Resolve icon ID Observable and apply changes.
      await fixture.whenStable();
      fixture.detectChanges();
    }

    it('should be accessible (icon: "test", size: undefined, variant: undefined)', async () => {
      fixture.componentRef.setInput('iconName', 'test');
      await detectUrlChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "test", size: 2x, variant: undefined)', async () => {
      fixture.componentRef.setInput('iconName', 'test');
      fixture.componentRef.setInput('iconSize', '2x');
      await detectUrlChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "test", size: undefined, variant: "solid")', async () => {
      fixture.componentRef.setInput('iconName', 'test');
      fixture.componentRef.setInput('iconVariant', 'solid');
      await detectUrlChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "test", size: undefined, variant: "line")', async () => {
      fixture.componentRef.setInput('iconName', 'test');
      fixture.componentRef.setInput('iconVariant', 'line');
      await detectUrlChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "test", size: 2x, variant: "solid")', async () => {
      fixture.componentRef.setInput('iconName', 'test');
      fixture.componentRef.setInput('iconSize', '2x');
      fixture.componentRef.setInput('iconVariant', 'solid');
      await detectUrlChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible (icon: "test", size: 2x, variant: "line")', async () => {
      fixture.componentRef.setInput('iconName', 'test');
      fixture.componentRef.setInput('iconSize', '2x');
      fixture.componentRef.setInput('iconVariant', 'line');
      await detectUrlChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
