import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { SkyCoreAdapterService, SkyIdService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyFormsUtility } from '../shared/forms-utility';

import { FONT_LIST_DEFAULTS } from './defaults/font-list-defaults';
import { FONT_SIZE_LIST_DEFAULTS } from './defaults/font-size-list-defaults';
import { MENU_DEFAULTS } from './defaults/menu-defaults';
import { STYLE_STATE_DEFAULTS } from './defaults/style-state-defaults';
import { TOOLBAR_ACTION_DEFAULTS } from './defaults/toolbar-action-defaults';
import { SkyTextEditorAdapterService } from './services/text-editor-adapter.service';
import { SkyTextEditorSelectionService } from './services/text-editor-selection.service';
import { SkyTextEditorService } from './services/text-editor.service';
import { SkyTextSanitizationService } from './services/text-sanitization.service';
import { SkyTextEditorFont } from './types/font-state';
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
  ],
})
export class SkyTextEditorComponent implements OnDestroy {
  /**
   * Whether to put focus on the editor after it renders.
   */
  @Input()
  public autofocus: boolean | undefined = false;

  /**
   * Whether to disable the text editor.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    const coercedValue = SkyFormsUtility.coerceBooleanProperty(value);
    if (coercedValue !== this.disabled) {
      this.#_disabled = coercedValue;

      // Update focusableChildren inside the iframe.
      let focusableChildren: HTMLElement[];
      /* istanbul ignore else */
      if (this.iframeRef) {
        focusableChildren = this.#coreAdapterService.getFocusableChildren(
          this.iframeRef.contentDocument?.body,
          {
            ignoreVisibility: true,
            ignoreTabIndex: true,
          }
        );

        if (this.#_disabled) {
          this.#adapterService.disableEditor(focusableChildren, this.iframeRef);
        } else {
          this.#adapterService.enableEditor(focusableChildren, this.iframeRef);
        }
        this.#changeDetector.markForCheck();
      }
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
   * The actions to include in the toolbar and determines their order.
   * @default [ 'font-family', 'font-size', 'font-style', 'color', 'list', 'link ]
   */
  @Input()
  public set toolbarActions(
    value: SkyTextEditorToolbarActionType[] | undefined
  ) {
    this.#_toolbarActions = value || TOOLBAR_ACTION_DEFAULTS;
  }

  public get toolbarActions(): SkyTextEditorToolbarActionType[] {
    return this.#_toolbarActions;
  }

  public iframeRef: HTMLIFrameElement | undefined;

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
        this.#ngControl?.control &&
        normalizedValue !== this.#ngControl.control.value
      ) {
        this.#ngControl.control.setValue(normalizedValue, {
          emitModelToViewChange: false,
        });
      }

      // Autofocus isn't testable in Firefox and IE.
      // Don't set focus on the editor now if the iframe isn't initialized.
      // #initIframe() will do another check later to see if the editor should
      // receive focus.
      /* istanbul ignore next */
      if (this.autofocus && this.#initialized && !this.#focusInitialized) {
        this.#adapterService.focusEditor();
        this.#focusInitialized = true;
      }
    }
  }

  public get value(): string {
    return this.#_value;
  }

  public editorFocusStream = new Subject<void>();

  #defaultId: string;
  #id: string;
  #focusInitialized = false;
  #initialized = false;
  #ngUnsubscribe = new Subject<void>();
  #changeDetector: ChangeDetectorRef;
  #coreAdapterService: SkyCoreAdapterService;
  #adapterService: SkyTextEditorAdapterService;
  #editorService: SkyTextEditorService;
  #sanitizationService: SkyTextSanitizationService;
  #ngControl: NgControl;
  #zone: NgZone;

  #_fontList = FONT_LIST_DEFAULTS;
  #_fontSizeList = FONT_SIZE_LIST_DEFAULTS;
  #_mergeFields: SkyTextEditorMergeField[] = [];
  #_menus = MENU_DEFAULTS;
  #_toolbarActions: SkyTextEditorToolbarActionType[] = TOOLBAR_ACTION_DEFAULTS;
  #_disabled = false;
  #_initialStyleState = Object.assign({}, STYLE_STATE_DEFAULTS);
  #_placeholder = '';
  #_value = '<p></p>';

  constructor(
    changeDetector: ChangeDetectorRef,
    coreAdapterService: SkyCoreAdapterService,
    adapterService: SkyTextEditorAdapterService,
    editorService: SkyTextEditorService,
    sanitizationService: SkyTextSanitizationService,
    ngControl: NgControl,
    zone: NgZone,
    idSvc: SkyIdService
  ) {
    this.#changeDetector = changeDetector;
    this.#coreAdapterService = coreAdapterService;
    this.#adapterService = adapterService;
    this.#editorService = editorService;
    this.#sanitizationService = sanitizationService;
    this.#ngControl = ngControl;
    this.#zone = zone;

    this.#id = this.#defaultId = idSvc.generateId();

    ngControl.valueAccessor = this;
  }

  public ngOnDestroy(): void {
    this.#adapterService.removeObservers(this.#editorService.editor);
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onIframeLoad(event: Event): void {
    this.iframeRef = event.target as HTMLIFrameElement;
    this.#initIframe();
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

  #updateStyle(): void {
    this.#_initialStyleState = {
      ...this.#_initialStyleState,
      ...this.#adapterService.getStyleState(),
    };
  }

  #initIframe(): void {
    if (this.iframeRef) {
      this.#adapterService.initEditor(
        this.id,
        this.iframeRef,
        this.initialStyleState,
        this.placeholder
      );

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
          // so we have to run #_onTouched() inside the NgZone to force change propagation to consuming components.
          this.#zone.run(() => {
            this.#_onTouched();
          });
        });

      this.#editorService
        .commandChangeListener()
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateStyle();
          this.#viewToModelUpdate();
        });

      this.#adapterService.setEditorInnerHtml(this.#_value);

      /* istanbul ignore next */
      if (this.autofocus) {
        this.#adapterService.focusEditor();
      }

      this.#initialized = true;
    }
  }

  #viewToModelUpdate(emitChange: boolean = true): void {
    this.value = this.#adapterService.getEditorInnerHtml();
    /* istanbul ignore else */
    if (emitChange) {
      this.#_onChange(this.#_value);
    }
  }

  /* istanbul ignore next */
  #_onTouched = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  };

  /* istanbul ignore next */
  #_onChange: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => void = () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  };
}
