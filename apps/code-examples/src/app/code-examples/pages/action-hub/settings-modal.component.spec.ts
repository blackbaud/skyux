import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyModalHarness } from '@skyux/modals/testing';
import { SkyActionHubHarness } from '@skyux/pages/testing';

import { DemoComponent } from './demo.component';
import { MODAL_TITLE } from './modal-title-token';

describe('SettingsModalComponent', () => {
  async function setupTest(): Promise<{
    actionHubHarness: SkyActionHubHarness;
    fixture: ComponentFixture<DemoComponent>;
    loader: HarnessLoader;
    rootLoader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const actionHubHarness = await loader.getHarness(
      SkyActionHubHarness.with({
        dataSkyId: 'action-hub',
      }),
    );

    return { actionHubHarness, rootLoader, fixture, loader };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MODAL_TITLE,
          useValue: 'Settings Modal Test',
        },
      ],
    });
  });

  it('should show settings modal', async () => {
    const { actionHubHarness, rootLoader } = await setupTest();
    const settingsLinksHarness = await actionHubHarness.getSettingsLinks();
    const settingsLinks = await settingsLinksHarness.getListItems();
    expect(settingsLinks).toHaveSize(2);
    await settingsLinks[1].click();
    const modalHarness = await rootLoader.getHarness(
      SkyModalHarness.with({
        dataSkyId: 'settings-modal',
      }),
    );
    expect(await modalHarness.getHeadingText()).toBe('Color');
    const consoleSpy = spyOn(console, 'log').and.stub();
    const modalElement = TestbedHarnessEnvironment.getNativeElement(
      await modalHarness.host(),
    );
    const submit = modalElement.querySelector('button[type="submit"]');
    expect(submit).toBeTruthy();
    expect(submit?.textContent?.trim()).toBe('Save');
    (submit as HTMLButtonElement).click();
    expect(consoleSpy).toHaveBeenCalledWith({
      'Color 1': '',
      'Color 2': '',
      'Color 3': '',
      'Color 4': '',
      'Color 5': '',
    });
  });
});
