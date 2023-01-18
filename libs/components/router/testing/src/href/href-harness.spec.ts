import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyHrefTestingModule } from '@skyux/router/testing';

import { HrefHarnessTestComponent } from './fixtures/href-harness-test.component';
import { HrefHarnessTestModule } from './fixtures/href-harness-test.module';
import { SkyHrefHarness } from './href-harness';

describe('SkyHrefHarness', () => {
  async function setupTest(options: {
    dataSkyId: string;
    userHasAccess: boolean;
  }) {
    TestBed.configureTestingModule({
      imports: [
        HrefHarnessTestModule,
        SkyHrefTestingModule.with({ userHasAccess: options.userHasAccess }),
      ],
    });

    const fixture = TestBed.createComponent(HrefHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const hrefHarness = await loader.getHarness(
      SkyHrefHarness.with({ dataSkyId: options.dataSkyId })
    );

    return { hrefHarness, fixture, loader };
  }

  it('should be created', async () => {
    const { loader } = await setupTest({
      dataSkyId: 'my-href-1',
      userHasAccess: true,
    });
    const hrefHarness = await loader.getHarness(SkyHrefHarness);
    expect(hrefHarness).toBeTruthy();
    const href = await hrefHarness.getHref();
    expect(href).toEqual('https://example.com/test1');
    const text = await hrefHarness.getLinkText();
    expect(text).toEqual('Link 1');
    expect(await hrefHarness.isLinked()).toBeTrue();
    expect(await hrefHarness.isVisible()).toBeTrue();
  });
});
