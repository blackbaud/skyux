import {
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  NgControl
} from '@angular/forms';

import {
  takeUntil
} from 'rxjs/operators';

import {
  Subject
} from 'rxjs';

import {
  SkyCoreAdapterService
} from '@skyux/core';

import {
  MENU_DEFAULTS
} from './defaults/menu-defaults';

import {
  STYLE_STATE_DEFAULTS
} from './defaults/style-state-defaults';

import {
  TOOLBAR_ACTION_DEFAULTS
} from './defaults/toolbar-action-defaults';

import {
  SkyTextEditorAdapterService
} from './services/text-editor-adapter.service';

import {
  SkyTextEditorService
} from './services/text-editor.service';

import {
  SkyTextSanitizationService
} from './services/text-sanitization.service';

import {
  FONT_LIST_DEFAULTS
} from './defaults/font-list-defaults';

import {
  FONT_SIZE_LIST_DEFAULTS
} from './defaults/font-size-list-defaults';

import {
  SkyTextEditorFont
} from './types/font-state';

import {
  SkyTextEditorMenuType
} from './types/menu-type';

import {
  SkyTextEditorStyleState
} from './types/style-state';

import {
  SkyTextEditorMergeField
} from './types/text-editor-merge-field';

import {
  SkyTextEditorToolbarActionType
} from './types/toolbar-action-type';

import {
  SkyFormsUtility
} from '../shared/forms-utility';

/**
 * Auto-incrementing integer used to generate unique ids for radio components.
 */
let nextUniqueId = 0;

/**
 * The text editor component lets users format and manipulate text.
 */
