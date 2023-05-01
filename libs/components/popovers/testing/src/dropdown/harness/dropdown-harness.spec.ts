import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyDropdownHarness } from './dropdown-harness';

// #region Test component
@Component({
  selector: 'sky-dropdown-test',
  template: `
    <sky-dropdown
      [buttonStyle]="buttonStyle"
      [buttonType]="buttonType"
      [disabled]="disabledFlag"
      [label]="ariaLabel"
      [title]="tooltipTitle"
    >
      <sky-dropdown-button></sky-dropdown-button>
      <sky-dropdown-menu
        [ariaLabelledBy]="menuLabelledBy"
        [ariaRole]="menuRole"
      >
        <sky-dropdown-item [ariaRole]="itemRole"></sky-dropdown-item>
      </sky-dropdown-menu>
    </sky-dropdown>

    <sky-dropdown
      data-sky-id="other-dropdown"
      [buttonStyle]="'primary'"
    ></sky-dropdown>
  `,
})
class TestDropdownComponent {
  public buttonStyle: string | undefined;
  public buttonType: string | undefined;
  public disabledFlag: boolean | undefined;
  public ariaLabel: string | undefined;
  public tooltipTitle: string | undefined;

  public menuLabelledBy: string | undefined;
  public menuRole: string | undefined;

  public itemRole: string | undefined;
}
// #endregion Test component

describe('Dropdown test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {}
  ): Promise<{
    dropdownHarness: SkyDropdownHarness;
    fixture: ComponentFixture<TestDropdownComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestDropdownComponent],
      imports: [SkyDropdownModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestDropdownComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    let dropdownHarness: SkyDropdownHarness;

    if (options.dataSkyId) {
      dropdownHarness = await loader.getHarness(
        SkyDropdownHarness.with({
          dataSkyId: options.dataSkyId,
        })
      );
    } else {
      dropdownHarness = await loader.getHarness(SkyDropdownHarness);
    }

    return { dropdownHarness, fixture, loader };
  }

  it('should get the dropdown from its data-sky-id', async () => {
    const { dropdownHarness, fixture } = await setupTest({
      dataSkyId: 'other-dropdown',
    });

    fixture.detectChanges();

    await expectAsync(dropdownHarness.getButtonStyle()).toBeResolvedTo(
      'primary'
    );
  });

  it('should get the default button style', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownHarness.getButtonStyle()).toBeResolvedTo(
      'default'
    );
  });

  it('should get the button style', async () => {
    const { dropdownHarness, fixture } = await setupTest();
    const styles = ['default', 'primary', 'link'];

    for (const style of styles) {
      fixture.componentInstance.buttonStyle = style;
      fixture.detectChanges();

      await expectAsync(dropdownHarness.getButtonStyle()).toBeResolvedTo(style);
    }
  });

  it('should get default button type', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownHarness.getButtonType()).toBeResolvedTo('select');
  });

  it('should get the button type', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    const types = ['select', 'context-menu'];

    for (const type of types) {
      fixture.componentInstance.buttonType = type;
      fixture.detectChanges();

      await expectAsync(dropdownHarness.getButtonType()).toBeResolvedTo(type);
    }
  });

  it('should get the default value for disabled button', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownHarness.isDisabled()).toBeResolvedTo(false);
  });

  it('should get the correct value for disabled button', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.componentInstance.disabledFlag = true;
    fixture.detectChanges();

    await expectAsync(dropdownHarness.isDisabled()).toBeResolvedTo(true);

    fixture.componentInstance.disabledFlag = false;
    fixture.detectChanges();

    await expectAsync(dropdownHarness.isDisabled()).toBeResolvedTo(false);
  });

  it('should have default aria-label', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownHarness.getAriaLabel()).toBeResolvedTo(
      'Context menu'
    );
  });

  it('should get the aria-label', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.componentInstance.ariaLabel = 'aria-label';
    fixture.detectChanges();

    await expectAsync(dropdownHarness.getAriaLabel()).toBeResolvedTo(
      'aria-label'
    );
  });

  it('should have no tooltip if undefined', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownHarness.getTooltipTitle()).toBeResolvedTo(null);
  });

  it('should get the tooltip title', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.componentInstance.tooltipTitle = 'dropdown demo';
    fixture.detectChanges();

    await expectAsync(dropdownHarness.getTooltipTitle()).toBeResolvedTo(
      'dropdown demo'
    );
  });

  it('should get the correct value if dropdown menu is open or not', fakeAsync(async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(false);

    dropdownHarness.clickDropdownButton();
    fixture.detectChanges();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(true);

    dropdownHarness.clickDropdownButton();
    fixture.detectChanges();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(false);
  }));
});
