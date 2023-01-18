import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHrefHarness, SkyHrefTestingModule } from '@skyux/router/testing';

import { SkyHrefDemoComponent } from './sky-href-demo.component';

describe('SkyHrefDemoComponent', () => {
  let component: SkyHrefDemoComponent;
  let fixture: ComponentFixture<SkyHrefDemoComponent>;

  async function setup(userHasAccess: boolean) {
    TestBed.configureTestingModule({
      declarations: [SkyHrefDemoComponent],
      imports: [SkyHrefTestingModule.with({ userHasAccess })],
    });

    fixture = TestBed.createComponent(SkyHrefDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    return { fixture, loader };
  }

  it('should create', async () => {
    await setup(true);
    expect(component).toBeTruthy();
  });

  it('should show skyhref with access', async () => {
    const { loader } = await setup(true);
    const hrefHarness = await loader.getHarness(
      SkyHrefHarness.with({ dataSkyId: 'my-href-allow' })
    );
    expect(await hrefHarness.getHref()).toEqual('https://example.com');
    expect(await hrefHarness.getLinkText()).toEqual(
      'Example.com with “allow” protocol'
    );
    expect(await hrefHarness.isLinked()).toBeTrue();
    expect(await hrefHarness.isVisible()).toBeTrue();
  });

  it('should hide skyhref without access', async () => {
    const { loader } = await setup(false);
    const hrefHarness = await loader.getHarness(
      SkyHrefHarness.with({ dataSkyId: 'my-href-hidden' })
    );
    expect(await hrefHarness.getHref()).toBeFalsy();
    expect(await hrefHarness.getLinkText()).toEqual(
      'Example.com with “deny” protocol'
    );
    expect(await hrefHarness.isLinked()).toBeFalse();
    expect(await hrefHarness.isVisible()).toBeFalse();
  });

  it('should unlink skyhref without access', async () => {
    const { loader } = await setup(false);
    const hrefHarness = await loader.getHarness(
      SkyHrefHarness.with({ dataSkyId: 'my-href-unlinked' })
    );
    expect(await hrefHarness.getHref()).toBeFalsy();
    expect(await hrefHarness.getLinkText()).toEqual(
      'Example.com with “deny” protocol'
    );
    expect(await hrefHarness.isLinked()).toBeFalse();
    expect(await hrefHarness.isVisible()).toBeTrue();
  });
});
