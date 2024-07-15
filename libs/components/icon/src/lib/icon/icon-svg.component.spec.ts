import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconSvgComponent } from './icon-svg.component';
import { SkyIconModule } from './icon.module';

describe('Icon SVG component', () => {
  let resolverSvc: jasmine.SpyObj<SkyIconSvgResolverService>;
  let fixture: ComponentFixture<SkyIconSvgComponent>;

  function detectUrlChanges(): void {
    fixture.detectChanges();

    // Resolve icon ID Observable and apply changes.
    tick();
    fixture.detectChanges();
  }

  function getSvgEl(): SVGElement {
    return fixture.nativeElement.querySelector('.sky-icon-svg-img');
  }

  function validateIconId(expectedId: string): void {
    const useEl = getSvgEl().querySelector<SVGUseElement>('use');

    expect(useEl?.href.baseVal).toBe(expectedId);
  }

  beforeEach(() => {
    resolverSvc = jasmine.createSpyObj<SkyIconSvgResolverService>(
      'SkyIconSvgResolverService',
      ['resolveHref'],
    );

    resolverSvc.resolveHref.and.callFake((src, size, variant) => {
      return Promise.resolve(`#${src}-${size}-${variant ?? 'line'}`);
    });

    TestBed.configureTestingModule({
      imports: [SkyIconModule],
      providers: [
        {
          provide: SkyIconSvgResolverService,
          useValue: resolverSvc,
        },
      ],
    });

    fixture = TestBed.createComponent(SkyIconSvgComponent);
  });

  it('should display the resolved icon by ID', fakeAsync(() => {
    fixture.componentRef.setInput('iconName', 'test');
    detectUrlChanges();

    validateIconId('#test-16-line');
  }));

  it('should display the resolved icon by ID and size', fakeAsync(() => {
    fixture.componentRef.setInput('iconName', 'test');
    fixture.componentRef.setInput('iconSize', '2x');
    detectUrlChanges();

    validateIconId('#test-32-line');
  }));

  it('should display the resolved icon by ID and variant', fakeAsync(() => {
    fixture.componentRef.setInput('iconName', 'test');
    fixture.componentRef.setInput('iconVariant', 'solid');
    detectUrlChanges();

    validateIconId('#test-16-solid');
  }));

  it("should use the host element's text color as its fill color", fakeAsync(() => {
    fixture.nativeElement.style.color = '#0f0';

    fixture.componentRef.setInput('iconName', 'test');
    detectUrlChanges();

    expect(getComputedStyle(getSvgEl()).fill).toBe('rgb(0, 255, 0)');
  }));

  it('should handle errors', fakeAsync(() => {
    resolverSvc.resolveHref.and.throwError('Icon could not be resolved');

    fixture.componentRef.setInput('iconName', 'test');
    detectUrlChanges();

    validateIconId('');
  }));
});
