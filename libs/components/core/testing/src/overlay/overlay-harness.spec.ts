import { ComponentHarness } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { OverlayChildTestHarness } from './fixtures/overlay-child-harness';
import { OverlayHarnessTestComponent } from './fixtures/overlay-harness-test.component';
import { OverlayHarnessTestModule } from './fixtures/overlay-harness-test.module';
import { SkyOverlayHarness } from './overlay-harness';

class NoneFoundTestHarness extends ComponentHarness {
  public static hostSelector = 'not-found-selector';
}

describe('Overlay harness', () => {
  async function setupTest(): Promise<{ overlayHarness: SkyOverlayHarness }> {
    await TestBed.configureTestingModule({
      imports: [OverlayHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(OverlayHarnessTestComponent);
    const overlay = fixture.componentInstance.openOverlay();

    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const overlayHarness = await rootLoader.getHarness(
      SkyOverlayHarness.with({ selector: `#${overlay.id}` }),
    );

    return { overlayHarness };
  }

  it('should query children harnesses', async () => {
    const { overlayHarness } = await setupTest();

    const harnesses = await overlayHarness.queryHarnesses(
      OverlayChildTestHarness,
    );

    await expectAsync((await harnesses[0].host()).text()).toBeResolvedTo(
      'OVERLAY CHILD 1 CONTENT',
    );

    await expectAsync((await harnesses[1].host()).text()).toBeResolvedTo(
      'OVERLAY CHILD 2 CONTENT',
    );
  });

  it('should return an empty array if child harnesses not found', async () => {
    const { overlayHarness } = await setupTest();

    await expectAsync(
      overlayHarness.queryHarnesses(NoneFoundTestHarness),
    ).toBeResolvedTo([]);
  });

  it('should query one child harness', async () => {
    const { overlayHarness } = await setupTest();

    const harness = await overlayHarness.queryHarness(OverlayChildTestHarness);

    await expectAsync((await harness.host()).text()).toBeResolvedTo(
      'OVERLAY CHILD 1 CONTENT',
    );
  });

  it('should return null if test harness cannot be found', async () => {
    const { overlayHarness } = await setupTest();

    await expectAsync(
      overlayHarness.queryHarnessOrNull(NoneFoundTestHarness),
    ).toBeResolvedTo(null);
  });

  it('should throw error if test harness cannot be found', async () => {
    const { overlayHarness } = await setupTest();

    await expectAsync(
      overlayHarness.queryHarness(NoneFoundTestHarness),
    ).toBeRejectedWithError();
  });

  it('should query child test elements', async () => {
    const { overlayHarness } = await setupTest();

    const testElements = await overlayHarness.querySelectorAll('li');

    expect(testElements.length).toEqual(3);
  });

  it('should return an empty array if child elements not found', async () => {
    const { overlayHarness } = await setupTest();

    await expectAsync(
      overlayHarness.querySelectorAll('.not-found-selector'),
    ).toBeResolvedTo([]);
  });

  it('should query one child test element', async () => {
    const { overlayHarness } = await setupTest();

    const testElement = await overlayHarness.querySelector('li');

    await expectAsync(testElement?.hasClass('li-foo')).toBeResolvedTo(true);
  });

  it('should return null if child test element cannot be found', async () => {
    const { overlayHarness } = await setupTest();

    await expectAsync(
      overlayHarness.querySelectorOrNull('.not-found-selector'),
    ).toBeResolvedTo(null);
  });

  it('should throw if child test element cannot be found', async () => {
    const { overlayHarness } = await setupTest();

    await expectAsync(
      overlayHarness.querySelector('.not-found-selector'),
    ).toBeRejected();
  });
});
