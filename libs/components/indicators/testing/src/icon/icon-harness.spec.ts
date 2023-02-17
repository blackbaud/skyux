import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconModule } from '@skyux/indicators';

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
    ></sky-icon>
    <sky-icon data-sky-id="test-icon" icon="sort"></sky-icon>
  `,
})
class TestComponent {
  public iconName = 'house';
  public iconType: string | undefined = 'skyux';
  public fixedWidth: boolean | undefined = true;
  public variant: string | undefined = 'line';
  public size: string | undefined = '2xl'; //reset to undefined so u have a baseline
}
//#endregion Test component

async function validateIconName(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  iconName: string
): Promise<void> {
  fixture.componentInstance.iconName = iconName;
  fixture.detectChanges();
  await expectAsync(iconHarness.getIconName()).toBeResolvedTo(iconName);
}

async function validateIconType(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  iconType: string | undefined
): Promise<void> {
  fixture.componentInstance.iconType = iconType;
  fixture.detectChanges();
  await expectAsync(iconHarness.getIconType()).toBeResolvedTo(
    iconType ? iconType : 'fa'
  );
}

async function validateFixedWidth(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  fixedWidth: boolean | undefined
): Promise<void> {
  fixture.componentInstance.fixedWidth = fixedWidth;
  fixture.detectChanges();
  await expectAsync(iconHarness.isFixedWidth()).toBeResolvedTo(
    fixedWidth ? fixedWidth : false
  );
}

async function validateIconSize(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  iconSize: string | undefined
): Promise<void> {
  fixture.componentInstance.size = iconSize;
  fixture.detectChanges();
  await expectAsync(iconHarness.getIconSize()).toBeResolvedTo(iconSize);
}

async function validateVariant(
  iconHarness: SkyIconHarness,
  fixture: ComponentFixture<TestComponent>,
  variant: string | undefined
): Promise<void> {
  fixture.componentInstance.variant = variant;
  fixture.detectChanges();
  await expectAsync(iconHarness.getVariant()).toBeResolvedTo(
    variant ? variant : ''
  );
}

const iconTypes = ['fa', 'skyux'];
const variants = ['line', 'solid'];
const sizes = [
  '2xs',
  'xs',
  'sm',
  'lg',
  '2xl',
  '1x',
  '2x',
  '3x',
  '4x',
  '5x',
  '6x',
  '7x',
  '8x',
  '9x',
  '10x',
];

describe('Icon harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    iconHarness: SkyIconHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
    pageLoader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyIconModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const pageLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const iconHarness: SkyIconHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyIconHarness.with({ dataSkyId: options.dataSkyId })
        )
      : await loader.getHarness(SkyIconHarness);
    fixture.detectChanges();

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
          fixture.componentInstance.iconName
        );
      }
    }
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

  it('should return the correct icon size', async () => {
    const { iconHarness, fixture } = await setupTest();
    for (const size of sizes) {
      await validateIconSize(iconHarness, fixture, size);
    }
  });

  it('should return undefined if size is not set', async () => {
    const { iconHarness, fixture } = await setupTest();
    await validateIconSize(iconHarness, fixture, undefined);
  });

  it('should return default values for fixed width', async () => {
    const { iconHarness, fixture } = await setupTest();
    fixture.componentInstance.fixedWidth = undefined;
    fixture.detectChanges();
    await expectAsync(iconHarness.isFixedWidth()).toBeResolvedTo(false);
  });

  it('should return the right variant for skyux icons', async () => {
    const { iconHarness, fixture } = await setupTest();
    fixture.componentInstance.iconType = 'skyux';
    for (const type of iconTypes) {
      await validateIconType(iconHarness, fixture, type);
    }
  });

  it('should throw an error when trying to get variant for a non skyux icon', async () => {
    const { iconHarness, fixture } = await setupTest();
    fixture.componentInstance.iconType = undefined;
    fixture.detectChanges();

    await expectAsync(iconHarness.getVariant()).toBeRejectedWithError(
      'Variant cannot be determined because iconType is not skyux'
    );
  });

  it('should get an icon by its data-sky-id property', async () => {
    const { iconHarness } = await setupTest({ dataSkyId: 'test-icon' });
    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('sort');
  });
});
