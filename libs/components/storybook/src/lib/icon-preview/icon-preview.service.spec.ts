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
  let resolver: jasmine.SpyObj<
    Pick<SkyIconSvgResolverService, 'resolveHref' | 'refreshIconMap'>
  >;
  let fetchSpy: jasmine.Spy;

  beforeEach(() => {
    fetchSpy = spyOn(global, 'fetch').and.stub();
    doc = {
      querySelector: jasmine.createSpy('querySelector').and.returnValue(null),
      createElement: jasmine.createSpy('createElement').and.returnValue({
        children: [],
        remove: jasmine.createSpy('remove'),
      }),
      getElementById: jasmine.createSpy('getElementById').and.returnValue(null),
      body: {
        querySelector: jasmine
          .createSpy('body.querySelector')
          .and.returnValue(null),
        classList: {
          add: jasmine.createSpy('add'),
          remove: jasmine.createSpy('remove'),
        } as unknown as DOMTokenList,
      } as unknown as HTMLBodyElement,
    };
    resolver = {
      resolveHref: jasmine.createSpy('resolveHref').and.resolveTo('star.svg'),
      refreshIconMap: jasmine.createSpy('refreshIconMap').and.returnValue(null),
    };
    TestBed.configureTestingModule({
      providers: [
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
  });

  it('should be created', () => {
    const service = TestBed.inject(IconPreviewService);
    expect(service).toBeTruthy();
    expect(doc.querySelector).toHaveBeenCalledWith('link.skyux-icons-preview');
    TestBed.tick();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should load sprite', async () => {
    doc.querySelector.and.returnValue({
      href: '/sprite.svg',
    } as HTMLLinkElement);
    doc.getElementById.and.returnValue({
      replaceWith: jasmine.createSpy('replaceWith'),
    } as unknown as HTMLElement);
    fetchSpy.and.resolveTo({
      text: () => Promise.resolve('<svg></svg>'),
    } as Response);
    const service = TestBed.inject(IconPreviewService);
    expect(service).toBeTruthy();
    expect(doc.querySelector).toHaveBeenCalledWith('link.skyux-icons-preview');
    TestBed.tick();
    expect(fetchSpy).toHaveBeenCalledWith('/sprite.svg');
    await new Promise((resolve) => setTimeout(resolve, 0));
    TestBed.tick();
    expect(doc.getElementById).toHaveBeenCalled();
    expect(doc.createElement).toHaveBeenCalled();
  });
});
