import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyActionButtonContainerHarness } from '@skyux/layout/testing';

import { DemoComponent } from './demo.component';

describe('Action buttons with permalinks', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyActionButtonContainerHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyActionButtonContainerHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent],
      providers: [provideRouter([])],
    });
  });

  it('should set initial values', async () => {
    const { harness } = await setupTest({ dataSkyId: 'list-actions' });

    const buildButtonHarness = await harness.getActionButton({
      header: 'Build a new list',
    });

    await expectAsync(buildButtonHarness.getIconType()).toBeResolvedTo(
      'filter',
    );
    await expectAsync(buildButtonHarness.getDetailsText()).toBeResolvedTo(
      'Start from scratch and fine-tune with filters.',
    );

    const openButtonHarness = await harness.getActionButton({
      dataSkyId: 'open-button',
    });

    await expectAsync(openButtonHarness.getIconType()).toBeResolvedTo(
      'folder-open-o',
    );
    await expectAsync(openButtonHarness.getDetailsText()).toBeResolvedTo(
      'Open a list with filters saved in the web view.',
    );
  });

  it('should set up button click actions', async () => {
    const { harness, fixture } = await setupTest({ dataSkyId: 'list-actions' });

    const buttons = await harness.getActionButtons();

    const filterSpy = spyOn(fixture.componentInstance, 'filterActionClick');
    const openSpy = spyOn(fixture.componentInstance, 'openActionClick');

    await buttons[0].click();
    expect(filterSpy).toHaveBeenCalled();

    await buttons[1].click();
    expect(openSpy).toHaveBeenCalled();
  });
});
