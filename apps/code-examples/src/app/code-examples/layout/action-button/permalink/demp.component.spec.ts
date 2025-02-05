import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyActionButtonContainerHarness } from '@skyux/layout/testing';

import { DemoComponent } from './demo.component';

describe('Action buttons with permalinks', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyActionButtonContainerHarness;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyActionButtonContainerHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
      providers: [provideRouter([])],
    });
  });

  it('should set initial values', async () => {
    const { harness } = await setupTest({ dataSkyId: 'link-buttons' });

    const linkButtonHarness = await harness.getActionButton({
      header: 'Open a link',
    });

    await expectAsync(linkButtonHarness.getLink()).toBeResolvedTo(
      'https://www.stackblitz.com/',
    );
    await expectAsync(linkButtonHarness.getIconType()).toBeResolvedTo('link');
    await expectAsync(linkButtonHarness.getDetailsText()).toBeResolvedTo(
      'Open a link.',
    );

    const routerLinkButtonHarness = await harness.getActionButton({
      dataSkyId: 'router-link-button',
    });

    const urlCheck = (await routerLinkButtonHarness.getLink())?.endsWith(
      '?component=MyComponent',
    );
    expect(urlCheck).toBeTrue();
    await expectAsync(routerLinkButtonHarness.getIconType()).toBeResolvedTo(
      'link',
    );
    await expectAsync(routerLinkButtonHarness.getDetailsText()).toBeResolvedTo(
      'Open a router link.',
    );
  });
});
