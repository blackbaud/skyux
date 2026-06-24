import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyModalHarness } from '@skyux/modals/testing';

import {
  SkyChartDataTableModal,
  SkyChartDataTableModalContext,
} from './chart-data-table-modal';

@Component({
  template: '',
})
class TestComponent {}

describe('Chart data table modal', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;
  let modalSvc: SkyModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    fixture = TestBed.createComponent(TestComponent);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    modalSvc = TestBed.inject(SkyModalService);
  });

  async function openModal(headingText: string): Promise<{
    instance: SkyModalInstance;
    modalHarness: SkyModalHarness;
  }> {
    const instance = modalSvc.open(SkyChartDataTableModal, {
      providers: [
        {
          provide: SkyChartDataTableModalContext,
          useValue: { headingText },
        },
      ],
    });

    const modalHarness = await loader.getHarness(SkyModalHarness);

    return { instance, modalHarness };
  }

  it('should display the heading text from the modal context', async () => {
    const { instance, modalHarness } = await openModal('My chart');

    await expectAsync(modalHarness.getHeadingText()).toBeResolvedTo('My chart');

    instance.close();
  });

  describe('a11y', () => {
    it('should be accessible', async () => {
      const { instance } = await openModal('My chart');

      await expectAsync(document.querySelector('.sky-modal')).toBeAccessible();

      instance.close();
    });
  });
});
