import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyDropdownItemHarness } from './dropdown-item-harness';

// #region Test Component
@Component({
  selector: 'sky-dropdown-menu-test',
  template: `
    <sky-dropdown-item [ariaRole]="itemRole">
      <button (click)="clickItem()"></button>
      {{ itemText }}
    </sky-dropdown-item>
  `,
})
class TestDropdownItemComponent {
  public itemRole: string | undefined;
  public itemText: string | undefined;

  public clickItem(): void {
    // Only exists for the spy
  }
}
// #endregion Test Component

describe('Dropdown item test harness', () => {
  async function setupTest(): Promise<{
    dropdownItemHarness: SkyDropdownItemHarness;
    fixture: ComponentFixture<TestDropdownItemComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestDropdownItemComponent],
      imports: [SkyDropdownModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestDropdownItemComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const dropdownItemHarness = await loader.getHarness(SkyDropdownItemHarness);

    return { dropdownItemHarness, fixture, loader };
  }

  it('should get the default menu item role', async () => {
    const { dropdownItemHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(dropdownItemHarness.getAriaRole()).toBeResolvedTo(
      'menuitem'
    );
  });

  it('should get the menu item role', async () => {
    const { dropdownItemHarness, fixture } = await setupTest();

    fixture.componentInstance.itemRole = 'item-role';
    fixture.detectChanges();

    await expectAsync(dropdownItemHarness.getAriaRole()).toBeResolvedTo(
      'item-role'
    );
  });

  it('should click the menu item', async () => {
    const { dropdownItemHarness, fixture } = await setupTest();

    const spy = spyOn(fixture.componentInstance, 'clickItem');
    fixture.detectChanges();

    await dropdownItemHarness.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get the item text', async () => {
    const { dropdownItemHarness, fixture } = await setupTest();

    fixture.componentInstance.itemText = 'text';
    fixture.detectChanges();

    await expectAsync(dropdownItemHarness.getText()).toBeResolvedTo('text');
  });
});
