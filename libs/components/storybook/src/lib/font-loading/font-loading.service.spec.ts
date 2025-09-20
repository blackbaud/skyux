import { TestBed } from '@angular/core/testing';

import FontFaceObserver from 'fontfaceobserver';
import { firstValueFrom } from 'rxjs';

import { FontLoadingService } from './font-loading.service';

describe('FontLoadingService', () => {
  let service: FontLoadingService;

  function createSvgSprite(): void {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.id = 'sky-icon-svg-sprite';

    document.body.appendChild(svgEl);
  }

  beforeEach(() => {
    spyOn(FontFaceObserver.prototype, 'load').and.callFake(() =>
      Promise.resolve(),
    );
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontLoadingService);
  });

  afterEach(() => {
    document.getElementById('sky-icon-svg-sprite')?.remove();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve when the SVG sprite appears in the DOM before calling ready()', async () => {
    createSvgSprite();

    const readyPromise = service.ready();

    await expectAsync(firstValueFrom(readyPromise)).toBeResolvedTo(true);
  });

  it('should resolve when the SVG sprite appears in the DOM after calling ready()', async () => {
    const readyPromise = service.ready();

    createSvgSprite();

    await expectAsync(firstValueFrom(readyPromise)).toBeResolvedTo(true);
  });
});
