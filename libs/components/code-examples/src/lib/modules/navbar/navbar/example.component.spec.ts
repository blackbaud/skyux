import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyNavbarHarness } from '@skyux/navbar/testing';

import { NavbarExampleComponent } from './example.component';

describe('Basic navbar example', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    navbarHarness: SkyNavbarHarness;
    fixture: ComponentFixture<NavbarExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [NavbarExampleComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarExampleComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const navbarHarness: SkyNavbarHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyNavbarHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyNavbarHarness);

    return { navbarHarness, fixture };
  }

  it('should set up the navbar', async () => {
    const { navbarHarness, fixture } = await setupTest();

    const navbarItem1 = await navbarHarness.getItem({
      dataSkyId: 'navbar-item-1',
    });
    const navbarButton = await navbarItem1.querySelector('a');

    const clickSpy = spyOn(fixture.componentInstance, 'onItemClick');
    await navbarButton.click();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
