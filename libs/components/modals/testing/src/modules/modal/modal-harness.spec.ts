import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, Injectable, StaticProvider, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyModalConfigurationInterface,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';

import { SkyModalHarness } from './modal-harness';

@Injectable()
export class ModalTestContext {
  public headingText: string | undefined;
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
}

//#region Test component
@Component({
  selector: 'sky-modal-modal-test',
  template: `<sky-modal
    [headingText]="context?.headingText"
    [helpKey]="context?.helpKey"
    [helpPopoverContent]="context?.helpPopoverContent"
    [helpPopoverTitle]="context?.helpPopoverTitle"
  ></sky-modal>`,
  standalone: false,
})
class TestComponent {
  protected context = inject(ModalTestContext, { optional: true });
}

class ModalWithKeepWorkingPromptTestContext {
  public isDirty = false;
}

@Component({
  selector: 'sky-modal-discard-prompt-test',
  template: `<sky-modal
    data-sky-id="isDirtyModal"
    [isDirty]="isDirty"
  ></sky-modal>`,
  standalone: false,
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
  standalone: false,
})
class TestSkyIdComponent {}

@Component({
  selector: 'sky-modal-test-modal',
  template: `<button type="button" (click)="openModal()"></button>`,
  standalone: false,
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
    } = {},
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
      imports: [NoopAnimationsModule, SkyModalModule],
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
        }),
      );
    } else {
      modalHarness = await loader.getHarness(SkyModalHarness);
    }

    return { modalHarness, fixture, service, loader };
  }

  function getContextProviders(
    context: Partial<ModalTestContext>,
  ): StaticProvider[] {
    return [
      {
        provide: ModalTestContext,
        useValue: context,
      },
    ];
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
      }),
    );

    await expectAsync(isDirtyModalHarness.isDirty()).toBeResolvedTo(isDirty);
  }

  it('should get the correct modal by data sky id', async () => {
    const { modalHarness, fixture } = await setupTest(
      {},
      { dataSkyId: 'otherModal' },
    );

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaDescribedBy()).toBeResolvedTo(
      'otherModal',
    );
  });

  it('should get aria described by', async () => {
    const { modalHarness, fixture } = await setupTest({
      ariaDescribedBy: 'ariaDescribedBy',
    });

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaDescribedBy()).toBeResolvedTo(
      'ariaDescribedBy',
    );
  });

  it('should get aria labelled by', async () => {
    const { modalHarness, fixture } = await setupTest({
      ariaLabelledBy: 'ariaLabelledBy',
    });

    fixture.detectChanges();

    await expectAsync(modalHarness.getAriaLabelledBy()).toBeResolvedTo(
      'ariaLabelledBy',
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
      'Size cannot be determined because size property is overridden when modal is full page',
    );
  });

  it('should get wrapper class', async () => {
    const { modalHarness, fixture } = await setupTest({
      wrapperClass: 'test-class',
    });

    fixture.detectChanges();

    await expectAsync(modalHarness.getWrapperClass()).toBeResolvedTo(
      'test-class',
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

  it('should get the heading text', async () => {
    const { modalHarness } = await setupTest({
      providers: getContextProviders({
        headingText: 'My modal heading',
      }),
    });

    await expectAsync(modalHarness.getHeadingText()).toBeResolvedTo(
      'My modal heading',
    );
  });

  it('should get the popover content', async () => {
    const { modalHarness } = await setupTest({
      providers: getContextProviders({
        headingText: 'My modal heading',
        helpPopoverContent: 'My popover content',
      }),
    });

    await modalHarness.clickHelpInline();

    await expectAsync(modalHarness.getHelpPopoverContent()).toBeResolvedTo(
      'My popover content',
    );
  });

  it('should get the popover title', async () => {
    const { modalHarness } = await setupTest({
      providers: getContextProviders({
        headingText: 'My modal heading',
        helpPopoverContent: 'My popover content',
        helpPopoverTitle: 'My popover title',
      }),
    });

    await modalHarness.clickHelpInline();

    await expectAsync(modalHarness.getHelpPopoverTitle()).toBeResolvedTo(
      'My popover title',
    );
  });

  it('should throw when getting content from a closed popover', async () => {
    const { modalHarness } = await setupTest({
      providers: getContextProviders({
        headingText: 'My modal heading',
        helpPopoverContent: 'My popover content',
      }),
    });

    await expectAsync(
      modalHarness.getHelpPopoverContent(),
    ).toBeRejectedWithError(
      'Unable to retrieve the popover content because the popover is not open.',
    );
  });

  it('should throw when clicking on a nonexistent help button', async () => {
    const { modalHarness } = await setupTest({
      providers: getContextProviders({
        headingText: undefined,
        helpPopoverContent: 'My popover content',
      }),
    });

    await expectAsync(modalHarness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
  });
});
