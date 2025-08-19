import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconModule } from '@skyux/icon';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyIconHarness } from './icon-harness';

//#region Test component
@Component({
  selector: 'sky-icon-test',
  template: `
    <sky-icon
      data-sky-id="svg-icon"
      [iconName]="iconName"
      [variant]="variant"
      [iconSize]="iconSize"
    />
  `,
  standalone: false,
})
class TestComponent {
  public iconName = 'filter';
  public variant: string | undefined;
  public iconSize: string | undefined;
}
//#endregion Test component
async function validateIconName(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  iconName: string,
): Promise<void> {
  fixture.componentInstance.iconName = iconName;

  fixture.detectChanges();

  await expectAsync(iconHarness.getIconName()).toBeResolvedTo(iconName);
}

async function validateIconSize(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  iconSize: string,
): Promise<void> {
  fixture.componentInstance.iconSize = iconSize;

  fixture.detectChanges();

  await expectAsync(iconHarness.getIconSize()).toBeResolvedTo(iconSize);
}

async function validateVariant(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  variant: string,
): Promise<void> {
  fixture.componentInstance.variant = variant;

  fixture.detectChanges();

  await expectAsync(iconHarness.getVariant()).toBeResolvedTo(variant);
}

const variants = ['line', 'solid'];
const sizes = ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

describe('Icon harness', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    iconHarness: SkyIconHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
    pageLoader: HarnessLoader;
  }> {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyIconModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const pageLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const iconHarness: SkyIconHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyIconHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyIconHarness);

    return { iconHarness, fixture, loader, pageLoader };
  }

  it('should return the correct icon name for all icon variants', async () => {
    const { iconHarness, fixture } = await setupTest({
      dataSkyId: 'svg-icon',
    });

    for (const variant of variants) {
      fixture.componentInstance.variant = variant;

      await validateIconName(
        iconHarness,
        fixture,
        fixture.componentInstance.iconName,
      );
    }
  });

  it('should return the correct icon for all sizes', async () => {
    const { iconHarness, fixture } = await setupTest({
      dataSkyId: 'svg-icon',
    });
    for (const size of sizes) {
      await validateIconSize(iconHarness, fixture, size);
    }
  });

  it('should return the correct variant', async () => {
    const { iconHarness, fixture } = await setupTest({
      dataSkyId: 'svg-icon',
    });

    for (const variant of variants) {
      await validateVariant(iconHarness, fixture, variant);
    }
  });

  it('should return "line" as the default variant when no variant is specified', async () => {
    const { iconHarness, fixture } = await setupTest({
      dataSkyId: 'svg-icon',
    });

    fixture.componentInstance.variant = undefined;
    fixture.detectChanges();

    await expectAsync(iconHarness.getVariant()).toBeResolvedTo('line');
  });
});
