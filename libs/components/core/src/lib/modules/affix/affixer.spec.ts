import { ViewportRuler } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  NgZone,
  RendererFactory2,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable, Subject } from 'rxjs';

import { SkyAffixer } from './affixer';

@Component({
  template: `
    <div class="affixer-container">
      <div #baseElement class="affixer-base">base</div>
    </div>
    <div #affixedElement class="affixed">affixed</div>
  `,
  styles: [
    `
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
        font-size: 8px;
        height: 10px;
        width: 15px;
      }
    `,
  ],
  standalone: true,
})
class AffixerSpecComponent {
  @ViewChild('affixedElement', { static: true })
  public affixedElement: ElementRef<HTMLDivElement> | undefined;

  @ViewChild('baseElement', { static: true })
  public baseRef: ElementRef<HTMLDivElement> | undefined;
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
      TestBed.inject(NgZone)
    );
    expect(affixer).toBeTruthy();
    expect(component.baseRef?.nativeElement).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      placement: 'above',
      verticalAlignment: 'top',
      isSticky: true,
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('11px');
    affixer.destroy();
  });

  it('should create an instance, place at top right', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const affixer = new SkyAffixer(
      component.affixedElement?.nativeElement as HTMLElement,
      TestBed.inject(RendererFactory2).createRenderer(undefined, null),
      TestBed.inject(ViewportRuler),
      TestBed.inject(NgZone)
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
    const viewportRulerChange = new Subject<Event>();
    const viewportRuler = {
      getViewportScrollPosition: () => ({ top: 50, left: 0 }),
      change: (): Observable<Event> => viewportRulerChange,
    } as ViewportRuler;
    const affixer = new SkyAffixer(
      component.affixedElement?.nativeElement as HTMLElement,
      TestBed.inject(RendererFactory2).createRenderer(undefined, null),
      viewportRuler,
      TestBed.inject(NgZone)
    );
    expect(affixer).toBeTruthy();
    affixer.affixTo(component.baseRef?.nativeElement as HTMLElement, {
      isSticky: true,
      placement: 'above',
    });
    expect(component.affixedElement?.nativeElement.style.top).toEqual('1px');
  });
});
