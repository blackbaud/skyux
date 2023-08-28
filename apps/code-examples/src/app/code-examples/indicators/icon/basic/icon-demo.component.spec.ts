import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconHarness } from '@skyux/indicators/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { IconDemoComponent } from './icon-demo.component';
import { IconDemoModule } from './icon-demo.module';

describe('Basic icon', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  async function setupTest(
    options: { theme?: 'default' | 'modern' } = {}
  ): Promise<{
    iconHarness: SkyIconHarness;
    fixture: ComponentFixture<IconDemoComponent>;
  }> {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets[options?.theme || 'default'],
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [IconDemoModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(IconDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const iconHarness = await loader.getHarness(
      SkyIconHarness.with({
        dataSkyId: 'icon-demo',
      })
    );

    return { iconHarness, fixture };
  }

  it('should display the correct icon in default theme', async () => {
    const { iconHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('calendar');
    await expectAsync(iconHarness.getVariant()).toBeRejectedWithError(
      'Variant cannot be determined because variants are only assigned to icons with type `skyux`.'
    );
    await expectAsync(iconHarness.getIconSize()).toBeResolvedTo('4x');
    await expectAsync(iconHarness.isFixedWidth()).toBeResolvedTo(true);
  });

  it('should display the correct icon in modern theme', async () => {
    const { iconHarness, fixture } = await setupTest({ theme: 'modern' });

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('calendar');
    await expectAsync(iconHarness.getVariant()).toBeResolvedTo('solid');
    await expectAsync(iconHarness.getIconSize()).toBeResolvedTo('4x');
    await expectAsync(iconHarness.isFixedWidth()).toBeResolvedTo(true);
  });
});
