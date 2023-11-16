import { ViewportRuler } from '@angular/cdk/overlay';
import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  NgZone,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyAffixer } from './affixer';

@Component({
  template: `
    <div
      class="affixer-layer"
      [ngClass]="{
        'affix-layer-fixed': fixedLayer1,
        'affix-layer-overflow': overflowLayer1
      }"
    >
      <div
        class="affixer-layer"
        [ngClass]="{
          'affix-layer-fixed': fixedLayer2,
          'affix-layer-overflow': overflowLayer2
        }"
      >
        <div
          class="affixer-layer"
          [ngClass]="{
            'affix-layer-fixed': fixedLayer3,
            'affix-layer-overflow': overflowLayer3
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
  standalone: true,
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

  it('should create an instance, place above the top', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(component.affixedElement?.nativeElement).toBeTruthy();
    const affixer = new SkyAffixer(
      component.affixedElement?.nativeElement as HTMLElement,
      TestBed.inject(RendererFactory2).createRenderer(undefined, null),
      TestBed.inject(ViewportRuler),
      TestBed.inject(NgZone),
      TestBed.inject(DOCUMENT).documentElement,
    );
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
    const affixer = new SkyAffixer(
      component.affixedElement?.nativeElement as HTMLElement,
      TestBed.inject(RendererFactory2).createRenderer(undefined, null),
      TestBed.inject(ViewportRuler),
      TestBed.inject(NgZone),
      TestBed.inject(DOCUMENT).documentElement,
    );
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
    const affixer = new SkyAffixer(
      component.affixedElement?.nativeElement as HTMLElement,
      TestBed.inject(RendererFactory2).createRenderer(undefined, null),
      TestBed.inject(ViewportRuler),
      TestBed.inject(NgZone),
      TestBed.inject(DOCUMENT).documentElement,
    );
    expect(affixer).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      placement: 'above',
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('1px');
  });

  it('should handle multiple layers of fixed elements', async () => {
    component.fixedLayer1 = true;
    fixture.detectChanges();
    const affixer = new SkyAffixer(
      component.affixedElement?.nativeElement as HTMLElement,
      TestBed.inject(RendererFactory2).createRenderer(undefined, null),
      TestBed.inject(ViewportRuler),
      TestBed.inject(NgZone),
      TestBed.inject(DOCUMENT).documentElement,
    );
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

  it('should handle multiple layers of overflow elements', async () => {
    component.overflowLayer1 = true;
    fixture.detectChanges();
    const affixer = new SkyAffixer(
      component.affixedElement?.nativeElement as HTMLElement,
      TestBed.inject(RendererFactory2).createRenderer(undefined, null),
      TestBed.inject(ViewportRuler),
      TestBed.inject(NgZone),
      TestBed.inject(DOCUMENT).documentElement,
    );
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
});
