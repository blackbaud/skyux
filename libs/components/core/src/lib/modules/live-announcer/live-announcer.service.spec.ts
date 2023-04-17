import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SkyLiveAnnouncerService } from './live-announcer.service';
import {
  SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
  SkyLiveAnnouncerDefaultOptions,
} from './types/live-announcer-tokens';

describe('LiveAnnouncer', () => {
  let announcer: SkyLiveAnnouncerService;
  let fixture: ComponentFixture<TestAppComponent>;

  describe('with default element', () => {
    beforeEach(() =>
      TestBed.configureTestingModule({
        imports: [A11yModule],
        declarations: [TestAppComponent, TestModalComponent],
      })
    );

    beforeEach(fakeAsync(() => {
      announcer = TestBed.inject(SkyLiveAnnouncerService);
      fixture = TestBed.createComponent(TestAppComponent);
    }));

    it('should correctly update the announce text', fakeAsync(() => {
      const buttonElement: HTMLElement | undefined = fixture.debugElement.query(
        By.css('button')
      ).nativeElement;
      buttonElement?.click();
      const ariaLiveElement = getLiveElement();

      expect(ariaLiveElement?.textContent).toBe('Test');
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
          'Expected that the aria-live element was remove from the DOM.'
        )
        .toBeFalsy();
    }));

    it('should ensure that there is only one live element at a time', fakeAsync(() => {
      fixture.destroy();

      TestBed.resetTestingModule().configureTestingModule({
        imports: [A11yModule],
        declarations: [TestAppComponent],
      });

      const extraElement = document.createElement('div');
      extraElement.classList.add('sky-live-announcer-element');
      document.body.appendChild(extraElement);

      inject([SkyLiveAnnouncerService], (la: SkyLiveAnnouncerService) => {
        announcer = la;
        fixture = TestBed.createComponent(TestAppComponent);
      })();

      announcer.announce('Hey Google');

      expect(
        document.body.querySelectorAll('.sky-live-announcer-element').length
      )
        .withContext('Expected only one live announcer element in the DOM.')
        .toBe(1);
      extraElement.remove();
    }));

    it('should clear pending timeouts on destroy', fakeAsync(() => {
      announcer.announce('Hey Google');
      announcer.ngOnDestroy();

      // Since we're testing whether the timeouts were flushed, we don't need any
      // assertions here. `fakeAsync` will fail the test if a timer was left over.
    }));
  });

  describe('with a default options', () => {
    beforeEach(() => {
      return TestBed.configureTestingModule({
        imports: [A11yModule],
        declarations: [TestAppComponent],
        providers: [
          {
            provide: SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
            useValue: {
              politeness: 'assertive',
              duration: 1337,
            } as SkyLiveAnnouncerDefaultOptions,
          },
        ],
      });
    });

    beforeEach(inject(
      [SkyLiveAnnouncerService],
      (la: SkyLiveAnnouncerService) => {
        announcer = la;
      }
    ));

    it('should pick up the default politeness from the injection token', fakeAsync(() => {
      announcer.announce('Hello');
      const ariaLiveElement = getLiveElement();

      tick(2000);

      expect(ariaLiveElement?.getAttribute('aria-live')).toBe('assertive');
    }));
  });
});

function getLiveElement(): Element | null {
  return document.body.querySelector('.sky-live-announcer-element');
}

@Component({
  template: `<button (click)="announceText('Test')">Announce</button>`,
})
class TestAppComponent {
  constructor(public liveAnnouncerSvc: SkyLiveAnnouncerService) {}

  public announceText(message: string): void {
    this.liveAnnouncerSvc.announce(message);
  }
}

@Component({
  template: '',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { '[attr.aria-owns]': 'ariaOwns', 'aria-modal': 'true' },
})
class TestModalComponent {
  public ariaOwns: string | null = null;
}
