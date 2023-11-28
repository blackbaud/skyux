import { TestBed } from '@angular/core/testing';

import FontFaceObserver from 'fontfaceobserver';
import { map } from 'rxjs/operators';

import { FontLoadingService } from './font-loading.service';

describe('FontLoadingService', () => {
  let service: FontLoadingService;

  beforeEach(() => {
    spyOn(FontFaceObserver.prototype, 'load').and.callFake(() =>
      Promise.resolve(),
    );
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load fonts', async () => {
    await service
      .ready()
      .pipe(
        map((ready) => {
          expect(ready).toBe(true);
        }),
      )
      .toPromise();
  });
});
