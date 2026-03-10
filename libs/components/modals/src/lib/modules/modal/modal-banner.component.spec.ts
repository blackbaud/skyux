import { TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { ModalBannerTestComponent } from './fixtures/modal-banner.component.fixture';
import { ModalTestContext } from './fixtures/modal-context';
import { SkyModalFixturesModule } from './fixtures/modal-fixtures.module';
import { SkyModalInstance } from './modal-instance';
import { SkyModalService } from './modal.service';

const BANNER_IMAGE_SRC =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"><rect width="200" height="120" fill="%23264653"/><circle cx="100" cy="50" r="35" fill="%23e63946"/><rect x="20" y="75" width="55" height="40" fill="%232a9d8f"/><polygon points="180,115 140,115 160,70" fill="%23e9c46a"/></svg>';

const BANNER_IMAGE_SRC_ESCAPED =
  'data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"200\\" height=\\"120\\" viewBox=\\"0 0 200 120\\"><rect width=\\"200\\" height=\\"120\\" fill=\\"%23264653\\"/><circle cx=\\"100\\" cy=\\"50\\" r=\\"35\\" fill=\\"%23e63946\\"/><rect x=\\"20\\" y=\\"75\\" width=\\"55\\" height=\\"40\\" fill=\\"%232a9d8f\\"/><polygon points=\\"180,115 140,115 160,70\\" fill=\\"%23e9c46a\\"/></svg>';

const BANNER_IMAGE_SRC_BASE64 =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMjAwIDEyMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiM5MmEyYTkiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI1MCIgcj0iMzUiIGZpbGw9IiNmMjljYTIiLz48cmVjdCB4PSIyMCIgeT0iNzUiIHdpZHRoPSI1NSIgaGVpZ2h0PSI0MCIgZmlsbD0iIzk0Y2VjNyIvPjxwb2x5Z29uIHBvaW50cz0iMTgwLDExNSAxNDAsMTE1IDE2MCw3MCIgZmlsbD0iI2Y0ZTFiNSIvPjwvc3ZnPg==';

describe('SkyModalBannerComponent', () => {
  let testModalInstance: SkyModalInstance | undefined;

  function getModalService(): SkyModalService {
    return TestBed.inject(SkyModalService);
  }

  function getBannerEl(): HTMLElement {
    return document.querySelector('sky-modal-banner') as HTMLElement;
  }

  function openModal(bannerImageSrc?: string): SkyModalInstance {
    return getModalService().open(ModalBannerTestComponent, {
      providers: [
        {
          provide: ModalTestContext,
          useFactory: (): ModalTestContext => {
            const context = new ModalTestContext();
            context.bannerImageSrc = bannerImageSrc;
            return context;
          },
        },
      ],
    });
  }

  function closeModal(): void {
    testModalInstance?.close();
    testModalInstance = undefined;
  }

  function validateBannerImage(
    imageSrc: string | undefined,
    expectedBackgroundImage: string,
  ): void {
    testModalInstance = openModal(imageSrc);
    const bannerWithImageClass = 'sky-modal-banner-with-image';

    const bannerEl = getBannerEl();

    if (imageSrc) {
      expect(bannerEl).toHaveCssClass(bannerWithImageClass);
    } else {
      expect(bannerEl).not.toHaveCssClass(bannerWithImageClass);
    }

    expect(bannerEl.style.backgroundImage).toBe(expectedBackgroundImage);

    closeModal();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalFixturesModule],
    });
  });

  afterEach(() => {
    closeModal();
  });

  it('should project content into the banner', () => {
    testModalInstance = openModal();

    expect(getBannerEl().textContent?.trim()).toBe('Banner content');
  });

  it('should not set background-image when bannerImageSrc is not provided', () => {
    validateBannerImage(undefined, '');
  });

  it('should set background-image when bannerImageSrc is provided', () => {
    validateBannerImage(
      BANNER_IMAGE_SRC_BASE64,
      `url("${BANNER_IMAGE_SRC_BASE64}")`,
    );
  });

  it('should escape quotes in the image URL', () => {
    validateBannerImage(BANNER_IMAGE_SRC, `url("${BANNER_IMAGE_SRC_ESCAPED}")`);
  });

  it('should pass accessibility', async () => {
    testModalInstance = openModal(BANNER_IMAGE_SRC_BASE64);

    await expectAsync(document.querySelector('.sky-modal')).toBeAccessible();
  });
});
