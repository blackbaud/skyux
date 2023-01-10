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
        [ariaLabel]="ariaLabel"
        [isFullPage]="isFullPage"
        [isNonBlocking]="isNonBlocking"
        [isWaiting]="isWaiting"
        data-sky-id="wait-2"
      ></sky-wait>
    </div>
  `,
})
class TestComponent {
  public ariaLabel: string | undefined;

  public isFullPage: boolean | undefined = true;

  public isNonBlocking: boolean | undefined = false;

  public isWaiting = false;
}
//#endregion Test component

async function validateWaitProperties(
  waitHarness: SkyWaitHarness,
  fixture: ComponentFixture<TestComponent>,
  isFullPage?: boolean,
  isNonBlocking?: boolean,
  ariaLabel?: string
): Promise<void> {
  fixture.componentInstance.ariaLabel = undefined;
  fixture.componentInstance.isFullPage = undefined;
  fixture.componentInstance.isNonBlocking = undefined;
  if (ariaLabel) {
    fixture.componentInstance.ariaLabel = ariaLabel;
  }
  if (isFullPage !== undefined) {
    fixture.componentInstance.isFullPage = isFullPage;
  }
  if (isNonBlocking !== undefined) {
    fixture.componentInstance.ariaLabel = ariaLabel;
  }

  fixture.componentInstance.isWaiting = true;
  fixture.detectChanges();

  const label =
    fixture.componentInstance.ariaLabel ??
    `${fixture.componentInstance.isFullPage ? 'Page l' : 'L'}oading.${
      fixture.componentInstance.isNonBlocking ? '' : ' Please wait.'
    }`;
  await expectAsync(waitHarness.getAriaLabel()).toBeResolvedTo(label);
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

  it('should return the expected ARIA label', async () => {
    const { waitHarness, fixture } = await setupTest();
    await validateWaitProperties(waitHarness, fixture);
    await validateWaitProperties(waitHarness, fixture, false);
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
    const { waitHarness } = await setupTest({ dataSkyId: 'wait-2' });
    // if isWaiting is false the wait mask doesn't exist, so there is no ARIA label
    await expectAsync(waitHarness.getAriaLabel()).toBeRejectedWithError(
      'The wait component is not currently visible.'
    );
  });
});
