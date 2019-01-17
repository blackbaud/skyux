// #region imports
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyInfiniteScrollFixturesModule,
  SkyInfiniteScrollTestComponent
} from './fixtures';
// #endregion

describe('Infinite scroll', () => {
  let fixture: ComponentFixture<SkyInfiniteScrollTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyInfiniteScrollFixturesModule
      ]
    });

    fixture = TestBed.createComponent(SkyInfiniteScrollTestComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  function clickLoadButton(): void {
    fixture.nativeElement.querySelector('.sky-btn').click();
    fixture.detectChanges();
  }

  function scrollWindowBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();
  }

  it('should set defaults', () => {
    expect(fixture.componentInstance.infiniteScrollComponent.enabled).toEqual(false);
    expect(fixture.componentInstance.infiniteScrollComponent.isWaiting).toEqual(false);
    expect(fixture.componentInstance.infiniteScrollComponent.scrollEnd).toBeDefined();
    fixture.detectChanges();
  });

  it('should not fire parentChanges event for infinite scroll elements', async(() => {
    fixture.componentInstance.enabled = true;
    // Set this to true manually so we can check if the parentChanges event sets it to false.
    fixture.componentInstance.infiniteScrollComponent.isWaiting = true;
    fixture.detectChanges();
    expect(fixture.componentInstance.infiniteScrollComponent.isWaiting).toEqual(true);
  }));

  it('should not show wait component or load button when enabled is false.', () => {
    fixture.componentInstance.enabled = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sky-btn')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sky-wait')).toBeNull();
  });

  it('should emit a scrollEnd event on button click', async(() => {
    const spy = spyOn(fixture.componentInstance, 'onScrollEnd').and.callThrough();
    fixture.componentInstance.enabled = true;
    fixture.detectChanges();

    clickLoadButton();
    expect(fixture.componentInstance.items.length).toBe(10);
    expect(spy).toHaveBeenCalled();
  }));

  it('should emit a scrollEnd event on scroll when window is the scrollable parent', async(() => {
    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.length).toBe(1000);

    const spy = spyOn(fixture.componentInstance, 'onScrollEnd').and.callThrough();

    // Should not trigger scrollEnd if not at the bottom of the scrollable container.
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();

    scrollWindowBottom();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('should not emit scrollEnd if waiting', async(() => {
    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.length).toBe(1000);

    const spy = spyOn(fixture.componentInstance, 'onScrollEnd').and.callThrough();

    scrollWindowBottom();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    spy.calls.reset();

    scrollWindowBottom();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  }));

  it('should not emit a scrollEnd event on scroll when enabled is false', async(() => {
    const spy = spyOn(fixture.componentInstance, 'onScrollEnd').and.callThrough();
    fixture.componentInstance.enabled = false;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    scrollWindowBottom();
    expect(spy).not.toHaveBeenCalled();
  }));

  it('should emit a scrollEnd event on scroll when disabled and then re-enabled', async(() => {
    const spy = spyOn(fixture.componentInstance, 'onScrollEnd').and.callThrough();
    fixture.componentInstance.enabled = false;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    fixture.componentInstance.enabled = true;
    fixture.detectChanges();
    scrollWindowBottom();
    expect(spy).toHaveBeenCalled();
  }));

  it('should emit a scrollEnd event on scroll when an element is the scrollable parent', async(() => {
    const wrapper = fixture.componentInstance.wrapper.nativeElement;
    wrapper.setAttribute('style', 'height:200px;overflow:auto;');

    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.length).toBe(1000);

    const spy = spyOn(fixture.componentInstance, 'onScrollEnd').and.callThrough();

    // Should not trigger scrollEnd if not at the bottom of the scrollable container.
    SkyAppTestUtility.fireDomEvent(wrapper, 'scroll');
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();

    wrapper.scrollTop = wrapper.scrollHeight;
    SkyAppTestUtility.fireDomEvent(wrapper, 'scroll');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('should support overflow-y', async(() => {
    const wrapper = fixture.componentInstance.wrapper.nativeElement;
    wrapper.setAttribute('style', 'height:200px;overflow-y:scroll;');

    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.length).toBe(1000);

    const spy = spyOn(fixture.componentInstance, 'onScrollEnd').and.callThrough();
    wrapper.scrollTop = wrapper.scrollHeight;
    SkyAppTestUtility.fireDomEvent(wrapper, 'scroll');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('should be accessible', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
