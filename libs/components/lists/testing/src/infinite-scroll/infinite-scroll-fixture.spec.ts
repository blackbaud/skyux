import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyInfiniteScrollFixture } from './infinite-scroll-fixture';
import { SkyInfiniteScrollTestingModule } from './infinite-scroll-testing.module';

const DATA_SKY_ID = 'test-infinite-scroll';

//#region Test component
@Component({
  selector: 'sky-infinite-scroll-fixture',
  template: `
    <ul style="scroll-behavior: auto; height: 40px;">
      <li *ngFor="let i of items">{{ i }}</li>
      <li *ngIf="items.length === 0"><em>(no items)</em></li>
      <sky-infinite-scroll
        data-sky-id="${DATA_SKY_ID}"
        [enabled]="true"
        (scrollEnd)="loadMore()"
      >
      </sky-infinite-scroll>
    </ul>
  `,
})
class InfiniteScrollTestComponent {
  public items: string[] = [];
  private i: number = 1;
  public loadMore() {
    return new Promise(() => {
      for (let j = 1; j <= 10; j++) {
        this.items.push(`Item ${this.i++}`);
      }
    });
  }
}
//#endregion Test component

describe('Infinite scroll fixture component', () => {
  let fixture: ComponentFixture<InfiniteScrollTestComponent>;
  let testComponent: InfiniteScrollTestComponent;
  let infiniteScrollFixture: SkyInfiniteScrollFixture;

  /**
   * This configureTestingModule function imports SkyAppTestModule, which brings in all of
   * the SKY UX modules and components in your application for testing convenience. If this has
   * an adverse effect on your test performance, you can individually bring in each of your app
   * components and the SKY UX modules that those components rely upon.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfiniteScrollTestComponent],
      imports: [SkyInfiniteScrollTestingModule],
    });

    fixture = TestBed.createComponent(InfiniteScrollTestComponent);
    testComponent = fixture.componentInstance;
    infiniteScrollFixture = new SkyInfiniteScrollFixture(fixture, DATA_SKY_ID);
  });

  it('should display button', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(infiniteScrollFixture.loadMoreButtonIsVisible).toBeTrue();
  });

  it('should load more', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(infiniteScrollFixture.loadMoreButtonIsVisible).toBeTrue();
    // click once
    await infiniteScrollFixture.clickLoadMoreButton();
    const length = testComponent.items.length;
    expect(length).toBeGreaterThan(0);
  });
});
