import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { HrefHarnessTestComponent } from './fixtures/href-harness-test.component';
import { HrefHarnessTestModule } from './fixtures/href-harness-test.module';
import { SkyHrefHarness } from './href-harness';
import { SkyHrefTestingModule } from './href-testing.module';

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
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-1',
      userHasAccess: true,
    });
    expect(hrefHarness).toBeTruthy();
    expect(await hrefHarness.getHref()).toEqual('https://example.com/test1');
    expect(await hrefHarness.getLinkText()).toEqual('Link 1');
    expect(await hrefHarness.isLinked()).toBeTrue();
    expect(await hrefHarness.isVisible()).toBeTrue();
  });

  it('should work with multiple directives', async () => {
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-2',
      userHasAccess: true,
    });
    expect(hrefHarness).toBeTruthy();
    expect(await hrefHarness.getHref()).toEqual('https://example.com/test2');
    expect(await hrefHarness.getLinkText()).toEqual('Link 2');
    expect(await hrefHarness.isLinked()).toBeTrue();
    expect(await hrefHarness.isVisible()).toBeTrue();
  });

  it('should work when the link is not active', async () => {
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-1',
      userHasAccess: false,
    });
    expect(hrefHarness).toBeTruthy();
    expect(await hrefHarness.getHref()).toBeFalsy();
    expect(await hrefHarness.getLinkText()).toEqual('Link 1');
    expect(await hrefHarness.isLinked()).toBeFalse();
    expect(await hrefHarness.isVisible()).toBeTrue();
  });

  it('should work when the link is hidden', async () => {
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-2',
      userHasAccess: false,
    });
    expect(hrefHarness).toBeTruthy();
    expect(await hrefHarness.getHref()).toBeFalsy();
    expect(await hrefHarness.getLinkText()).toEqual('Link 2');
    expect(await hrefHarness.isLinked()).toBeFalse();
    expect(await hrefHarness.isVisible()).toBeFalse();
  });
});
