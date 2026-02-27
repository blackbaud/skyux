import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyFlyoutConfig,
  SkyFlyoutInstance,
  SkyFlyoutModule,
  SkyFlyoutService,
} from '@skyux/flyout';

import { SkyFlyoutHarness } from './flyout-harness';

@Component({
  imports: [SkyFlyoutModule],
  template: '',
})
class TestComponent {
  public flyoutSvc = inject(SkyFlyoutService);
  public instance: SkyFlyoutInstance<CustomComponent> | undefined;

  public openFlyout(config: SkyFlyoutConfig): void {
    this.instance = this.flyoutSvc.open(CustomComponent, config);

    this.instance.closed.subscribe(() => {
      this.buttonClicked('close');
    });

    this.instance.iteratorNextButtonClick.subscribe(() => {
      this.buttonClicked('next');
    });

    this.instance.iteratorPreviousButtonClick.subscribe(() => {
      this.buttonClicked('previous');
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public buttonClicked(func: string): void {}
}

@Component({
  template: ` <div>This is a custom component</div> `,
})
class CustomComponent {}

describe('Flyout harness', () => {
  async function setupTest(config?: SkyFlyoutConfig): Promise<{
    flyoutHarness: SkyFlyoutHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent, CustomComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    fixture.componentInstance.openFlyout(config || {});

    const flyoutHarness: SkyFlyoutHarness =
      await loader.getHarness(SkyFlyoutHarness);

    return { flyoutHarness, fixture };
  }

  it('should get ARIA attributes', async () => {
    const { flyoutHarness } = await setupTest({
      ariaLabel: 'aria label',
      ariaLabelledBy: 'aria labelledby',
      ariaDescribedBy: 'aria describedby',
    });

    await expectAsync(flyoutHarness.getAriaLabel()).toBeResolvedTo(
      'aria label',
    );
    await expectAsync(flyoutHarness.getAriaDescribedBy()).toBeResolvedTo(
      'aria describedby',
    );
    await expectAsync(flyoutHarness.getAriaLabelledBy()).toBeResolvedTo(
      'aria labelledby',
    );
    await expectAsync(flyoutHarness.getAriaRole()).toBeResolvedTo('dialog');
  });

  it('should get the flyout width, min width, and max width', async () => {
    const { flyoutHarness } = await setupTest({
      defaultWidth: 500,
      maxWidth: 600,
      minWidth: 400,
    });

    await expectAsync(flyoutHarness.getFlyoutWidth()).toBeResolvedTo(500);
    await expectAsync(flyoutHarness.getFlyoutMaxWidth()).toBeResolvedTo(600);
    await expectAsync(flyoutHarness.getFlyoutMinWidth()).toBeResolvedTo(400);
  });

  it('should close the flyout', async () => {
    const { flyoutHarness, fixture } = await setupTest();

    const buttonSpy = spyOn(fixture.componentInstance, 'buttonClicked');

    await flyoutHarness.closeFlyout();

    expect(buttonSpy).toHaveBeenCalledOnceWith('close');
  });

  it('should click the iterator buttons', async () => {
    const { flyoutHarness, fixture } = await setupTest({
      showIterator: true,
    });

    const buttonSpy = spyOn(fixture.componentInstance, 'buttonClicked');

    await flyoutHarness.clickNextIteratorButton();
    expect(buttonSpy).toHaveBeenCalledOnceWith('next');

    buttonSpy.calls.reset();

    await flyoutHarness.clickPreviousIteratorButton();
    expect(buttonSpy).toHaveBeenCalledOnceWith('previous');
  });

  it('should throw an error when trying to click iterator buttons on a flyout without them', async () => {
    const { flyoutHarness } = await setupTest();

    await expectAsync(
      flyoutHarness.clickNextIteratorButton(),
    ).toBeRejectedWithError('Could not find iterator buttons.');
    await expectAsync(
      flyoutHarness.clickPreviousIteratorButton(),
    ).toBeRejectedWithError('Could not find iterator buttons.');
  });

  it('should throw an error when trying to click disabled iterator buttons', async () => {
    const { flyoutHarness } = await setupTest({
      showIterator: true,
      iteratorNextButtonDisabled: true,
      iteratorPreviousButtonDisabled: true,
    });

    await expectAsync(
      flyoutHarness.clickNextIteratorButton(),
    ).toBeRejectedWithError(
      'Could not click the next iterator because it is disabled.',
    );
    await expectAsync(
      flyoutHarness.clickPreviousIteratorButton(),
    ).toBeRejectedWithError(
      'Could not click the previous iterator because it is disabled.',
    );
  });

  it('should interact with a primary action button', async () => {
    let actionCalled = false;
    const { flyoutHarness } = await setupTest({
      primaryAction: {
        label: 'Primary action',
        callback: () => (actionCalled = true),
      },
    });

    await expectAsync(
      flyoutHarness.getPrimaryActionButtonLabel(),
    ).toBeResolvedTo('Primary action');

    await flyoutHarness.clickPrimaryActionButton();
    expect(actionCalled).toBe(true);
  });

  it('should throw an error when trying to interact with a primary action button that does not exist', async () => {
    const { flyoutHarness } = await setupTest();

    await expectAsync(
      flyoutHarness.clickPrimaryActionButton(),
    ).toBeRejectedWithError('Could not find primary action button.');
  });

  it('should interact with a permalink button', async () => {
    const { flyoutHarness } = await setupTest({
      permalink: {
        label: 'Permalink',
        url: 'http://example.com',
      },
    });

    await expectAsync(flyoutHarness.getPermalinkButtonLabel()).toBeResolvedTo(
      'Permalink',
    );
    await expectAsync(flyoutHarness.getPermalinkButtonRoute()).toBeResolvedTo(
      'http://example.com',
    );
  });

  it('should throw an error when trying to interact with a permalink button that does not exist', async () => {
    const { flyoutHarness } = await setupTest();

    await expectAsync(
      flyoutHarness.getPermalinkButtonLabel(),
    ).toBeRejectedWithError('Could not find permalink button.');
    await expectAsync(
      flyoutHarness.getPermalinkButtonRoute(),
    ).toBeRejectedWithError('Could not find permalink button.');
  });
});
