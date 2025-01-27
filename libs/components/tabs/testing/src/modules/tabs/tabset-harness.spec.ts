import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyTabIndex, SkyTabsModule } from '@skyux/tabs';

import { SkyTabButtonHarness } from './tab-button-harness';
import { SkyTabsetHarness } from './tabset-harness';

@Component({
  standalone: true,
  imports: [SkyTabsModule],
  template: `
    <sky-tabset
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [permalinkId]="permalinkId"
      (newTab)="newTabAction()"
      (openTab)="openTabAction()"
    >
      <sky-tab
        [tabHeading]="tabHeading"
        [permalinkValue]="permalinkValue"
        [tabIndexValue]="tabIndexValue"
      >
        Tab 1 Content
      </sky-tab>
      <sky-tab [tabHeading]="'Tab 2'"> Tab 2 Content </sky-tab>
      <sky-tab [tabHeading]="'Tab 3'"> Tab 3 Content </sky-tab>
      <sky-tab [tabHeading]="'Disabled tab'" [disabled]="true" />
    </sky-tabset>
    <sky-tabset data-sky-id="other-tabset">
      <sky-tab [tabHeading]="'Tab 1'" />
    </sky-tabset>
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

  public newTabAction(): void {
    // This function is for the spy.
  }

  public openTabAction(): void {
    // This function is for the spy.
  }
}

fdescribe('Tab harness', () => {
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
    const newTabClickSpy = spyOn(fixture.componentInstance, 'newTabAction');

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
    const openTabClickSpy = spyOn(fixture.componentInstance, 'openTabAction');

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

  it('should get the tab harness from tab heading', async () => {
    const { tabsetHarness } = await setupTest();
    let tabHarness = await tabsetHarness.getTabHarness('Tab 1');
    await expectAsync(tabHarness.isVisible()).toBeResolvedTo(true);
    tabHarness = await tabsetHarness.getTabHarness('Tab 2');
    await expectAsync(tabHarness.isVisible()).toBeResolvedTo(false);
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

    it('should get a tab harness', async () => {
      const { tabButtonHarness } = await setupTabButtonTest('Tab 1');
      const tabHarness = await tabButtonHarness.getTabHarness();
      await expectAsync(tabHarness.isVisible()).toBeResolvedTo(true);
    });
  });
});
