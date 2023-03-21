import { TestBed } from '@angular/core/testing';

import * as FontFaceObserver from 'fontfaceobserver';
import { map } from 'rxjs/operators';

import { FontLoadingService } from './font-loading.service';

describe('FontLoadingService', () => {
  let service: FontLoadingService;

  beforeEach(() => {
    jest
      .spyOn(FontFaceObserver.prototype, 'load')
      .mockImplementation(() => Promise.resolve());
    TestBed.configureTestingModule({});
    service = TestBed.inject(FontLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load fonts', async () => {
    expect.assertions(1);
    await service
      .ready()
      .pipe(
        map((ready) => {
          expect(ready).toBe(true);
        })
      )
      .toPromise();
  });
});
