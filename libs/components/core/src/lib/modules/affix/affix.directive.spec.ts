import { ViewportRuler } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility, expectAsync } from '@skyux-sdk/testing';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAffixAutoFitContext } from './affix-auto-fit-context';
import { SkyAffixConfig } from './affix-config';
import { SkyAffixOffset } from './affix-offset';
import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixPosition } from './affix-position';
import { SkyAffixService } from './affix.service';
import { AffixFixtureComponent } from './fixtures/affix.component.fixture';
import { AffixFixturesModule } from './fixtures/affix.module.fixture';

describe('Affix directive', () => {
  let ngUnsubscribe: Subject<void> | undefined;

  const expectedOffsets = {
    aboveLeft: {
      top: 195,
      left: 245,
    },
    aboveCenter: {
      top: 195,
      left: 225,
    },
    aboveRight: {
      top: 195,
      left: 205,
    },
    aboveTop: {
      top: 245,
      left: 225,
    },
    aboveMiddle: {
      top: 220,
      left: 225,
    },
    aboveBottom: {
      top: 195,
      left: 225,
    },
    belowLeft: {
      top: 255,
      left: 245,
    },
    belowCenter: {
      top: 255,
      left: 225,
    },
    belowRight: {
      top: 255,
      left: 205,
    },
    belowTop: {
      top: 255,
      left: 225,
    },
    belowMiddle: {
      top: 230,
      left: 225,
    },
    belowBottom: {
      top: 205,
      left: 225,
    },
    rightTop: {
      top: 245,
      left: 255,
    },
    rightMiddle: {
      top: 225,
      left: 255,
    },
    rightBottom: {
      top: 205,
      left: 255,
    },
    leftTop: {
      top: 245,
      left: 195,
    },
    leftMiddle: {
      top: 225,
      left: 195,
    },
    leftBottom: {
      top: 205,
      left: 195,
    },
  };

  function triggerParentScroll(
    fixture: ComponentFixture<AffixFixtureComponent>,
  ): void {
    const el = fixture.componentInstance.overflowParentRef.nativeElement;

    SkyAppTestUtility.fireDomEvent(el, 'scroll', { bubbles: false });
  }

  function runTestsForPosition(position: SkyAffixPosition | undefined): void {
    function setupTest() {
      TestBed.configureTestingModule({
        imports: [AffixFixturesModule],
      });

      // Make the body element scrollable.
      window.document.body.style.height = '5000px';
      window.document.body.style.width = '5000px';

      const fixture = TestBed.createComponent(AffixFixtureComponent);
      const directive = fixture.componentInstance.affixDirective;
      const affixService = TestBed.inject(SkyAffixService);
      const viewportRulerChange = new Subject<Event>();
      const viewportRuler = TestBed.inject(ViewportRuler);

      spyOn(viewportRuler, 'change').and.returnValue(viewportRulerChange);

      const viewportRulerResize = (): void =>
        viewportRulerChange.next(new Event('resize'));

      fixture.componentInstance.position = position;

      fixture.componentInstance.scrollTargetIntoView();

      let offset: SkyAffixOffset | undefined;
      let numOverflowScrollEmitted = 0;

      const placement: (SkyAffixPlacement | null | undefined)[] = [];
      const createAffixer = spyOn(
        affixService,
        'createAffixer',
      ).and.callThrough();

      ngUnsubscribe = new Subject<void>();

      directive.affixOverflowScroll
        .pipe(takeUntil(ngUnsubscribe))
        .subscribe(() => {
          numOverflowScrollEmitted++;
        });

      directive.affixOffsetChange
        .pipe(takeUntil(ngUnsubscribe))
        .subscribe((x) => {
          offset = x.offset;
        });

      directive.affixPlacementChange
        .pipe(takeUntil(ngUnsubscribe))
        .subscribe((x) => {
          placement.push(x.placement);
        });

      const getAffixer = () => createAffixer.calls.mostRecent().returnValue;

      const getAffixedOffset = (): SkyAffixOffset => {
        const styles = window.getComputedStyle(
          fixture.componentInstance.affixedRef.nativeElement,
        );
        return {
          top: +styles.top.split('px')[0],
          left: +styles.left.split('px')[0],
        };
      };

      const getRecentOffsetChange = () => offset;
      const getNumOverflowScrollEmitted = () => numOverflowScrollEmitted;
      const getRecentPlacementChange = () => placement[placement.length - 1];
      const getPlacementChanges = () => placement;

      return {
        fixture,
        getAffixedOffset,
        getAffixer,
        getRecentOffsetChange,
        getNumOverflowScrollEmitted,
        getRecentPlacementChange,
        getPlacementChanges,
        viewportRulerResize,
      };
    }

    it('should set default config', () => {
      const { fixture, getAffixedOffset, getAffixer } = setupTest();

      fixture.detectChanges();

      const affixer = getAffixer();
      const affixedOffset = getAffixedOffset();

      const expectedConfig: SkyAffixConfig = {
        autoFitContext: SkyAffixAutoFitContext.OverflowParent,
        autoFitOverflowOffset: undefined,
        enableAutoFit: false,
        horizontalAlignment: 'center',
        isSticky: false,
        placement: 'above',
        position,
        verticalAlignment: undefined,
      };

      expect(affixer?.getConfig()).toEqual(expectedConfig);
      expect(affixedOffset.top).toEqual(expectedOffsets.aboveCenter.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveCenter.left);
    });

    it('should place affixed element on all sides of the base element', async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.placement = 'above';
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.aboveCenter.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveCenter.left);

      componentInstance.placement = 'right';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.rightMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.rightMiddle.left);

      componentInstance.placement = 'below';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.belowCenter.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.belowCenter.left);

      componentInstance.placement = 'left';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.leftMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.leftMiddle.left);
    });

    it('should allow adjustments to overflow parent offset', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      const offset: SkyAffixOffset = {
        bottom: 10,
        left: 10,
        right: 10,
        top: 10,
      };

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'right';
      fixture.detectChanges();

      const affixedElementWidth =
        componentInstance.affixedRef.nativeElement.getBoundingClientRect()
          .width;

      componentInstance.scrollTargetToRight(affixedElementWidth);
      triggerParentScroll(fixture);
      fixture.detectChanges();

      // The placement shouldn't change.
      expect(getRecentPlacementChange()).toEqual('right');

      componentInstance.autoFitOverflowOffset = offset;
      fixture.detectChanges();

      // The placement should now change since the overflow offset was added.
      expect(getRecentPlacementChange()).toEqual('left');
    });

    it('should adjust to a positioned parent offset', async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enablePositionedParent = true;
      fixture.detectChanges();

      const affixedOffset = getAffixedOffset();

      if (position === 'absolute') {
        // Absolute position is relative to the positioned parent.
        expect(affixedOffset.top).toEqual(195);
        expect(affixedOffset.left).toEqual(225);
      } else {
        // Fixed position is relative to the viewport.
        expect(affixedOffset.top).toEqual(295);
        expect(affixedOffset.left).toEqual(325);
      }
    });

    it('should affix element using vertical alignments', async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.placement = 'right';
      componentInstance.verticalAlignment = 'top';
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.rightTop.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.rightTop.left);

      componentInstance.placement = 'right';
      componentInstance.verticalAlignment = 'middle';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.rightMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.rightMiddle.left);

      componentInstance.placement = 'right';
      componentInstance.verticalAlignment = undefined;
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.rightMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.rightMiddle.left);

      componentInstance.placement = 'right';
      componentInstance.verticalAlignment = 'bottom';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.rightBottom.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.rightBottom.left);

      componentInstance.placement = 'left';
      componentInstance.verticalAlignment = 'top';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.leftTop.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.leftTop.left);

      componentInstance.placement = 'left';
      componentInstance.verticalAlignment = 'middle';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.leftMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.leftMiddle.left);

      componentInstance.placement = 'left';
      componentInstance.verticalAlignment = undefined;
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.leftMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.leftMiddle.left);

      componentInstance.placement = 'left';
      componentInstance.verticalAlignment = 'bottom';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.leftBottom.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.leftBottom.left);

      componentInstance.placement = 'above';
      componentInstance.verticalAlignment = 'top';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.aboveTop.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveTop.left);

      componentInstance.placement = 'above';
      componentInstance.verticalAlignment = 'middle';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.aboveMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveMiddle.left);

      componentInstance.placement = 'above';
      componentInstance.verticalAlignment = 'bottom';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.aboveBottom.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveBottom.left);

      componentInstance.placement = 'below';
      componentInstance.verticalAlignment = 'bottom';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.belowBottom.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.belowBottom.left);

      componentInstance.placement = 'below';
      componentInstance.verticalAlignment = 'middle';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.belowMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.belowMiddle.left);

      componentInstance.placement = 'below';
      componentInstance.verticalAlignment = 'top';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.belowTop.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.belowTop.left);
    });

    it('should affix element using horizontal alignments', async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.placement = 'above';
      componentInstance.horizontalAlignment = 'left';
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.aboveLeft.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveLeft.left);

      componentInstance.placement = 'above';
      componentInstance.horizontalAlignment = 'right';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.aboveRight.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveRight.left);

      componentInstance.placement = 'below';
      componentInstance.horizontalAlignment = 'left';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.belowLeft.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.belowLeft.left);

      componentInstance.placement = 'below';
      componentInstance.horizontalAlignment = 'right';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.belowRight.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.belowRight.left);
    });

    it('should update placement on window scroll', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.isSticky = true;
      componentInstance.enableAutoFit = true;
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('above');

      // Scroll down until the affixed item is clipped at its top, then trigger the scroll event.
      window.scrollTo(0, 247);
      SkyAppTestUtility.fireDomEvent(window.visualViewport, 'scroll');
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('below');
    });

    it('should have null placement when scrolled out of view', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.isSticky = true;
      componentInstance.enableAutoFit = true;
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('above');

      // Scroll down until the base item is out of view, then trigger the scroll event.
      window.scrollTo(0, 256);
      SkyAppTestUtility.fireDomEvent(window.visualViewport, 'scroll');
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toBeNull();
    });

    it('should update placement on window resize', async () => {
      const { fixture, getRecentPlacementChange, viewportRulerResize } =
        await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.isSticky = true;
      componentInstance.enableAutoFit = true;
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('above');

      // Scroll down until the affixed item is clipped at its top, then trigger the resize event.
      window.scrollTo(0, 200);
      viewportRulerResize();
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('below');
    });

    it('should update placement on parent element scroll', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableOverflowParent = true;
      fixture.detectChanges();

      componentInstance.isSticky = true;
      componentInstance.enableAutoFit = true;
      componentInstance.scrollTargetIntoView();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('above');

      componentInstance.scrollTargetToTop();
      triggerParentScroll(fixture);

      expect(getRecentPlacementChange()).toEqual('below');
    });

    it('should find a suitable placement if preferred placement is hidden', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'above';
      componentInstance.scrollTargetOutOfView();
      fixture.detectChanges();

      // Initially, the affixed element should be out of view, so the placement should be null.
      expect(getRecentPlacementChange()).toBeNull();

      componentInstance.scrollTargetToTop();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      // The 'above' placement is hidden, so it should land on 'below'.
      expect(getRecentPlacementChange()).toEqual('below');
    });

    it('should update placement on parent element scroll, using below placement', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.placement = 'below';
      window.scrollTo(0, 255);
      SkyAppTestUtility.fireDomEvent(window.visualViewport, 'scroll');
      fixture.detectChanges();
      expect(getRecentPlacementChange()).toBeNull();
    });

    it('should allow ignoring overflow parent boundaries when using auto-fit', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableOverflowParent = true;
      fixture.detectChanges();

      componentInstance.autoFitContext = SkyAffixAutoFitContext.Viewport;
      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.placement = 'below';
      componentInstance.scrollTargetIntoView();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('below');

      componentInstance.scrollTargetToBottom();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      // Because the auto-fit context is now set to Viewport, the auto-fit functionality shouldn't
      // fire when the affixed element's offset is located outside of the nearest scrollable parent.
      // (Normally, the placement would be changed from 'below' to 'above'.)
      expect(getRecentPlacementChange()).toEqual('below');
    });

    it("should slightly adjust `left` if affixed element's edges are flush with overflow parent", async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'above';
      fixture.detectChanges();

      componentInstance.scrollTargetToLeft();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();
      expect(affixedOffset.left).toEqual(0);

      componentInstance.scrollTargetToRight();
      triggerParentScroll(fixture);

      fixture.detectChanges();

      affixedOffset = getAffixedOffset();
      const parentRect =
        componentInstance.overflowParentRef.nativeElement.getBoundingClientRect();
      const affixedRect =
        componentInstance.affixedRef.nativeElement.getBoundingClientRect();
      const expectedLeft = parentRect.width - affixedRect.width;
      expect(affixedOffset.left).toEqual(expectedLeft);
    });

    it("should slightly adjust `top` if affixed element's edges are flush with overflow parent", async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'left';
      fixture.detectChanges();

      componentInstance.scrollTargetToTop();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();
      expect(affixedOffset.top).toEqual(0);

      componentInstance.scrollTargetToBottom();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();
      const parentRect =
        componentInstance.overflowParentRef.nativeElement.getBoundingClientRect();
      const affixedRect =
        componentInstance.affixedRef.nativeElement.getBoundingClientRect();
      const expectedTop = parentRect.height - affixedRect.height;
      expect(affixedOffset.top).toEqual(expectedTop);
    });

    it('should never detach affixed element `left` from base element', async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'above';
      componentInstance.horizontalAlignment = 'left';
      fixture.detectChanges();

      const offset = 100;

      componentInstance.scrollTargetToLeft(offset * -1);
      triggerParentScroll(fixture);
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();
      let baseRect =
        componentInstance.baseRef.nativeElement.getBoundingClientRect();
      expect(affixedOffset.left).toEqual(baseRect.left);

      componentInstance.scrollTargetToRight(offset);
      triggerParentScroll(fixture);

      fixture.detectChanges();

      affixedOffset = getAffixedOffset();
      baseRect =
        componentInstance.baseRef.nativeElement.getBoundingClientRect();

      expect(affixedOffset.left).toEqual(baseRect.left);
    });

    it('should never detach affixed element `top` from base element', async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'right';
      componentInstance.verticalAlignment = 'top';
      fixture.detectChanges();

      const offset = 100;

      componentInstance.scrollTargetToTop(offset * -1);
      triggerParentScroll(fixture);
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();
      let baseRect =
        componentInstance.baseRef.nativeElement.getBoundingClientRect();

      expect(affixedOffset.top).toEqual(baseRect.top);

      componentInstance.scrollTargetToBottom(offset);
      triggerParentScroll(fixture);

      fixture.detectChanges();

      affixedOffset = getAffixedOffset();
      baseRect =
        componentInstance.baseRef.nativeElement.getBoundingClientRect();

      expect(affixedOffset.top).toEqual(baseRect.top);
    });

    it('should emit when placement changes', async () => {
      const { fixture } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableAutoFit = false;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      fixture.detectChanges();

      // Trigger a change.
      componentInstance.enableAutoFit = true;
      fixture.detectChanges();

      const spy = spyOn(
        componentInstance,
        'onAffixPlacementChange',
      ).and.callThrough();

      // Scroll to make base element visible.
      componentInstance.scrollTargetToTop();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith({
        placement: 'below',
      });
      expect(spy.calls.count()).toEqual(1);
      spy.calls.reset();

      // Scroll to hide base element.
      componentInstance.scrollTargetOutOfView();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith({
        placement: null,
      });
      expect(spy.calls.count()).toEqual(1);
      spy.calls.reset();
    });

    it('should be accessible', async () => {
      const { fixture } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.enableOverflowParent = true;
      componentInstance.scrollTargetToTop();
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should find correct placements when the base element is larger than the affixed element', async () => {
      const { fixture, getAffixedOffset } = await setupTest();
      const componentInstance = fixture.componentInstance;

      fixture.detectChanges();

      // First, get the original base element's width value.
      const originalBaseElementWidth =
        componentInstance.baseRef.nativeElement.getBoundingClientRect().width;

      componentInstance.enableLargerBaseElement = true;
      componentInstance.placement = 'above';
      fixture.detectChanges();

      // Then, get the new base element's width after resize.
      const baseElementWidth =
        componentInstance.baseRef.nativeElement.getBoundingClientRect().width;

      // Finally, calculate the offset difference so we can use it in our calculations.
      const offsetDifference =
        baseElementWidth / 2 - originalBaseElementWidth / 2;

      let affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(
        expectedOffsets.aboveCenter.top - offsetDifference,
      );
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveCenter.left);

      componentInstance.placement = 'right';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.rightMiddle.top);
      expect(affixedOffset.left).toEqual(
        expectedOffsets.rightMiddle.left + offsetDifference,
      );

      componentInstance.placement = 'below';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(
        expectedOffsets.belowCenter.top + offsetDifference,
      );
      expect(affixedOffset.left).toEqual(expectedOffsets.belowCenter.left);

      componentInstance.placement = 'left';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.leftMiddle.top);
      expect(affixedOffset.left).toEqual(
        expectedOffsets.leftMiddle.left - offsetDifference,
      );
    });

    it('should emit when affixed element offset changes', async () => {
      const { fixture, getRecentOffsetChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      fixture.detectChanges();

      const firstOffset = getRecentOffsetChange();

      // Scroll to trigger offset change.
      componentInstance.scrollTargetToTop();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(getRecentOffsetChange()).not.toEqual(firstOffset);
    });

    it('should emit when the overflow parent scrolls', async () => {
      const { fixture, getNumOverflowScrollEmitted } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      fixture.detectChanges();

      expect(getNumOverflowScrollEmitted()).toEqual(0);

      // Scroll to trigger offset change.
      componentInstance.scrollTargetToTop();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(getNumOverflowScrollEmitted()).toEqual(1);
    });

    it('should allow re-running the affix calculation', async () => {
      const { fixture, getAffixer, getRecentPlacementChange } =
        await setupTest();
      const componentInstance = fixture.componentInstance;
      const preferredPlacement = 'right';

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = preferredPlacement;
      fixture.detectChanges();

      componentInstance.scrollTargetIntoView();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual(preferredPlacement);

      // Scroll to right to make the affixer find a new placement.
      componentInstance.scrollTargetToRight();
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('left');

      getAffixer()?.reaffix();
      fixture.detectChanges();

      // The placement change emitter should be exactly the same as before since we're forcing the
      // affix functionality to be called again.
      expect(getRecentPlacementChange()).toEqual('left');
    });

    it('should emit a placement of `null` if base element hidden', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      componentInstance.placement = 'above';
      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.autoFitContext = SkyAffixAutoFitContext.Viewport;
      componentInstance.enableOverflowParent = true;
      fixture.detectChanges();

      componentInstance.scrollTargetToBottom();
      SkyAppTestUtility.fireDomEvent(window.visualViewport, 'scroll');
      fixture.detectChanges();

      // Confirm baseline expectation.
      expect(getRecentPlacementChange()).toEqual('above');

      // Scroll base element out of view.
      const baseElementHeight =
        componentInstance.baseRef.nativeElement.getBoundingClientRect().height;
      componentInstance.scrollTargetToBottom(baseElementHeight);
      SkyAppTestUtility.fireDomEvent(window.visualViewport, 'scroll');
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toBeNull();
    });

    it('should handle empty `autoFitOverflowOffset` properties', async () => {
      const { fixture, getRecentPlacementChange } = await setupTest();
      const componentInstance = fixture.componentInstance;

      // All properties are left undefined.
      const offset: SkyAffixOffset = {};

      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'right';
      fixture.detectChanges();

      const affixedElementWidth =
        componentInstance.affixedRef.nativeElement.getBoundingClientRect()
          .width;

      componentInstance.scrollTargetToRight(affixedElementWidth);
      triggerParentScroll(fixture);
      fixture.detectChanges();

      expect(getRecentPlacementChange()).toEqual('right');

      componentInstance.autoFitOverflowOffset = offset;
      triggerParentScroll(fixture);
      fixture.detectChanges();

      // The placement should be the same since the offset did not include any new values.
      expect(getRecentPlacementChange()).toEqual('right');
    });
  }

  afterEach(() => {
    if (ngUnsubscribe) {
      ngUnsubscribe.next();
      ngUnsubscribe.complete();
      ngUnsubscribe = undefined;
    }

    // Reset body height/width.
    window.document.body.style.height = 'initial';
    window.document.body.style.width = 'initial';
  });

  describe('with position fixed', () => {
    runTestsForPosition('fixed');
    runTestsForPosition(undefined);
  });

  describe('with position absolute', () => {
    runTestsForPosition('absolute');
  });
});
