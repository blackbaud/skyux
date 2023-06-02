import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyDropdownHarness } from './dropdown-harness';

// #region Test component
@Component({
  selector: 'sky-dropdown-test',
  template: `
    <sky-dropdown
      [dismissOnBlur]="dismissOnBlur"
      [buttonStyle]="buttonStyle"
      [buttonType]="buttonType"
      [disabled]="disabledFlag"
      [label]="ariaLabel"
      [title]="tooltipTitle"
    >
      <sky-dropdown-menu [ariaRole]="menuRole"></sky-dropdown-menu>
    </sky-dropdown>

    <sky-dropdown data-sky-id="other-dropdown" [buttonStyle]="'primary'">
      <sky-dropdown-menu [ariaRole]="'otherDropdownMenu'"></sky-dropdown-menu>
    </sky-dropdown>
  `,
})
class TestDropdownComponent {
  public dismissOnBlur: boolean | undefined;
  public buttonStyle: string | undefined;
  public buttonType: string | undefined;
  public disabledFlag: boolean | undefined;
  public ariaLabel: string | undefined;
  public tooltipTitle: string | undefined;

  public menuRole: string | undefined;
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

    const types = ['select', 'tab', 'context-menu'];

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

    await expectAsync(dropdownHarness.getTitle()).toBeResolvedTo(null);
  });

  it('should get the tooltip title', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.componentInstance.tooltipTitle = 'dropdown demo';
    fixture.detectChanges();

    await expectAsync(dropdownHarness.getTitle()).toBeResolvedTo(
      'dropdown demo'
    );
  });

  it('should get the correct value if dropdown menu is open or not', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(false);

    await dropdownHarness.clickDropdownButton();
    fixture.detectChanges();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(true);

    await dropdownHarness.clickDropdownButton();
    fixture.detectChanges();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(false);
  });

  it('should close the dropdown menu if clicking out when dismissOnBlur is set to true', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.componentInstance.dismissOnBlur = true;
    fixture.detectChanges();
    await dropdownHarness.clickDropdownButton();
    fixture.detectChanges();
    await (await dropdownHarness.getDropdownMenu()).clickOut();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(false);
  });

  it('should not close the dropdown menu if clicking out when dismissOnBlur is set to false', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.componentInstance.dismissOnBlur = false;
    fixture.detectChanges();
    await dropdownHarness.clickDropdownButton();
    fixture.detectChanges();
    await (await dropdownHarness.getDropdownMenu()).clickOut();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(true);
  });

  it('should get the dropdown menu harness', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.componentInstance.menuRole = 'dropdown-menu';
    fixture.detectChanges();
    await dropdownHarness.clickDropdownButton();
    fixture.detectChanges();

    const dropdownMenuHarness = await dropdownHarness.getDropdownMenu();

    await expectAsync(dropdownMenuHarness.getAriaRole()).toBeResolvedTo(
      'dropdown-menu'
    );
  });

  describe('Dropdown menu test harness', () => {
    it('should throw an error if dropdown menu is not open', async () => {
      const { dropdownHarness, fixture } = await setupTest();

      fixture.detectChanges();

      await expectAsync(
        dropdownHarness.getDropdownMenu()
      ).toBeRejectedWithError(
        'Unable to retrieve dropdown menu harness because dropdown is closed.'
      );
    });

    it('should throw an error when trying to get an item in an empty menu', async () => {
      const { dropdownHarness, fixture } = await setupTest();

      fixture.detectChanges();
      await dropdownHarness.clickDropdownButton();
      fixture.detectChanges();

      const dropdownMenuHarness = await dropdownHarness.getDropdownMenu();

      await expectAsync(dropdownMenuHarness.getItems()).toBeRejectedWithError(
        'Unable to retrieve item(s) because dropdown menu is empty.'
      );
    });
  });
});
