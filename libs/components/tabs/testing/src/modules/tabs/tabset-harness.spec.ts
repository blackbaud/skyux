import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyModalModule } from '@skyux/modals';
import { SkyPageModule } from '@skyux/pages';
import {
  SkyTabIndex,
  SkyTabsModule,
  SkyTabsetNavButtonType,
} from '@skyux/tabs';

import { SkyTabButtonHarness } from './tab-button-harness';
import { SkyTabsetHarness } from './tabset-harness';
import { SkyTabsetNavButtonHarness } from './tabset-nav-button-harness';

@Component({
  standalone: true,
  imports: [SkyTabsModule, SkyPageModule],
  template: `
    <sky-tabset
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [permalinkId]="permalinkId"
      (newTab)="tabAction()"
      (openTab)="tabAction()"
    >
      <sky-tab
        [tabHeading]="tabHeading"
        [permalinkValue]="permalinkValue"
        [tabIndexValue]="tabIndexValue"
        (close)="tabAction()"
      >
        Tab 1 Content
      </sky-tab>
      <sky-tab [tabHeading]="'Tab 2'"> Tab 2 Content </sky-tab>
      <sky-tab [tabHeading]="'Tab 3'"> Tab 3 Content </sky-tab>
      <sky-tab [tabHeading]="'Disabled tab'" [disabled]="true" />
    </sky-tabset>
    <sky-page layout="tabs">
      <sky-page-content>
        <sky-tabset data-sky-id="other-tabset">
          <sky-tab [tabHeading]="'Tab 1'" layout="blocks" />
        </sky-tabset>
      </sky-page-content>
    </sky-page>
  `,
})
class TestComponent {
  public active = false;
  public ariaLabel: string | undefined;
  public ariaLabelledBy: string | undefined;
  public permalinkId: string | undefined;
  public permalinkValue: string | undefined;
  public tabHeading: string | undefined = 'Tab 1';
  public tabIndexValue: SkyTabIndex | undefined;

  public tabAction(): void {
    // This function is for the spy.
  }
}

@Component({
  standalone: true,
  imports: [SkyTabsModule, SkyModalModule],
  template: `
    <sky-modal headingText="Modal title">
      <sky-modal-content>
        <sky-tabset #wizardTest tabStyle="wizard" ariaLabel="wizard">
          <sky-tab tabHeading="Tab 1"> Tab 1 content </sky-tab>
          <sky-tab tabHeading="Tab 2" [disabled]="isStep2Disabled">
            Tab 2 content
          </sky-tab>
          <sky-tab tabHeading="Tab 3" [disabled]="isStep3Disabled">
            Tab 3 content
          </sky-tab>
        </sky-tabset>
      </sky-modal-content>
      <sky-modal-footer>
        <sky-tabset-nav-button
          data-sky-id="previous-button"
          buttonType="previous"
          [tabset]="wizardTest"
        />
        <sky-tabset-nav-button buttonType="next" [tabset]="wizardTest" />
        <sky-tabset-nav-button
          buttonType="finish"
          [tabset]="wizardTest"
          [disabled]="isSaveDisabled"
        />
      </sky-modal-footer>
    </sky-modal>
  `,
})
class WizardTestComponent {
  public isStep2Disabled = true;
  public isStep3Disabled = true;
  public isSaveDisabled = true;
}

