import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalHarness } from '@skyux/modals/testing';

import { Observable, of } from 'rxjs';

import { ModalDemoDataServiceDelay } from './data.service';
import { ModalSplitViewTileDashboardComponent } from './modal-split-view-tile-dashboard.component';
import { ModalSplitViewTileDashboardModule } from './modal-split-view-tile-dashboard.module';

class MockWaitSvc {
  public blockingWrap(data: unknown): Observable<unknown> {
    return of(data);
  }
}

describe('ModalSplitViewTileDashboardComponent', () => {
  async function setupTest(): Promise<{
    modalHarness: () => Promise<SkyModalHarness>;
    fixture: ComponentFixture<ModalSplitViewTileDashboardComponent>;
  }> {
    TestBed.configureTestingModule({
      imports: [ModalSplitViewTileDashboardModule],
      providers: [
        {
          provide: SkyWaitService,
          useClass: MockWaitSvc,
        },
        {
          provide: ModalDemoDataServiceDelay,
          useValue: 0,
        }],
    });
    const fixture = TestBed.createComponent(
      ModalSplitViewTileDashboardComponent,
    );
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const modalHarness = async () =>
      await loader.getHarness(
        SkyModalHarness.with({
          dataSkyId: 'modal-demo',
        }),
      );

    return { modalHarness, fixture };
  }

  it('should create full page modal', async () => {
    const { fixture, modalHarness } = await setupTest();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.componentInstance.onOpenFullPageModalClick();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(await (await modalHarness()).isFullPage()).toBeTrue();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('should create fit layout modal', async () => {
    const { fixture, modalHarness } = await setupTest();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.componentInstance.onOpenLargeModalClick();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(await (await modalHarness()).getSize()).toEqual('large');
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
