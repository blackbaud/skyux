import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyErrorHarness } from './error-harness';
import { ErrorHarnessTestComponent } from './fixtures/error-harness-test.component';

describe('Error test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    errorHarness: SkyErrorHarness;
    fixture: ComponentFixture<ErrorHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [ErrorHarnessTestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ErrorHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const errorHarness: SkyErrorHarness = await getHarness(loader, options);

    return { errorHarness, fixture, loader };
  }

  async function getHarness(
    loader: HarnessLoader,
    options: { dataSkyId?: string } = {},
  ): Promise<SkyErrorHarness> {
    return options.dataSkyId
      ? await loader.getHarness(
          SkyErrorHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyErrorHarness);
  }

  it('should get the error by data-sky-id and return the error type', async () => {
    // eslint-disable-next-line prefer-const
    let { errorHarness, fixture, loader } = await setupTest({
      dataSkyId: 'broken-error',
    });
    await expectAsync(errorHarness.getErrorType()).toBeResolvedTo('broken');

    errorHarness = await getHarness(loader, { dataSkyId: 'not-found-error' });
    await expectAsync(errorHarness.getErrorType()).toBeResolvedTo('notfound');

    errorHarness = await getHarness(loader, {
      dataSkyId: 'construction-error',
    });
    await expectAsync(errorHarness.getErrorType()).toBeResolvedTo(
      'construction',
    );

    errorHarness = await getHarness(loader, { dataSkyId: 'security-error' });
    await expectAsync(errorHarness.getErrorType()).toBeResolvedTo('security');

    errorHarness = await getHarness(loader, { dataSkyId: 'custom-error' });
    await expectAsync(errorHarness.getErrorType()).toBeResolvedTo(undefined);

    errorHarness = await getHarness(loader, { dataSkyId: 'dynamic-error' });
    await expectAsync(errorHarness.getErrorType()).toBeResolvedTo('broken');

    fixture.componentInstance.errorType = 'construction';
    fixture.detectChanges();

    await expectAsync(errorHarness.getErrorType()).toBeResolvedTo(
      'construction',
    );
  });

  it('should get the error title and description', async () => {
    const { errorHarness } = await setupTest({ dataSkyId: 'broken-error' });

    await expectAsync(errorHarness.getTitle()).toBeResolvedTo("That's odd...");
    await expectAsync(errorHarness.getDescription()).toBeResolvedTo(
      'Something went wrong.\nTry again or come back later.',
    );
  });

  it('should indicate if the error displays an image', async () => {
    const { errorHarness, fixture } = await setupTest({
      dataSkyId: 'dynamic-error',
    });

    await expectAsync(errorHarness.hasImage()).toBeResolvedTo(true);

    fixture.componentInstance.errorType = undefined;
    fixture.detectChanges();

    await expectAsync(errorHarness.hasImage()).toBeResolvedTo(false);
  });

  it('should return an error image harness', async () => {
    const { errorHarness } = await setupTest({
      dataSkyId: 'custom-error',
    });

    await expectAsync(errorHarness.getErrorImage()).toBeResolved();
  });

  it('should throw an error if no error image is found', async () => {
    const { errorHarness, fixture } = await setupTest({
      dataSkyId: 'dynamic-error',
    });

    fixture.componentInstance.errorType = undefined;

    await expectAsync(errorHarness.getErrorImage()).toBeRejectedWithError(
      'Unable to find error image.',
    );
  });

  it('should return an error action harness', async () => {
    const { errorHarness } = await setupTest({
      dataSkyId: 'dynamic-error',
    });

    await expectAsync(errorHarness.getErrorAction()).toBeResolved();
  });

  it('should throw an error if no error action is found', async () => {
    const { errorHarness, fixture } = await setupTest({
      dataSkyId: 'dynamic-error',
    });

    fixture.componentInstance.errorType = undefined;

    await expectAsync(errorHarness.getErrorAction()).toBeRejectedWithError(
      'Unable to find error action.',
    );
  });

  it('should interact with an action button', async () => {
    const { errorHarness, fixture } = await setupTest({
      dataSkyId: 'broken-error',
    });

    await expectAsync(errorHarness.getActionButtonText()).toBeResolvedTo(
      'Try again',
    );

    const actionSpy = spyOn(fixture.componentInstance, 'customAction');

    await errorHarness.clickActionButton();

    expect(actionSpy).toHaveBeenCalled();
  });

  it('should throw an error if no action button is found', async () => {
    const { errorHarness, fixture } = await setupTest({
      dataSkyId: 'dynamic-error',
    });

    fixture.componentInstance.errorType = undefined;

    await expectAsync(errorHarness.clickActionButton()).toBeRejectedWithError(
      'Unable to find error action button.',
    );
  });
});
