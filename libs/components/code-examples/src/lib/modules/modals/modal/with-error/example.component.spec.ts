import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyButtonHarness, SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyWaitService } from '@skyux/indicators';
import { SkyStatusIndicatorHarness } from '@skyux/indicators/testing';
import { SkyModalHarness } from '@skyux/modals/testing';

import { Observable, of } from 'rxjs';

import { ModalDemoData } from './data';
import { ModalDemoDataService } from './data.service';
import { ModalsModalWithErrorExampleComponent } from './example.component';

class MockWaitService {
  public blockingWrap<T>(observable: Observable<T>): Observable<T> {
    return observable;
  }
}

// Return data synchronously instead of simulating network latency.
class MockModalDemoDataService {
  public load(): Observable<ModalDemoData> {
    return of({ value1: 'Hello world' });
  }

  public save(data: ModalDemoData): Observable<ModalDemoData> {
    return of(data);
  }
}

describe('Modal with form errors example', () => {
  async function setupTest(): Promise<{
    modalHarness: SkyModalHarness;
    fixture: ComponentFixture<ModalsModalWithErrorExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      ModalsModalWithErrorExampleComponent,
    );
    fixture.componentInstance.onOpenModalClick();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const modalHarness = await loader.getHarness(
      SkyModalHarness.with({
        dataSkyId: 'modal-example',
      }),
    );

    return { modalHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalsModalWithErrorExampleComponent],
      providers: [
        {
          provide: SkyWaitService,
          useClass: MockWaitService,
        },
        {
          provide: ModalDemoDataService,
          useClass: MockModalDemoDataService,
        },
        provideNoopSkyAnimations(),
      ],
    });
  });

  it('should open the correct modal', async () => {
    const { modalHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaRole()).toBeResolvedTo('dialog');
    await expectAsync(modalHarness.getSize()).toBeResolvedTo('medium');
    await expectAsync(modalHarness.isFullPage()).toBeResolvedTo(false);
  });

  it('should display the saved value after the modal is closed', async () => {
    const { fixture } = await setupTest();
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const input = await (
      await rootLoader.getHarness(SkyInputBoxHarness)
    ).querySelector('input');

    await expectAsync(input.getProperty('value')).toBeResolvedTo('Hello world');

    await input.clear();
    await input.sendKeys('Hello there');

    const buttons = await rootLoader.getAllHarnesses(SkyButtonHarness);
    const labels = await Promise.all(buttons.map((b) => b.getLabelText()));
    await buttons[labels.indexOf('Save')].click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'The user entered Hello there',
    );
  });

  it('should display a form error when the save fails', async () => {
    const { fixture } = await setupTest();
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    await expectAsync(
      rootLoader.getAllHarnesses(SkyStatusIndicatorHarness),
    ).toBeResolvedTo([]);

    const buttons = await rootLoader.getAllHarnesses(SkyButtonHarness);
    const labels = await Promise.all(buttons.map((b) => b.getLabelText()));
    await buttons[labels.indexOf('Save form with an error')].click();

    const errorIndicator = await rootLoader.getHarness(
      SkyStatusIndicatorHarness,
    );
    await expectAsync(errorIndicator.getText()).toBeResolvedTo(
      'There was an error saving the form.',
    );
    await expectAsync(errorIndicator.getIndicatorType()).toBeResolvedTo(
      'danger',
    );
    await expectAsync(errorIndicator.getDescriptionType()).toBeResolvedTo(
      'error',
    );
  });
});
