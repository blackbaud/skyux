import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  booleanAttribute,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyColorpickerMessage,
  SkyColorpickerMessageType,
  SkyColorpickerModule,
  SkyColorpickerOutput,
} from '@skyux/colorpicker';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';
import {
  SkyDropdownMessage,
  SkyDropdownMessageType,
  SkyDropdownModule,
} from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { STYLE_STATE_DEFAULTS } from '../defaults/style-state-defaults';
import { SkyTextEditorAdapterService } from '../services/text-editor-adapter.service';
import { SkyTextEditorFont } from '../types/font-state';
import { SkyTextEditorLinkWindowOptionsType } from '../types/link-window-options-type';
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
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyColorpickerModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyThemeModule,
    SkyToolbarModule,
  ],
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
  public linkWindowOptions: SkyTextEditorLinkWindowOptionsType[] = [];

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

  @Input({ transform: booleanAttribute })
  public disabled = false;

  public backColorpickerStream = new Subject<SkyColorpickerMessage>();
  public colorpickerStream = new Subject<SkyColorpickerMessage>();
  public fontPickerStream = new Subject<SkyDropdownMessage>();
  public fontSizeStream = new Subject<SkyDropdownMessage>();
  public styleStateFontName: string | undefined;

  #editorFocusStreamSub: Subscription | undefined;
  #ngUnsubscribe = new Subject<void>();

  #_editorFocusStream = new Subject<void>();
  #_styleState = STYLE_STATE_DEFAULTS;

  readonly #adapterService = inject(SkyTextEditorAdapterService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #modalService = inject(SkyModalService);

  public ngOnInit(): void {
    this.#subscribeEditorFocus();
  }

  public execCommand(command: string, value = ''): void {
    void this.#adapterService.execCommand({
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
    command: string,
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
        useFactory: (): SkyUrlModalContext => {
          const context = new SkyUrlModalContext();
          context.urlResult = currentLink;
          context.linkWindowOptions = this.linkWindowOptions;

          return context;
        },
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
              '</a>',
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
    void this.#adapterService.setFontSize(size);
    this.styleState = {
      ...this.styleState,
      ...this.#adapterService.getStyleState(),
    };
  }

  public onColorpickerColorChanged(
    color: SkyColorpickerOutput,
    isBackground = false,
  ): void {
    if (isBackground) {
      this.execCommand('backColor', color.rgbaText);
    } else {
      this.execCommand('foreColor', color.hex);
    }
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
    for (const skyTextEditorFont of this.fontList) {
      if (fontName.replace(/['"]+/g, '') === skyTextEditorFont.name) {
        return skyTextEditorFont.name;
      }
    }

    /* istanbul ignore next */
    return undefined;
  }
}
