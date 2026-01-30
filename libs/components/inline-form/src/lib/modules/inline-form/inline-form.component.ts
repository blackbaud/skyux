import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Observable, ReplaySubject, Subject, zip as observableZip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyInlineFormAdapterService } from './inline-form-adapter.service';
import { SkyInlineFormButtonConfig } from './types/inline-form-button-config';
import { SkyInlineFormButtonLayout } from './types/inline-form-button-layout';
import { SkyInlineFormCloseArgs } from './types/inline-form-close-args';
import { SkyInlineFormConfig } from './types/inline-form-config';

/**
 * Renders form content in the current view instead of a separate modal.
 */
@Component({
  selector: 'sky-inline-form',
  templateUrl: './inline-form.component.html',
  styleUrls: ['./inline-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyInlineFormAdapterService],
  standalone: false,
})
export class SkyInlineFormComponent implements OnInit, OnDestroy {
  /**
   * Configuration options for the buttons to display with the inline form.
   * @required
   */
  @Input()
  public set config(value: SkyInlineFormConfig | undefined) {
    if (value !== this.#_config && !!value) {
      this.#_config = value;
      this.#setupButtons();
    }
  }

  public get config(): SkyInlineFormConfig | undefined {
    return this.#_config;
  }

  /**
   * The template to instantiate the inline form.
   * @required
   */
  @Input()
  public template: TemplateRef<unknown> | undefined;

  /**
   * Whether to display the inline form. Users can toggle between displaying
   * and hiding the inline form.
   * @default false
   */
  @Input()
  public set showForm(value: boolean | undefined) {
    this.#_showForm = value;

    /* istanbul ignore else */
    if (value) {
      // setTimeout() prevents applyAutofocus() from firing
      // until after *ngIf has added the form element to the DOM.
      this.#skyAppWindowRef.nativeWindow.setTimeout(() => {
        this.#adapter.applyAutofocus(this.#elementRef);
      });
    }
  }

  public get showForm(): boolean | undefined {
    return this.#_showForm;
  }

  @HostBinding('attr.data-show-form')
  public get showFormData(): boolean | undefined {
    return this.showForm;
  }

  /**
   * Fires when users close the inline form.
   */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public close = new EventEmitter<SkyInlineFormCloseArgs>();

  // TODO: handle buttons being set asynchronously ("| undefined") when setting autofocus
  public buttons!: SkyInlineFormButtonConfig[];

  #_config: SkyInlineFormConfig | undefined;

  #_showForm: boolean | undefined = false;

  #ngUnsubscribe = new Subject<void>();

  #adapter: SkyInlineFormAdapterService;
  #elementRef: ElementRef;
  #resourcesService: SkyLibResourcesService;
  #skyAppWindowRef: SkyAppWindowRef;
  #changeDetectorRef: ChangeDetectorRef;

  constructor(
    adapter: SkyInlineFormAdapterService,
    elementRef: ElementRef,
    resourcesService: SkyLibResourcesService,
    skyAppWindowRef: SkyAppWindowRef,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    this.#adapter = adapter;
    this.#elementRef = elementRef;
    this.#resourcesService = resourcesService;
    this.#skyAppWindowRef = skyAppWindowRef;
    this.#changeDetectorRef = changeDetectorRef;
  }

  public ngOnInit(): void {
    this.#setupButtons();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.close.complete();
  }

  public closeInlineForm(event: SkyInlineFormButtonConfig): void {
    const args: SkyInlineFormCloseArgs = {
      reason: event.action,
    };
    this.close.emit(args);
  }

  #setupButtons(): void {
    if (
      this.#isValidCustomConfig(this.config) &&
      this.config &&
      this.config.buttons
    ) {
      this.buttons = this.#getCustomButtons(this.config.buttons);
      this.#changeDetectorRef.markForCheck();
      return;
    }

    this.#getPresetButtons()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((buttons: SkyInlineFormButtonConfig[]) => {
        this.buttons = buttons;
        this.#changeDetectorRef.markForCheck();
      });
  }

  #getPresetButtons(): Observable<SkyInlineFormButtonConfig[]> {
    const emitter = new ReplaySubject<SkyInlineFormButtonConfig[]>(1);

    const buttonType = this.config
      ? this.config.buttonLayout
      : SkyInlineFormButtonLayout.DoneCancel;

    switch (buttonType) {
      /* istanbul ignore next */
      default:
      case SkyInlineFormButtonLayout.DoneCancel:
        observableZip(
          this.#resourcesService.getString('skyux_inline_form_button_done'),
          this.#resourcesService.getString('skyux_inline_form_button_cancel'),
        )
          .pipe(takeUntil(this.#ngUnsubscribe))
          .subscribe((values: string[]) => {
            emitter.next([
              {
                text: values[0],
                styleType: 'primary',
                action: 'done',
              },
              {
                text: values[1],
                styleType: 'link',
                action: 'cancel',
              },
            ]);
          });
        break;

      case SkyInlineFormButtonLayout.SaveCancel:
        observableZip(
          this.#resourcesService.getString('skyux_inline_form_button_save'),
          this.#resourcesService.getString('skyux_inline_form_button_cancel'),
        )
          .pipe(takeUntil(this.#ngUnsubscribe))
          .subscribe((values: string[]) => {
            emitter.next([
              {
                text: values[0],
                styleType: 'primary',
                action: 'save',
              },
              {
                text: values[1],
                styleType: 'link',
                action: 'cancel',
              },
            ]);
          });
        break;

      case SkyInlineFormButtonLayout.DoneDeleteCancel:
        observableZip(
          this.#resourcesService.getString('skyux_inline_form_button_done'),
          this.#resourcesService.getString('skyux_inline_form_button_delete'),
          this.#resourcesService.getString('skyux_inline_form_button_cancel'),
        )
          .pipe(takeUntil(this.#ngUnsubscribe))
          .subscribe((values: string[]) => {
            emitter.next([
              {
                text: values[0],
                styleType: 'primary',
                action: 'done',
              },
              {
                text: values[1],
                styleType: 'default',
                action: 'delete',
              },
              {
                text: values[2],
                styleType: 'link',
                action: 'cancel',
              },
            ]);
          });
        break;

      case SkyInlineFormButtonLayout.SaveDeleteCancel:
        observableZip(
          this.#resourcesService.getString('skyux_inline_form_button_save'),
          this.#resourcesService.getString('skyux_inline_form_button_delete'),
          this.#resourcesService.getString('skyux_inline_form_button_cancel'),
        )
          .pipe(takeUntil(this.#ngUnsubscribe))
          .subscribe((values: string[]) => {
            emitter.next([
              {
                text: values[0],
                styleType: 'primary',
                action: 'save',
              },
              {
                text: values[1],
                styleType: 'default',
                action: 'delete',
              },
              {
                text: values[2],
                styleType: 'link',
                action: 'cancel',
              },
            ]);
          });
        break;
    }

    return emitter.asObservable();
  }

  #getCustomButtons(
    buttonConfigs: SkyInlineFormButtonConfig[],
  ): SkyInlineFormButtonConfig[] {
    const buttons: SkyInlineFormButtonConfig[] = [];

    buttonConfigs.forEach((config: SkyInlineFormButtonConfig) => {
      /* istanbul ignore next */
      const styleType = config.styleType || 'default';

      buttons.push({
        action: config.action,
        disabled: config.disabled,
        styleType: styleType,
        text: config.text,
      } as SkyInlineFormButtonConfig);
    });

    return buttons;
  }

  #isValidCustomConfig(config: SkyInlineFormConfig | undefined): boolean {
    return (
      !!config &&
      !!config.buttons &&
      config.buttons.length > 0 &&
      config.buttonLayout === SkyInlineFormButtonLayout.Custom
    );
  }
}
