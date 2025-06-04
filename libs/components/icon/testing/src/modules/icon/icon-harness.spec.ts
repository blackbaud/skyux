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
      [icon]="iconName"
      [iconType]="iconType"
      [fixedWidth]="fixedWidth"
      [variant]="variant"
      [size]="size"
    />
    <sky-icon data-sky-id="test-icon" icon="sort" size="md" />
    <sky-icon
      data-sky-id="svg-icon"
      [iconName]="svgIconName"
      [variant]="svgVariant"
      [iconSize]="svgIconSize"
      [size]="svgIconRelativeSize"
    />
  `,
  standalone: false,
})
class TestComponent {
  public iconName: string | undefined = 'house';
  public iconType: string | undefined;
  public fixedWidth: boolean | undefined;
  public variant: string | undefined;
  public size: string | undefined;
  public svgIconName: string | undefined = 'filter';
  public svgVariant: string | undefined;
  public svgIconSize: string | undefined;
  public svgIconRelativeSize: string | undefined;
}
//#endregion Test component

async function validateIconName(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  iconName: string | undefined,
): Promise<void> {
  fixture.componentInstance.iconName = iconName;

  fixture.detectChanges();

  await expectAsync(iconHarness.getIconName()).toBeResolvedTo(iconName);
}

async function validateSvgIconName(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  iconName: string | undefined,
): Promise<void> {
  fixture.componentInstance.svgIconName = iconName;

  fixture.detectChanges();

  await expectAsync(iconHarness.getIconName()).toBeResolvedTo(iconName);
}

async function validateIconType(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  iconType: string | undefined,
): Promise<void> {
  fixture.componentInstance.iconType = iconType;

  fixture.detectChanges();

  await expectAsync(iconHarness.getIconType()).toBeResolvedTo(
    iconType ? iconType : 'fa',
  );
}

async function validateFixedWidth(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  fixedWidth: boolean | undefined,
): Promise<void> {
  fixture.componentInstance.fixedWidth = fixedWidth;

  fixture.detectChanges();

  await expectAsync(iconHarness.isFixedWidth()).toBeResolvedTo(
    fixedWidth ? fixedWidth : false,
  );
}

async function validateIconSize(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  relativeSize: string | undefined,
): Promise<void> {
  fixture.componentInstance.size = relativeSize;

  fixture.detectChanges();

  await expectAsync(iconHarness.getIconSize()).toBeResolvedTo(relativeSize);
}

async function validateSvgIconSize(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  relativeSize: string | undefined,
  fixedSize: string | undefined,
): Promise<void> {
  fixture.componentInstance.svgIconRelativeSize = relativeSize;
  fixture.componentInstance.svgIconSize = fixedSize;

  fixture.detectChanges();

  await expectAsync(iconHarness.getIconSize()).toBeResolvedTo(
    relativeSize || fixedSize,
  );
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

async function validateSvgVariant(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  variant: string,
): Promise<void> {
  fixture.componentInstance.svgVariant = variant;

  fixture.detectChanges();

  await expectAsync(iconHarness.getVariant()).toBeResolvedTo(variant);
}

const iconTypes = ['fa', 'skyux'];
const variants = ['line', 'solid'];
const relativeSizes = ['lg', '2x', '3x', '4x', '5x'];
const sizes = ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

describe('Icon harness', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  async function setupTest(
    options: { dataSkyId?: string; theme?: 'default' | 'modern' } = {},
  ): Promise<{
    iconHarness: SkyIconHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
    pageLoader: HarnessLoader;
  }> {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets[options?.theme || 'default'],
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

  it('should return the correct icon name for all icon types and variants', async () => {
    const { iconHarness, fixture } = await setupTest();

    for (const type of iconTypes) {
      fixture.componentInstance.iconType = type;
      for (const variant of variants) {
        fixture.componentInstance.variant = variant;

        await validateIconName(
          iconHarness,
          fixture,
          fixture.componentInstance.iconName,
        );
      }
    }
  });

  it('should throw error if icon name is not set', async () => {
    const { iconHarness, fixture } = await setupTest();
    fixture.componentInstance.iconName = undefined;
    fixture.componentInstance.svgIconName = undefined;

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconName()).toBeRejectedWithError(
      'Icon could not be rendered.',
    );
  });

  it('should return the correct icon size', async () => {
    const { iconHarness, fixture } = await setupTest();

    for (const size of relativeSizes) {
      await validateIconSize(iconHarness, fixture, size);
    }
  });

  it('should return undefined if no size input is set', async () => {
    const { iconHarness, fixture } = await setupTest();

    await validateIconSize(iconHarness, fixture, undefined);
  });

  it('should return the correct icon type', async () => {
    const { iconHarness, fixture } = await setupTest();

    for (const type of iconTypes) {
      await validateIconType(iconHarness, fixture, type);
    }
  });

  it('should return the default icon type', async () => {
    const { iconHarness, fixture } = await setupTest();
    fixture.componentInstance.iconType = undefined;

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconType()).toBeResolvedTo('fa');
  });

  it('should return the correct variant for skyux icons', async () => {
    const { iconHarness, fixture } = await setupTest({
      theme: 'modern',
    });
    fixture.componentInstance.iconType = 'skyux';

    for (const variant of variants) {
      await validateVariant(iconHarness, fixture, variant);
    }
  });

  it('should return `line` if the skyux icon does not have variant', async () => {
    const { iconHarness, fixture } = await setupTest({ theme: 'modern' });
    fixture.componentInstance.iconName = 'sort';
    fixture.componentInstance.iconType = 'skyux';

    fixture.detectChanges();

    await expectAsync(iconHarness.getVariant()).toBeResolvedTo('line');
  });

  it('should throw an error when trying to get variant for a non skyux icon', async () => {
    const { iconHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(iconHarness.getVariant()).toBeRejectedWithError(
      'Variant cannot be determined because variants are only assigned to icons with type `skyux`.',
    );
  });

  it('should return default values for fixed width', async () => {
    const { iconHarness, fixture } = await setupTest();
    fixture.componentInstance.fixedWidth = undefined;

    fixture.detectChanges();

    await expectAsync(iconHarness.isFixedWidth()).toBeResolvedTo(false);
  });

  it('should return the correct value for fixed width', async () => {
    const { iconHarness, fixture } = await setupTest();

    await validateFixedWidth(iconHarness, fixture, false);
    await validateFixedWidth(iconHarness, fixture, true);
  });

  it('should get an icon by its data-sky-id property', async () => {
    const { iconHarness, fixture } = await setupTest({
      dataSkyId: 'test-icon',
    });

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('sort');
  });

  describe('svg icons', () => {
    it('should return the correct icon name for all icon variants', async () => {
      const { iconHarness, fixture } = await setupTest({
        dataSkyId: 'svg-icon',
      });

      for (const variant of variants) {
        fixture.componentInstance.svgVariant = variant;

        await validateSvgIconName(
          iconHarness,
          fixture,
          fixture.componentInstance.svgIconName,
        );
      }
    });

    it('should return the correct icon size when relative size is used', async () => {
      const { iconHarness, fixture } = await setupTest({
        dataSkyId: 'svg-icon',
      });
      for (const size of relativeSizes) {
        await validateSvgIconSize(iconHarness, fixture, size, undefined);
      }
    });

    it('should return the correct icon size when fixed size is used', async () => {
      const { iconHarness, fixture } = await setupTest({
        dataSkyId: 'svg-icon',
      });
      for (const size of sizes) {
        await validateSvgIconSize(iconHarness, fixture, undefined, size);
      }
    });

    it('should return the correct variant', async () => {
      const { iconHarness, fixture } = await setupTest({
        dataSkyId: 'svg-icon',
      });

      for (const variant of variants) {
        await validateSvgVariant(iconHarness, fixture, variant);
      }
    });
  });
});
