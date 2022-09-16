import { TestBed } from '@angular/core/testing';
import { SkyLogService } from '@skyux/core';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { ErrorModalConfig } from './error-modal-config';
import { SkyErrorModalFormComponent } from './error-modal-form.component';
import { SkyErrorModalService } from './error-modal.service';
import { MockModalService } from './fixtures/mocks';

describe('Error modal service', () => {
  function createMockModalService() {
    return new MockModalService();
  }

  it('should open with correct parameters (log service undefined)', () => {
    const modalService = createMockModalService();

    const config: ErrorModalConfig = {
      errorTitle: 'Error title',
      errorDescription: 'Description of error',
      errorCloseText: 'Close button text',
    };

    const expectedProviders = [{ provide: ErrorModalConfig, useValue: config }];

    const logServiceSpy = spyOn(
      SkyLogService.prototype,
      'deprecated'
    ).and.stub();

    const service = new SkyErrorModalService(modalService as SkyModalService);
    service.open(config);

    expect(modalService.openCalls.length).toBe(1);
    expect(modalService.openCalls[0].component).toBe(
      SkyErrorModalFormComponent
    );

    // Since the log service was not provided the deprecation call should be skipped.
    expect(logServiceSpy).not.toHaveBeenCalled();

    // Uses the modalService Open overload that takes config
    // instead of providers (despite the property name)
    const modalConfig = modalService.openCalls[0]
      .providers as SkyModalConfigurationInterface;
    expect(modalConfig.ariaRole).toBe('alertdialog');
    expect(modalConfig.providers).toEqual(expectedProviders);
  });

  it('should open with correct parameters (log service defined)', () => {
    const modalService = createMockModalService();

    const config: ErrorModalConfig = {
      errorTitle: 'Error title',
      errorDescription: 'Description of error',
      errorCloseText: 'Close button text',
    };

    const expectedProviders = [{ provide: ErrorModalConfig, useValue: config }];

    const logServiceSpy = spyOn(
      SkyLogService.prototype,
      'deprecated'
    ).and.stub();

    const service = new SkyErrorModalService(
      modalService as SkyModalService,
      TestBed.inject(SkyLogService)
    );
    service.open(config);

    expect(modalService.openCalls.length).toBe(1);
    expect(modalService.openCalls[0].component).toBe(
      SkyErrorModalFormComponent
    );

    expect(logServiceSpy).toHaveBeenCalledWith(
      "SkyErrorModalService's open method",
      {
        deprecationMajorVersion: 6,
        replacementRecommendation:
          'We recommend using a standard modal with an error component instead.',
      }
    );

    // Uses the modalService Open overload that takes config
    // instead of providers (despite the property name)
    const modalConfig = modalService.openCalls[0]
      .providers as SkyModalConfigurationInterface;
    expect(modalConfig.ariaRole).toBe('alertdialog');
    expect(modalConfig.providers).toEqual(expectedProviders);
  });
});
