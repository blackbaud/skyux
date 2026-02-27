import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyInlineDeleteHarness } from '@skyux/layout/testing';

import { LayoutInlineDeleteCustomExampleComponent } from './example.component';

describe('Custom component inline delete example', () => {
  async function setupTest(): Promise<{
    deleteHarness: SkyInlineDeleteHarness;
    fixture: ComponentFixture<LayoutInlineDeleteCustomExampleComponent>;
  }> {
    TestBed.configureTestingModule({
      imports: [LayoutInlineDeleteCustomExampleComponent],
    });
    const fixture = TestBed.createComponent(
      LayoutInlineDeleteCustomExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentInstance.deleting = true;
    fixture.detectChanges();
    const deleteHarness = await loader.getHarness(
      SkyInlineDeleteHarness.with({ dataSkyId: 'inline-delete-custom' }),
    );

    return { deleteHarness, fixture };
  }

  it('should mark delete as pending when the delete button is clicked', async () => {
    const { deleteHarness } = await setupTest();

    await deleteHarness.clickDeleteButton();
    await expectAsync(deleteHarness.isPending()).toBeResolvedTo(true);
  });
});
