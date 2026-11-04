import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyButtonHarness, SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalHarness } from '@skyux/modals/testing';

import { Observable, of } from 'rxjs';

import { ModalDemoData } from './data';
import { ModalDemoDataService } from './data.service';
import { ModalsModalBasicWithHarnessHelpKeyExampleComponent } from './example.component';

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

describe('Modal with a help key example', () => {
  async function setupTest(): Promise<{
    modalHarness: SkyModalHarness;
    fixture: ComponentFixture<ModalsModalBasicWithHarnessHelpKeyExampleComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(
      ModalsModalBasicWithHarnessHelpKeyExampleComponent,
    );
    fixture.componentInstance.onOpenModalClick();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const modalHarness = await loader.getHarness(
      SkyModalHarness.with({
        dataSkyId: 'modal-example',
      }),
    );
    const helpController = TestBed.inject(SkyHelpTestingController);

    return { modalHarness, fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalsModalBasicWithHarnessHelpKeyExampleComponent,
        SkyHelpTestingModule,
      ],
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

  it('should have the correct help key', async () => {
    const { modalHarness, helpController } = await setupTest();

    await modalHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('modal-help');
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
});
