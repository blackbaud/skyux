import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NavbarHarnessTestComponent } from './fixtures/navbar-harness-test.component';
import { SkyNavbarHarness } from './navbar-harness';

describe('Navbar test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    navbarHarness: SkyNavbarHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [NavbarHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const navbarHarness: SkyNavbarHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyNavbarHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyNavbarHarness);

    return { navbarHarness };
  }

  it('should get the navbar and a navbar item by data-sky-id', async () => {
    const { navbarHarness } = await setupTest({
      dataSkyId: 'basic-navbar',
    });

    await expectAsync(
      navbarHarness.getItem({ dataSkyId: 'navbar-button-1' }),
    ).toBeResolved();
  });

  it('should get an array of all navbar items', async () => {
    const { navbarHarness } = await setupTest({
      dataSkyId: 'basic-navbar',
    });

    const items = await navbarHarness.getItems();

    expect(items.length).toBe(2);
  });

  it('should get an array of navbar items based on criteria', async () => {
    const { navbarHarness } = await setupTest({
      dataSkyId: 'basic-navbar',
    });

    const items = await navbarHarness.getItems({
      dataSkyId: 'navbar-button-1',
    });

    expect(items.length).toBe(1);
  });

  it('should throw an error if no navbar items are found matching criteria', async () => {
    const { navbarHarness } = await setupTest({
      dataSkyId: 'basic-navbar',
    });

    await expectAsync(
      navbarHarness.getItems({ dataSkyId: 'navbar-item-3' }),
    ).toBeRejectedWithError(
      'Unable to find any navbar items with filter(s): {"dataSkyId":"navbar-item-3"}',
    );
  });

  it('should return the navbar item active status', async () => {
    const { navbarHarness } = await setupTest({ dataSkyId: 'basic-navbar' });

    const items = await navbarHarness.getItems();

    await expectAsync(items[0].isActive()).toBeResolvedTo(true);
    await expectAsync(items[1].isActive()).toBeResolvedTo(false);
  });
});
