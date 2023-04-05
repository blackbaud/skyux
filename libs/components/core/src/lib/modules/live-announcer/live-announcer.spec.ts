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

import { SkyLiveAnnouncer } from './live-announcer';
import {
  SKY_LIVE_ANNOUNCER_DEFAULT_OPTIONS,
  SKY_LIVE_ANNOUNCER_ELEMENT_TOKEN,
  SkyLiveAnnouncerDefaultOptions,
} from './live-announcer-tokens';

describe('LiveAnnouncer', () => {
  let announcer: SkyLiveAnnouncer;
  let ariaLiveElement: Element;
  let fixture: ComponentFixture<TestAppComponent>;

  describe('with default element', () => {
    beforeEach(() =>
      TestBed.configureTestingModule({
        imports: [A11yModule],
        declarations: [TestAppComponent, TestModalComponent],
      })
    );

    beforeEach(fakeAsync(() => {
      announcer = TestBed.inject(SkyLiveAnnouncer);
      ariaLiveElement = getLiveElement();
      fixture = TestBed.createComponent(TestAppComponent);
    }));

    it('should correctly update the announce text', fakeAsync(() => {
      const buttonElement = fixture.debugElement.query(
        By.css('button')
      )!.nativeElement;
      buttonElement.click();

      // This flushes our 100ms timeout for the screen readers.
      tick(100);

      expect(ariaLiveElement.textContent).toBe('Test');
    }));

    it('should correctly update the politeness attribute', fakeAsync(() => {
      announcer.announce('Hey Google', 'assertive');

      // This flushes our 100ms timeout for the screen readers.
      tick(100);

      expect(ariaLiveElement.textContent).toBe('Hey Google');
      expect(ariaLiveElement.getAttribute('aria-live')).toBe('assertive');
    }));

    it('should apply the aria-live value polite by default', fakeAsync(() => {
      announcer.announce('Hey Google');

      // This flushes our 100ms timeout for the screen readers.
      tick(100);

      expect(ariaLiveElement.textContent).toBe('Hey Google');
      expect(ariaLiveElement.getAttribute('aria-live')).toBe('polite');
    }));

    it('should be able to clear out the aria-live element manually', fakeAsync(() => {
      announcer.announce('Hey Google');
      tick(100);
      expect(ariaLiveElement.textContent).toBe('Hey Google');

      announcer.clear();
      expect(ariaLiveElement.textContent).toBeFalsy();
    }));

    it('should be able to clear out the aria-live element by setting a duration', fakeAsync(() => {
      announcer.announce('Hey Google', 2000);
      tick(100);
      expect(ariaLiveElement.textContent).toBe('Hey Google');

      tick(2000);
      expect(ariaLiveElement.textContent).toBeFalsy();
    }));

    it('should clear the duration of previous messages when announcing a new one', fakeAsync(() => {
      announcer.announce('Hey Google', 2000);
      tick(100);
      expect(ariaLiveElement.textContent).toBe('Hey Google');

      announcer.announce('Hello there');
      tick(2500);
      expect(ariaLiveElement.textContent).toBe('Hello there');
    }));

    it('should remove the aria-live element from the DOM on destroy', fakeAsync(() => {
      announcer.announce('Hey Google');

      // This flushes our 100ms timeout for the screen readers.
      tick(100);

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

      inject([SkyLiveAnnouncer], (la: SkyLiveAnnouncer) => {
        announcer = la;
        ariaLiveElement = getLiveElement();
        fixture = TestBed.createComponent(TestAppComponent);
      })();

      announcer.announce('Hey Google');
      tick(100);

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

  describe('with a custom element', () => {
    let customLiveElement: HTMLElement;

    beforeEach(() => {
      customLiveElement = document.createElement('div');

      return TestBed.configureTestingModule({
        imports: [A11yModule],
        declarations: [TestAppComponent],
        providers: [
          {
            provide: SKY_LIVE_ANNOUNCER_ELEMENT_TOKEN,
            useValue: customLiveElement,
          },
        ],
      });
    });

    beforeEach(inject([SkyLiveAnnouncer], (la: SkyLiveAnnouncer) => {
      announcer = la;
      ariaLiveElement = getLiveElement();
    }));

    it('should allow to use a custom live element', fakeAsync(() => {
      announcer.announce('Custom Element');

      // This flushes our 100ms timeout for the screen readers.
      tick(100);

      expect(customLiveElement.textContent).toBe('Custom Element');
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

    beforeEach(inject([SkyLiveAnnouncer], (la: SkyLiveAnnouncer) => {
      announcer = la;
      ariaLiveElement = getLiveElement();
    }));

    it('should pick up the default politeness from the injection token', fakeAsync(() => {
      announcer.announce('Hello');

      tick(2000);

      expect(ariaLiveElement.getAttribute('aria-live')).toBe('assertive');
    }));

    it('should pick up the default duration from the injection token', fakeAsync(() => {
      announcer.announce('Hello');

      tick();
      expect(ariaLiveElement.textContent).toBe('Hello');

      tick(1337);
      expect(ariaLiveElement.textContent).toBeFalsy();
    }));
  });
});

function getLiveElement(): Element {
  return document.body.querySelector('.sky-live-announcer-element')!;
}

@Component({
  template: `<button (click)="announceText('Test')">Announce</button>`,
})
class TestAppComponent {
  constructor(public live: SkyLiveAnnouncer) {}

  announceText(message: string) {
    this.live.announce(message);
  }
}

@Component({
  template: '',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { '[attr.aria-owns]': 'ariaOwns', 'aria-modal': 'true' },
})
class TestModalComponent {
  ariaOwns: string | null = null;
}
