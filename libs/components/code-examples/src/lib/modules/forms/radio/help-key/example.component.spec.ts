import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyRadioGroupHarness } from '@skyux/forms/testing';

import { FormsRadioHelpKeyExampleComponent } from './example.component';

describe('Basic radio group example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    radioGroupHarness: SkyRadioGroupHarness;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(FormsRadioHelpKeyExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpController = TestBed.inject(SkyHelpTestingController);

    const radioGroupHarness = await loader.getHarness(
      SkyRadioGroupHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { radioGroupHarness, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsRadioHelpKeyExampleComponent,
        SkyHelpTestingModule,
      ],
    });
  });

  it('should have the appropriate heading text/level/style, label text, and hint text', async () => {
    const { radioGroupHarness } = await setupTest({ dataSkyId: 'radio-group' });

    const radioButtons = await radioGroupHarness.getRadioButtons();

    await expectAsync(radioGroupHarness.getHeadingText()).toBeResolvedTo(
      'Payment method',
    );
    await expectAsync(radioGroupHarness.getHeadingLevel()).toBeResolvedTo(4);
    await expectAsync(radioGroupHarness.getHeadingStyle()).toBeResolvedTo(4);
    await expectAsync(radioGroupHarness.getHintText()).toBeResolvedTo(
      'Card methods require proof of identification.',
    );

    await expectAsync(radioButtons[0].getLabelText()).toBeResolvedTo('Cash');
    await expectAsync(radioButtons[0].getHintText()).toBeResolvedTo('');

    await expectAsync(radioButtons[1].getLabelText()).toBeResolvedTo('Check');
    await expectAsync(radioButtons[1].getHintText()).toBeResolvedTo('');

    await expectAsync(radioButtons[2].getLabelText()).toBeResolvedTo(
      'Apple pay',
    );
    await expectAsync(radioButtons[2].getHintText()).toBeResolvedTo('');

    await expectAsync(radioButtons[3].getLabelText()).toBeResolvedTo('Credit');
    await expectAsync(radioButtons[3].getHintText()).toBeResolvedTo(
      'A 2% late fee is applied to payments made after the due date.',
    );

    await expectAsync(radioButtons[4].getLabelText()).toBeResolvedTo('Debit');
    await expectAsync(radioButtons[4].getHintText()).toBeResolvedTo('');
  });

  it('should display an error message when there is a custom validation error', async () => {
    const { radioGroupHarness } = await setupTest({ dataSkyId: 'radio-group' });

    const radioHarness = (await radioGroupHarness.getRadioButtons())[1];

    await radioHarness.check();

    await expectAsync(
      radioGroupHarness.hasError('processingIssue'),
    ).toBeResolvedTo(true);
  });

  it('should have the correct help key for radio group', async () => {
    const { radioGroupHarness, helpController } = await setupTest({
      dataSkyId: 'radio-group',
    });

    await radioGroupHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('payment-help');
  });

  it('should have the correct help key for radio', async () => {
    const { radioGroupHarness, helpController } = await setupTest({
      dataSkyId: 'radio-group',
    });
    const radioHarness = (await radioGroupHarness.getRadioButtons())[0];

    await radioHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('cash-help');
  });
});
