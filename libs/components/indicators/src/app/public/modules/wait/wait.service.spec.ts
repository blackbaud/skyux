import {
  ApplicationRef
} from '@angular/core';

import {
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  ReplaySubject
} from 'rxjs';

import {
  SkyWaitFixturesModule
} from './fixtures/wait-fixtures.module';

import {
  SkyWaitService
} from './wait.service';

const NO_OP_FUNC: () => void = () => {
};

describe('Wait service', () => {
  let waitService: SkyWaitService;
  let applicationRef: ApplicationRef;

  const pageBlockingSelector =
    '.sky-wait-page .sky-wait-mask-loading-fixed.sky-wait-mask-loading-blocking';
  const pageNonBlockingSelector =
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

  function verifyBlockingPageWaitExists(doesExist: boolean): void {
    if (doesExist) {
      expect(document.body.querySelector(pageBlockingSelector)).not.toBeNull();
      expect(document.body.querySelectorAll(pageBlockingSelector).length).toBe(1);
    } else {
      expect(document.body.querySelector(pageBlockingSelector)).toBeNull();
    }
  }

  function verifyNonBlockingPageWaitExists(doesExist: boolean): void {
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

    const button = document.body.querySelector('button');
    const event = Object.assign(document.createEvent('CustomEvent'), { relatedTarget: document.body });
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

  it('should wrap with blocking wait when the given observable is hot', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitService.blockingWrap(subject.asObservable()).subscribe(NO_OP_FUNC);
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(true);
    subject.complete();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(false);
  }));

  it('should not wrap with blocking wait when the given observable is cold', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitService.blockingWrap(subject.asObservable());
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(false);
    subject.complete();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(false);
  }));

  it('should wrap with blocking wait when the given observable throws error', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitService.blockingWrap(subject.asObservable()).subscribe(NO_OP_FUNC, NO_OP_FUNC);
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(true);
    subject.error('error');
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(false);
  }));

  it('should wrap with nonblocking wait when the given observable is hot', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitService.nonBlockingWrap(subject.asObservable()).subscribe(NO_OP_FUNC);
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(true);
    subject.complete();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);
  }));

  it('should not wrap with nonblocking wait when the given observable is cold', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitService.nonBlockingWrap(subject.asObservable());
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);
    subject.complete();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);
  }));

  it('should wrap with nonblocking wait when the given observable throws error', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitService.nonBlockingWrap(subject.asObservable()).subscribe(NO_OP_FUNC, NO_OP_FUNC);
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(true);
    subject.error('error');
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);
  }));
});
