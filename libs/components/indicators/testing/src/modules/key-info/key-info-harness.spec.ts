import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { KeyInfoHarnessTestComponent } from './fixtures/key-info-harness-test.component';
import { KeyInfoHarnessTestModule } from './fixtures/key-info-harness-test.module';
import { SkyKeyInfoHarness } from './key-info-harness';

describe('Key Info harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    fixture: ComponentFixture<KeyInfoHarnessTestComponent>;
    keyInfoHarness: SkyKeyInfoHarness;
  }> {
    const fixture = TestBed.createComponent(KeyInfoHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const keyInfoHarness = await loader.getHarness(
      SkyKeyInfoHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { fixture, keyInfoHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeyInfoHarnessTestModule, SkyHelpTestingModule],
    });
  });

  it('should return properties for a horizontal layout', async () => {
    const { keyInfoHarness } = await setupTest({
      dataSkyId: 'horizontal-key-info',
    });

    await expectAsync(keyInfoHarness.getLayout()).toBeResolvedTo('horizontal');
    await expectAsync(keyInfoHarness.getValueText()).toBeResolvedTo('200');
    await expectAsync(keyInfoHarness.getLabelText()).toBeResolvedTo(
      'Horizontal label',
    );
  });

  it('should return properties for a vertical layout', async () => {
    const { keyInfoHarness } = await setupTest({
      dataSkyId: 'vertical-key-info',
    });

    await expectAsync(keyInfoHarness.getLayout()).toBeResolvedTo('vertical');
    await expectAsync(keyInfoHarness.getValueText()).toBeResolvedTo('100');
    await expectAsync(keyInfoHarness.getLabelText()).toBeResolvedTo(
      'Vertical label',
    );
  });

  it('should click help inline button and get popover content', async () => {
    const { keyInfoHarness, fixture } = await setupTest({
      dataSkyId: 'help-popover-key-info',
    });

    await keyInfoHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(keyInfoHarness.getHelpPopoverContent()).toBeResolvedTo(
      'This is help content.',
    );
  });

  it('should get help popover title', async () => {
    const { keyInfoHarness, fixture } = await setupTest({
      dataSkyId: 'help-popover-key-info',
    });

    await keyInfoHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(keyInfoHarness.getHelpPopoverTitle()).toBeResolvedTo(
      'Help Title',
    );
  });

  it('should work with help key', async () => {
    const { keyInfoHarness } = await setupTest({
      dataSkyId: 'help-key-key-info',
    });

    const helpController = TestBed.inject(SkyHelpTestingController);

    // Should be able to click the help button and trigger global help
    await keyInfoHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('test-help-key');
  });

  it('should throw error when no help inline is found', async () => {
    const { keyInfoHarness } = await setupTest({
      dataSkyId: 'no-help-key-info',
    });

    await expectAsync(keyInfoHarness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
    await expectAsync(
      keyInfoHarness.getHelpPopoverContent(),
    ).toBeRejectedWithError('No help inline found.');
    await expectAsync(
      keyInfoHarness.getHelpPopoverTitle(),
    ).toBeRejectedWithError('No help inline found.');
  });
});
