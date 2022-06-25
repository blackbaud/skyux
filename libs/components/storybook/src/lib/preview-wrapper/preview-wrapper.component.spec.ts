import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyThemeModule, SkyThemeService, SkyThemeSettingsChange } from '@skyux/theme';

import { PreviewWrapperComponent } from './preview-wrapper.component';

describe('PreviewWrapperComponent', () => {
  let component: PreviewWrapperComponent;
  let fixture: ComponentFixture<PreviewWrapperComponent>;
  let testHost: HTMLElement;

  if (!navigator.userAgent.match(/Version\/15\.\d+ Safari\//)) {
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

    it('should set the theme', () => {
      const themeService = TestBed.inject(SkyThemeService);
      let expectedTheme = {
        theme: 'default',
        mode: 'light',
      };
      const subscription = themeService.settingsChange.subscribe((settings: SkyThemeSettingsChange) => {
        expect(settings.currentSettings.theme.name).toEqual(expectedTheme.theme);
        expect(settings.currentSettings.mode.name).toEqual(expectedTheme.mode);
      });
      expectedTheme = {
        theme: 'modern',
        mode: 'light',
      };
      component.theme = 'modern-light';
      expectedTheme.mode = 'dark';
      component.theme = 'modern-dark';
      expect(component.theme).toEqual('modern-dark');
      expectedTheme = {
        theme: 'default',
        mode: 'light',
      };
      component.theme = 'default';
      expect(component.theme).toEqual('default');
      subscription.unsubscribe();
    });
  }
});
