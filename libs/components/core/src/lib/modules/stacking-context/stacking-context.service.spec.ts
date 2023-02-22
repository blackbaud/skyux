import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackingContextFixtureComponent } from './fixtures/stacking-context-fixture.component';
import { SkyStackingContextService } from './stacking-context.service';

describe('SkyStackingContextService', () => {
  let service: SkyStackingContextService;
  let fixture: ComponentFixture<StackingContextFixtureComponent>;
  let component: StackingContextFixtureComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyStackingContextService],
      declarations: [StackingContextFixtureComponent],
    });
    service = TestBed.inject(SkyStackingContextService);
    fixture = TestBed.createComponent(StackingContextFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get z-index', () => {
    expect(service).toBeTruthy();
    expect(service.getZIndex(component.elementRef.nativeElement)).toBe(0);
    expect(service.getZIndex(component.elementRef.nativeElement, 'body')).toBe(
      0
    );
    const a2 = fixture.nativeElement.querySelector('.a2');
    expect(service.getZIndex(a2)).toBe(22);
    expect(service.getZIndex(a2, 'body')).toBe(22);
    const a3 = fixture.nativeElement.querySelector('.a3');
    expect(service.getZIndex(a3)).toBe(22);
    expect(service.getZIndex(a3, 'body')).toBe(22);
    const a4 = fixture.nativeElement.querySelector('.a4');
    expect(service.getZIndex(a4)).toBe(22);
    expect(service.getZIndex(a4, a3)).toBe(33);
    expect(service.getZIndex(a4, a2)).toBe(22);
    const b1 = fixture.nativeElement.querySelector('.b1');
    expect(service.getZIndex(b1)).toBe(44);
    expect(service.getZIndex(b1, 'body')).toBe(44);
    const b2 = fixture.nativeElement.querySelector('.b2');
    expect(service.getZIndex(b2)).toBe(44);
    expect(service.getZIndex(b2, 'body')).toBe(44);
  });
});
