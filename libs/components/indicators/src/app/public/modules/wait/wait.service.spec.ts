import {
  ApplicationRef
} from '@angular/core';

import {
  TestBed,
  inject,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  SkyWaitFixturesModule
} from './fixtures/wait-fixtures.module';

import {
  SkyWaitService
} from './wait.service';

import {
  SkyWindowRefService
} from '@skyux/core';

describe('Wait service', () => {
  let waitService: SkyWaitService;
  let applicationRef: ApplicationRef;

  let pageBlockingSelector =
    '.sky-wait-page .sky-wait-mask-loading-fixed.sky-wait-mask-loading-blocking';
  let pageNonBlockingSelector =
    '.sky-wait-page .sky-wait-mask-loading-fixed.sky-wait-mask-loading-non-blocking';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyWaitFixturesModule
      ]
    });
  });

  beforeEach(
    inject(
      [
        ApplicationRef,
        SkyWaitService,
        SkyWindowRefService
      ],
      (
        _applicationRef: ApplicationRef,
        _waitService: SkyWaitService
      ) => {
        applicationRef = _applicationRef;
        waitService = _waitService;
        waitService.dispose();
      }
    )
  );

  function verifyBlockingPageWaitExists(doesExist: boolean) {
    if (doesExist) {
      expect(document.body.querySelector(pageBlockingSelector)).not.toBeNull();
      expect(document.body.querySelectorAll(pageBlockingSelector).length).toBe(1);
    } else {
      expect(document.body.querySelector(pageBlockingSelector)).toBeNull();
    }
  }

  function verifyNonBlockingPageWaitExists(doesExist: boolean) {
    if (doesExist) {
      expect(document.body.querySelector(pageNonBlockingSelector)).not.toBeNull();
      expect(document.body.querySelectorAll(pageNonBlockingSelector).length).toBe(1);
    } else {
      expect(document.body.querySelector(pageNonBlockingSelector)).toBeNull();
    }
  }

  it('should add a blocking page wait when beginPageWait is called with isBlocking true',
    fakeAsync(() => {
    waitService.beginBlockingPageWait();
    tick();
    applicationRef.tick();

    verifyBlockingPageWaitExists(true);

    waitService.beginBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(true);

    waitService.endBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(true);

    waitService.endBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(false);

  }));

  it('should block tab navigation when a blocking page wait is active', fakeAsync(() => {
    waitService.beginBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(true);

    let button = document.body.querySelector('button');
    let event = Object.assign(document.createEvent('CustomEvent'), { relatedTarget: document.body });
    event.initEvent('focusin', true, true);
    button.dispatchEvent(event);

    expect(document.activeElement).toBe(document.body);
  }));

  it('should add a nonblocking page wait when beginPageWait is called with isBlocking false',
    fakeAsync(() => {
    waitService.beginNonBlockingPageWait();
    tick();
    applicationRef.tick();

    verifyNonBlockingPageWaitExists(true);

    waitService.beginNonBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(true);

    waitService.endNonBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(true);

    waitService.endNonBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);
  }));

  it('do nothing if wait component not created and endPageWait is called', fakeAsync(() => {
    waitService.endNonBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);
  }));

  it('not drop counts below zero', fakeAsync(() => {
    waitService.beginNonBlockingPageWait();
    tick();
    applicationRef.tick();

    verifyNonBlockingPageWaitExists(true);

    waitService.endNonBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);

    waitService.endNonBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);

    waitService.beginNonBlockingPageWait();
    tick();
    applicationRef.tick();

    verifyNonBlockingPageWaitExists(true);

    waitService.endBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(false);

    waitService.beginBlockingPageWait();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(true);
  }));

  it('should clear appropriate waits when clearPageWait is called', fakeAsync(() => {
    waitService.beginNonBlockingPageWait();
    tick();
    applicationRef.tick();

    waitService.beginBlockingPageWait();
    tick();
    applicationRef.tick();

    waitService.clearAllPageWaits();
    tick();
    applicationRef.tick();

    verifyNonBlockingPageWaitExists(false);
    verifyBlockingPageWaitExists(false);
  }));

  it('should clear wait even if closed too fast', fakeAsync(() => {
    waitService.beginNonBlockingPageWait();
    waitService.clearAllPageWaits();
    tick();

    verifyNonBlockingPageWaitExists(false);
    verifyBlockingPageWaitExists(false);
  }));

  it('should only clear waits if waitcomponent not created', fakeAsync(() => {
    waitService.clearAllPageWaits();
    tick();
    applicationRef.tick();

    verifyNonBlockingPageWaitExists(false);
    verifyBlockingPageWaitExists(false);
  }));
});
