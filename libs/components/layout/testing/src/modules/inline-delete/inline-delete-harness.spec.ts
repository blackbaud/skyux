import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInlineDeleteModule } from '@skyux/layout';

import { SkyInlineDeleteHarness } from './inline-delete-harness';

@Component({
  selector: 'sky-inline-delete-test',
  imports: [SkyInlineDeleteModule],
  template: `
    <sky-inline-delete
      data-sky-id="test-component-delete"
      [pending]="pendingFlag"
      (cancelTriggered)="cancelDeletion()"
      (deleteTriggered)="deleteItem()"
    />
  `,
})
class TestComponent {
  public pendingFlag = false;
  public cancelDeletion(): void {
    // for spy
  }
  public deleteItem(): void {
    // for spy
  }
}
describe('Inline delete harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    deleteHarness: SkyInlineDeleteHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
    });
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const deleteHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyInlineDeleteHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyInlineDeleteHarness);

    return { deleteHarness, fixture };
  }

  it('should get the inline delete by data-sky-id', async () => {
    const { deleteHarness } = await setupTest({
      dataSkyId: 'test-component-delete',
    });
    await expectAsync(deleteHarness.host()).toBeResolved();
  });

  it('should click the delete button', async () => {
    const { deleteHarness, fixture } = await setupTest();

    const spy = spyOn(fixture.componentInstance, 'deleteItem');
    await deleteHarness.clickDeleteButton();

    expect(spy).toHaveBeenCalled();
  });

  it('should click the cancel button', async () => {
    const { deleteHarness, fixture } = await setupTest();

    const spy = spyOn(fixture.componentInstance, 'cancelDeletion');
    await deleteHarness.clickCancelButton();

    expect(spy).toHaveBeenCalled();
  });

  it('should get if the delete is pending', async () => {
    const { deleteHarness, fixture } = await setupTest();
    await expectAsync(deleteHarness.isPending()).toBeResolvedTo(false);

    fixture.componentInstance.pendingFlag = true;
    fixture.detectChanges();

    await expectAsync(deleteHarness.isPending()).toBeResolvedTo(true);
  });
});
