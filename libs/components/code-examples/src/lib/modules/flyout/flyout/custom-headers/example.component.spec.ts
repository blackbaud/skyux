import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyFlyoutHarness } from '@skyux/flyout/testing';

import { FlyoutCustomHeadersExampleComponent } from './example.component';

describe('Custom headers flyout example', () => {
  async function setupTest(option?: string): Promise<{
    flyoutHarness: SkyFlyoutHarness;
    fixture: ComponentFixture<FlyoutCustomHeadersExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [FlyoutCustomHeadersExampleComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      FlyoutCustomHeadersExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    switch (option) {
      case 'url':
        fixture.componentInstance.openFlyoutWithUrlPermalink();
        break;
      case 'action':
        fixture.componentInstance.openFlyoutWithPrimaryAction();
        break;
      default:
        fixture.componentInstance.openFlyoutWithIterators();
        break;
    }

    const flyoutHarness: SkyFlyoutHarness =
      await loader.getHarness(SkyFlyoutHarness);

    return { flyoutHarness, fixture };
  }

  it('should set up the flyout with iterators', async () => {
    const { flyoutHarness, fixture } = await setupTest();

    await expectAsync(flyoutHarness.getAriaLabelledBy()).toBeResolvedTo(
      'flyout-title',
    );
    await expectAsync(flyoutHarness.getAriaRole()).toBeResolvedTo('dialog');

    expect(fixture.componentInstance.recordNumber).toBe(0);
    await flyoutHarness.clickNextIteratorButton();
    expect(fixture.componentInstance.recordNumber).toBe(1);
    await flyoutHarness.clickPreviousIteratorButton();
    expect(fixture.componentInstance.recordNumber).toBe(0);
    // previous button is disabled
    await expectAsync(
      flyoutHarness.clickPreviousIteratorButton(),
    ).toBeRejectedWithError(
      'Could not click the previous iterator because it is disabled.',
    );
  });

  it('should set up the flyout with permalink', async () => {
    const { flyoutHarness } = await setupTest('url');

    await expectAsync(flyoutHarness.getPermalinkButtonLabel()).toBeResolvedTo(
      'Visit blackbaud.com',
    );
    await expectAsync(flyoutHarness.getPermalinkButtonRoute()).toBeResolvedTo(
      'http://www.blackbaud.com',
    );
  });

  it('should set up the flyout with primary action', async () => {
    const { flyoutHarness, fixture } = await setupTest('action');

    await expectAsync(
      flyoutHarness.getPrimaryActionButtonLabel(),
    ).toBeResolvedTo('Save');

    const actionSpy = spyOn(fixture.componentInstance, 'primaryActionCallback');
    await flyoutHarness.clickPrimaryActionButton();
    expect(actionSpy).toHaveBeenCalledTimes(1);
  });
});
