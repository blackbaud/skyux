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
  AffixFixtureComponent
} from './fixtures/affix.component.fixture';

import {
  AffixFixturesModule
} from './fixtures/affix.module.fixture';

import {
  SkyAffixAutoFitContext
} from './affix-auto-fit-context';

import {
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixOffset
} from './affix-offset';

import {
  SkyAffixer
} from './affixer';

describe('Affix directive', () => {

  const expectedOffsets = {
    aboveLeft: {
      top: 195,
      left: 245
    },
    aboveCenter: {
      top: 195,
      left: 225
    },
    aboveRight: {
      top: 195,
      left: 205
    },
    belowLeft: {
      top: 255,
      left: 245
    },
    belowCenter: {
      top: 255,
      left: 225
    },
    belowRight: {
      top: 255,
      left: 205
    },
    rightTop: {
      top: 245,
      left: 255
    },
    rightMiddle: {
      top: 225,
      left: 255
    },
    rightBottom: {
      top: 205,
      left: 255
    },
    leftTop: {
      top: 245,
      left: 195
    },
    leftMiddle: {
      top: 225,
      left: 195
    },
    leftBottom: {
      top: 205,
      left: 195
    }
  };

  let fixture: ComponentFixture<AffixFixtureComponent>;
  let componentInstance: AffixFixtureComponent;

  function getAffixer(): SkyAffixer {
    return componentInstance.affixDirective['affixer'];
  }

  function triggerParentScroll(): void {
    SkyAppTestUtility.fireDomEvent(
      componentInstance.overflowParentRef.nativeElement,
      'scroll',
      { bubbles: false }
    );
  }

  function getAffixedOffset(): SkyAffixOffset {
    const styles = window.getComputedStyle(componentInstance.affixedRef.nativeElement);
    return {
      top: +styles.top.split('px')[0],
      left: +styles.left.split('px')[0]
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AffixFixturesModule
      ]
    });

    fixture = TestBed.createComponent(AffixFixtureComponent);
    componentInstance = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set default config', () => {
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
      verticalAlignment: 'middle'
    };

    expect(affixer['config']).toEqual(expectedConfig);
    expect(affixedOffset.top).toEqual(expectedOffsets.aboveCenter.top);
    expect(affixedOffset.left).toEqual(expectedOffsets.aboveCenter.left);
  });

  it('should place affixed element on all sides of the base element', () => {
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

  it('should allow adjustments to overflow parent offset', () => {
    const offset: SkyAffixOffset = {
      bottom: 10,
      left: 10,
      right: 10,
      top: 10
    };

    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    componentInstance.placement = 'right';
    fixture.detectChanges();

    const affixer = getAffixer();
    const offsetSpy = spyOn(affixer as any, 'getPreferredOffset').and.callThrough();
    const affixedElementWidth = componentInstance.affixedRef.nativeElement
      .getBoundingClientRect().width;

    componentInstance.scrollTargetToRight(affixedElementWidth);
    triggerParentScroll();
    fixture.detectChanges();

    // The placement shouldn't change.
    expect(offsetSpy.calls.allArgs()).toEqual([
      ['right']
    ]);
    offsetSpy.calls.reset();

    componentInstance.autoFitOverflowOffset = offset;
    fixture.detectChanges();

    // The placement should now change since the overflow offset was added.
    expect(offsetSpy.calls.allArgs()).toEqual([
      ['right'],
      ['left']
    ]);
  });

  it('should affix element using vertical alignments', () => {
    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    let affixedOffset = getAffixedOffset();

    expect(affixedOffset.top).toEqual(expectedOffsets.rightTop.top);
    expect(affixedOffset.left).toEqual(expectedOffsets.rightTop.left);

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
    componentInstance.verticalAlignment = 'bottom';
    fixture.detectChanges();

    affixedOffset = getAffixedOffset();

    expect(affixedOffset.top).toEqual(expectedOffsets.leftBottom.top);
    expect(affixedOffset.left).toEqual(expectedOffsets.leftBottom.left);

  });

  it('should affix element using horizontal alignments', () => {
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

  it('should update placement on window scroll', () => {
    fixture.detectChanges();

    const affixer = getAffixer();
    const affixSpy = spyOn(affixer as any, 'affix').and.callThrough();

    componentInstance.isSticky = true;
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(1);

    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(2);
  });

  it('should update placement on window resize', () => {
    fixture.detectChanges();

    const affixer = getAffixer();
    const affixSpy = spyOn(affixer as any, 'affix').and.callThrough();

    componentInstance.isSticky = true;
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(1);

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(2);
  });

  it('should update placement on parent element scroll', () => {
    componentInstance.enableOverflowParent = true;
    fixture.detectChanges();

    const affixer = getAffixer();
    const affixSpy = spyOn(affixer as any, 'affix').and.callThrough();

    componentInstance.isSticky = true;
    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(1);
    affixSpy.calls.reset();

    triggerParentScroll();

    fixture.detectChanges();

    expect(affixSpy.calls.count()).toEqual(1);
  });

  it('should find a suitable placement if preferred placement is hidden', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    componentInstance.placement = 'above';
    componentInstance.scrollTargetOutOfView();

    const affixer = getAffixer();
    const offsetSpy = spyOn(affixer as any, 'getPreferredOffset').and.callThrough();

    fixture.detectChanges();

    // Initially, the affixed element should be out of view, so all placements should be checked.
    // (It should settle on the preferred placement if all placements are hidden.)
    expect(offsetSpy.calls.allArgs()).toEqual([
      ['above'],
      ['below'],
      ['left'],
      ['right'],
      ['above'] // <-- preferred placement
    ]);
    offsetSpy.calls.reset();

    componentInstance.scrollTargetToTop();
    triggerParentScroll();
    fixture.detectChanges();

    // The 'above' placement is hidden, so it should land on 'below'.
    expect(offsetSpy.calls.allArgs()).toEqual([
      ['above'],
      ['below']
    ]);
  });

  it('should allow ignoring overflow parent boundaries when using auto-fit', () => {
    componentInstance.autoFitContext = SkyAffixAutoFitContext.Viewport;
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    componentInstance.placement = 'below';

    const affixer = getAffixer();
    fixture.detectChanges();

    componentInstance.scrollTargetToBottom();
    const offsetSpy = spyOn(affixer as any, 'getPreferredOffset').and.callThrough();
    triggerParentScroll();
    fixture.detectChanges();

    // Because the auto-fit context is now set to Window, the auto-fit functionality shouldn't
    // fire when the affixed element's offset is located outside of the nearest scrollable parent.
    // (Normally, the placement would be changed from 'below' to 'above'.)
    expect(offsetSpy.calls.allArgs()).toEqual([
      ['below']
    ]);
  });

  it(
    'should slightly adjust `left` if affixed element\'s edges are flush with overflow parent',
    () => {
      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'above';
      fixture.detectChanges();

      componentInstance.scrollTargetToLeft();
      triggerParentScroll();
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();
      expect(affixedOffset.left).toEqual(0);

      componentInstance.scrollTargetToRight();
      triggerParentScroll();

      fixture.detectChanges();

      affixedOffset = getAffixedOffset();
      const parentRect = componentInstance.overflowParentRef.nativeElement.getBoundingClientRect();
      const affixedRect = componentInstance.affixedRef.nativeElement.getBoundingClientRect();
      const expectedLeft = parentRect.width - affixedRect.width;
      expect(affixedOffset.left).toEqual(expectedLeft);
    }
  );

  it(
    'should slightly adjust `top` if affixed element\'s edges are flush with overflow parent',
    () => {
      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableOverflowParent = true;
      componentInstance.placement = 'left';
      fixture.detectChanges();

      componentInstance.scrollTargetToTop();
      triggerParentScroll();
      fixture.detectChanges();

      let affixedOffset = getAffixedOffset();
      expect(affixedOffset.top).toEqual(0);

      componentInstance.scrollTargetToBottom();
      triggerParentScroll();
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();
      const parentRect = componentInstance.overflowParentRef.nativeElement.getBoundingClientRect();
      const affixedRect = componentInstance.affixedRef.nativeElement.getBoundingClientRect();
      const expectedTop = parentRect.height - affixedRect.height;
      expect(affixedOffset.top).toEqual(expectedTop);
    }
  );

  it('should never detach affixed element `left` from base element', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    const offset = 100;

    componentInstance.scrollTargetToLeft(offset * -1);
    triggerParentScroll();
    fixture.detectChanges();

    let affixedOffset = getAffixedOffset();
    let baseRect = componentInstance.baseRef.nativeElement.getBoundingClientRect();
    expect(affixedOffset.left).toEqual(baseRect.left);

    componentInstance.scrollTargetToRight(offset);
    triggerParentScroll();

    fixture.detectChanges();

    affixedOffset = getAffixedOffset();
    baseRect = componentInstance.baseRef.nativeElement.getBoundingClientRect();

    expect(affixedOffset.left).toEqual(baseRect.left);
  });

  it('should never detach affixed element `top` from base element', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    const offset = 100;

    componentInstance.scrollTargetToTop(offset * -1);
    triggerParentScroll();
    fixture.detectChanges();

    let affixedOffset = getAffixedOffset();
    let baseRect = componentInstance.baseRef.nativeElement.getBoundingClientRect();

    expect(affixedOffset.top).toEqual(baseRect.top);

    componentInstance.scrollTargetToBottom(offset);
    triggerParentScroll();

    fixture.detectChanges();

    affixedOffset = getAffixedOffset();
    baseRect = componentInstance.baseRef.nativeElement.getBoundingClientRect();

    expect(affixedOffset.top).toEqual(baseRect.top);
  });

  it('should emit when placement changes', () => {
    componentInstance.enableAutoFit = false;
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    fixture.detectChanges();

    // Trigger a change.
    componentInstance.enableAutoFit = true;
    fixture.detectChanges();

    const spy = spyOn(componentInstance, 'onAffixPlacementChange').and.callThrough();

    // Scroll to make base element visible.
    componentInstance.scrollTargetToTop();
    triggerParentScroll();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      placement: 'below'
    });
    expect(spy.calls.count()).toEqual(1);
    spy.calls.reset();

    // Scroll to hide base element.
    componentInstance.scrollTargetOutOfView();
    triggerParentScroll();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      /* tslint:disable-next-line:no-null-keyword */
      placement: null
    });
    expect(spy.calls.count()).toEqual(1);
    spy.calls.reset();
  });

  it('should be accessible', async(() => {
    componentInstance.enableOverflowParent = true;
    componentInstance.scrollTargetToTop();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  it(
    'should find correct placements when the base element is larger than the affixed element',
    () => {
      fixture.detectChanges();

      // First, get the original base element's width value.
      const originalBaseElementWidth = componentInstance.baseRef.nativeElement
        .getBoundingClientRect().width;

      componentInstance.enableLargerBaseElement = true;
      componentInstance.placement = 'above';
      fixture.detectChanges();

      // Then, get the new base element's width after resize.
      const baseElementWidth = componentInstance.baseRef.nativeElement
        .getBoundingClientRect().width;

      // Finally, calculate the offset difference so we can use it in our calculations.
      const offsetDifference = (baseElementWidth / 2) - (originalBaseElementWidth / 2);

      let affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.aboveCenter.top - offsetDifference);
      expect(affixedOffset.left).toEqual(expectedOffsets.aboveCenter.left);

      componentInstance.placement = 'right';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.rightMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.rightMiddle.left + offsetDifference);

      componentInstance.placement = 'below';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.belowCenter.top + offsetDifference);
      expect(affixedOffset.left).toEqual(expectedOffsets.belowCenter.left);

      componentInstance.placement = 'left';
      fixture.detectChanges();

      affixedOffset = getAffixedOffset();

      expect(affixedOffset.top).toEqual(expectedOffsets.leftMiddle.top);
      expect(affixedOffset.left).toEqual(expectedOffsets.leftMiddle.left - offsetDifference);
    }
  );

  it('should emit when affixed element offset changes', () => {
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    fixture.detectChanges();

    const spy = spyOn(componentInstance, 'onAffixOffsetChange').and.callThrough();

    // Scroll to trigger offset change.
    componentInstance.scrollTargetToTop();
    triggerParentScroll();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toEqual(1);
    spy.calls.reset();
  });

  it('should emit when the overflow parent scrolls', () => {
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    fixture.detectChanges();

    const spy = spyOn(componentInstance, 'onAffixOverflowScroll').and.callThrough();

    // Scroll to trigger offset change.
    componentInstance.scrollTargetToTop();
    triggerParentScroll();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toEqual(1);
    spy.calls.reset();
  });

  it('should allow re-running the affix calculation', () => {
    const preferredPlacement = 'right';

    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableOverflowParent = true;
    componentInstance.placement = preferredPlacement;
    fixture.detectChanges();

    const affixer = getAffixer();
    const placementSpy = spyOn(componentInstance, 'onAffixPlacementChange').and.callThrough();

    // Scroll to right to make the affixer find a new placement.
    componentInstance.scrollTargetToRight();
    triggerParentScroll();
    fixture.detectChanges();

    expect(placementSpy.calls.allArgs()).toEqual([
      [{ placement: 'left' }]
    ]);
    placementSpy.calls.reset();

    const affixSpy = spyOn(affixer as any, 'affix').and.callThrough();

    affixer.reaffix();
    fixture.detectChanges();

    expect(affixSpy).toHaveBeenCalled();

    // The placement change emitter should be exactly the same as before since we're forcing the
    // affix functionality to be called again.
    expect(placementSpy.calls.allArgs()).toEqual([
      [{ placement: 'left' }]
    ]);
  });

  it('should emit a placement of `null` if base element hidden', () => {
    componentInstance.placement = 'above';
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.autoFitContext = SkyAffixAutoFitContext.Viewport;
    componentInstance.enableOverflowParent = true;
    fixture.detectChanges();

    const spy = spyOn(componentInstance, 'onAffixPlacementChange').and.callThrough();

    expect(spy).not.toHaveBeenCalled();

    componentInstance.scrollTargetToBottom();
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();

    // Confirm baseline expectation.
    expect(spy).toHaveBeenCalledWith({
      placement: 'above'
    });
    spy.calls.reset();

    // Scroll base element out of view.
    const baseElementHeight = componentInstance.baseRef.nativeElement
      .getBoundingClientRect().height;
    componentInstance.scrollTargetToBottom(baseElementHeight);
    SkyAppTestUtility.fireDomEvent(window, 'scroll');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      /*tslint:disable-next-line:no-null-keyword*/
      placement: null
    });
  });

});
