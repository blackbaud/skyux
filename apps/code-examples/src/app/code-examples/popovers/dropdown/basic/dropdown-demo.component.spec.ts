import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { DropdownDemoComponent } from './dropdown-demo.component';
import { DropdownDemoModule } from './dropdown-demo.module';

fdescribe('Basic dropdown', () => {
  async function setupTest(): Promise<{
    dropdownHarness: SkyDropdownHarness;
    fixture: ComponentFixture<DropdownDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DropdownDemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const dropdownHarness = await loader.getHarness(
      SkyDropdownHarness.with({
        dataSkyId: 'dropdown-demo',
      })
    );

    return { dropdownHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DropdownDemoModule],
    });
  });

  it('should display the correct dropdown', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownHarness.getButtonStyle()).toBeResolvedTo(
      'default'
    );
    await expectAsync(dropdownHarness.getButtonType()).toBeResolvedTo('select');
    await expectAsync(dropdownHarness.isDisabled()).toBeResolvedTo(false);
    await expectAsync(dropdownHarness.getAriaLabel()).toBeResolvedTo(
      'Context menu'
    );
    await expectAsync(dropdownHarness.getTitle()).toBeResolvedTo(null);
    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(false);
  });

  it('should open the correct dropdown menu', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    fixture.detectChanges();
    await dropdownHarness.clickDropdownButton();
    fixture.detectChanges();

    const dropdownMenu = await dropdownHarness.getDropdownMenu();
    const dropdownMenuItems = await dropdownMenu?.getAllItems();

    await expectAsync(dropdownHarness.isOpen()).toBeResolvedTo(true);
    await expectAsync(dropdownMenu?.getAriaRole()).toBeResolvedTo('menu');

    await expectAsync(dropdownMenuItems?.[0].getText()).toBeResolvedTo(
      'Option 1'
    );
  });

  it('should click the correct dropdown menu item', async () => {
    const { dropdownHarness, fixture } = await setupTest();

    const clickSpy = spyOn(fixture.componentInstance, 'actionClicked');
    fixture.detectChanges();
    await dropdownHarness.clickDropdownButton();
    fixture.detectChanges();

    const dropdownMenu = await dropdownHarness.getDropdownMenu();
    const dropdownMenuItem = await dropdownMenu?.getItem({ text: 'Option 1' });

    await dropdownMenuItem?.click();

    expect(clickSpy).toHaveBeenCalledWith('Option 1');
  });
});
