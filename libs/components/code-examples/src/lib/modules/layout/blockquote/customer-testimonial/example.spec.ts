import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyBlockquoteHarness } from '@skyux/layout/testing';

import { LayoutBlockquoteCustomerTestimonialExample } from './example';

describe('Customer testimonial with attribution example', () => {
  async function setupTest(): Promise<{
    blockquoteHarness: SkyBlockquoteHarness;
  }> {
    const fixture = TestBed.createComponent(
      LayoutBlockquoteCustomerTestimonialExample,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const blockquoteHarness = await loader.getHarness(
      SkyBlockquoteHarness.with({ dataSkyId: 'customer-testimonial' }),
    );

    return { blockquoteHarness };
  }

  it("should show the customer's testimonial", async () => {
    const { blockquoteHarness } = await setupTest();

    await expectAsync(blockquoteHarness.getText()).toBeResolvedTo(
      jasmine.stringContaining('This product has been an absolute joy to use'),
    );
  });

  it('should credit and link to the customer', async () => {
    const { blockquoteHarness } = await setupTest();

    await expectAsync(blockquoteHarness.getAuthor()).toBeResolvedTo(
      'Happy Customer',
    );
    await expectAsync(blockquoteHarness.getQuoteSource()).toBeResolvedTo(
      'https://www.blackbaud.com',
    );
  });
});
