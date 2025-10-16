import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SkyHarnessFilters } from './harness-filters';
import { SkyQueryableComponentHarness } from './queryable-component-harness';

@Component({
  template: `<div class="my-parent" data-sky-id="my-sky-id">
    <div class="my-child">Child text.</div>
  </div>`,
})
class TestComponent {}

class ChildTestHarness extends ComponentHarness {
  public static hostSelector = '.my-child';
}

class QueryableTestHarness extends SkyQueryableComponentHarness {
  public static hostSelector = '.my-parent';

  public static with(
    filters: SkyHarnessFilters,
  ): HarnessPredicate<QueryableTestHarness> {
    return QueryableTestHarness.getDataSkyIdPredicate(filters);
  }
}

class NoneFoundTestHarness extends ComponentHarness {
  public static hostSelector = 'not-found-selector';
}

describe('SkyQueryableComponentHarness', () => {
  it('should query harnesses', async () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    const fixture = TestBed.createComponent(TestComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const queryableHarness = await loader.getHarness(
      QueryableTestHarness.with({
        dataSkyId: 'my-sky-id',
      }),
    );

    await expectAsync(
      (
        await (await queryableHarness.queryHarness(ChildTestHarness)).host()
      ).text(),
    ).toBeResolvedTo('Child text.');

    expect(
      (await queryableHarness.queryHarnesses(ChildTestHarness)).length,
    ).toEqual(1);

    await expectAsync(
      queryableHarness.queryHarness(NoneFoundTestHarness),
    ).toBeRejected();

    await expectAsync(
      queryableHarness.queryHarnessOrNull(NoneFoundTestHarness),
    ).toBeResolvedTo(null);
  });
});