describe('Tab harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    tabsetHarness: SkyTabsetHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const tabsetHarness: SkyTabsetHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyTabsetHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyTabsetHarness);

    return { tabsetHarness, fixture };
  }

  it('should click the new tab button', async () => {
    const { tabsetHarness, fixture } = await setupTest();
    const newTabClickSpy = spyOn(fixture.componentInstance, 'tabAction');

    await tabsetHarness.clickNewTabButton();

    expect(newTabClickSpy).toHaveBeenCalled();
  });

  it('should throw an error if attempting to click new tab if it is not enabled', async () => {
    const { tabsetHarness } = await setupTest({
      dataSkyId: 'other-tabset',
    });

    await expectAsync(tabsetHarness.clickNewTabButton()).toBeRejectedWithError(
      'Unable to find the new tab button.',
    );
  });

  it('should click the open tab button', async () => {
    const { tabsetHarness, fixture } = await setupTest();
    const openTabClickSpy = spyOn(fixture.componentInstance, 'tabAction');

    await tabsetHarness.clickOpenTabButton();

    expect(openTabClickSpy).toHaveBeenCalled();
  });

  it('should throw an error if attempting to click open tab if it is not enabled', async () => {
    const { tabsetHarness } = await setupTest({
      dataSkyId: 'other-tabset',
    });

    await expectAsync(tabsetHarness.clickOpenTabButton()).toBeRejectedWithError(
      'Unable to find the open tab button.',
    );
  });

  it('should get aria-label', async () => {
    const { tabsetHarness, fixture } = await setupTest();
    fixture.componentInstance.ariaLabel = 'aria label';
    fixture.detectChanges();

    await expectAsync(tabsetHarness.getAriaLabel()).toBeResolvedTo(
      'aria label',
    );
  });

  it('should get aria-labelledby', async () => {
    const { tabsetHarness, fixture } = await setupTest();
    fixture.componentInstance.ariaLabelledBy = 'aria-labelledby';
    fixture.detectChanges();

    await expectAsync(tabsetHarness.getAriaLabelledBy()).toBeResolvedTo(
      'aria-labelledby',
    );
  });

  it('should get a tab button harness by tab heading', async () => {
    const { tabsetHarness } = await setupTest();
    const tabOne = await tabsetHarness.getTabButtonHarness('Tab 1');

    await expectAsync(tabOne.getTabHeading()).toBeResolvedTo('Tab 1');
  });

  it('should get all tab button harnesses', async () => {
    const { tabsetHarness } = await setupTest();
    const tabs = await tabsetHarness.getTabButtonHarnesses();

    expect(tabs.length).toBe(4);
  });

  it('should get tab button harnesses that matches given filters', async () => {
    const { tabsetHarness } = await setupTest();
    const tabs = await tabsetHarness.getTabButtonHarnesses({
      tabHeading: 'Tab 2',
    });

    expect(tabs.length).toBe(1);
    await expectAsync(tabs[0].getTabHeading()).toBeResolvedTo('Tab 2');
  });

  it('should throw error when tab button harnesses with filters not found', async () => {
    const { tabsetHarness } = await setupTest();
    const filter = { tabHeading: 'Non-existent' };

    await expectAsync(
      tabsetHarness.getTabButtonHarnesses(filter),
    ).toBeRejectedWithError(
      `Unable to find any tab buttons with filter(s): ${JSON.stringify(filter)}`,
    );
  });

  it('should get a tab button with filters', async () => {
    const { tabsetHarness } = await setupTest();
    const tab = await tabsetHarness.getTabButton({ tabHeading: 'Tab 3' });

    await expectAsync(tab.getTabHeading()).toBeResolvedTo('Tab 3');
  });

  it('should throw error when single tab button with filters not found', async () => {
    const { tabsetHarness } = await setupTest();

    await expectAsync(
      tabsetHarness.getTabButton({ tabHeading: 'Non-existent' }),
    ).toBeRejectedWithError();
  });

  it('should get the active tab button', async () => {
    const { tabsetHarness } = await setupTest();
    const activeTab = await tabsetHarness.getActiveTabButton();

    await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo('Tab 1');
  });

  it('should get the mode when tab', async () => {
    const { tabsetHarness } = await setupTest();

    await expectAsync(tabsetHarness.getMode()).toBeResolvedTo('tabs');
  });

  it('should get the mode when dropdown', async () => {
    const { tabsetHarness, fixture } = await setupTest();
    fixture.nativeElement.style.width = '50px';
    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(tabsetHarness.getMode()).toBeResolvedTo('dropdown');
  });

  it('should get the tab content harness from tab heading', async () => {
    const { tabsetHarness } = await setupTest();
    let tabContentHarness = await tabsetHarness.getTabContentHarness('Tab 1');
    await expectAsync(tabContentHarness.isVisible()).toBeResolvedTo(true);
    tabContentHarness = await tabsetHarness.getTabContentHarness('Tab 2');
    await expectAsync(tabContentHarness.isVisible()).toBeResolvedTo(false);
  });

  it('should get the tab layout in pages', async () => {
    const { tabsetHarness } = await setupTest({ dataSkyId: 'other-tabset' });
    const tabContentHarness = await tabsetHarness.getTabContentHarness('Tab 1');
    await expectAsync(tabContentHarness.getLayout()).toBeResolvedTo('blocks');
  });

  it('should get the default tab layout', async () => {
    const { tabsetHarness } = await setupTest();
    const tabContentHarness = await tabsetHarness.getTabContentHarness('Tab 1');
    await expectAsync(tabContentHarness.getLayout()).toBeResolvedTo('none');
  });

  it('should click a tab', async () => {
    const { tabsetHarness } = await setupTest();
    await expectAsync(
      (await tabsetHarness.getActiveTabButton())?.getTabHeading(),
    ).toBeResolvedTo('Tab 1');

    await tabsetHarness.clickTabButton('Tab 2');
    await expectAsync(
      (await tabsetHarness.getActiveTabButton())?.getTabHeading(),
    ).toBeResolvedTo('Tab 2');
  });

  it('should get if the tabstyle is wizard', async () => {
    const { tabsetHarness } = await setupTest();
    await expectAsync(tabsetHarness.isWizardTabset()).toBeResolvedTo(false);
  });

  describe('tab button harness', () => {
    async function setupTabButtonTest(tabHeading: string): Promise<{
      tabButtonHarness: SkyTabButtonHarness;
      tabsetHarness: SkyTabsetHarness;
      fixture: ComponentFixture<TestComponent>;
    }> {
      const { tabsetHarness, fixture } = await setupTest();
      const tabButtonHarness =
        await tabsetHarness.getTabButtonHarness(tabHeading);
      return { tabButtonHarness, tabsetHarness, fixture };
    }

    it('should click the tab button and change the active tab', async () => {
      const { tabButtonHarness } = await setupTabButtonTest('Tab 2');
      await expectAsync(tabButtonHarness.isActive()).toBeResolvedTo(false);
      await tabButtonHarness.click();
      await expectAsync(tabButtonHarness.isActive()).toBeResolvedTo(true);
    });

    it('should get the permalink for a tab button', async () => {
      const { tabButtonHarness, fixture } = await setupTabButtonTest('Tab 1');
      fixture.componentInstance.permalinkId = 'test-tab';
      fixture.componentInstance.permalinkValue = 'tab-1';
      fixture.detectChanges();

      await expectAsync(tabButtonHarness.getPermalink()).toBeResolvedTo(
        '/?test-tab-active-tab=tab-1',
      );
    });

    it('should get when tab is disabled', async () => {
      const { tabButtonHarness } = await setupTabButtonTest('Disabled tab');
      await expectAsync(tabButtonHarness.isDisabled()).toBeResolvedTo(true);
    });

    it('should get when tab is not disabled', async () => {
      const { tabButtonHarness } = await setupTabButtonTest('Tab 1');
      await expectAsync(tabButtonHarness.isDisabled()).toBeResolvedTo(false);
    });

    it('should get a tab content harness', async () => {
      const { tabButtonHarness } = await setupTabButtonTest('Tab 1');
      const tabContentHarness = await tabButtonHarness.getTabContentHarness();
      await expectAsync(tabContentHarness.isVisible()).toBeResolvedTo(true);
    });

    it('should throw an error if trying to click dropdown when not in dropdown mode', async () => {
      const { tabsetHarness } = await setupTest();
      await expectAsync(tabsetHarness.clickDropdownTab()).toBeRejectedWithError(
        'Cannot click dropdown tab button, tab is not in dropdown mode.',
      );
    });

    it('should throw an error if trying to close a tab with no close button', async () => {
      const { tabButtonHarness } = await setupTabButtonTest('Tab 2');
      await expectAsync(
        tabButtonHarness.clickRemoveButton(),
      ).toBeRejectedWithError('Unable to find remove tab button.');
    });

    it('should click close button', async () => {
      const { tabButtonHarness, fixture } = await setupTabButtonTest('Tab 1');
      const closeClickSpy = spyOn(fixture.componentInstance, 'tabAction');
      await tabButtonHarness.clickRemoveButton();
      expect(closeClickSpy).toHaveBeenCalled();
    });

    it('should get if the tab button is inside a wizard tabset', async () => {
      const { tabButtonHarness } = await setupTabButtonTest('Tab 1');
      await expectAsync(tabButtonHarness.isInWizardTabset()).toBeResolvedTo(
        false,
      );
    });
  });

  describe('in dropdown mode', () => {
    async function shrinkScreen(
      fixture: ComponentFixture<TestComponent>,
    ): Promise<void> {
      fixture.nativeElement.style.width = '50px';
      SkyAppTestUtility.fireDomEvent(window, 'resize');
      fixture.detectChanges();
      await fixture.whenStable();
    }
    it('should click dropdown tab', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      await shrinkScreen(fixture);
      await expectAsync(tabsetHarness.clickDropdownTab()).toBeResolved();
    });

    it('should get a tab button harness from tab heading', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      await shrinkScreen(fixture);
      await tabsetHarness.clickDropdownTab();
      const tabButtonHarness = await tabsetHarness.getTabButtonHarness('Tab 1');

      await expectAsync(tabButtonHarness.isActive()).toBeResolvedTo(true);
    });

    it('should get all tab button harnesses', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      await shrinkScreen(fixture);
      await tabsetHarness.clickDropdownTab();
      const tabButtonHarnesses = await tabsetHarness.getTabButtonHarnesses();
      expect(tabButtonHarnesses.length).toBe(4);
    });

    it('should get tab button harnesses with filters in dropdown mode', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      await shrinkScreen(fixture);
      await tabsetHarness.clickDropdownTab();
      const tabs = await tabsetHarness.getTabButtonHarnesses({
        tabHeading: 'Tab 2',
      });

      expect(tabs.length).toBe(1);
      await expectAsync(tabs[0].getTabHeading()).toBeResolvedTo('Tab 2');
    });

    it('should throw error when tab button harnesses with filters not found in dropdown mode', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      await shrinkScreen(fixture);
      await tabsetHarness.clickDropdownTab();

      await expectAsync(
        tabsetHarness.getTabButtonHarnesses({ tabHeading: 'Non-existent' }),
      ).toBeRejectedWithError(
        `Unable to find any tab buttons with filter(s): {"tabHeading":"Non-existent"}`,
      );
    });

    it('should get a tab button with filters in dropdown mode', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      await shrinkScreen(fixture);
      await tabsetHarness.clickDropdownTab();
      const tab = await tabsetHarness.getTabButton({ tabHeading: 'Tab 3' });

      await expectAsync(tab.getTabHeading()).toBeResolvedTo('Tab 3');
    });

    it('should throw an error when trying to get tab buttons when dropdown is closed', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      await shrinkScreen(fixture);
      await expectAsync(
        tabsetHarness.getTabButtonHarnesses(),
      ).toBeRejectedWithError(
        'Cannot get tab button when tabs is in dropdown mode and is closed.',
      );
    });
  });
});

