import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Injectable,
  inject,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyModalModule, SkyModalService } from '@skyux/modals';

import { SkyModalBannerHarness } from './modal-banner-harness';
import { SkyModalHarness } from './modal-harness';

@Injectable()
class BannerTestContext {
  public bannerImageSrc: string | undefined;
}

//#region Test components
@Component({
  selector: 'sky-modal-banner-test-modal',
  template: `
    <sky-modal headingText="Test" [headingHidden]="true">
      <sky-modal-banner
        [imageSrc]="context?.bannerImageSrc ?? ''"
      ></sky-modal-banner>
      <sky-modal-content />
    </sky-modal>
  `,
  standalone: false,
})
class BannerModalComponent {
  protected context = inject(BannerTestContext, { optional: true });
}

@Component({
  selector: 'sky-modal-no-banner-test-modal',
  template: `
    <sky-modal headingText="Test">
      <sky-modal-content />
    </sky-modal>
  `,
  standalone: false,
})
class NoBannerModalComponent {}

@Component({
  selector: 'sky-modal-non-matching-banner-modal',
  template: `
    <sky-modal headingText="Test" [headingHidden]="true">
      <sky-modal-banner />
      <sky-modal-content />
    </sky-modal>
  `,
  standalone: false,
})
class NonMatchingBannerModalComponent implements AfterViewInit {
  #elRef = inject(ElementRef<HTMLElement>);

  public ngAfterViewInit(): void {
    const banner = this.#elRef.nativeElement.querySelector('sky-modal-banner');
    if (banner instanceof HTMLElement) {
      banner.style.backgroundImage = 'linear-gradient(red, blue)';
    }
  }
}

@Component({
  selector: 'sky-modal-banner-test-opener',
  template: ``,
  standalone: false,
})
class TestButtonComponent {
  #modalSvc = inject(SkyModalService);

  public openBannerModal(bannerImageSrc?: string): void {
    this.#modalSvc.open(BannerModalComponent, {
      providers: [{ provide: BannerTestContext, useValue: { bannerImageSrc } }],
    });
  }

  public openNoBannerModal(): void {
    this.#modalSvc.open(NoBannerModalComponent);
  }

  public openNonMatchingBannerModal(): void {
    this.#modalSvc.open(NonMatchingBannerModalComponent);
  }
}
//#endregion Test components

describe('Modal banner harness', () => {
  let fixture: ComponentFixture<TestButtonComponent>;
  let service: SkyModalService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BannerModalComponent,
        NoBannerModalComponent,
        NonMatchingBannerModalComponent,
      ],
      imports: [SkyModalModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestButtonComponent);
    fixture.detectChanges();
    service = TestBed.inject(SkyModalService);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  afterEach(() => {
    service.dispose();
    fixture.destroy();
  });

  async function setupBannerModal(
    bannerImageSrc?: string,
  ): Promise<SkyModalBannerHarness> {
    fixture.componentInstance.openBannerModal(bannerImageSrc);
    fixture.detectChanges();

    const modalHarness = await loader.getHarness(SkyModalHarness);
    const bannerHarness = await modalHarness.getBanner();

    if (!bannerHarness) {
      throw new Error('Expected banner harness to be present.');
    }

    return bannerHarness;
  }

  it('should return null from getBanner() when no banner is present', async () => {
    fixture.componentInstance.openNoBannerModal();
    fixture.detectChanges();

    const modalHarness = await loader.getHarness(SkyModalHarness);

    await expectAsync(modalHarness.getBanner()).toBeResolvedTo(null);
  });

  it('should return a banner harness from getBanner() when a banner is present', async () => {
    const bannerHarness = await setupBannerModal();

    expect(bannerHarness).toBeInstanceOf(SkyModalBannerHarness);
  });

  it('should return null from getImageSrc() when no image source is set', async () => {
    const bannerHarness = await setupBannerModal('');

    await expectAsync(bannerHarness.getImageSrc()).toBeResolvedTo(null);
  });

  it('should return the image source from getImageSrc()', async () => {
    const imageSrc = 'data:image/svg+xml;base64,PHN2ZyAvPg==';
    const bannerHarness = await setupBannerModal(imageSrc);

    await expectAsync(bannerHarness.getImageSrc()).toBeResolvedTo(imageSrc);
  });

  it('should return null from getImageSrc() when background image does not match the expected url format', async () => {
    fixture.componentInstance.openNonMatchingBannerModal();
    fixture.detectChanges();

    const modalHarness = await loader.getHarness(SkyModalHarness);
    const bannerHarness = await modalHarness.getBanner();

    if (!bannerHarness) {
      throw new Error('Expected banner harness to be present.');
    }

    await expectAsync(bannerHarness.getImageSrc()).toBeResolvedTo(null);
  });
});
