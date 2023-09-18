import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHrefHarness, SkyHrefTestingModule } from '@skyux/router/testing';

import { DemoComponent } from './demo.component';

describe('SkyHrefDemoComponent', () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  async function setup(options: {
    userHasAccess: boolean;
    dataSkyId: string;
  }): Promise<{
    fixture: ComponentFixture<DemoComponent>;
    loader: HarnessLoader;
    hrefHarness: SkyHrefHarness;
  }> {
    TestBed.configureTestingModule({
      imports: [
        DemoComponent,
        SkyHrefTestingModule.with({ userHasAccess: options.userHasAccess }),
      ],
    });

    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const hrefHarness = await loader.getHarness(
      SkyHrefHarness.with({ dataSkyId: options.dataSkyId })
    );

    return { fixture, loader, hrefHarness };
  }

  it('should create', async () => {
    await setup({ userHasAccess: true, dataSkyId: 'my-href-allow' });
    expect(component).toBeTruthy();
  });

  it('should show skyhref with access', async () => {
    const { hrefHarness } = await setup({
      userHasAccess: true,
      dataSkyId: 'my-href-allow',
    });
    expect(hrefHarness).toBeTruthy();
    await expectAsync(hrefHarness.getHref()).toBeResolvedTo(
      'allow://example.com'
    );
    await expectAsync(hrefHarness.getText()).toBeResolvedTo(
      'Example.com with “allow” protocol'
    );
    await expectAsync(hrefHarness.isVisible()).toBeResolvedTo(true);
  });

  it('should hide skyhref without access', async () => {
    const { hrefHarness } = await setup({
      userHasAccess: false,
      dataSkyId: 'my-href-hidden',
    });
    expect(hrefHarness).toBeTruthy();
    await expectAsync(hrefHarness.getHref()).toBeResolvedTo(null);
    await expectAsync(hrefHarness.getText()).toBeResolvedTo('');
    await expectAsync(hrefHarness.isVisible()).toBeResolvedTo(false);
  });

  it('should unlink skyhref without access', async () => {
    const { hrefHarness } = await setup({
      userHasAccess: false,
      dataSkyId: 'my-href-unlinked',
    });
    await expectAsync(hrefHarness.getHref()).toBeResolvedTo(null);
    await expectAsync(hrefHarness.getText()).toBeResolvedTo(
      'Example.com with “deny” protocol'
    );
    await expectAsync(hrefHarness.isVisible()).toBeResolvedTo(true);
  });
});
