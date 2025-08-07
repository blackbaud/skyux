import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalHarness } from '@skyux/modals/testing';

import { Observable, of } from 'rxjs';

import { ModalDemoDataService } from './data.service';
import { ModalsModalWithErrorExampleComponent } from './example.component';

class mockWaitSvc {
  public blockingWrap(data: unknown): Observable<unknown> {
    return of(data);
  }
}

describe('Basic modal', () => {
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
          useClass: mockWaitSvc,
        },
        ModalDemoDataService,
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
});
