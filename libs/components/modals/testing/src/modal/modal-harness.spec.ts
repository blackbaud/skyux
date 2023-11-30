import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyModalConfigurationInterface,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';

import { SkyModalHarness } from './modal-harness';

//#region Test component
@Component({
  selector: 'sky-modal-modal-test',
  template: `<sky-modal></sky-modal>`,
})
class TestComponent {}

class ModalWithKeepWorkingPromptTestContext {
  public isDirty = false;
}

@Component({
  selector: 'sky-modal-discard-prompt-test',
  template: `<sky-modal
    data-sky-id="isDirtyModal"
    [isDirty]="isDirty"
  ></sky-modal>`,
})
class TestKeepWaitingPromptComponent {
  public isDirty: boolean;

  constructor(context: ModalWithKeepWorkingPromptTestContext) {
    this.isDirty = context.isDirty;
  }
}

@Component({
  selector: 'sky-modal-sky-id-test',
  template: `<sky-modal data-sky-id="otherModal"></sky-modal>`,
})
class TestSkyIdComponent {}

@Component({
  selector: 'sky-modal-test-modal',
  template: `<button (click)="openModal()"></button>`,
})
class TestButtonComponent {
  #modalSvc = inject(SkyModalService);

  public openModal(config?: SkyModalConfigurationInterface): void {
    this.#modalSvc.open(TestComponent, config);
  }

  public openOtherModal(): void {
    this.#modalSvc.open(TestSkyIdComponent, { ariaDescribedBy: 'otherModal' });
  }

  public openIsDirtyModal(isDirty: boolean): void {
    this.#modalSvc.open(TestKeepWaitingPromptComponent, {
      providers: [
        {
          provide: ModalWithKeepWorkingPromptTestContext,
          useValue: { isDirty },
        },
      ],
    });
  }
}
//#endregion Test component

describe('Modal test harness', () => {
  let fixture: ComponentFixture<TestButtonComponent>;
  let service: SkyModalService;
  async function setupTest(
    config?: SkyModalConfigurationInterface,
    options: {
      dataSkyId?: string;
    } = {}
  ): Promise<{
    modalHarness: SkyModalHarness;
    service: SkyModalService;
    fixture: ComponentFixture<TestButtonComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        TestKeepWaitingPromptComponent,
        TestSkyIdComponent,
      ],
      imports: [SkyModalModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestButtonComponent);
    fixture.detectChanges();
    fixture.componentInstance.openModal(config);
    fixture.componentInstance.openOtherModal();
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    service = TestBed.inject(SkyModalService);

    let modalHarness: SkyModalHarness;

    if (options.dataSkyId) {
      modalHarness = await loader.getHarness(
        SkyModalHarness.with({
          dataSkyId: options.dataSkyId,
        })
      );
    } else {
      modalHarness = await loader.getHarness(SkyModalHarness);
    }

    return { modalHarness, fixture, service, loader };
  }

  afterEach(() => {
    service.dispose();
    fixture.destroy();
  });

  async function testIsDirtyDirective(isDirty: boolean): Promise<void> {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();

    fixture.componentInstance.openIsDirtyModal(isDirty);
    fixture.detectChanges();

    const isDirtyModalHarness = await loader.getHarness(
      SkyModalHarness.with({
        dataSkyId: 'isDirtyModal',
      })
    );

    await expectAsync(isDirtyModalHarness.isDirty()).toBeResolvedTo(isDirty);
  }

  it('should get the correct modal by data sky id', async () => {
    const { modalHarness, fixture } = await setupTest(
      {},
      { dataSkyId: 'otherModal' }
    );

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaDescribedBy()).toBeResolvedTo(
      'otherModal'
    );
  });

  it('should get aria described by', async () => {
    const { modalHarness, fixture } = await setupTest({
      ariaDescribedBy: 'ariaDescribedBy',
    });

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaDescribedBy()).toBeResolvedTo(
      'ariaDescribedBy'
    );
  });

  it('should get aria labelled by', async () => {
    const { modalHarness, fixture } = await setupTest({
      ariaLabelledBy: 'ariaLabelledBy',
    });

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaLabelledBy()).toBeResolvedTo(
      'ariaLabelledBy'
    );
  });

  it('should get default aria role', async () => {
    const { modalHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaRole()).toBeResolvedTo('dialog');
  });

  it('should get aria role', async () => {
    const { modalHarness, fixture } = await setupTest({
      ariaRole: 'testModal',
    });

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaRole()).toBeResolvedTo('testModal');
  });

  it('should get modal default size', async () => {
    const { modalHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(modalHarness.getSize()).toBeResolvedTo('medium');
  });

  const sizes = ['small', 'medium', 'large'];
  for (const size of sizes) {
    it(`should return the correct modal size when ${size}`, async () => {
      const { modalHarness, fixture } = await setupTest({
        size: size,
      });

      fixture.detectChanges();

      await expectAsync(modalHarness.getSize()).toBeResolvedTo(size);
    });
  }

  it('should throw an error when trying to get size of a full page modal', async () => {
    const { modalHarness, fixture } = await setupTest({
      size: 'small',
      fullPage: true,
    });

    fixture.detectChanges();

    await expectAsync(modalHarness.getSize()).toBeRejectedWithError(
      'Size cannot be determined because size property is overridden when modal is full page'
    );
  });

  it('should get wrapper class', async () => {
    const { modalHarness, fixture } = await setupTest({
      wrapperClass: 'test-class',
    });

    fixture.detectChanges();

    await expectAsync(modalHarness.getWrapperClass()).toBeResolvedTo(
      'test-class'
    );
  });

  it('should get the default value for full page', async () => {
    const { modalHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(modalHarness.isFullPage()).toBeResolvedTo(false);
  });

  it('should get the correct value for full page when true', async () => {
    const { modalHarness, fixture } = await setupTest({ fullPage: true });

    fixture.detectChanges();

    await expectAsync(modalHarness.isFullPage()).toBeResolvedTo(true);
  });

  it('should get the correct value for full page when false', async () => {
    const { modalHarness, fixture } = await setupTest({ fullPage: false });

    fixture.detectChanges();

    await expectAsync(modalHarness.isFullPage()).toBeResolvedTo(false);
  });

  it('should report that modal is not dirty without keep working prompt directive', async () => {
    const { modalHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(modalHarness.isDirty()).toBeResolvedTo(false);
  });

  it('should get correct value for isDirty when false', async () => {
    await testIsDirtyDirective(false);
  });

  it('should get correct value for isDirty when true', async () => {
    await testIsDirtyDirective(true);
  });
});
