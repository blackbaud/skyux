import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconModule } from '@skyux/icon';
import {
  SkyThemeModule,
  SkyThemeService,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { PreviewWrapperComponent } from './preview-wrapper.component';

describe('PreviewWrapperComponent', () => {
  let component: PreviewWrapperComponent;
  let fixture: ComponentFixture<PreviewWrapperComponent>;
  let testHost: HTMLElement;

  beforeEach(() => {
    testHost = document.createElement('div');
    document.body.appendChild(testHost);

    TestBed.configureTestingModule({
      declarations: [PreviewWrapperComponent],
      imports: [SkyThemeModule, SkyIconModule],
      providers: [
        SkyThemeService,
        {
          provide: 'BODY',
          useValue: testHost,
        },
      ],
    });
    fixture = TestBed.createComponent(PreviewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    document.body.removeChild(testHost);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the theme', () => {
    const themeService = TestBed.inject(SkyThemeService);
    let expectedTheme: {
      theme: string;
      mode: string;
      brand?: string;
    } = {
      theme: 'default',
      mode: 'light',
      brand: undefined,
    };
    let expectModernV2Class = false;
    const subscription = themeService.settingsChange.subscribe(
      (settings: SkyThemeSettingsChange) => {
        expect(settings.currentSettings.theme.name).toEqual(
          expectedTheme.theme,
        );
        expect(settings.currentSettings.mode.name).toEqual(expectedTheme.mode);

        if (expectModernV2Class) {
          expect(settings.currentSettings.brand?.name).toEqual(
            expectedTheme.brand,
          );
        } else {
          expect(settings.currentSettings.brand).toBeUndefined();
        }
      },
    );

    expectedTheme = {
      theme: 'modern',
      mode: 'dark',
      brand: 'blackbaud',
    };
    expectModernV2Class = true;
    component.theme = 'modern-v2-dark';

    expectedTheme = {
      theme: 'default',
      mode: 'light',
    };
    component.theme = 'default';

    expectedTheme = {
      theme: 'modern',
      mode: 'light',
      brand: 'blackbaud',
    };
    expectModernV2Class = true;
    component.theme = 'modern-v2-light';

    expectedTheme = {
      theme: 'default',
      mode: 'light',
    };
    expectModernV2Class = false;
    component.theme = undefined;

    subscription.unsubscribe();
    themeService.destroy();
  });
});
