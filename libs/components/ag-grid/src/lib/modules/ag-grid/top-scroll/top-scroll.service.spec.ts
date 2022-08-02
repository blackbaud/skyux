import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MutationObserverService } from '@skyux/core';
import { SkyDataManagerService } from '@skyux/data-manager';

import { SkyAgGridDataManagerFixtureComponent } from '../fixtures/ag-grid-data-manager.component.fixture';
import { SkyAgGridFixtureModule } from '../fixtures/ag-grid.module.fixture';

import { SkyAgGridTopScrollService } from './top-scroll.service';

describe('SkyAgGridTopScrollService', () => {
  let topHorizontalScrollService: SkyAgGridTopScrollService;
  let agGridDataManagerFixtureComponent: ComponentFixture<SkyAgGridDataManagerFixtureComponent>;
  let mutationObserverService: MutationObserverService;

  let elementRef: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAgGridFixtureModule],
      providers: [SkyDataManagerService, SkyAgGridTopScrollService],
    });

    mutationObserverService = TestBed.inject(MutationObserverService);

    spyOn(mutationObserverService, 'create').and.callFake(
      (cb): MutationObserver => {
        cb();
        return new MutationObserver(cb);
      }
    );

    agGridDataManagerFixtureComponent = TestBed.createComponent(
      SkyAgGridDataManagerFixtureComponent
    );
    topHorizontalScrollService = TestBed.inject(SkyAgGridTopScrollService);
    agGridDataManagerFixtureComponent.detectChanges();
    elementRef = agGridDataManagerFixtureComponent.elementRef;
    topHorizontalScrollService.appendTopScrollbarToGrid(elementRef);
  });

  describe('appendTopScrollbarToGrid', () => {
    it('should add a scroll at top', () => {
      const scrollElement = elementRef.nativeElement.querySelectorAll(
        '.ag-body-horizontal-scroll'
      );

      expect(scrollElement.length).toEqual(2);
    });

    it('should listen to bottom scroll event', () => {
      const cloneViewportElement: HTMLElement =
        elementRef.nativeElement.querySelectorAll(
          '.ag-body-horizontal-scroll-viewport'
        )[0];
      cloneViewportElement.scrollLeft = 100;
      cloneViewportElement.dispatchEvent(new Event('scroll'));
      const scrollViewportElement = elementRef.nativeElement.querySelectorAll(
        '.ag-body-horizontal-scroll-viewport'
      )[1];

      expect(scrollViewportElement.scrollLeft).toEqual(
        cloneViewportElement.scrollLeft
      );
    });

    it('should listen to top scroll event', () => {
      const scrollViewportElement: HTMLElement =
        elementRef.nativeElement.querySelectorAll(
          '.ag-body-horizontal-scroll-viewport'
        )[1];
      scrollViewportElement.scrollLeft = 250;
      scrollViewportElement.dispatchEvent(new Event('scroll'));
      const cloneViewportElement = elementRef.nativeElement.querySelectorAll(
        '.ag-body-horizontal-scroll-viewport'
      )[0];

      expect(cloneViewportElement.scrollLeft).toEqual(
        scrollViewportElement.scrollLeft
      );
    });
  });
});
