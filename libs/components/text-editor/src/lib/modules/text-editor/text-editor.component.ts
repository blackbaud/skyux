import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SkyCoreAdapterService, SkyIdModule, SkyIdService } from '@skyux/core';
import {
  SKY_FORM_ERRORS_ENABLED,
  SkyFormErrorsModule,
  SkyInputBoxHostService,
  SkyRequiredStateDirective,
} from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyThemeModule } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyTextEditorResourcesModule } from '../shared/sky-text-editor-resources.module';

import { FONT_LIST_DEFAULTS } from './defaults/font-list-defaults';
import { FONT_SIZE_LIST_DEFAULTS } from './defaults/font-size-list-defaults';
import { LINK_WINDOW_OPTIONS_DEFAULTS } from './defaults/link-window-options-defaults';
import { MENU_DEFAULTS } from './defaults/menu-defaults';
import { STYLE_STATE_DEFAULTS } from './defaults/style-state-defaults';
import { TOOLBAR_ACTION_DEFAULTS } from './defaults/toolbar-action-defaults';
import { SkyTextEditorMenubarComponent } from './menubar/text-editor-menubar.component';
import { SkyTextEditorAdapterService } from './services/text-editor-adapter.service';
import { SkyTextEditorSelectionService } from './services/text-editor-selection.service';
import { SkyTextEditorService } from './services/text-editor.service';
import { SkyTextSanitizationService } from './services/text-sanitization.service';
import { SkyTextEditorToolbarComponent } from './toolbar/text-editor-toolbar.component';
import { SkyTextEditorFont } from './types/font-state';
import { SkyTextEditorLinkWindowOptionsType } from './types/link-window-options-type';
import { SkyTextEditorMenuType } from './types/menu-type';
import { SkyTextEditorStyleState } from './types/style-state';
import { SkyTextEditorMergeField } from './types/text-editor-merge-field';
import { SkyTextEditorToolbarActionType } from './types/toolbar-action-type';

/**
 * The text editor component lets users format and manipulate text.
 */
@Component({
  selector: 'sky-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    SkyTextEditorService,
    SkyTextEditorSelectionService,
    SkyTextEditorAdapterService,
    { provide: SKY_FORM_ERRORS_ENABLED, useValue: true },
  ],
  hostDirectives: [
    {
      directive: SkyRequiredStateDirective,
      inputs: ['required'],
    },
  ],
  imports: [
    CommonModule,
    SkyHelpInlineModule,
    SkyIdModule,
    SkyTextEditorMenubarComponent,
    SkyTextEditorToolbarComponent,
    SkyThemeModule,
    SkyToolbarModule,
    SkyFormErrorsModule,
    SkyTextEditorResourcesModule,
  ],
})
export class SkyTextEditorComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor
{
  /**
   * Whether to put focus on the editor after it renders.
   */
  @Input()
  public autofocus: boolean | undefined = false;

  /**
   * Whether to disable the text editor on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input({ transform: booleanAttribute })
  public set disabled(value: boolean) {
    if (value !== this.disabled) {
      this.#_disabled = value;
      this.#applyDisabledState();
    }
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * The fonts to include in the font picker.
   * @default [{name: 'Blackbaud Sans', value: '"Blackbaud Sans", Arial, sans-serif'}, {name: 'Arial', value: 'Arial'}, {name: 'Arial Black', value: '"Arial Black"'}, {name: 'Courier New', value: '"Courier New"'}, {name: 'Georgia', value: 'Georgia, serif'}, {name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif'}, {name: 'Times New Roman', value: '"Times New Roman"'}, {name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif'}, {name: 'Verdana', value: 'Verdana, Geneva, sans-serif'}]
   */
  @Input()
  public set fontList(value: SkyTextEditorFont[] | undefined) {
    this.#_fontList = value || FONT_LIST_DEFAULTS;
  }

  public get fontList(): SkyTextEditorFont[] {
    return this.#_fontList;
  }

