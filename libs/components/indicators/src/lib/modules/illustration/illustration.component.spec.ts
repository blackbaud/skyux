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
  ): void {
    const providers: Provider[] = [];

    if (provideResolver) {
      providers.push({
        provide: SkyIllustrationResolverService,
        useClass: SkyIllustrationTestResolverService,
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

  function validateImageAttr(name: string, expectedValue: string): void {
    expect(getImgEl()?.getAttribute(name)).toBe(expectedValue);
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
  });

  describe('without resolver provided', () => {
    it('should show a broken image', fakeAsync(() => {
      setupTest(false, 'success', 'sm');

      detectUrlChanges();

      validateImageAttr('src', '');
    }));
  });
});
