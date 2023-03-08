import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  SkyColorpickerMessage,
  SkyColorpickerMessageType,
  SkyColorpickerOutput,
} from '@skyux/colorpicker';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';
import { SkyDropdownMessage, SkyDropdownMessageType } from '@skyux/popovers';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { STYLE_STATE_DEFAULTS } from '../defaults/style-state-defaults';
import { SkyTextEditorAdapterService } from '../services/text-editor-adapter.service';
import { SkyTextEditorFont } from '../types/font-state';
import { SkyTextEditorStyleState } from '../types/style-state';
import { SkyTextEditorToolbarActionType } from '../types/toolbar-action-type';
import { SkyUrlModalContext } from '../url-modal/text-editor-url-modal-context';
import { SkyTextEditorUrlModalComponent } from '../url-modal/text-editor-url-modal.component';
import { UrlTarget } from '../url-modal/text-editor-url-target';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-editor-toolbar',
  templateUrl: './text-editor-toolbar.component.html',
  styleUrls: ['./text-editor-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyTextEditorToolbarComponent implements OnInit {
  @Input()
  public set editorFocusStream(value: Subject<void>) {
    this.#_editorFocusStream = value;
    this.#subscribeEditorFocus();
  }

  public get editorFocusStream(): Subject<void> {
    return this.#_editorFocusStream;
  }

  @Input()
  public fontList: SkyTextEditorFont[] = [];

  @Input()
  public fontSizeList: number[] = [];

  @Input()
  public toolbarActions: SkyTextEditorToolbarActionType[] = [];

  @Input()
  public set styleState(value: SkyTextEditorStyleState) {
    this.#_styleState = value;
    if (value.font !== this.styleStateFontName) {
      if (value.font === '"Blackbaud Sans", Arial, sans-serif') {
        this.styleStateFontName = this.#getFontName('Blackbaud Sans');
      } else {
        this.styleStateFontName = this.#getFontName(value.font);
      }
    }
  }

  public get styleState(): SkyTextEditorStyleState {
    return this.#_styleState;
  }

  @Input()
  public set disabled(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);
    if (coercedValue !== this.disabled) {
      this.#_disabled = coercedValue;
      this.#changeDetector.markForCheck();
    }
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  public backColorpickerStream = new Subject<SkyColorpickerMessage>();
  public colorpickerStream = new Subject<SkyColorpickerMessage>();
  public fontPickerStream = new Subject<SkyDropdownMessage>();
  public fontSizeStream = new Subject<SkyDropdownMessage>();
  public styleStateFontName: string | undefined;

  #editorFocusStreamSub: Subscription | undefined;
  #adapterService: SkyTextEditorAdapterService;
  #changeDetector: ChangeDetectorRef;
  #modalService: SkyModalService;
  #ngUnsubscribe = new Subject<void>();

  #_editorFocusStream = new Subject<void>();
  #_disabled = false;
  #_styleState = STYLE_STATE_DEFAULTS;

  constructor(
    adapterService: SkyTextEditorAdapterService,
    changeDetector: ChangeDetectorRef,
    modalService: SkyModalService
  ) {
    this.#adapterService = adapterService;
    this.#changeDetector = changeDetector;
    this.#modalService = modalService;
  }

  public ngOnInit(): void {
    this.#subscribeEditorFocus();
  }

  public execCommand(command: string, value = ''): void {
    this.#adapterService.execCommand({
      command: command,
      value: value,
    });
    this.styleState = {
      ...this.styleState,
      ...this.#adapterService.getStyleState(),
    };
  }

  public toggleFontStyle(
    currentState: boolean,
    newState: boolean,
    command: string
  ): void {
    if (currentState !== newState) {
      this.execCommand(command);
    }

    // Force sky-checkbox to show changes on user's initial click.
    this.#changeDetector.detectChanges();
  }

  public link(): void {
    const priorSelection = this.#adapterService.saveSelection();
    const currentLink = this.#adapterService.getLink();
    const inputModal = this.#modalService.open(SkyTextEditorUrlModalComponent, [
      {
        provide: SkyUrlModalContext,
        useValue: { urlResult: currentLink },
      },
    ]);
    inputModal.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save' && priorSelection) {
        if (currentLink) {
          const anchor = this.#adapterService.getSelectedAnchorTag();

          if (anchor) {
            this.#adapterService.selectElement(anchor);
          }
        }

        this.execCommand('unlink');
        if (result.data.target === UrlTarget.None) {
          // Current window
          this.execCommand('createLink', result.data.url);
        } else {
          // New Window
          const sText = this.#adapterService.getCurrentSelection();
          this.execCommand(
            'insertHTML',
            '<a href="' +
              result.data.url +
              '" rel="noopener noreferrer" target="_blank">' +
              sText +
              '</a>'
          );
        }
      }
    });
  }

  public unlink(): void {
    const currentSelectionRange = this.#adapterService
      .getCurrentSelection()
      ?.getRangeAt(0);
    if (currentSelectionRange && currentSelectionRange.toString().length <= 0) {
      const anchorTag = this.#adapterService.getSelectedAnchorTag();
      if (anchorTag) {
        this.#adapterService.selectElement(anchorTag);
      }
    }
    this.execCommand('unlink');
  }

  public changeFontSize(size: number): void {
    this.#adapterService.setFontSize(size);
    this.styleState = {
      ...this.styleState,
      ...this.#adapterService.getStyleState(),
    };
  }

  public onColorpickerColorChanged(
    color: SkyColorpickerOutput,
    isBackground = false
  ): void {
    this.execCommand(isBackground ? 'backColor' : 'foreColor', color.hex);
  }

  #subscribeEditorFocus(): void {
    this.#editorFocusStreamSub?.unsubscribe();

    this.#editorFocusStreamSub = this.editorFocusStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.styleState = {
          ...this.styleState,
          ...this.#adapterService.getStyleState(),
        };
        this.#closeDropdowns();
        this.#changeDetector.detectChanges();
      });
  }

  #closeDropdowns(): void {
    const message: SkyColorpickerMessage = {
      type: SkyColorpickerMessageType.Close,
    };
    this.colorpickerStream.next(message);
    this.backColorpickerStream.next(message);
    this.fontPickerStream.next({ type: SkyDropdownMessageType.Close });
    this.fontSizeStream.next({ type: SkyDropdownMessageType.Close });
  }

  #getFontName(fontName: string): string | undefined {
    for (let i = 0; i < this.fontList.length; i++) {
      if (fontName.replace(/['"]+/g, '') === this.fontList[i].name) {
        return this.fontList[i].name;
      }
    }

    /* istanbul ignore next */
    return undefined;
  }
}
