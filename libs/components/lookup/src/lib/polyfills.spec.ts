import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import './polyfills';

@Component({
  selector: 'sky-test-cmp',
  template: `
    <div id="one">one</div>
    <div id="two">two</div>
    <div id="three">three</div>

    <div id="parent">
      <div>
        <a href="#" id="hyperlink">
          <span id="child"></span>
        </a>
      </div>
    </div>
  `,
})
export class PolyfillTestComponent {}

describe('Polyfills', () => {
  let fixture;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolyfillTestComponent],
      providers: [],
    });
    fixture = TestBed.createComponent(PolyfillTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('matches()', () => {
    it('should return true if element matches', () => {
      const targetEl = nativeElement.querySelector('#one');
      const actual = targetEl.matches('#one');

      expect(actual).toBe(true);
    });

    it('should return false if element does not match', () => {
      const targetEl = nativeElement.querySelector('#two');
      const actual = targetEl.matches('#one');

      expect(actual).toBe(false);
    });
  });

  describe('closest()', () => {
    it('should find the closest element through several ancestors', () => {
      const parentEl = nativeElement.querySelector('#parent');
      const childEl = nativeElement.querySelector('#child');
      const actual = childEl.closest('#parent');

      expect(actual).toEqual(parentEl);
    });

    it('should find the closest element through a single ancestor', () => {
      const parentEl = nativeElement.querySelector('#hyperlink');
      const childEl = nativeElement.querySelector('#child');
      const actual = childEl.closest('a') as Element;

      expect(actual).toEqual(parentEl);
    });

    it('should return undefined if no ancestor is found', () => {
      const childEl = nativeElement.querySelector('#child');
      const actual = childEl.closest('#not-found');

      expect(actual).toBeNull();
    });
  });
});
