import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyCodeHarness } from '@skyux/code/testing';
import { SkyDatepickerHarness } from '@skyux/datetime/testing';

import { DatetimeDatepickerCustomDatesExampleComponent } from './example.component';

describe('Datepicker with custom dates example', () => {
  async function setupTest(): Promise<{
    codeHarness: SkyCodeHarness;
    datepickerHarness: SkyDatepickerHarness;
  }> {
    const fixture = TestBed.createComponent(
      DatetimeDatepickerCustomDatesExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const codeHarness = await loader.getHarness(SkyCodeHarness);
    const datepickerHarness = await loader.getHarness(SkyDatepickerHarness);

    return { codeHarness, datepickerHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatetimeDatepickerCustomDatesExampleComponent],
    });
  });

  it('should show the selected date as code', async () => {
    const { codeHarness, datepickerHarness } = await setupTest();

    await expectAsync(codeHarness.getText()).toBeResolvedTo('null');

    const inputHarness = await datepickerHarness.getControl();
    await inputHarness.setValue('10/12/2001');

    await expectAsync(codeHarness.getText()).toBeResolvedTo(
      JSON.stringify(new Date('10/12/2001')),
    );
  });
});
