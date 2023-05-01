import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyDropdownMenuHarness } from './dropdown-menu-harness';

// #region Test Component
@Component({
  selector: 'sky-dropdown-menu-test',
  template: `
    <sky-dropdown-menu [ariaLabelledBy]="labelledBy" [ariaRole]="role">
      <sky-dropdown-item [ariaRole]="itemRole"></sky-dropdown-item>
      <sky-dropdown-item
        [ariaRole]="clickItemRole"
        (click)="clickItem()"
      ></sky-dropdown-item>
    </sky-dropdown-menu>
  `,
})
class TestDropdownMenuComponent {
  public labelledBy: string | undefined;
  public role: string | undefined;

  public itemRole: string | undefined;
  public clickItemRole: string | undefined;

  public clickItem(): void {
    // Only exists for the spy
  }
}
// #endregion Test Component

fdescribe('DropdownMenu menu test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {}
  ): Promise<{
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

    let dropdownMenuHarness: SkyDropdownMenuHarness;

    if (options.dataSkyId) {
      dropdownMenuHarness = await loader.getHarness(
        SkyDropdownMenuHarness.with({
          dataSkyId: options.dataSkyId,
        })
      );
    } else {
      dropdownMenuHarness = await loader.getHarness(SkyDropdownMenuHarness);
    }

    return { dropdownMenuHarness, fixture, loader };
  }

  it('should get the aria-labelledBy', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.componentInstance.labelledBy = 'aria-labelledBy';
    fixture.detectChanges();

    await expectAsync(dropdownMenuHarness.getAriaLabelledBy()).toBeResolvedTo(
      'aria-labelledBy'
    );
  });

  it('should get aria-role', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.componentInstance.role = 'menu-role';
    fixture.detectChanges();

    await expectAsync(dropdownMenuHarness.getRole()).toBeResolvedTo(
      'menu-role'
    );
  });

  it('should get menu item role at index', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.componentInstance.itemRole = 'item1';
    fixture.componentInstance.clickItemRole = 'item2';
    fixture.detectChanges();

    await expectAsync(dropdownMenuHarness.getMenuItemRole(0)).toBeResolvedTo(
      'item1'
    );
  });

  it('should click menu item at index', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    const clickSpy = spyOn(fixture.componentInstance, 'clickItem');
    fixture.detectChanges();

    await dropdownMenuHarness.clickMenuItemAtIndex(1);
    expect(clickSpy).toHaveBeenCalled();
  });

  fit('should click menu item with role', async () => {
    const { dropdownMenuHarness, fixture } = await setupTest();

    fixture.componentInstance.clickItemRole = 'click-item';
    const clickSpy = spyOn(fixture.componentInstance, 'clickItem');
    fixture.detectChanges();

    await dropdownMenuHarness.clickMenuItemWithRole('click-item');
    expect(clickSpy).toHaveBeenCalled();
  });
});
