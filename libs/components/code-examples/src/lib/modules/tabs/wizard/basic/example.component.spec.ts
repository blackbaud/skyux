import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { SkyModalHarness } from '@skyux/modals/testing';
import { SkyTabsetHarness } from '@skyux/tabs/testing';

import { TabsWizardBasicExampleComponent } from './example.component';

describe('Wizard in a modal example', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsWizardBasicExampleComponent],
      providers: [provideNoopSkyAnimations(), provideRouter([])],
    });
  });

  it('should open the wizard in a large modal', async () => {
    const fixture = TestBed.createComponent(TabsWizardBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const openButton = await loader.getHarness(SkyButtonHarness);
    await expectAsync(openButton.getLabelText()).toBeResolvedTo('Open Wizard');
    await expectAsync(openButton.getAriaHasPopup()).toBeResolvedTo('dialog');

    await openButton.click();

    const modalHarness = await rootLoader.getHarness(SkyModalHarness);
    await expectAsync(modalHarness.getHeadingText()).toBeResolvedTo(
      'New Member Sign-up',
    );
    await expectAsync(modalHarness.getSize()).toBeResolvedTo('large');

    const tabsetHarness = await rootLoader.getHarness(
      SkyTabsetHarness.with({ dataSkyId: 'sign-up-wizard' }),
    );
    await expectAsync(tabsetHarness.isWizardTabset()).toBeResolvedTo(true);
    await expectAsync(tabsetHarness.getAriaLabel()).toBeResolvedTo(
      'Sign-up steps',
    );
  });
});
