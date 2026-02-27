import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyModalInstance } from '@skyux/modals';
import {
  SkyTabsetHarness,
  SkyTabsetNavButtonHarness,
} from '@skyux/tabs/testing';

import { ModalComponent } from './modal.component';

describe('Wizard tabset demo', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyTabsetHarness;
    fixture: ComponentFixture<ModalComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), SkyModalInstance],
      imports: [ModalComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ModalComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyTabsetHarness.with({ dataSkyId: options.dataSkyId }),
    );
    return { harness, fixture, loader };
  }

  it('should set up the tabset wizard', async () => {
    const { harness, loader } = await setupTest({
      dataSkyId: 'sign-up-wizard',
    });

    // You can get all tab button harnesses from the tabset harness.
    const tabs = await harness.getTabButtonHarnesses();
    expect(tabs.length).toBe(3);
    await expectAsync(tabs[1].isDisabled()).toBeResolvedTo(true);

    // You can get the tab button harness from its `tabHeading`
    const tab2 = await harness.getTabButtonHarness({
      tabHeading: '2. Contact Information',
    });
    await expectAsync(tab2.isActive()).toBeResolvedTo(false);

    // You can get the active tab button's harness.
    const activeTab = await harness.getActiveTabButton();
    await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo(
      '1. Biographical Details',
    );

    // You can get the tabset nav button harnesses by their `buttonType`.
    const previousButton = await loader.getHarness(
      SkyTabsetNavButtonHarness.with({
        buttonType: 'previous',
      }),
    );
    const nextButton = await loader.getHarness(
      SkyTabsetNavButtonHarness.with({
        buttonType: 'next',
      }),
    );

    await expectAsync(previousButton.isDisabled()).toBeResolvedTo(true);
    await expectAsync(nextButton.isDisabled()).toBeResolvedTo(true);
  });

  it('should enable the second step once the first step is complete', async () => {
    const { harness, loader, fixture } = await setupTest({
      dataSkyId: 'sign-up-wizard',
    });

    const tab1Harness = await harness.getActiveTabButton();

    // You can query the tab content harness' internal harnesses.
    const inputHarnesses = await (
      await tab1Harness?.getTabContentHarness()
    )?.queryHarnesses(SkyInputBoxHarness);
    expect(inputHarnesses?.length).toBe(3);

    fixture.componentInstance.formGroup.get('firstName')?.setValue('John');
    fixture.componentInstance.formGroup.get('lastName')?.setValue('Doe');
    fixture.detectChanges();

    // If changes in the test causes the tabset to swap to dropdown mode
    // open the dropdown to access tab button harnesses
    if ((await harness.getMode()) === 'dropdown') {
      await harness.clickDropdownTab();
    }

    const tab2 = await harness.getTabButtonHarness({
      tabHeading: '2. Contact Information',
    });
    expect(await tab2.isDisabled()).toBe(false);

    const nextButton = await loader.getHarness(
      SkyTabsetNavButtonHarness.with({ buttonType: 'next' }),
    );
    expect(await nextButton.isDisabled()).toBe(false);

    await nextButton.click();
    await expectAsync(tab2.isActive()).toBeResolvedTo(true);
  });
});
