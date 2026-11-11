import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyButtonHarness, SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalHarness } from '@skyux/modals/testing';

import { Observable, of } from 'rxjs';

import { ModalDemoData } from './data';
import { ModalDemoDataService } from './data.service';
import { ModalsModalBasicWithHarnessExampleComponent } from './example.component';

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

describe('Basic modal', () => {
  async function setupTest(): Promise<{
    modalHarness: SkyModalHarness;
    fixture: ComponentFixture<ModalsModalBasicWithHarnessExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      ModalsModalBasicWithHarnessExampleComponent,
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
      imports: [ModalsModalBasicWithHarnessExampleComponent],
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
    await expectAsync(modalHarness.getHeadingText()).toBeResolvedTo(
      'Modal title',
    );

    await modalHarness.clickHelpInline();

    await expectAsync(modalHarness.getHelpPopoverContent()).toBeResolvedTo(
      'Use the help inline component to invoke contextual user assistance.',
    );
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
