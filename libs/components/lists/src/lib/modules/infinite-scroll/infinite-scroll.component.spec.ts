import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAppWindowRef } from '@skyux/core';

import { Subject } from 'rxjs';

import { SkyInfiniteScrollFixturesModule } from './fixtures/infinite-scroll-fixtures.module';
import { SkyInfiniteScrollTestComponent } from './fixtures/infinite-scroll.component.fixture';
import { SkyInfiniteScrollDomAdapterService } from './infinite-scroll-dom-adapter.service';
import { SkyInfiniteScrollComponent } from './infinite-scroll.component';

describe('Infinite scroll', () => {
  let fixture: ComponentFixture<SkyInfiniteScrollTestComponent>;
  let adapter: SkyInfiniteScrollDomAdapterService;
  let parentChangesSpy: jasmine.Spy;

  beforeEach(() => {
    adapter = new SkyInfiniteScrollDomAdapterService(new SkyAppWindowRef());

    parentChangesSpy = spyOn(adapter, 'parentChanges').and.callThrough();

    TestBed.configureTestingModule({
      imports: [SkyInfiniteScrollFixturesModule],
    }).overrideComponent(SkyInfiniteScrollComponent, {
      set: {
        providers: [
          {
            provide: SkyInfiniteScrollDomAdapterService,
            useFactory: () => adapter,
          },
        ],
      },
    });

    fixture = TestBed.createComponent(SkyInfiniteScrollTestComponent);
  });

  afterEach(() => {
    fixture.destroy();
    adapter.ngOnDestroy();
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
    expect(fixture.componentInstance.infiniteScrollComponent.enabled).toEqual(
      false
    );
    expect(fixture.componentInstance.infiniteScrollComponent.isWaiting).toEqual(
      false
    );
    expect(
      fixture.componentInstance.infiniteScrollComponent.scrollEnd
    ).toBeDefined();
    fixture.detectChanges();
  });

  it('should not fire parentChanges event for infinite scroll elements', async () => {
    fixture.componentInstance.enabled = true;
    // Set this to true manually so we can check if the parentChanges event sets it to false.
    fixture.componentInstance.infiniteScrollComponent.isWaiting = true;
    fixture.detectChanges();
    expect(fixture.componentInstance.infiniteScrollComponent.isWaiting).toEqual(
      true
    );
  });

  it('should not show wait component or load button when enabled is false.', () => {
    fixture.componentInstance.enabled = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sky-btn')).toBeNull();
    expect(fixture.nativeElement.querySelector('.sky-wait')).toBeNull();
  });

  it('should emit a scrollEnd event on button click', async () => {
    const spy = spyOn(
      fixture.componentInstance,
      'onScrollEnd'
    ).and.callThrough();
    fixture.componentInstance.enabled = true;
    fixture.detectChanges();

    clickLoadButton();
    expect(fixture.componentInstance.items.length).toBe(10);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit a scrollEnd event on scroll when window is the scrollable parent', async () => {
    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.length).toBe(1000);

    const spy = spyOn(
      fixture.componentInstance,
      'onScrollEnd'
    ).and.callThrough();

    // Should not trigger scrollEnd if not at the bottom of the scrollable container.
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();

    scrollWindowBottom();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit scrollEnd if waiting', async () => {
    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.length).toBe(1000);

    const spy = spyOn(
      fixture.componentInstance,
      'onScrollEnd'
    ).and.callThrough();

    scrollWindowBottom();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    spy.calls.reset();

    scrollWindowBottom();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit a scrollEnd event on scroll when enabled is false', async () => {
    const spy = spyOn(
      fixture.componentInstance,
      'onScrollEnd'
    ).and.callThrough();
    fixture.componentInstance.enabled = false;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    scrollWindowBottom();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit a scrollEnd event on scroll when disabled and then re-enabled', async () => {
    const spy = spyOn(
      fixture.componentInstance,
      'onScrollEnd'
    ).and.callThrough();
    fixture.componentInstance.enabled = false;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    fixture.componentInstance.enabled = true;
    fixture.detectChanges();
    scrollWindowBottom();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit a scrollEnd event on scroll when an element is the scrollable parent', async () => {
    const wrapper = fixture.componentInstance.wrapper.nativeElement;
    wrapper.setAttribute('style', 'height:200px;overflow:auto;');

    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.length).toBe(1000);

    const spy = spyOn(
      fixture.componentInstance,
      'onScrollEnd'
    ).and.callThrough();

    // Should not trigger scrollEnd if not at the bottom of the scrollable container.
    SkyAppTestUtility.fireDomEvent(wrapper, 'scroll');
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();

    wrapper.scrollTop = wrapper.scrollHeight;
    SkyAppTestUtility.fireDomEvent(wrapper, 'scroll');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit a scrollEnd event on scroll when loading is true', async () => {
    const spy = spyOn(
      fixture.componentInstance,
      'onScrollEnd'
    ).and.callThrough();

    // Simulate the component in a loading state.
    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loading = true;

    // Add items to the DOM while the component is still in the loading state.
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();

    // Scroll to the infinite scroll component. This should not trigger the scrollEnd event.
    scrollWindowBottom();
    expect(spy).not.toHaveBeenCalled();

    // Component is done looading. Scrolling again should cause the scrollEnd event to fire.
    fixture.componentInstance.loading = false;
    fixture.detectChanges();

    scrollWindowBottom();
    expect(spy).toHaveBeenCalled();
  });

  it('should set isWaiting based on DOM changes when loading is not specified', async () => {
    const parentChangesObs = new Subject<void>();
    parentChangesSpy.and.returnValue(parentChangesObs);

    fixture.componentInstance.enabled = true;
    fixture.detectChanges();

    parentChangesObs.next();

    expect(fixture.componentInstance.infiniteScrollComponent.isWaiting).toBe(
      false
    );
  });

  it('should set isWaiting based on the loading input when specified', async () => {
    const parentChangesObs = new Subject<void>();
    parentChangesSpy.and.returnValue(parentChangesObs);

    fixture.componentInstance.enabled = true;

    // Changing loading to true should set isWaiting to true.
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    expect(fixture.componentInstance.infiniteScrollComponent.isWaiting).toBe(
      true
    );

    // Parent DOM changes shouldn't change the isWaiting flag when loading is specified.
    parentChangesObs.next();

    expect(fixture.componentInstance.infiniteScrollComponent.isWaiting).toBe(
      true
    );

    // Changing loading to false should set isWaiting to false.
    fixture.componentInstance.loading = false;
    fixture.detectChanges();

    expect(fixture.componentInstance.infiniteScrollComponent.isWaiting).toBe(
      false
    );
  });

  it('should support overflow-y', async () => {
    const wrapper = fixture.componentInstance.wrapper.nativeElement;
    wrapper.setAttribute('style', 'height:200px;overflow-y:scroll;');

    fixture.componentInstance.enabled = true;
    fixture.componentInstance.loadItems(1000);
    fixture.detectChanges();
    expect(fixture.componentInstance.items.length).toBe(1000);

    const spy = spyOn(
      fixture.componentInstance,
      'onScrollEnd'
    ).and.callThrough();
    wrapper.scrollTop = wrapper.scrollHeight;
    SkyAppTestUtility.fireDomEvent(wrapper, 'scroll');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
