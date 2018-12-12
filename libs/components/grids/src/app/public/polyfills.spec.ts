import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

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
  `
})
export class PolyfillTestComponent {
}

describe('Polyfills', () => {
  let fixture;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolyfillTestComponent],
      providers: []
    });
    fixture = TestBed.createComponent(PolyfillTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('elementMatches()', () => {

    it('should return true if element matches', () => {
      let targetEl = nativeElement.querySelector('#one');
      let actual = targetEl.matches('#one');

      expect(actual).toBe(true);
    });

    it('should return false if element does not match', () => {
      let targetEl = nativeElement.querySelector('#two');
      let actual = targetEl.matches('#one');

      expect(actual).toBe(false);
    });

  });

  describe('getClosest()', () => {

    it('should find the closest element through several ancestors', () => {
      let parentEl = nativeElement.querySelector('#parent');
      let childEl = nativeElement.querySelector('#child');
      let actual = childEl.closest('#parent');

      expect(actual).toEqual(parentEl);
    });

    it('should find the closest element through a single ancestor', () => {
      let parentEl = nativeElement.querySelector('#hyperlink');
      let childEl = nativeElement.querySelector('#child');
      let actual = childEl.closest('a') as Element;

      expect(actual).toEqual(parentEl);
    });

    it('should return undefined if no ancestor is found', () => {
      let childEl = nativeElement.querySelector('#child');
      let actual = childEl.closest('#not-found');

      expect(actual).toBeNull();
    });
  });

});