@Component({
  selector: 'sky-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SkyTextEditorComponent implements AfterViewInit, OnDestroy {

  /**
   * Indicates whether to put focus on the editor after it renders.
   */
  @Input()
  public autofocus: boolean = false;

  /**
   * Indicates whether to disable the text editor.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    const coercedValue = SkyFormsUtility.coerceBooleanProperty(value);
    if (coercedValue !== this.disabled) {
      this._disabled = coercedValue;

      // Update focusableChildren inside the iframe.
      let focusableChildren: HTMLElement[];
      /* istanbul ignore else */
      if (this.iframeRef) {
        focusableChildren = this.coreAdapterService.getFocusableChildren(this.iframeRef.nativeElement.contentDocument.body, {
          ignoreVisibility: true,
          ignoreTabIndex: true
        });
      }

      if (this._disabled) {
        this.adapterService.disableEditor(this.id, focusableChildren, this.iframeRef.nativeElement);
      } else {
        this.adapterService.enableEditor(this.id, focusableChildren, this.iframeRef.nativeElement);
      }
      this.changeDetector.markForCheck();
    }
  }

  public get disabled() {
    return this._disabled;
  }

  public editorFocusStream = new Subject();

  /**
   * Specifies the fonts to include in the font picker.
   * @default [{name: 'Blackbaud Sans', value: '"Blackbaud Sans", Arial, sans-serif'}, {name: 'Arial', value: 'Arial'}, {name: 'Arial Black', value: '"Arial Black"'}, {name: 'Courier New', value: '"Courier New"'}, {name: 'Georgia', value: 'Georgia, serif'}, {name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif'}, {name: 'Times New Roman', value: '"Times New Roman"'}, {name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif'}, {name: 'Verdana', value: 'Verdana, Geneva, sans-serif'}]
   */
  @Input()
  public fontList: SkyTextEditorFont[] = FONT_LIST_DEFAULTS;

  /**
   * Specifies the font sizes to include in the font size picker.
   * @default [6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 36, 48]
   */
  @Input()
  public fontSizeList: number[] = FONT_SIZE_LIST_DEFAULTS;

  /**
   * Specifies a unique ID attribute for the text editor.
   * By default, the component generates a random ID.
   */
  @Input()
  public id = `sky-text-editor-${++nextUniqueId}`;

  /**
   * Specifies the initial styles for all content, including background color, font size, and link state.
   */
  @Input()
  public set initialStyleState(state: SkyTextEditorStyleState) {
    // Do not update the state after initialization has taken place
    /* istanbul ignore else */
    if (!this.initialized) {
      this._initialStyleState = {
        ...STYLE_STATE_DEFAULTS,
        ...state
      };
    }
  }

  public get initialStyleState(): SkyTextEditorStyleState {
    return this._initialStyleState;
  }

  /**
   * Specifies the menus to include in the menu bar.
   * @default [ 'edit', 'format' ]
   */
  @Input()
  public menus: SkyTextEditorMenuType[] = MENU_DEFAULTS;

  /**
   * Specifies the merge fields to include in the merge field menu.
   */
  @Input()
  public mergeFields: SkyTextEditorMergeField[] = [];

  /**
   * Specifies placeholder text to display when the text entry area is empty.
   */
  @Input()
  public set placeholder(value: string) {
    /* istanbul ignore else */
    if (value !== this._placeholder) {
      this._placeholder = value;
      if (this.initialized) {
        this.adapterService.setPlaceholder(this.id, value);
      }
    }
  }

  public get placeholder(): string {
    return this._placeholder;
  }

  /**
   * Specifies the actions to include in the toolbar and determines their order.
   * @default [ 'font-family', 'font-size', 'font-style', 'color', 'list', 'link ]
   */
  @Input()
  public toolbarActions: SkyTextEditorToolbarActionType[] = TOOLBAR_ACTION_DEFAULTS;

  /**
   * The internal value of the control.
   */
  public set value(value: string) {

    // Normalize value and set any empty state to an empty string.
    let normalizedValue: string = value;
    if (!value || value.trim() === '<p></p>' || value.trim() === '<br>' || value.trim() === '<p><br></p>') {
      normalizedValue = '';
    }
    normalizedValue = this.sanitizationService.sanitize(normalizedValue).trim();

    if (this._value !== normalizedValue) {
      this._value = normalizedValue;

      // Update angular form control if model has been normalized.
      /* istanbul ignore else */
      if (this.ngControl && this.ngControl.control) {
        /* istanbul ignore else */
        if (normalizedValue !== this.ngControl.control.value) {
          this.ngControl.control.setValue(normalizedValue, { emitModelToViewChange: false });
        }
      }

      // Autofocus isn't testable in Firefox and IE.
      /* istanbul ignore next */
      if (this.autofocus && !this.focusInitialized) {
        this.adapterService.focusEditor(this.id);
        this.focusInitialized = true;
      }
    }
  }

  public get value(): string {
    return this._value;
  }

  private focusInitialized: boolean = false;

  @ViewChild('iframe')
  private iframeRef: ElementRef;

  private initialized: boolean = false;

  private ngUnsubscribe = new Subject<void>();

  private _disabled: boolean = false;

  private _initialStyleState = Object.assign({}, STYLE_STATE_DEFAULTS);

  private _placeholder = '';

  private _value: string = '<p></p>';

  constructor (
    private changeDetector: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private adapterService: SkyTextEditorAdapterService,
    private editorService: SkyTextEditorService,
    private sanitizationService: SkyTextSanitizationService,
    private ngControl: NgControl,
    private zone: NgZone,
  ) {
    this.ngControl.valueAccessor = this;
  }

  public ngAfterViewInit(): void {
    this.initIframe();
  }

  public ngOnDestroy(): void {
    this.adapterService.removeObservers(this.editorService.editors[this.id]);
    this.editorService.removeEditor(this.id);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onIframeLoad(): void {
    // Remove editor if it already exists to cover situations where the text editor might have been moved in the DOM.
    /* istanbul ignore else */
    if (this.editorService.editors[this.id]) {
      this.editorService.removeEditor(this.id);
      this.initIframe();
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public writeValue(value: string): void {
    this.value = value;

    // Update HTML if necessary.
    const editorValue = this.adapterService.getEditorInnerHtml(this.id);
    if (this.initialized && editorValue !== this._value) {
      this.adapterService.setEditorInnerHtml(this.id, this._value);
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private updateStyle(): void {
    this._initialStyleState = {
      ...this._initialStyleState,
      ...this.adapterService.getStyleState(this.id) as any
    };
  }

  private initIframe(): void {
    this.adapterService.addEditor(
      this.id,
      this.iframeRef.nativeElement,
      this.initialStyleState,
      this.placeholder
    );

    this.editorService.inputListener(this.id)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        // Angular doesn't run change detection for changes originating inside an iframe,
        // so we have to call the onChange() event inside NgZone to force change propigation to consuming components.
        this.zone.run(() => {
          this.ViewToModelUpdate();
        });
      });

    this.editorService.selectionChangeListener(this.id)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.updateStyle();
        this.editorFocusStream.next();
      });

    this.editorService.clickListener(this.id)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.editorFocusStream.next();
      });

    this.editorService.blurListener(this.id)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        // Angular doesn't run change detection for changes originating inside an iframe,
        // so we have to run markForCheck() inside the NgZone to force change propigation to consuming components.
        this.zone.run(() => {
          this._onTouched();
        });
      });

    this.editorService.commandChangeListener(this.id)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.updateStyle();
        this.ViewToModelUpdate();
      });

    this.adapterService.setEditorInnerHtml(this.id, this._value);

    /* istanbul ignore next */
    if (this.autofocus) {
      this.adapterService.focusEditor(this.id);
    }

    this.initialized = true;
  }

  private ViewToModelUpdate(emitChange: boolean = true): void {
    this.value = this.adapterService.getEditorInnerHtml(this.id);
    /* istanbul ignore else */
    if (emitChange) {
      this._onChange(this._value);
    }
  }

  /* istanbul ignore next */
  private _onTouched = () => {};

  /* istanbul ignore next */
  private _onChange: (value: any) => void = () => {};
}
