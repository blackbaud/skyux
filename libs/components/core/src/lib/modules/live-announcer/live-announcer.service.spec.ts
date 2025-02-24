import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SkyLiveAnnouncerFixtureComponent } from './fixtures/live-announcer.component.fixture';
import { SkyLiveAnnouncerService } from './live-announcer.service';

describe('SkyLiveAnnouncer', () => {
  let announcer: SkyLiveAnnouncerService;
  let fixture: ComponentFixture<SkyLiveAnnouncerFixtureComponent>;

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [SkyLiveAnnouncerFixtureComponent],
    }),
  );

  beforeEach(fakeAsync(() => {
    announcer = TestBed.inject(SkyLiveAnnouncerService);
    fixture = TestBed.createComponent(SkyLiveAnnouncerFixtureComponent);
  }));

  it('should correctly update the announce text', fakeAsync(() => {
    const buttonElement: HTMLElement | undefined = fixture.debugElement.query(
      By.css('button'),
    ).nativeElement;
    buttonElement?.click();
    const ariaLiveElement = getLiveElement();

    expect(ariaLiveElement?.textContent).toBe('Test');
  }));

  it('should clear the announcement after a given duration', fakeAsync(() => {
    announcer.announce('Hey Google', { duration: 15000 });
    const ariaLiveElement = getLiveElement();

    expect(ariaLiveElement?.textContent).toBe('Hey Google');
    tick(15000);
    expect(ariaLiveElement?.textContent).toBe('');
  }));

  it('should clear the announcement after a calculated duration using the number of words if no duration is given', fakeAsync(() => {
    announcer.announce('Hey Google');
    const ariaLiveElement = getLiveElement();

    expect(ariaLiveElement?.textContent).toBe('Hey Google');
    tick(2249);
    expect(ariaLiveElement?.textContent).toBe('Hey Google');
    tick(1);
    expect(ariaLiveElement?.textContent).toBe('');

    announcer.announce('Hey Google I am testing');

    expect(ariaLiveElement?.textContent).toBe('Hey Google I am testing');
    tick(5624);
    expect(ariaLiveElement?.textContent).toBe('Hey Google I am testing');
    tick(1);
    expect(ariaLiveElement?.textContent).toBe('');
  }));

  it('should correctly update the politeness attribute', fakeAsync(() => {
    announcer.announce('Hey Google', { politeness: 'assertive' });
    const ariaLiveElement = getLiveElement();

    expect(ariaLiveElement?.textContent).toBe('Hey Google');
    expect(ariaLiveElement?.getAttribute('aria-live')).toBe('assertive');
  }));

  it('should apply the aria-live value polite by default', fakeAsync(() => {
    announcer.announce('Hey Google');
    const ariaLiveElement = getLiveElement();

    expect(ariaLiveElement?.textContent).toBe('Hey Google');
    expect(ariaLiveElement?.getAttribute('aria-live')).toBe('polite');
  }));

  it('should be able to clear out the aria-live element manually', fakeAsync(() => {
    announcer.announce('Hey Google');
    const ariaLiveElement = getLiveElement();

    expect(ariaLiveElement?.textContent).toBe('Hey Google');

    announcer.clear();
    expect(ariaLiveElement?.textContent).toBeFalsy();
  }));

  it('should remove the aria-live element from the DOM on destroy', fakeAsync(() => {
    announcer.announce('Hey Google');

    // Call the lifecycle hook manually since Angular won't do it in tests.
    announcer.ngOnDestroy();

    expect(document.body.querySelector('.sky-live-announcer-element'))
      .withContext(
        'Expected that the aria-live element was remove from the DOM.',
      )
      .toBeFalsy();
  }));

  it('should ensure that there is only one live element at a time', fakeAsync(() => {
    fixture.destroy();

    TestBed.resetTestingModule().configureTestingModule({
      declarations: [SkyLiveAnnouncerFixtureComponent],
    });

    const extraElement = document.createElement('div');
    extraElement.classList.add('sky-live-announcer-element');
    document.body.appendChild(extraElement);

    inject([SkyLiveAnnouncerService], (la: SkyLiveAnnouncerService) => {
      announcer = la;
      fixture = TestBed.createComponent(SkyLiveAnnouncerFixtureComponent);
    })();

    announcer.announce('Hey Google');

    expect(document.body.querySelectorAll('.sky-live-announcer-element').length)
      .withContext('Expected only one live announcer element in the DOM.')
      .toBe(1);
    extraElement.remove();
  }));
});

function getLiveElement(): Element | null {
  return document.body.querySelector('.sky-live-announcer-element');
}
