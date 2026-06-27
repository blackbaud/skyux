import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyDropdownMenuHarness } from './dropdown-menu-harness';

// #region Test Component
@Component({
  selector: 'sky-dropdown-menu-test',
  template: `
    <sky-dropdown-menu [ariaLabelledBy]="labelledBy()" [ariaRole]="role()">
      <sky-dropdown-item [ariaRole]="itemRole()">Option 1</sky-dropdown-item>
      <sky-dropdown-item>Option 2</sky-dropdown-item>
    </sky-dropdown-menu>
  `,
  standalone: false,
})
class TestDropdownMenuComponent {
  public readonly labelledBy = input<string | undefined>(undefined);
  public readonly role = input<string | undefined>(undefined);
  public readonly itemRole = input<string | undefined>(undefined);
}
// #endregion Test Component

describe('Dropdown menu test harness', () => {
  async function setupTest(): Promise<{
    dropdownMenuHarness: SkyDropdownMenuHarness;
    fixture: ComponentFixture<TestDropdownMenuComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestDropdownMenuComponent],
      imports: [SkyDropdownModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestDropdownMenuComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const dropdownMenuHarness = await loader.getHarness(SkyDropdownMenuHarness);

    return { dropdownMenuHarness, fixture, loader };
  }
  it('should get the aria-labelledBy', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('labelledBy', 'aria-labelledBy');
    fixture.detectChanges();

    await expectAsync(dropdownMenuHarness.getAriaLabelledBy()).toBeResolvedTo(
      'aria-labelledBy',
    );
  });

  it('should get menu role', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('role', 'menu-role');
    fixture.detectChanges();

    await expectAsync(dropdownMenuHarness.getAriaRole()).toBeResolvedTo(
      'menu-role',
    );
  });

  it('should get all the menu items harnesses', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.detectChanges();
    const harnesses = dropdownMenuHarness.getItems();

    await expect((await harnesses).length).toBe(2);
  });

  it('should get menu item by text', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('itemRole', 'test-item');
    fixture.detectChanges();
    const harness = await dropdownMenuHarness.getItem({ text: 'Option 1' });

    await expectAsync(harness.getAriaRole()).toBeResolvedTo('test-item');
  });

  it('should get a specific dropdown menu item that meets certain criteria', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.detectChanges();
    const harness = await dropdownMenuHarness.getItem({ text: 'Option 2' });

    await expectAsync(harness.getText()).toBeResolvedTo('Option 2');
  });
});
