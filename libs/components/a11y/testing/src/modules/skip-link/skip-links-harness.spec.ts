import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkySkipLinkService } from '@skyux/a11y';

import { SkySkipLinksHarness } from './skip-links-harness';

//#region Test component
@Component({
  selector: 'sky-skip-link-test',
  template: `
    <div class="sky-container">
      <p>Press [tab] to see the links.</p>

      <div tabindex="-1" id="area1" #skipLink1>
        <h2>Area 1</h2>
        <p>Text 1</p>
      </div>

      <div tabindex="-1" id="area2" #skipLink2>
        <h2>Area 2</h2>
        <p>Text 2</p>
      </div>
    </div>
  `,
  standalone: false,
})
class TestComponent implements AfterViewInit {
  @ViewChild('skipLink1', { read: ElementRef })
  public skipLink1: ElementRef | undefined;

  @ViewChild('skipLink2', { read: ElementRef })
  public skipLink2: ElementRef | undefined;

  #skipLinkService: SkySkipLinkService;

  constructor(skipLinkService: SkySkipLinkService) {
    this.#skipLinkService = skipLinkService;
  }

  public ngAfterViewInit(): void {
    if (this.skipLink1 && this.skipLink2) {
      this.#skipLinkService.setSkipLinks({
        links: [
          {
            title: 'Area 1',
            elementRef: this.skipLink1,
          },
          {
            title: 'Area 2',
            elementRef: this.skipLink2,
          },
        ],
      });
    }
  }
}
//#endregion Test component

async function validateSkipLinkText(
  skipLinksHarness: SkySkipLinksHarness,
  index: number,
  text: string,
): Promise<void> {
  await expectAsync(skipLinksHarness.getSkipLinkText(index)).toBeResolvedTo(
    text,
  );
}

async function clickAndValidateSkipLink(
  skipLinksHarness: SkySkipLinksHarness,
  index: number,
  id: string,
): Promise<void> {
  await skipLinksHarness.clickSkipLink(index);
  expect(document.activeElement).toBe(document.querySelector(id));
}

describe('Skip Links harness', () => {
  async function setupTest(): Promise<{
    skipLinksHarness: SkySkipLinksHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const skipLinksHarness: SkySkipLinksHarness =
      await loader.getHarness(SkySkipLinksHarness);

    return { skipLinksHarness, fixture, loader };
  }

  afterEach(() => {
    TestBed.inject(SkySkipLinkService).removeHostComponent();
  });

  it('should get the skip link text', async () => {
    const { skipLinksHarness, fixture } = await setupTest();
    fixture.detectChanges();

    await validateSkipLinkText(skipLinksHarness, 0, 'Skip to Area 1');
  });

  it('should click the skip link and the correct item should be focused', async () => {
    const { skipLinksHarness, fixture } = await setupTest();
    fixture.detectChanges();

    await clickAndValidateSkipLink(skipLinksHarness, 0, '#area1');
  });
});
