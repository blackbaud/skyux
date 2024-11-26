import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyFileAttachmentHarness } from '@skyux/forms/testing';

import { DemoComponent } from './demo.component';

fdescribe('Basic file attachment demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyFileAttachmentHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyFileAttachmentHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    });
  });

  it('should set initial value', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'birth-certificate',
    });

    await expectAsync(harness.getLabelText()).toBeResolvedTo(
      'Birth certificate',
    );
    await expectAsync(harness.getHintText()).toBeResolvedTo(
      'Attach a .pdf, .gif, .png, or .jpeg file.',
    );
    await expectAsync(harness.getAcceptedTypes()).toBeResolvedTo(
      'application/pdf,image/jpeg,image/png,image/gif',
    );

    // await harness.clickHelpInline();

    // await expectAsync(harness.getHelpPopoverTitle()).toBeResolvedTo(
    //   'Requirements',
    // );
  });

  fit('should throw throw an error if file begins with the letter a', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'birth-certificate',
    });

    const file = new File([], 'afile.png', { type: 'image/png' });
    await harness.uploadFile(file);

    await expectAsync(
      harness.hasCustomError('invalidStartingLetter'),
    ).toBeResolvedTo(true);
  });

  it('should set file attachment to required', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'birth-certificate',
    });

    await expectAsync(harness.isRequired()).toBeResolvedTo(true);

    // NOTES TO JW: this does not work bc something is either busted with file attachment CVA
    // or it's deliberate and we gotta give consumers another way to set file attachment values.
    await harness.uploadFile(null);

    await expectAsync(harness.hasRequiredError()).toBeResolvedTo(true);
  });
});
