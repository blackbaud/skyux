import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyErrorModalService } from '@skyux/errors';

import { SkyErrorModalHarness } from './error-modal-harness';

@Component({
  template: '',
  standalone: false,
})
class TestComponent {}

describe('Error modal harness', () => {
  function setupTest(): {
    rootLoader: HarnessLoader;
  } {
    const fixture = TestBed.createComponent(TestComponent);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    return { rootLoader };
  }

  it('should provide methods for interacting with the error modal', async () => {
    const { rootLoader } = setupTest();

    const errorModalSvc = TestBed.inject(SkyErrorModalService);

    errorModalSvc.open({
      errorCloseText: 'Close test',
      errorDescription: 'Description test',
      errorTitle: 'Title test',
    });

    const harness = await rootLoader.getHarness(SkyErrorModalHarness);

    await expectAsync(harness.getCloseText()).toBeResolvedTo('Close test');
    await expectAsync(harness.getDescription()).toBeResolvedTo(
      'Description test',
    );
    await expectAsync(harness.getTitle()).toBeResolvedTo('Title test');

    await harness.clickCloseButton();

    await expectAsync(
      rootLoader.getHarness(SkyErrorModalHarness),
    ).toBeRejected();
  });
});
