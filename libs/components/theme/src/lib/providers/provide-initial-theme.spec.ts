import { TestBed } from '@angular/core/testing';

import { firstValueFrom, map } from 'rxjs';

import { SkyThemeService } from '../theming/theme.service';

import { provideInitialTheme } from './provide-initial-theme';

describe('provideInitialTheme', () => {
  it('should provide modern theme', async () => {
    TestBed.configureTestingModule({
      providers: [provideInitialTheme()],
    });
    const service = TestBed.inject(SkyThemeService);
    expect(service).toBeTruthy();
    expect(
      await firstValueFrom(
        service.settingsChange.pipe(
          map((settings) => ({
            theme: settings.currentSettings.theme.name,
            mode: settings.currentSettings.mode.name,
            spacing: settings.currentSettings.spacing.name,
          })),
        ),
      ),
    ).toEqual({
      theme: 'default',
      mode: 'light',
      spacing: 'standard',
    });
  });

  it('should provide modern theme with overrides', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideInitialTheme('modern', {
          mode: 'dark',
          spacing: 'compact',
        }),
      ],
    });
    const service = TestBed.inject(SkyThemeService);
    expect(service).toBeTruthy();
    expect(
      await firstValueFrom(
        service.settingsChange.pipe(
          map((settings) => ({
            theme: settings.currentSettings.theme.name,
            mode: settings.currentSettings.mode.name,
            spacing: settings.currentSettings.spacing.name,
          })),
        ),
      ),
    ).toEqual({
      theme: 'modern',
      mode: 'dark',
      spacing: 'compact',
    });
  });
});
