import { Provider } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';

import { SkyIllustrationTestResolverService } from './fixtures/illustration-test-resolver.service';
import { SkyIllustrationResolverService } from './illustration-resolver.service';
import { SkyIllustrationSize } from './illustration-size';
import { SkyIllustrationComponent } from './illustration.component';
import { SkyIllustrationModule } from './illustration.module';

describe('Illustration', () => {
  let fixture: ComponentFixture<SkyIllustrationComponent>;

  function setupTest(
    provideResolver: boolean,
    name: string,
    size: SkyIllustrationSize,
    resolver?: {
      resolveUrl: (url: string) => Promise<string>;
      resolveSvg: (name: string) => Promise<string>;
    },
  ): void {
    const providers: Provider[] = [];

    if (provideResolver) {
      providers.push({
        provide: SkyIllustrationResolverService,
        useFactory: () => resolver ?? new SkyIllustrationTestResolverService(),
      });
    }

    TestBed.configureTestingModule({
      imports: [SkyIllustrationModule],
      providers,
    });

    fixture = TestBed.createComponent(SkyIllustrationComponent);
    fixture.componentRef.setInput('name', name);
    fixture.componentRef.setInput('size', size);
  }

  function getImgEl(): HTMLImageElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '.sky-illustration-img',
    );
  }

  function getSvgContainer(): HTMLDivElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '.sky-illustration-wrapper .sky-illustration-svg-wrapper',
    );
  }

  function getSvgElement(): SVGElement | null {
    const container = getSvgContainer();
    return container?.querySelector('svg') || null;
  }

  function validateImageAttr(name: string, expectedValue: string): void {
    expect(getImgEl()?.getAttribute(name)).toBe(expectedValue);
  }

  function validateImageVisibility(expectedVisible: boolean): void {
    const imgEl = getImgEl();
    let visibility: string | undefined;

    if (imgEl) {
      visibility = getComputedStyle(imgEl).visibility;
    }

    expect(visibility).toBe(expectedVisible ? 'visible' : 'hidden');
  }

  function detectUrlChanges(): void {
    fixture.detectChanges();

    // Resolve URL promise and apply changes.
    tick();
    fixture.detectChanges();
  }

  describe('with resolver provided', () => {
    it('should be hidden from screen readers', () => {
      setupTest(true, 'success', 'sm');

      fixture.detectChanges();

      // Blank alt attributes hide images from screen readers.
      // https://www.w3.org/WAI/tutorials/images/decorative/
      validateImageAttr('alt', '');
    });

    it('should set the expected attributes', fakeAsync(() => {
      setupTest(true, 'success', 'sm');

      detectUrlChanges();

      validateImageAttr('loading', 'lazy');
      validateImageAttr('src', 'https://example.com/success.svg');
    }));

    it('should show a broken image if no URL is returned', fakeAsync(() => {
      setupTest(true, 'invalid', 'sm');

      detectUrlChanges();

      validateImageAttr('src', '');
    }));

    it('should show a broken image if retrieving the URL fails', fakeAsync(() => {
      setupTest(true, 'fail', 'sm');

      detectUrlChanges();

      validateImageAttr('src', '');
    }));

    it('should be accessible', async () => {
      setupTest(true, 'success', 'sm');

      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be hidden until the URL is resolved', fakeAsync(async () => {
      // TODO: Use the more concise Promise.withResolvers() when it's available in TypeScript
      // to avoid this awkward workaround for strict type checking.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
      let resolveUrl = (_: string): void => void _;

      const resolvePromise = new Promise<string>(
        (resolve) => (resolveUrl = resolve),
      );

      setupTest(true, 'test', 'sm', {
        resolveUrl: () => resolvePromise,
        resolveSvg: () => Promise.resolve(''),
      });

      detectUrlChanges();

      validateImageVisibility(false);

      resolveUrl('https://example.com/success.svg');

      detectUrlChanges();

      validateImageVisibility(true);

      await resolvePromise;
    }));
  });

  describe('without resolver provided', () => {
    it('should show a broken image', fakeAsync(() => {
      setupTest(false, 'success', 'sm');

      detectUrlChanges();

      validateImageAttr('src', '');
    }));
  });

  describe('SVG functionality', () => {
    it('should display SVG when resolveSvg returns content', fakeAsync(() => {
      const mockSvg = '<svg><circle cx="50" cy="50" r="40" /></svg>';

      setupTest(true, 'test-svg', 'md', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveSvg: () => Promise.resolve(mockSvg),
      });

      detectUrlChanges();

      const svgContainer = getSvgContainer();
      const imgEl = getImgEl();

      expect(svgContainer).toBeTruthy();
      expect(svgContainer?.innerHTML).toContain('<svg>');
      expect(svgContainer?.innerHTML).toContain('<circle');
      expect(imgEl).toBeFalsy();
    }));

    it('should fallback to image when resolveSvg returns empty string', fakeAsync(() => {
      setupTest(true, 'test-image', 'md', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveSvg: () => Promise.resolve(''),
      });

      detectUrlChanges();

      const svgContainer = getSvgContainer();
      const imgEl = getImgEl();

      expect(svgContainer).toBeFalsy();
      expect(imgEl).toBeTruthy();
      expect(imgEl?.getAttribute('src')).toBe('https://example.com/test.svg');
    }));

    it('should fallback to image when resolveSvg fails', fakeAsync(() => {
      setupTest(true, 'test-fail', 'md', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveSvg: () => Promise.reject(new Error('SVG load failed')),
      });

      detectUrlChanges();

      const svgContainer = getSvgContainer();
      const imgEl = getImgEl();

      expect(svgContainer).toBeFalsy();
      expect(imgEl).toBeTruthy();
      expect(imgEl?.getAttribute('src')).toBe('https://example.com/test.svg');
    }));

    it('should sanitize SVG content properly', fakeAsync(() => {
      const maliciousSvg =
        '<svg><script>alert("xss")</script><circle cx="50" cy="50" r="40" /></svg>';

      setupTest(true, 'test-sanitize', 'md', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveSvg: () => Promise.resolve(maliciousSvg),
      });

      detectUrlChanges();

      const svgContainer = getSvgContainer();

      console.log('WHATTT');
      console.log(svgContainer);

      expect(svgContainer).toBeTruthy();
      expect(svgContainer?.innerHTML).toContain('<svg>');
      expect(svgContainer?.innerHTML).toContain('<circle');
      expect(svgContainer?.innerHTML).not.toContain('<script>');
    }));

    xit('should handle SVG with complex content', fakeAsync(() => {
      const complexSvg = `
      <svg viewBox="0 0 100 100" class="sky-illustration-svg">
        <defs>
          <linearGradient id="gradient1">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#gradient1)" />
        <text x="50" y="50" text-anchor="middle">Test</text>
      </svg>
    `;

      setupTest(true, 'test-complex', 'lg', {
        resolveUrl: () => Promise.resolve('https://example.com/complex.svg'),
        resolveSvg: () => Promise.resolve(complexSvg),
      });

      detectUrlChanges();

      const svgContainer = getSvgContainer();
      const svgElement = getSvgElement();

      expect(svgContainer).toBeTruthy();
      expect(svgElement).toBeTruthy();
      expect(svgElement?.getAttribute('viewBox')).toBe('0 0 100 100');
      expect(svgContainer?.innerHTML).toContain('<defs>');
      expect(svgContainer?.innerHTML).toContain('<linearGradient');
      expect(svgContainer?.innerHTML).toContain('<text');
    }));

    xit('should apply correct wrapper class with SVG', fakeAsync(() => {
      const mockSvg = '<svg><circle cx="50" cy="50" r="40" /></svg>';

      setupTest(true, 'test-class', 'sm', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveSvg: () => Promise.resolve(mockSvg),
      });

      detectUrlChanges();

      const wrapper = (fixture.nativeElement as HTMLElement).querySelector(
        '.sky-illustration-wrapper',
      );

      expect(wrapper).toBeTruthy();
      expect(wrapper?.classList.contains('sky-illustration-img-sm')).toBe(true);
    }));

    xit('should be accessible with SVG content', fakeAsync(async () => {
      const accessibleSvg =
        '<svg role="img" aria-label="Test illustration"><circle cx="50" cy="50" r="40" /></svg>';

      setupTest(true, 'test-accessible', 'md', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveSvg: () => Promise.resolve(accessibleSvg),
      });

      detectUrlChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    }));
  });
});
