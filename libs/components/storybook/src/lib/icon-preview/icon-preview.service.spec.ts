import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyIconSvgResolverService } from '@skyux/icon';

import { IconPreviewService } from './icon-preview.service';

describe('IconPreviewService', () => {
  let doc: jasmine.SpyObj<
    Pick<
      Document,
      'querySelector' | 'createElement' | 'getElementById' | 'body'
    >
  >;
  let controller: HttpTestingController;
  let resolver: jasmine.SpyObj<SkyIconSvgResolverService>;

  beforeEach(() => {
    doc = {
      querySelector: jasmine.createSpy('querySelector').and.returnValue(null),
      createElement: jasmine.createSpy('createElement').and.returnValue({
        children: [],
        remove: jasmine.createSpy('remove'),
      }),
      getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
      body: {
        classList: {
          add: jasmine.createSpy('add'),
          remove: jasmine.createSpy('remove'),
        } as unknown as DOMTokenList,
      } as unknown as HTMLBodyElement,
    };
    resolver = {
      resolveHref: jasmine.createSpy('resolveHref').and.resolveTo('star.svg'),
    };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: DOCUMENT,
          useValue: doc,
        },
        {
          provide: SkyIconSvgResolverService,
          useValue: resolver,
        },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service = TestBed.inject(IconPreviewService);
    expect(service).toBeTruthy();
    expect(doc.querySelector).toHaveBeenCalledWith('link.skyux-icons-preview');
    TestBed.tick();
    controller.verify();
  });

  it('should load sprite', async () => {
    doc.querySelector.and.returnValue({
      href: '/sprite.svg',
    } as HTMLLinkElement);
    doc.getElementById.and.returnValue({
      replaceWith: jasmine.createSpy('replaceWith'),
    } as unknown as HTMLElement);
    const service = TestBed.inject(IconPreviewService);
    expect(service).toBeTruthy();
    expect(doc.querySelector).toHaveBeenCalledWith('link.skyux-icons-preview');
    TestBed.tick();
    const request = controller.expectOne('/sprite.svg');
    request.flush('<svg></svg>');
    await new Promise((resolve) => setTimeout(resolve, 0));
    TestBed.tick();
    expect(doc.getElementById).toHaveBeenCalled();
    expect(doc.createElement).toHaveBeenCalled();
    controller.verify();
  });
});
