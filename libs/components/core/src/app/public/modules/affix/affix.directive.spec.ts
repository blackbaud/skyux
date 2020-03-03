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
  SkyAffixConfig
} from './affix-config';

import {
  SkyAffixer
} from './affixer';

describe('Affix directive', () => {

  const expectedOffsets = {
    aboveLeft: {
      top: '195px',
      left: '245px'
    },
    aboveCenter: {
      top: '195px',
      left: '225px'
    },
    aboveRight: {
      top: '195px',
      left: '205px'
    },
    belowLeft: {
      top: '255px',
      left: '245px'
    },
    belowCenter: {
      top: '255px',
      left: '225px'
    },
    belowRight: {
      top: '255px',
      left: '205px'
    },
    rightTop: {
      top: '245px',
      left: '255px'
    },
    rightMiddle: {
      top: '225px',
      left: '255px'
    },
    rightBottom: {
      top: '205px',
      left: '255px'
    },
    leftTop: {
      top: '245px',
      left: '195px'
    },
    leftMiddle: {
      top: '225px',
      left: '195px'
    },
    leftBottom: {
      top: '205px',
      left: '195px'
    }
  };

  let fixture: ComponentFixture<AffixFixtureComponent>;
  let componentInstance: AffixFixtureComponent;

  function getAffixer(): SkyAffixer {
    return componentInstance.affixDirective['affixer'];
  }

  function getAffixedElementStyle(): CSSStyleDeclaration {
    return window.getComputedStyle(componentInstance.affixedRef.nativeElement);
  }

  function triggerParentScroll(): void {
    SkyAppTestUtility.fireDomEvent(
      componentInstance.scrollableParentRef.nativeElement,
      'scroll',
      { bubbles: false }
    );
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
    const affixedElementStyles = getAffixedElementStyle();

    const expectedConfig: SkyAffixConfig = {
      enableAutoFit: false,
      placement: 'above',
      isSticky: false,
      horizontalAlignment: 'center',
      verticalAlignment: 'middle'
    };

    expect(affixer['config']).toEqual(expectedConfig);
    expect(affixedElementStyles.top).toEqual(expectedOffsets.aboveCenter.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.aboveCenter.left);
  });

  it('should place affixed element on all sides of the base element', () => {
    componentInstance.placement = 'right';
    fixture.detectChanges();

    let affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.rightMiddle.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.rightMiddle.left);

    componentInstance.placement = 'below';
    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.belowCenter.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.belowCenter.left);

    componentInstance.placement = 'left';
    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.leftMiddle.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.leftMiddle.left);
  });

  it('should affix element using vertical alignments', () => {
    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    let affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.rightTop.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.rightTop.left);

    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'bottom';
    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.rightBottom.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.rightBottom.left);

    componentInstance.placement = 'left';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.leftTop.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.leftTop.left);

    componentInstance.placement = 'left';
    componentInstance.verticalAlignment = 'bottom';
    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.leftBottom.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.leftBottom.left);

  });

  it('should affix element using horizontal alignments', () => {
    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    let affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.aboveLeft.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.aboveLeft.left);

    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'right';
    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.aboveRight.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.aboveRight.left);

    componentInstance.placement = 'below';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.belowLeft.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.belowLeft.left);

    componentInstance.placement = 'below';
    componentInstance.horizontalAlignment = 'right';
    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    expect(affixedElementStyles.top).toEqual(expectedOffsets.belowRight.top);
    expect(affixedElementStyles.left).toEqual(expectedOffsets.belowRight.left);
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
    componentInstance.enableScrollableParent = true;
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
    componentInstance.enableScrollableParent = true;
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

  it(
    'should slightly adjust `left` if affixed element\'s edges are flush with scrollable parent',
    () => {
      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableScrollableParent = true;
      componentInstance.placement = 'above';
      fixture.detectChanges();

      componentInstance.scrollTargetToLeft();
      triggerParentScroll();
      fixture.detectChanges();

      let affixedElementStyles = getAffixedElementStyle();
      expect(affixedElementStyles.left).toEqual(`0px`);

      componentInstance.scrollTargetToRight();
      triggerParentScroll();

      fixture.detectChanges();

      affixedElementStyles = getAffixedElementStyle();
      const parentRect = componentInstance.scrollableParentRef.nativeElement.getBoundingClientRect();
      const affixedRect = componentInstance.affixedRef.nativeElement.getBoundingClientRect();
      const expectedLeft = parentRect.width - affixedRect.width;
      expect(affixedElementStyles.left).toEqual(`${expectedLeft}px`);
    }
  );

  it(
    'should slightly adjust `top` if affixed element\'s edges are flush with scrollable parent',
    () => {
      componentInstance.enableAutoFit = true;
      componentInstance.isSticky = true;
      componentInstance.enableScrollableParent = true;
      componentInstance.placement = 'left';
      fixture.detectChanges();

      componentInstance.scrollTargetToTop();
      triggerParentScroll();
      fixture.detectChanges();

      let affixedElementStyles = getAffixedElementStyle();
      expect(affixedElementStyles.top).toEqual(`0px`);

      componentInstance.scrollTargetToBottom();
      triggerParentScroll();
      fixture.detectChanges();

      affixedElementStyles = getAffixedElementStyle();
      const parentRect = componentInstance.scrollableParentRef.nativeElement.getBoundingClientRect();
      const affixedRect = componentInstance.affixedRef.nativeElement.getBoundingClientRect();
      const expectedTop = parentRect.height - affixedRect.height;
      expect(affixedElementStyles.top).toEqual(`${expectedTop}px`);
    }
  );

  it('should never detach affixed element `left` from base element', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
    componentInstance.placement = 'above';
    componentInstance.horizontalAlignment = 'left';
    fixture.detectChanges();

    const offset = 100;

    componentInstance.scrollTargetToLeft(offset * -1);
    triggerParentScroll();
    fixture.detectChanges();

    let affixedElementStyles = getAffixedElementStyle();
    expect(affixedElementStyles.left).toEqual(`-${offset}px`);

    componentInstance.scrollTargetToRight(offset);
    triggerParentScroll();

    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    const baseRect = componentInstance.baseRef.nativeElement.getBoundingClientRect();
    const affixedRect = componentInstance.affixedRef.nativeElement.getBoundingClientRect();
    const expectedLeft = baseRect.right - affixedRect.width;

    expect(affixedElementStyles.left).toEqual(`${expectedLeft}px`);
  });

  it('should never detach affixed element `top` from base element', () => {
    componentInstance.enableAutoFit = true;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
    componentInstance.placement = 'right';
    componentInstance.verticalAlignment = 'top';
    fixture.detectChanges();

    const offset = 100;

    componentInstance.scrollTargetToTop(offset * -1);
    triggerParentScroll();
    fixture.detectChanges();

    let affixedElementStyles = getAffixedElementStyle();
    expect(affixedElementStyles.top).toEqual(`-${offset}px`);

    componentInstance.scrollTargetToBottom(offset);
    triggerParentScroll();

    fixture.detectChanges();

    affixedElementStyles = getAffixedElementStyle();

    const baseRect = componentInstance.baseRef.nativeElement.getBoundingClientRect();
    const affixedRect = componentInstance.affixedRef.nativeElement.getBoundingClientRect();
    const expectedTop = baseRect.bottom - affixedRect.height;

    expect(affixedElementStyles.top).toEqual(`${expectedTop}px`);
  });

  it('should emit when placement changes', () => {
    componentInstance.enableAutoFit = false;
    componentInstance.isSticky = true;
    componentInstance.enableScrollableParent = true;
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
    componentInstance.enableScrollableParent = true;
    componentInstance.scrollTargetToTop();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
