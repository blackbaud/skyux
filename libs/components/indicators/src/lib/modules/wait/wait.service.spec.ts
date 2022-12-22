import { ApplicationRef } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { SkyWaitFixturesModule } from './fixtures/wait-fixtures.module';
import { SkyWaitTestComponent } from './fixtures/wait.component.fixture';
import { SkyWaitService } from './wait.service';

describe('Wait service', () => {
  const NO_OP_FUNC = jasmine.createSpy('NO_OP_FUNC');

  let waitSvc: SkyWaitService;
  let applicationRef: ApplicationRef;

  const pageBlockingSelector =
    '.sky-wait-page .sky-wait-mask-loading-fixed.sky-wait-mask-loading-blocking';
  const pageNonBlockingSelector =
    '.sky-wait-page .sky-wait-mask-loading-fixed.sky-wait-mask-loading-non-blocking';

  function beginBlockingPageWait(): void {
    waitSvc.beginBlockingPageWait();
    tick();
    applicationRef.tick();
  }

  function endBlockingPageWait(): void {
    waitSvc.endBlockingPageWait();
    tick();
    applicationRef.tick();
  }

  function beginNonBlockingPageWait(): void {
    waitSvc.beginNonBlockingPageWait();
    tick();
    applicationRef.tick();
  }

  function endNonBlockingPageWait(): void {
    waitSvc.endNonBlockingPageWait();
    tick();
    applicationRef.tick();
  }

  function clearAllPageWaits(): void {
    waitSvc.clearAllPageWaits();
    tick();
    applicationRef.tick();
  }

  function verifyBlockingPageWaitExists(doesExist: boolean): void {
    if (doesExist) {
      expect(document.body.querySelector(pageBlockingSelector)).not.toBeNull();
      expect(document.body.querySelectorAll(pageBlockingSelector).length).toBe(
        1
      );
    } else {
      expect(document.body.querySelector(pageBlockingSelector)).toBeNull();
    }
  }

  function verifyNonBlockingPageWaitExists(doesExist: boolean): void {
    if (doesExist) {
      expect(
        document.body.querySelector(pageNonBlockingSelector)
      ).not.toBeNull();
      expect(
        document.body.querySelectorAll(pageNonBlockingSelector).length
      ).toBe(1);
    } else {
      expect(document.body.querySelector(pageNonBlockingSelector)).toBeNull();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyWaitFixturesModule],
    });
  });

  beforeEach(() => {
    applicationRef = TestBed.inject(ApplicationRef);
    waitSvc = TestBed.inject(SkyWaitService);
    waitSvc.dispose();
  });

  afterEach(() => {
    waitSvc.dispose();
  });

  it('should add a blocking page wait when beginPageWait is called with isBlocking true', fakeAsync(() => {
    beginBlockingPageWait();
    verifyBlockingPageWaitExists(true);

    beginBlockingPageWait();
    verifyBlockingPageWaitExists(true);

    endBlockingPageWait();
    verifyBlockingPageWaitExists(true);

    endBlockingPageWait();
    verifyBlockingPageWaitExists(false);
  }));

  it('should block tab navigation when a blocking page wait is active', fakeAsync(() => {
    TestBed.createComponent(SkyWaitTestComponent);

    beginBlockingPageWait();
    verifyBlockingPageWaitExists(true);

    const button = document.body.querySelector('button');
    const event = Object.assign(document.createEvent('CustomEvent'), {
      relatedTarget: document.body,
    });
    event.initEvent('focusin', true, true);
    button?.dispatchEvent(event);

    expect(document.activeElement).toBe(document.body);
  }));

  it('should add a nonblocking page wait when beginPageWait is called with isBlocking false', fakeAsync(() => {
    beginNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(true);

    beginNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(true);

    endNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(true);

    endNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(false);
  }));

  it('do nothing if wait component not created and endPageWait is called', fakeAsync(() => {
    endNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(false);
  }));

  it('not drop counts below zero', fakeAsync(() => {
    beginNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(true);

    endNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(false);

    endNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(false);

    beginNonBlockingPageWait();
    verifyNonBlockingPageWaitExists(true);

    endBlockingPageWait();
    verifyBlockingPageWaitExists(false);

    beginBlockingPageWait();
    verifyBlockingPageWaitExists(true);
  }));

  it('should clear appropriate waits when clearPageWait is called', fakeAsync(() => {
    beginNonBlockingPageWait();

    beginBlockingPageWait();

    clearAllPageWaits();

    verifyNonBlockingPageWaitExists(false);
    verifyBlockingPageWaitExists(false);
  }));

  it('should clear wait even if closed too fast', fakeAsync(() => {
    // Don't call the convenience methods in this test file since tick()/applicationRef.tick()
    // can't be called to test this feature.
    waitSvc.beginNonBlockingPageWait();
    waitSvc.clearAllPageWaits();
    tick();

    verifyNonBlockingPageWaitExists(false);
    verifyBlockingPageWaitExists(false);
  }));

  it('should only clear waits if waitcomponent not created', fakeAsync(() => {
    clearAllPageWaits();

    verifyNonBlockingPageWaitExists(false);
    verifyBlockingPageWaitExists(false);
  }));

  it('should wrap with blocking wait when the given observable is hot', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitSvc
      .blockingWrap({ observable: subject.asObservable() })
      .subscribe(NO_OP_FUNC);
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
    waitSvc.blockingWrap({ observable: subject.asObservable() });
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
    waitSvc
      .blockingWrap({ observable: subject.asObservable() })
      .subscribe(NO_OP_FUNC, NO_OP_FUNC);
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(true);
    subject.error('error');
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(false);
  }));

  it('should wrap with blocking wait when the given observable is given outside of args', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitSvc.blockingWrap(subject.asObservable()).subscribe(NO_OP_FUNC);
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(true);
    subject.complete();
    tick();
    applicationRef.tick();
    verifyBlockingPageWaitExists(false);
  }));

  it('should wrap with nonblocking wait when the given observable is hot', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitSvc
      .nonBlockingWrap({ observable: subject.asObservable() })
      .subscribe(NO_OP_FUNC);
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
    waitSvc.nonBlockingWrap({ observable: subject.asObservable() });
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
    waitSvc
      .nonBlockingWrap({ observable: subject.asObservable() })
      .subscribe(NO_OP_FUNC, NO_OP_FUNC);
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(true);
    subject.error('error');
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);
  }));

  it('should wrap with nonblocking wait when the given observable is given outside of args', fakeAsync(() => {
    const subject = new ReplaySubject();
    waitSvc.nonBlockingWrap(subject.asObservable()).subscribe(NO_OP_FUNC);
    subject.next('A');
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(true);
    subject.complete();
    tick();
    applicationRef.tick();
    verifyNonBlockingPageWaitExists(false);
  }));
});
