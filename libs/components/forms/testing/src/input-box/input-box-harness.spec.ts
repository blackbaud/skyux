import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { InputBoxHarnessTestComponent } from './fixtures/input-box-harness-test.component';
import { InputBoxHarnessTestModule } from './fixtures/input-box-harness-test.module';
import { LastNameHarness } from './fixtures/last-name-harness';
import { SkyInputBoxHarness } from './input-box-harness';

describe('Input box harness', () => {
  async function setupTest(options: { dataSkyId: string }) {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, InputBoxHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(InputBoxHarnessTestComponent);
    const component = fixture.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({
        dataSkyId: options.dataSkyId,
      })
    );

    return { component, fixture, inputBoxHarness };
  }

  it('should query child harnesses', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name',
    });

    const harness = await inputBoxHarness.queryHarness(LastNameHarness);

    await expectAsync(harness?.value()).toBeResolvedTo('Doe');
  });

  it('should return disabled', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    await expectAsync(inputBoxHarness.getDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.easyModeDisabled = true;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getDisabled()).toBeResolvedTo(true);
  });

  it('should return label text', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo(
      'Last name (easy mode)'
    );

    fixture.componentInstance.easyModeLabel = undefined;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo('');
  });

  it('should return help popover harness', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    // String content
    const helpPopover = await inputBoxHarness.getHelpPopover();
    await helpPopover.clickPopoverButton();

    const helpContent = await helpPopover.getPopoverContent();

    await expectAsync(helpContent.getBodyText()).toBeResolvedTo('Help content');
    await expectAsync(helpContent.getTitleText()).toBeResolvedTo('Help title');

    // Template content
    component.easyModeHelpContent = component.helpContentTemplate;
    fixture.detectChanges();

    await expectAsync(helpContent.getBodyText()).toBeResolvedTo(
      'Help content from template'
    );

    // No content
    component.easyModeHelpContent = undefined;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getHelpPopover()).toBeRejectedWithError(
      'The input box does not have a help popover configured.'
    );
  });

  it('should return stacked', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name-easy-mode',
    });

    await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(false);

    fixture.componentInstance.easyModeStacked = true;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(true);
  });
});
