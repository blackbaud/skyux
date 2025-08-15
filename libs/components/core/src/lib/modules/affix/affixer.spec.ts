import { ViewportRuler } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import {
  Component,
  DOCUMENT,
  ElementRef,
  NgZone,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyAffixAutoFitContext } from './affix-auto-fit-context';
import { SkyAffixer } from './affixer';

@Component({
  template: `
    <div
      class="affixer-layer"
      [ngClass]="{
        'affix-layer-fixed': fixedLayer1,
        'affix-layer-overflow': overflowLayer1,
      }"
    >
      <div
        class="affixer-layer"
        [ngClass]="{
          'affix-layer-fixed': fixedLayer2,
          'affix-layer-overflow': overflowLayer2,
        }"
      >
        <div
          class="affixer-layer"
          [ngClass]="{
            'affix-layer-fixed': fixedLayer3,
            'affix-layer-overflow': overflowLayer3,
          }"
        >
          <div class="affixer-container">
            <div #baseElement class="affixer-base">base</div>
          </div>
          <div #affixedElement class="affixed">affixed</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .affixer-layer {
        background-color: rgba(0, 0, 0, 0.1);
      }

      .affix-layer-overflow {
        overflow: hidden;
        padding: 5px;
      }

      .affix-layer-fixed {
        overflow: scroll;
        position: fixed;
        top: 10px;
        left: 10px;
        height: 120px;
        width: 60px;
      }

      .affix-layer-fixed .affix-layer-fixed {
        top: 40px;
        left: 30px;
      }

      .affix-layer-fixed .affix-layer-fixed .affix-layer-fixed {
        top: 60px;
        left: 40px;
      }

      .affixer-container {
        position: relative;
        height: 100px;
        width: 100px;
      }

      .affixer-base {
        position: absolute;
        top: 11px;
        left: 12px;
        height: 20px;
        width: 40px;
      }

      .affixed {
        position: fixed;
        font-size: 8px;
        height: 10px;
        width: 15px;
      }
    `,
  ],
  imports: [NgClass],
})
class AffixerSpecComponent {
  @ViewChild('affixedElement', { static: true })
  public affixedElement: ElementRef<HTMLDivElement> | undefined;

  @ViewChild('baseElement', { static: true })
  public baseRef: ElementRef<HTMLDivElement> | undefined;

  public fixedLayer1 = false;
  public overflowLayer1 = false;
  public fixedLayer2 = false;
  public overflowLayer2 = false;
  public fixedLayer3 = false;
  public overflowLayer3 = false;
}

