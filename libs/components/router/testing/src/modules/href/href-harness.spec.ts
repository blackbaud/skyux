import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrefHarnessTestComponent } from './fixtures/href-harness-test.component';
import { HrefHarnessTestModule } from './fixtures/href-harness-test.module';
import { SkyHrefHarness } from './href-harness';
import { SkyHrefTestingModule } from './href-testing.module';

describe('SkyHrefHarness', () => {
  async function setupTest(options: {
    dataSkyId: string;
    userHasAccess: boolean;
  }): Promise<{
    fixture: ComponentFixture<HrefHarnessTestComponent>;
    loader: HarnessLoader;
    hrefHarness: SkyHrefHarness;
  }> {
    TestBed.configureTestingModule({
      imports: [
        HrefHarnessTestModule,
        SkyHrefTestingModule.with({ userHasAccess: options.userHasAccess }),
      ],
    });

    const fixture = TestBed.createComponent(HrefHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const hrefHarness = await loader.getHarness(
      SkyHrefHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { hrefHarness, fixture, loader };
  }

  it('should be created', async () => {
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-1',
      userHasAccess: true,
    });
    expect(hrefHarness).toBeTruthy();
    await expectAsync(hrefHarness.getHref()).toBeResolvedTo(
      'https://example.com/test1',
    );
    await expectAsync(hrefHarness.getText()).toBeResolvedTo('Link 1');
    await expectAsync(hrefHarness.isVisible()).toBeResolvedTo(true);
  });

  it('should work with multiple directives', async () => {
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-2',
      userHasAccess: true,
    });
    expect(hrefHarness).toBeTruthy();
    await expectAsync(hrefHarness.getHref()).toBeResolvedTo(
      'https://example.com/test2',
    );
    await expectAsync(hrefHarness.getText()).toBeResolvedTo('Link 2');
    await expectAsync(hrefHarness.isVisible()).toBeResolvedTo(true);
  });

  it('should work when the link is not active', async () => {
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-1',
      userHasAccess: false,
    });
    expect(hrefHarness).toBeTruthy();
    await expectAsync(hrefHarness.getHref()).toBeResolvedTo(null);
    await expectAsync(hrefHarness.getText()).toBeResolvedTo('Link 1');
    await expectAsync(hrefHarness.isVisible()).toBeResolvedTo(true);
  });

  it('should work when the link is hidden', async () => {
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-2',
      userHasAccess: false,
    });
    expect(hrefHarness).toBeTruthy();
    await expectAsync(hrefHarness.getHref()).toBeResolvedTo(null);
    await expectAsync(hrefHarness.getText()).toBeResolvedTo('');
    await expectAsync(hrefHarness.isVisible()).toBeResolvedTo(false);
  });

  it('should find elements when skyHref is bound to a variable', async () => {
    const { hrefHarness } = await setupTest({
      dataSkyId: 'my-href-3',
      userHasAccess: true,
    });

    await expectAsync(hrefHarness.getHref()).toBeResolvedTo(
      'https://example.com/my-base-href',
    );
  });
});
