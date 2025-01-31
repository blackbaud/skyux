import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyErrorHarness } from '@skyux/errors/testing';

import { DemoComponent } from './demo.component';

describe('Embedded error demo', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    errorHarness: SkyErrorHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const errorHarness: SkyErrorHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyErrorHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyErrorHarness);

    return { errorHarness, fixture };
  }

  it('should set up the error', async () => {
    const { errorHarness, fixture } = await setupTest({
      dataSkyId: 'broken-error',
    });

    await expectAsync(errorHarness.getErrorType()).toBeResolvedTo('broken');

    await expectAsync(errorHarness.getTitle()).toBeResolvedTo("That's odd...");

    await expectAsync(errorHarness.getDescription()).toBeResolvedTo(
      'Something went wrong.\nTry again or come back later.',
    );

    await expectAsync(errorHarness.hasImage()).toBeResolvedTo(true);

    await expectAsync(errorHarness.getActionButtonText()).toBeResolvedTo(
      'Try again',
    );

    const actionSpy = spyOn(fixture.componentInstance, 'customAction');
    await errorHarness.clickActionButton();
    expect(actionSpy).toHaveBeenCalled();
  });
});
