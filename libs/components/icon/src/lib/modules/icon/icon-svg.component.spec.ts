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
