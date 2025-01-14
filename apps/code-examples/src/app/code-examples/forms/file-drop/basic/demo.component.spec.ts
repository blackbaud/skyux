import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyFileDropHarness,
  provideSkyFileAttachmentTesting,
} from '@skyux/forms/testing';

import { DemoComponent } from '../../character-count/demo.component';

describe('Basic file drop demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyFileDropHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    TestBed.configureTestingModule({
      providers: [provideSkyFileAttachmentTesting()],
    });
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyFileDropHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    });
  });
});
