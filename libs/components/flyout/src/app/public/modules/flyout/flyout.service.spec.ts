import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injector
} from '@angular/core';

import {
  inject,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyWindowRefService
} from '@skyux/core';

import { SkyFlyoutAdapterService } from './flyout-adapter.service';
import { SkyFlyoutService } from './flyout.service';

import {
  SkyFlyoutMessageType
} from './types';

describe('Flyout service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule
      ],
      providers: [
        SkyFlyoutService,
        {
          provide: SkyFlyoutAdapterService,
          useValue: {
            appendToBody() { },
            removeHostElement() { }
          }
        },
        {
          provide: ApplicationRef,
          useValue: {
            attachView() {},
            detachView() {}
          }
        },
        Injector,
        {
          provide: ComponentFactoryResolver,
          useValue: {
            resolveComponentFactory() {
              return {
                create() {
                  return {
                    destroy() {},
                    hostView: {
                      rootNodes: [
                        {}
                      ]
                    },
                    instance: {
                      messageStream: {
                        take() {
                          return {
                            subscribe() { }
                          };
                        },
                        next() {}
                      },
                      attach() {
                        return {
                          close() { },
                          closed: {
                            take() {
                              return {
                                subscribe() { }
                              };
                            }
                          }
                        };
                      }
                    }
                  };
                }
              };
            }
          }
        },
        SkyWindowRefService
      ]
    });
  });

  it('should only create a single host component', inject(
    [SkyFlyoutService],
    (service: SkyFlyoutService) => {
      const spy = spyOn(service as any, 'createHostComponent').and.callThrough();
      service.open({} as any);
      service.open({} as any);
      expect(spy.calls.count()).toEqual(1);
    }
  ));

  it('should return an instance with a close method', inject(
    [SkyFlyoutService],
    (service: SkyFlyoutService) => {
      const flyout = service.open({} as any);
      expect(typeof flyout.close).toEqual('function');
    }
  ));

  it('should expose a method to remove the flyout from the DOM', fakeAsync(inject(
    [SkyFlyoutService, SkyFlyoutAdapterService, ApplicationRef],
    (
      service: SkyFlyoutService,
      adapter: SkyFlyoutAdapterService,
      appRef: ApplicationRef
    ) => {
      service.open({} as any);
      tick();
      const spy = spyOn(service['host'].instance.messageStream, 'next').and.callThrough();
      service.close();
      tick();
      expect(spy).toHaveBeenCalledWith({
        type: SkyFlyoutMessageType.Close
      });
    }
  )));
});
