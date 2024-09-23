import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      imports: [SkyThemeModule],
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

  it('should set the theme', async () => {
    const themeService = TestBed.inject(SkyThemeService);
    let expectedTheme = {
      theme: 'default',
      mode: 'light',
    };
    let expectGeminiClass = false;
    const subscription = themeService.settingsChange.subscribe(
      (settings: SkyThemeSettingsChange) => {
        expect(settings.currentSettings.theme.name).toEqual(
          expectedTheme.theme,
        );
        expect(settings.currentSettings.mode.name).toEqual(expectedTheme.mode);

        const gemini = fixture.nativeElement.querySelector(
          '.sky-theme-brand-blackbaud',
        );
        if (expectGeminiClass) {
          expect(gemini).toBeDefined();
        } else {
          expect(gemini).toBeNull();
        }
      },
    );
    expectedTheme = {
      theme: 'modern',
      mode: 'light',
    };
    component.theme = 'modern-light';

    expectedTheme = {
      theme: 'modern',
      mode: 'dark',
    };
    component.theme = 'modern-dark';

    expectedTheme = {
      theme: 'default',
      mode: 'light',
    };
    component.theme = 'default';

    expectedTheme = {
      theme: 'modern',
      mode: 'light',
    };
    expectGeminiClass = true;
    component.theme = 'modern-gemini-light';

    expectedTheme = {
      theme: 'default',
      mode: 'light',
    };
    expectGeminiClass = false;
    component.theme = undefined;

    subscription.unsubscribe();
    themeService.destroy();
  });
});
