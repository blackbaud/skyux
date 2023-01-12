import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyWaitModule } from '@skyux/indicators';

import { SkyWaitHarness } from './wait-harness';

//#region Test component
@Component({
  selector: 'sky-wait-test',
  template: `
    <div style="width: 200px; height: 100px">
      Sample Component
      <sky-wait
        [ariaLabel]="ariaLabel"
        [isFullPage]="isFullPage"
        [isNonBlocking]="isNonBlocking"
        [isWaiting]="isWaiting"
        data-sky-id="test-wait"
      ></sky-wait>
    </div>
    <div style="width: 200px; height: 100px">
      <sky-wait
        ariaLabel="this is another wait"
        [isWaiting]="isWaiting2"
        data-sky-id="wait-2"
      ></sky-wait>
    </div>
  `,
})
class TestComponent {
  public ariaLabel: string | undefined;

  public isFullPage: boolean | undefined;

  public isNonBlocking: boolean | undefined;

  public isWaiting = false;

  public isWaiting2 = false;
}
//#endregion Test component

async function validateWaitProperties(
  waitHarness: SkyWaitHarness,
  fixture: ComponentFixture<TestComponent>,
  isFullPage: boolean,
  isNonBlocking: boolean,
  ariaLabel?: string
): Promise<void> {
  fixture.componentInstance.isFullPage = isFullPage;
  fixture.componentInstance.isNonBlocking = isNonBlocking;
  fixture.componentInstance.ariaLabel = ariaLabel;
  fixture.componentInstance.isWaiting = true;
  fixture.detectChanges();

  const label =
    fixture.componentInstance.ariaLabel ??
    `${fixture.componentInstance.isFullPage ? 'Page l' : 'L'}oading.${
      fixture.componentInstance.isNonBlocking ? '' : ' Please wait.'
    }`;
  await expectAsync(waitHarness.getAriaLabel()).toBeResolvedTo(label);
  await expectAsync(waitHarness.isWaiting()).toBeResolvedTo(true);
  await expectAsync(waitHarness.isFullPage()).toBeResolvedTo(isFullPage);
  await expectAsync(waitHarness.isNonBlocking()).toBeResolvedTo(isNonBlocking);
  fixture.componentInstance.isWaiting = false;
}

describe('Wait harness', () => {
  async function setupTest(
    options: { dataSkyId?: string; ariaLabel?: string } = {}
  ): Promise<{
    waitHarness: SkyWaitHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyWaitModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let waitHarness: SkyWaitHarness;

    if (options.dataSkyId) {
      waitHarness = await loader.getHarness(
        SkyWaitHarness.with({
          dataSkyId: options.dataSkyId,
        })
      );
    } else {
      waitHarness = await loader.getHarness(SkyWaitHarness);
    }

    if (options.ariaLabel) {
      fixture.componentInstance.ariaLabel = options.ariaLabel;
    }

    return { waitHarness, fixture, loader };
  }

  it('should return the expected wait component properties', async () => {
    const { waitHarness, fixture } = await setupTest();
    await validateWaitProperties(waitHarness, fixture, false, false);
    await validateWaitProperties(waitHarness, fixture, true, false);
    await validateWaitProperties(waitHarness, fixture, false, true);
    await validateWaitProperties(waitHarness, fixture, true, true);
    await validateWaitProperties(
      waitHarness,
      fixture,
      true,
      true,
      'test label'
    );
  });

  it('should get a wait by its data-sky-id property', async () => {
    const { waitHarness, fixture } = await setupTest({ dataSkyId: 'wait-2' });
    fixture.componentInstance.isWaiting2 = true;
    await expectAsync(waitHarness.getAriaLabel()).toBeResolvedTo(
      'this is another wait'
    );
  });

  it('should throw an error when trying to get the ARIA label while not waiting', async () => {
    const { waitHarness } = await setupTest();
    await expectAsync(waitHarness.getAriaLabel()).toBeRejectedWithError(
      'An ARIA label cannot be determined because the wait component is not visible.'
    );
  });
});