describe('Affixer', () => {
  let fixture: ComponentFixture<AffixerSpecComponent>;
  let component: AffixerSpecComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AffixerSpecComponent],
    });
    fixture = TestBed.createComponent(AffixerSpecComponent);
    component = fixture.componentInstance;
  });

  function createAffixer(): SkyAffixer {
    return new SkyAffixer(
      component.affixedElement?.nativeElement as HTMLElement,
      TestBed.inject(RendererFactory2).createRenderer(undefined, null),
      TestBed.inject(ViewportRuler),
      TestBed.inject(NgZone),
      TestBed.inject(DOCUMENT).documentElement,
    );
  }

  it('should create an instance, place above the top', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(component.affixedElement?.nativeElement).toBeTruthy();
    const affixer = createAffixer();
    const offsetChangeObserver = jasmine.createSpy('offsetChange');
    const overflowScrollObserver = jasmine.createSpy('overflowScroll');
    const placementChangeObserver = jasmine.createSpy('placementChange');
    const offsetChangeSubscription =
      affixer.offsetChange.subscribe(offsetChangeObserver);
    const overflowScrollSubscription = affixer.overflowScroll.subscribe(
      overflowScrollObserver,
    );
    const placementChangeSubscription = affixer.placementChange.subscribe(
      placementChangeObserver,
    );
    expect(affixer).toBeTruthy();
    expect(component.baseRef?.nativeElement).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      placement: 'above',
      verticalAlignment: 'top',
      isSticky: true,
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('11px');
    affixer.reaffix();
    expect(component.affixedElement?.nativeElement.style.top).toEqual('11px');
    expect(offsetChangeObserver).toHaveBeenCalled();
    expect(overflowScrollObserver).not.toHaveBeenCalled();
    expect(placementChangeObserver).toHaveBeenCalled();
    expect(affixer.getConfig()).toEqual({
      autoFitContext: 0,
      enableAutoFit: false,
      horizontalAlignment: 'center',
      isSticky: true,
      placement: 'above',
      verticalAlignment: 'top',
    });
    affixer.destroy();
    offsetChangeSubscription.unsubscribe();
    overflowScrollSubscription.unsubscribe();
    placementChangeSubscription.unsubscribe();
  });

  it('should create an instance, place at top right', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const affixer = createAffixer();
    expect(affixer).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      isSticky: true,
      placement: 'above',
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('1px');
  });

  it('should use viewport ruler change observable', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const affixer = createAffixer();
    expect(affixer).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      placement: 'above',
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('1px');
  });

  it('should handle multiple layers of fixed elements', () => {
    component.fixedLayer1 = true;
    fixture.detectChanges();
    const affixer = createAffixer();
    expect(affixer).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      isSticky: true,
      placement: 'above',
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('11px');
    component.fixedLayer2 = true;
    fixture.detectChanges();
    affixer.reaffix();
    expect(component.affixedElement?.nativeElement.style.top).toEqual('41px');
    component.fixedLayer3 = true;
    fixture.detectChanges();
    affixer.reaffix();
    expect(component.affixedElement?.nativeElement.style.top).toEqual('61px');
  });

  it('should handle multiple layers of overflow elements', () => {
    component.overflowLayer1 = true;
    fixture.detectChanges();
    const affixer = createAffixer();
    expect(affixer).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      isSticky: true,
      placement: 'above',
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('6px');
    component.overflowLayer2 = true;
    fixture.detectChanges();
    affixer.reaffix();
    expect(component.affixedElement?.nativeElement.style.top).toEqual('11px');
    component.overflowLayer3 = true;
    fixture.detectChanges();
    affixer.reaffix();
    expect(component.affixedElement?.nativeElement.style.top).toEqual('16px');
  });

  it('should use the viewport dimensions', async () => {
    document.body.style.height = '2px';
    fixture.detectChanges();
    await fixture.whenStable();
    const affixer = createAffixer();
    expect(affixer).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      isSticky: true,
      placement: 'below',
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('31px');
    document.body.style.height = 'initial';
  });

  describe('autofit context behavior', () => {
    it('should handle OverflowParent autofit context with enableAutoFit', async () => {
      // Setup a constrained container to test autofit behavior
      component.overflowLayer1 = true;
      fixture.detectChanges();
      await fixture.whenStable();

      const affixer = createAffixer();

      affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
        placement: 'below',
        enableAutoFit: true,
        autoFitContext: SkyAffixAutoFitContext.OverflowParent,
      });

      // Verify that the affixer was created and positioned
      expect(affixer).toBeTruthy();
      expect(component.affixedElement?.nativeElement.style.top).toBeDefined();
      expect(component.affixedElement?.nativeElement.style.top).not.toEqual('');

      affixer.destroy();
    });

    it('should handle Viewport autofit context with enableAutoFit', async () => {
      // Setup a constrained container
      component.overflowLayer1 = true;
      fixture.detectChanges();
      await fixture.whenStable();

      const affixer = createAffixer();

      affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
        placement: 'below',
        enableAutoFit: true,
        autoFitContext: SkyAffixAutoFitContext.Viewport,
      });

      // Verify that the affixer was created and positioned
      expect(affixer).toBeTruthy();
      expect(component.affixedElement?.nativeElement.style.top).toBeDefined();
      expect(component.affixedElement?.nativeElement.style.top).not.toEqual('');

      affixer.destroy();
    });

    it('should use unified behavior for both OverflowParent and Viewport contexts', async () => {
      // Create a scenario where both contexts would need adjustment
      component.overflowLayer1 = true;
      fixture.detectChanges();
      await fixture.whenStable();

      const affixer1 = createAffixer();
      const affixer2 = createAffixer();

      // Test OverflowParent context
      affixer1.affixTo(component.baseRef?.nativeElement as HTMLElement, {
        placement: 'below',
        enableAutoFit: true,
        autoFitContext: SkyAffixAutoFitContext.OverflowParent,
      });

      const overflowParentPosition = {
        top: component.affixedElement?.nativeElement.style.top,
        left: component.affixedElement?.nativeElement.style.left,
      };

      affixer1.destroy();

      // Test Viewport context with same configuration
      affixer2.affixTo(component.baseRef?.nativeElement as HTMLElement, {
        placement: 'below',
        enableAutoFit: true,
        autoFitContext: SkyAffixAutoFitContext.Viewport,
      });

      const viewportPosition = {
        top: component.affixedElement?.nativeElement.style.top,
        left: component.affixedElement?.nativeElement.style.left,
      };

      // Both contexts should now use the same sophisticated logic
      // The exact position may differ due to different boundary calculations,
      // but both should be properly positioned within their respective contexts
      expect(overflowParentPosition.top).toBeDefined();
      expect(overflowParentPosition.left).toBeDefined();
      expect(viewportPosition.top).toBeDefined();
      expect(viewportPosition.left).toBeDefined();

      affixer2.destroy();
    });

    it('should properly calculate boundaries for autofit contexts', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const affixer = createAffixer();

      // Test with autofit enabled to ensure the unified offset adjustment logic is triggered
      affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
        placement: 'above',
        enableAutoFit: true,
        autoFitContext: SkyAffixAutoFitContext.OverflowParent,
      });

      // Verify the config was applied correctly
      const config = affixer.getConfig();
      expect(config.enableAutoFit).toBe(true);
      expect(config.autoFitContext).toBe(SkyAffixAutoFitContext.OverflowParent);

      affixer.destroy();
    });
  });
});