describe('Wizard tab harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    wizardHarness: SkyTabsetHarness;
    fixture: ComponentFixture<WizardTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(WizardTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const wizardHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyTabsetHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyTabsetHarness);

    return { wizardHarness, fixture };
  }

  it('should get if the tabset is a wizard tabset', async () => {
    const { wizardHarness } = await setupTest();
    await expectAsync(wizardHarness.isWizardTabset()).toBeResolvedTo(true);
  });

  it('should throw an error if attempting to click new tab in wizard mode', async () => {
    const { wizardHarness } = await setupTest();
    await expectAsync(wizardHarness.clickNewTabButton()).toBeRejectedWithError(
      'Cannot use new tab button in a wizard tabset.',
    );
  });

  it('should throw an error if attempting to click open tab in wizard mode', async () => {
    const { wizardHarness } = await setupTest();
    await expectAsync(wizardHarness.clickOpenTabButton()).toBeRejectedWithError(
      'Cannot use open tab button in a wizard tabset.',
    );
  });

  describe('tab button harness', () => {
    it('should throw an error if trying to click remove tab button in wizard mode', async () => {
      const { wizardHarness } = await setupTest();
      const tabButtonHarness = await wizardHarness.getTabButtonHarness('Tab 1');
      await expectAsync(
        tabButtonHarness.clickRemoveButton(),
      ).toBeRejectedWithError(
        'Cannot use remove tab button in a wizard tabset.',
      );
    });

    it('should throw an error if attempting to get the permalink in wizard mode', async () => {
      const { wizardHarness } = await setupTest();
      const tabButtonHarness = await wizardHarness.getTabButtonHarness('Tab 1');
      await expectAsync(tabButtonHarness.getPermalink()).toBeRejectedWithError(
        'Cannot get permalink for tab button in a wizard tabset.',
      );
    });
  });

  describe('nav button harness', () => {
    async function setupTabButtonTest(
      options: { dataSkyId?: string; buttonType?: SkyTabsetNavButtonType } = {},
      fixture: ComponentFixture<WizardTestComponent>,
    ): Promise<{
      navButtonHarness: SkyTabsetNavButtonHarness;
      loader: HarnessLoader;
    }> {
      const loader = TestbedHarnessEnvironment.loader(fixture);
      const navButtonHarness = options.dataSkyId
        ? await loader.getHarness(
            SkyTabsetNavButtonHarness.with({ dataSkyId: options.dataSkyId }),
          )
        : options.buttonType
          ? await loader.getHarness(
              SkyTabsetNavButtonHarness.with({
                buttonType: options.buttonType,
              }),
            )
          : await loader.getHarness(SkyTabsetNavButtonHarness);
      return { navButtonHarness, loader };
    }

    it('should get the nav button from data-sky-id', async () => {
      const { fixture } = await setupTest();
      const { navButtonHarness } = await setupTabButtonTest(
        { dataSkyId: 'previous-button' },
        fixture,
      );
      await expectAsync(navButtonHarness.getButtonText()).toBeResolvedTo(
        'Previous',
      );
    });

    it('should get the nav button from button type', async () => {
      const { fixture } = await setupTest();
      const { navButtonHarness } = await setupTabButtonTest(
        { buttonType: 'next' },
        fixture,
      );
      await expectAsync(navButtonHarness.getButtonText()).toBeResolvedTo(
        'Next',
      );
    });

    it('should click the nav button', async () => {
      const { wizardHarness, fixture } = await setupTest();
      const { navButtonHarness } = await setupTabButtonTest(
        { buttonType: 'next' },
        fixture,
      );

      fixture.componentInstance.isStep2Disabled = false;
      fixture.detectChanges();

      let activeTab = await wizardHarness.getActiveTabButton();
      await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo('Tab 1');
      await navButtonHarness.click();
      activeTab = await wizardHarness.getActiveTabButton();
      await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo('Tab 2');
    });

    it('should get if the button is disabled', async () => {
      const { fixture, wizardHarness } = await setupTest();
      const { navButtonHarness, loader } = await setupTabButtonTest(
        { buttonType: 'next' },
        fixture,
      );

      fixture.componentInstance.isStep2Disabled = false;
      fixture.componentInstance.isStep3Disabled = false;
      fixture.detectChanges();

      await navButtonHarness.click();
      await navButtonHarness.click();

      await expectAsync(
        (await wizardHarness.getActiveTabButton())?.getTabHeading(),
      ).toBeResolvedTo('Tab 3');

      const finishButton = await loader.getHarness(
        SkyTabsetNavButtonHarness.with({ buttonType: 'finish' }),
      );

      await expectAsync(finishButton.isDisabled()).toBeResolvedTo(true);

      fixture.componentInstance.isSaveDisabled = false;
      fixture.detectChanges();

      await expectAsync(finishButton.isDisabled()).toBeResolvedTo(false);
    });
  });
});
