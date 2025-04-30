import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyIllustrationSize } from '@skyux/indicators';

import { SkyIllustrationTestComponent } from './fixtures/illustration-test.component';
import { SkyIllustrationTestModule } from './fixtures/illustration-test.module';
import { SkyIllustrationHarness } from './illustration-harness';

describe('Illustration harness', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<SkyIllustrationTestComponent>;
    harness: SkyIllustrationHarness;
  }> {
    TestBed.configureTestingModule({
      imports: [SkyIllustrationTestModule],
    });

    const fixture = TestBed.createComponent(SkyIllustrationTestComponent);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyIllustrationHarness.with({
        dataSkyId: 'illustration-test',
      }),
    );

    return { fixture, harness };
  }

  describe('getName()', () => {
    it('should return name when the name resolves to a non-data URL', fakeAsync(async () => {
      const { fixture, harness } = await setupTest();

      fixture.componentRef.setInput('name', 'success');
      fixture.detectChanges();
      tick();

      await expectAsync(harness.getName()).toBeResolvedTo('success');
    }));

    it('should return name when the name resolves to a data URL', fakeAsync(async () => {
      const { fixture, harness } = await setupTest();

      fixture.componentRef.setInput('name', 'success-data');
      fixture.detectChanges();
      tick();

      await expectAsync(harness.getName()).toBeResolvedTo('success-data');
    }));

    it('should throw an error when name is set to undefined', fakeAsync(async () => {
      const { fixture, harness } = await setupTest();

      fixture.componentRef.setInput('name', undefined);

      await expectAsync(harness.getName()).toBeRejectedWithError(
        'Name was not set.',
      );
    }));
  });

  describe('getSize()', () => {
    it('should return the expected size', async () => {
      async function validate(size: SkyIllustrationSize): Promise<void> {
        fixture.componentRef.setInput('size', size);

        await expectAsync(harness.getSize()).toBeResolvedTo(size);
      }

      const { fixture, harness } = await setupTest();

      await validate('sm');
      await validate('md');
      await validate('lg');
      await validate('xl');
    });

    it('should throw an error when the class is altered', fakeAsync(async () => {
      const { fixture, harness } = await setupTest();
      fixture.componentRef.setInput('size', 'sm');

      const classList = fixture.nativeElement.querySelector(
        '.sky-illustration-img',
      ).classList;

      classList.remove('sky-illustration-img-sm');
      classList.add('sky-illustration-img-fake');

      await expectAsync(harness.getSize()).toBeRejectedWithError(
        'Size was not set.',
      );
    }));

    it('should throw an error when size is set to undefined', fakeAsync(async () => {
      const { fixture, harness } = await setupTest();
      fixture.componentRef.setInput('size', undefined);

      await expectAsync(harness.getSize()).toBeRejectedWithError(
        'Size was not set.',
      );
    }));
  });
});
