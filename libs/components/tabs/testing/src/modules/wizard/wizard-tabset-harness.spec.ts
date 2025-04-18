import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyModalModule } from '@skyux/modals';
import { SkyTabsModule } from '@skyux/tabs';

import { SkyWizardTabsetHarness } from './wizard-tabset-harness';

@Component({
  standalone: true,
  imports: [SkyTabsModule, SkyModalModule],
  template: `
    <sky-modal headingText="Modal title">
      <sky-modal-content>
        <sky-tabset #wizardTest tabstyle="wizard">
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
        <sky-tabset-nav-button buttonType="previous" [tabset]="wizardTest" />
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
class TestComponent {
  public isStep2Disabled = true;
  public isStep3Disabled = true;
  public isSaveDisabled = true;
}

fdescribe('Wizard tabset harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    wizardHarness: SkyWizardTabsetHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const wizardHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyWizardTabsetHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyWizardTabsetHarness);

    return { wizardHarness, fixture };
  }

  it('should get the wizard', async () => {
    const { wizardHarness } = await setupTest();
    const tabHarness = await wizardHarness.getActiveTabButton();
    await expectAsync(tabHarness?.getTabHeading()).toBeResolvedTo('Tab 1');
  });
});