  /**
   * The font sizes to include in the font size picker.
   * @default [6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 36, 48]
   */
  @Input()
  public set fontSizeList(value: number[] | undefined) {
    this.#_fontSizeList = value || FONT_SIZE_LIST_DEFAULTS;
  }

  public get fontSizeList(): number[] {
    return this.#_fontSizeList;
  }

  /**
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the text editor. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   */
  @Input()
  public hintText: string | undefined;

  /**
   * The unique ID attribute for the text editor.
   * By default, the component generates a random ID.
   */
  @Input()
  public set id(value: string | undefined) {
    this.#id = value || this.#defaultId;
  }

  public get id(): string {
    return this.#id;
  }

  /**
   * The initial styles for all content, including background color, font size, and link state.
   */
  @Input()
  public set initialStyleState(state: SkyTextEditorStyleState | undefined) {
    // Do not update the state after initialization has taken place
    /* istanbul ignore else */
    if (!this.#initialized) {
      this.#_initialStyleState = {
        ...STYLE_STATE_DEFAULTS,
        ...state,
      };
    }
  }

  public get initialStyleState(): SkyTextEditorStyleState {
    return this.#_initialStyleState;
  }

  /**
   * The text to display as the text editor's label.
   */
  @Input()
  public set labelText(value: string | undefined) {
    this.#_labelText = value;
    this.#updateA11yAttributes();
  }

  public get labelText(): string | undefined {
    return this.#_labelText;
  }

  /**
   * The menus to include in the menu bar.
   * @default [ 'edit', 'format' ]
   */
  @Input()
  public set menus(value: SkyTextEditorMenuType[] | undefined) {
    this.#_menus = value || MENU_DEFAULTS;
  }

  public get menus(): SkyTextEditorMenuType[] {
    return this.#_menus;
  }

  /**
   * The merge fields to include in the merge field menu.
   */
  @Input()
  public set mergeFields(value: SkyTextEditorMergeField[] | undefined) {
    this.#_mergeFields = value || [];
  }

  public get mergeFields(): SkyTextEditorMergeField[] {
    return this.#_mergeFields;
  }

  /**
   * Placeholder text to display when the text entry area is empty.
   */
  @Input()
  public set placeholder(value: string | undefined) {
    /* istanbul ignore else */
    if (value !== this.#_placeholder) {
      this.#_placeholder = value || '';
      if (this.#initialized) {
        this.#adapterService.setPlaceholder(value);
      }
    }
  }

  public get placeholder(): string {
    return this.#_placeholder;
  }

  /**
   * Whether the text editor is stacked on another form component. When specified,
   * the appropriate vertical spacing is automatically added to the text editor.
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-form-field-stacked')
  public stacked = false;

  /**
   * The actions to include in the toolbar in the specified order.
   * @default [ 'font-family', 'font-size', 'font-style', 'color', 'list', 'link ]
   */
  @Input()
  public set toolbarActions(
    value: SkyTextEditorToolbarActionType[] | undefined,
  ) {
    this.#_toolbarActions = value || TOOLBAR_ACTION_DEFAULTS;
  }

  public get toolbarActions(): SkyTextEditorToolbarActionType[] {
    return this.#_toolbarActions;
  }

  /**
   * The target window options for adding a hyperlink.
   * @default [ 'new', 'existing' ]
   */
  @Input()
  public set linkWindowOptions(
    value: SkyTextEditorLinkWindowOptionsType[] | undefined,
  ) {
    this.#_linkWindowOptions = value ?? LINK_WINDOW_OPTIONS_DEFAULTS;
  }

  public get linkWindowOptions(): SkyTextEditorLinkWindowOptionsType[] {
    return this.#_linkWindowOptions;
  }

  /**
   * A help key that identifies the global help content to display. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the text editor label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  @ViewChild('iframe')
  public iframeRef: ElementRef | undefined;

  /**
   * The internal value of the control.
   */
  public set value(value: string | undefined) {
    // Normalize value and set any empty state to an empty string.
    let normalizedValue: string;
    const valueTrimmed = value?.trim();

    if (
      !value ||
      valueTrimmed === '<p></p>' ||
      valueTrimmed === '<br>' ||
      valueTrimmed === '<p><br></p>'
    ) {
      normalizedValue = '';
    } else {
      normalizedValue = value;
    }

    normalizedValue = this.#sanitizationService
      .sanitize(normalizedValue)
      .trim();

    if (this.#_value !== normalizedValue) {
      this.#_value = normalizedValue;

      // Update angular form control if model has been normalized.
      /* istanbul ignore else */
      if (
        this.ngControl?.control &&
        normalizedValue !== this.ngControl.control.value
      ) {
        this.ngControl.control.setValue(normalizedValue, {
          emitModelToViewChange: false,
        });
      }

      // #initIframe() will do another check later to see if the editor should
      // receive focus if not initialized before this is called.
      this.#checkAutofocusAndFocus();
    }
  }

  public get value(): string {
    return this.#_value;
  }

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public inputTemplateRef: TemplateRef<unknown> | undefined;

  public editorFocusStream = new Subject<void>();

  @HostBinding('class.sky-form-control')
  public formControlClass = !!inject(SkyInputBoxHostService, {
    optional: true,
  });

  protected editorFocused = false;

  #defaultId: string;
  #id: string;
  #focusInitialized = false;
  #initialized = false;
  #ngUnsubscribe = new Subject<void>();

  #_fontList = FONT_LIST_DEFAULTS;
  #_fontSizeList = FONT_SIZE_LIST_DEFAULTS;
  #_labelText: string | undefined;
  #_mergeFields: SkyTextEditorMergeField[] = [];
  #_menus = MENU_DEFAULTS;
  #_toolbarActions: SkyTextEditorToolbarActionType[] = TOOLBAR_ACTION_DEFAULTS;
  #_linkWindowOptions = LINK_WINDOW_OPTIONS_DEFAULTS;
  #_disabled = false;
  #_initialStyleState = Object.assign({}, STYLE_STATE_DEFAULTS);
  #_placeholder = '';
  #_value = '<p></p>';

  readonly #adapterService = inject(SkyTextEditorAdapterService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #coreAdapterService = inject(SkyCoreAdapterService);
  readonly #editorService = inject(SkyTextEditorService);
  readonly #idSvc = inject(SkyIdService);
  readonly #sanitizationService = inject(SkyTextSanitizationService);
  readonly #zone = inject(NgZone);

  protected readonly errorId = this.#idSvc.generateId();
  protected readonly ngControl = inject(NgControl);
  protected readonly requiredState = inject(SkyRequiredStateDirective);

  constructor() {
    this.#id = this.#defaultId = this.#idSvc.generateId();
    this.ngControl.valueAccessor = this;
  }

  public ngAfterViewInit(): void {
    this.#initIframe();
  }

  public ngOnDestroy(): void {
    this.#adapterService.removeObservers(this.#editorService.editor);
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onIframeLoad(): void {
    // Reinitialize the editor if it already exists to cover situations where the text editor might have been moved in the DOM.
    if (this.#editorService.isInitialized) {
      this.#initIframe();
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public writeValue(value: string): void {
    this.value = value;

    // Update HTML if necessary.
    if (this.#initialized) {
      const editorValue = this.#adapterService.getEditorInnerHtml();
      if (editorValue !== this.#_value) {
        this.#adapterService.setEditorInnerHtml(this.#_value);
      }
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public registerOnChange(fn: (value: any) => void): void {
    this.#_onChange = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public registerOnTouched(fn: () => void): void {
    this.#_onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  #checkAutofocusAndFocus(): void {
    // Don't set focus on the editor if the iframe isn't initialized.
    // Autofocus isn't testable in Firefox and IE.
    /* istanbul ignore next */
    if (this.autofocus && this.#initialized && !this.#focusInitialized) {
      this.#adapterService.focusEditor();
      this.#focusInitialized = true;
    }
  }

  #updateStyle(): void {
    this.#_initialStyleState = {
      ...this.#_initialStyleState,
      ...this.#adapterService.getStyleState(),
    };
  }

  #initIframe(): void {
    this.#adapterService.initEditor(
      this.id,
      (this.iframeRef as ElementRef).nativeElement,
      this.initialStyleState,
      this.placeholder,
    );

    this.ngControl.statusChanges
      ?.pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#updateA11yAttributes();

        // Trigger change detection when the field status is modified programmatically.
        this.#changeDetector.markForCheck();
      });

    this.#editorService
      .inputListener()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        // Angular doesn't run change detection for changes originating inside an iframe,
        // so we have to call the onChange() event inside NgZone to force change propagation to consuming components.
        this.#zone.run(() => {
          this.#viewToModelUpdate();
        });
      });

    this.#editorService
      .selectionChangeListener()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#updateStyle();
        this.editorFocusStream.next();
      });

    this.#editorService
      .clickListener()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.editorFocusStream.next();
      });

    this.#editorService
      .blurListener()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        // Angular doesn't run change detection for changes originating inside an iframe,
        // so we have to run markForCheck() inside the NgZone to force change propagation to consuming components.
        this.#zone.run(() => {
          this.#_onTouched();
          this.editorFocused = false;
          this.#changeDetector.markForCheck();
        });
      });

    this.#editorService
      .commandChangeListener()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#updateStyle();
        this.#viewToModelUpdate();
      });

    this.#editorService
      .focusListener()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        // Angular doesn't run change detection for changes originating inside an iframe,
        // so we have to run markForCheck() inside the NgZone to force change propagation to consuming components.
        this.#zone.run(() => {
          this.editorFocused = true;
          this.#changeDetector.markForCheck();
        });
      });

    this.#adapterService.setEditorInnerHtml(this.#_value);
    this.#updateA11yAttributes();

    /* istanbul ignore next */
    if (this.autofocus) {
      this.#adapterService.focusEditor();
    }

    this.#applyDisabledState();

    this.#initialized = true;
    this.#focusInitialized = false;

    this.#checkAutofocusAndFocus();
  }

  #updateA11yAttributes(): void {
    if (this.#editorService.isInitialized) {
      this.#adapterService.setLabelAttribute(this.labelText);
      this.#adapterService.setErrorAttributes(
        this.labelText ? this.errorId : '',
        this.ngControl.errors,
      );
      this.#adapterService.setRequiredAttribute(
        this.requiredState.isRequired(),
      );
    }
  }

  #viewToModelUpdate(emitChange = true): void {
    this.value = this.#adapterService.getEditorInnerHtml();
    /* istanbul ignore else */
    if (emitChange) {
      this.#_onChange(this.#_value);
    }
  }

  #applyDisabledState(): void {
    // Update focusableChildren inside the iframe.
    let focusableChildren: HTMLElement[];
    /* istanbul ignore else */
    if (this.iframeRef?.nativeElement.contentDocument?.body) {
      focusableChildren = this.#coreAdapterService.getFocusableChildren(
        this.iframeRef.nativeElement.contentDocument.body,
        {
          ignoreVisibility: true,
          ignoreTabIndex: true,
        },
      );

      if (this.#_disabled) {
        this.#adapterService.disableEditor(
          focusableChildren,
          this.iframeRef.nativeElement,
        );
      } else {
        this.#adapterService.enableEditor(
          focusableChildren,
          this.iframeRef.nativeElement,
        );
      }
      this.#changeDetector.markForCheck();
    }
  }

  /* istanbul ignore next */
  #_onTouched = (): void => {};

  /* istanbul ignore next */
  #_onChange: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
  ) => void = () => {};
}
