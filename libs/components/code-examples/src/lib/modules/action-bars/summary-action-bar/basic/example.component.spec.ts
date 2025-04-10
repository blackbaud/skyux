import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkySummaryActionBarHarness } from '@skyux/action-bars/testing';

import { ActionBarsSummaryActionBarBasicExampleComponent } from './example.component';

describe('Basic summary action bar example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkySummaryActionBarHarness;
    fixture: ComponentFixture<ActionBarsSummaryActionBarBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      ActionBarsSummaryActionBarBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkySummaryActionBarHarness.with({ dataSkyId: 'donation-summary' }),
    );

    return { harness, fixture };
  }
});
