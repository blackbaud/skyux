import {
  DestroyRef,
  EnvironmentInjector,
  FactoryProvider,
  createEnvironmentInjector,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SKY_STACKING_CONTEXT, SkyStackingContextService } from '@skyux/core';

import { of } from 'rxjs';

import { SkyModalHostService } from './modal-host.service';

describe('Modal host service', () => {
  function provideTestStackingContext(): FactoryProvider {
    return {
      provide: SKY_STACKING_CONTEXT,
      useFactory: (
        service: SkyStackingContextService,
        destroyRef: DestroyRef,
      ) => ({ zIndex: of(service.getZIndex('modal', destroyRef)) }),
      deps: [SkyStackingContextService, DestroyRef],
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTestStackingContext()],
    });
  });

  it('should return a modal z-index that is greater than the backdrop z-index', () => {
    const service = TestBed.inject(SkyModalHostService, undefined);

    expect(service.zIndex).toBeGreaterThan(SkyModalHostService.backdropZIndex);
    service.destroy();
  });

  it('should increment the modal z-index values when a new instance is created', () => {
    const service1 = TestBed.inject(SkyModalHostService);
    const service2 = createEnvironmentInjector(
      [SkyModalHostService, provideTestStackingContext()],
      TestBed.inject(EnvironmentInjector),
    ).get(SkyModalHostService, undefined, {
      self: true,
    });

    expect(service2.getModalZIndex()).toBeGreaterThan(
      service1.getModalZIndex(),
    );

    service1.destroy();
    service2.destroy();
  });

  it('should decrement the backdrop z-index when an instance is destroyed', () => {
    const service1 = TestBed.inject(SkyModalHostService);
    const service2 = createEnvironmentInjector(
      [SkyModalHostService, provideTestStackingContext()],
      TestBed.inject(EnvironmentInjector),
    ).get(SkyModalHostService, undefined, {
      self: true,
    });

    const twoModalBackdropZIndex = SkyModalHostService.backdropZIndex;

    service2.destroy();

    expect(SkyModalHostService.backdropZIndex).toBe(
      twoModalBackdropZIndex - 1000,
    );

    service1.destroy();
  });

  it('should provide a count of open modals', () => {
    expect(SkyModalHostService.openModalCount).toBe(0);

    const service1 = TestBed.inject(SkyModalHostService);
    const service2 = createEnvironmentInjector(
      [SkyModalHostService, provideTestStackingContext()],
      TestBed.inject(EnvironmentInjector),
    ).get(SkyModalHostService, undefined, {
      self: true,
    });

    expect(SkyModalHostService.openModalCount).toBe(2);

    service2.destroy();

    expect(SkyModalHostService.openModalCount).toBe(1);

    service1.destroy();
  });

  it('should notify subscribers when a modal is closed', () => {
    const service = TestBed.inject(SkyModalHostService);
    let closeEmitted = false;

    service.close.subscribe(() => {
      closeEmitted = true;
    });

    service.onClose();

    expect(closeEmitted).toBe(true);
    service.destroy();
  });

  it('should notify subscribers when the help header button is clicked', () => {
    const testHelpKey = 'test-key.html';
    let helpKey = '';
    let helpClicked = false;

    const service = TestBed.inject(SkyModalHostService);

    service.openHelp.subscribe((key: string) => {
      helpClicked = true;
      helpKey = key;
    });

    service.onOpenHelp(testHelpKey);

    expect(helpClicked).toBe(true);
    expect(helpKey).toBe(testHelpKey);

    service.destroy();
  });
});
