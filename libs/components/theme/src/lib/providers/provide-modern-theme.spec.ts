import { TestBed } from '@angular/core/testing';
import { SkyThemeService, provideModernTheme } from '@skyux/theme';

import { firstValueFrom, map } from 'rxjs';

describe('provideModernTheme', () => {
  it('should provide modern theme', async () => {
    TestBed.configureTestingModule({
      providers: [provideModernTheme()],
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
      mode: 'light',
      spacing: 'standard',
    });
  });

  it('should provide modern theme with overrides', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideModernTheme({
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
