import { Component, Provider } from '@angular/core';
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
import { SkyIllustrationModule } from './illustration.module';

// Test resolver that extends the actual service but only implements resolveUrl
// This will use the default resolveHref implementation
class TestDefaultHrefResolverService extends SkyIllustrationResolverService {
  public resolveUrl(name: string): Promise<string> {
    return Promise.resolve(`https://example.com/${name}.svg`);
  }
  // Note: resolveHref is intentionally not overridden to test default implementation
}

@Component({
  template: `
    <!-- mock sprite map -->
    <svg id="sky-illustration-svg-sprite" hidden="true">
      <symbol
        viewBox="-2 -2 96 96"
        class="sky-illustration-svg"
        id="sky-illustration-square"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="10" height="10" fill="blue" />
      </symbol>

      <symbol
        viewBox="-2 -2 96 96"
        class="sky-illustration-svg"
        id="sky-illustration-circle"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle r="5" cx="5" cy="5" fill="green" />
      </symbol>
    </svg>
    <div class="test-wrapper">
      <sky-illustration [name]="illustrationName" [size]="illustrationSize" />
    </div>
  `,
  imports: [SkyIllustrationModule],
})
class IllustrationComponent {
  public illustrationName = 'success';
  public illustrationSize: SkyIllustrationSize = 'sm';
}

describe('Illustration', () => {
  let fixture: ComponentFixture<IllustrationComponent>;
  let component: IllustrationComponent;

  function setupTest(
    provideResolver: boolean,
    name: string,
    size: SkyIllustrationSize,
    resolver?: {
      resolveUrl: (url: string) => Promise<string>;
      resolveHref: (name: string) => Promise<string>;
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
      imports: [IllustrationComponent],
      providers,
    });

    fixture = TestBed.createComponent(IllustrationComponent);
    component = fixture.componentInstance;
    component.illustrationName = name;
    component.illustrationSize = size;
  }

  function getImgEl(): HTMLImageElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '.sky-illustration-img',
    );
  }

  function getSvg(): SVGElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '.sky-illustration-wrapper .sky-illustration-svg',
    );
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

  function detectChanges(): void {
    fixture.detectChanges();

    // Resolve URL or href promise and apply changes.
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

      detectChanges();

      validateImageAttr('loading', 'lazy');
      validateImageAttr('src', 'https://example.com/success.svg');
    }));

    it('should show a broken image if no URL is returned', fakeAsync(() => {
      setupTest(true, 'invalid', 'sm');

      detectChanges();

      validateImageAttr('src', '');
    }));

    it('should show a broken image if retrieving the URL fails', fakeAsync(() => {
      setupTest(true, 'fail', 'sm');

      detectChanges();

      validateImageAttr('src', '');
    }));

    it('should be accessible with img', async () => {
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
        resolveHref: () => Promise.resolve(''),
      });

      detectChanges();

      validateImageVisibility(false);

      resolveUrl('https://example.com/success.svg');

      detectChanges();

      validateImageVisibility(true);

      await resolvePromise;
    }));
  });

  describe('without resolver provided', () => {
    it('should show a broken image', fakeAsync(() => {
      setupTest(false, 'success', 'sm');

      detectChanges();

      validateImageAttr('src', '');
    }));
  });

  describe('default illustration resolver implementation', () => {
    it('should fallback to image when resolver service uses default resolveHref implementation', fakeAsync(() => {
      const providers: Provider[] = [
        {
          provide: SkyIllustrationResolverService,
          useClass: TestDefaultHrefResolverService,
        },
      ];

      TestBed.configureTestingModule({
        imports: [IllustrationComponent],
        providers,
      });

      fixture = TestBed.createComponent(IllustrationComponent);
      component = fixture.componentInstance;
      component.illustrationName = 'test-default-href';
      component.illustrationSize = 'md';

      detectChanges();

      const svgEl = getSvg();
      const imgEl = getImgEl();

      // Should fallback to image since default resolveHref returns empty string
      expect(svgEl).toBeFalsy();
      expect(imgEl).toBeTruthy();
      expect(imgEl?.getAttribute('src')).toBe(
        'https://example.com/test-default-href.svg',
      );
    }));
  });

  describe('SVG functionality', () => {
    it('should display SVG when resolveHref returns content', fakeAsync(() => {
      const href = '#sky-illustration-square';

      setupTest(true, 'test-svg', 'md', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveHref: () => Promise.resolve(href),
      });

      detectChanges();

      const svgEl = getSvg();
      const imgEl = getImgEl();

      expect(svgEl).toBeTruthy();
      expect(svgEl?.innerHTML).toContain('<use');
      expect(imgEl).toBeFalsy();
    }));

    it('should fallback to image when resolveHref returns empty string', fakeAsync(() => {
      setupTest(true, 'test-image', 'md', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveHref: () => Promise.resolve(''),
      });

      detectChanges();

      const svgEl = getSvg();
      const imgEl = getImgEl();

      expect(svgEl).toBeFalsy();
      expect(imgEl).toBeTruthy();
      expect(imgEl?.getAttribute('src')).toBe('https://example.com/test.svg');
    }));

    it('should fallback to image when resolveHref fails', fakeAsync(() => {
      setupTest(true, 'test-fail', 'md', {
        resolveUrl: () => Promise.resolve('https://example.com/test.svg'),
        resolveHref: () => Promise.reject(new Error('href load failed')),
      });

      detectChanges();

      const svgEl = getSvg();
      const imgEl = getImgEl();

      expect(svgEl).toBeFalsy();
      expect(imgEl).toBeTruthy();
      expect(imgEl?.getAttribute('src')).toBe('https://example.com/test.svg');
    }));

    it('should be accessible with SVG', async () => {
      setupTest(true, 'svg', 'md');

      fixture.detectChanges();

      expect(fixture.nativeElement.innerHTML).toContain('<svg');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
