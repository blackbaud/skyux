import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyColorpickerOutput,
  SkyColorpickerMessage,
  SkyColorpickerMessageType
} from '@skyux/colorpicker';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

import {
  STYLE_STATE_DEFAULTS
} from '../defaults/style-state-defaults';

import {
  SkyTextEditorAdapterService
} from '../services/text-editor-adapter.service';

import {
  SkyTextEditorFont
} from '../types/font-state';

import {
  SkyTextEditorStyleState
} from '../types/style-state';

import {
  SkyTextEditorToolbarActionType
} from '../types/toolbar-action-type';

import {
  SkyTextEditorUrlModalComponent
} from '../url-modal/text-editor-url-modal.component';

import {
  UrlTarget
} from '../url-modal/text-editor-url-target';

import {
  SkyUrlModalContext
} from '../url-modal/text-editor-url-modal-context';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-editor-toolbar',
  templateUrl: './text-editor-toolbar.component.html',
  styleUrls: ['./text-editor-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTextEditorToolbarComponent implements OnInit {

  @Input()
  public editorFocusStream = new Subject();

  @Input()
  public editorId: string;

  @Input()
  public fontList: SkyTextEditorFont[];

  @Input()
  public fontSizeList: number[];

  @Input()
  public toolbarActions: SkyTextEditorToolbarActionType[];

  @Input()
  public get styleState(): SkyTextEditorStyleState {
    return this._styleState;
  }
  public set styleState(value: SkyTextEditorStyleState) {
    this._styleState = value;
    if (value.font !== this.styleStateFontName) {
      this.styleStateFontName = this.getFontName(value.font);
    }
  }

  public backColorpickerStream = new Subject<SkyColorpickerMessage>();

  public colorpickerStream = new Subject<SkyColorpickerMessage>();

  public fontPickerStream = new Subject<SkyDropdownMessage>();

  public fontSizeStream = new Subject<SkyDropdownMessage>();

  public styleStateFontName: string;

  private _styleState = STYLE_STATE_DEFAULTS;

  constructor(
    private adapterService: SkyTextEditorAdapterService,
    private changeDetector: ChangeDetectorRef,
    private modalService: SkyModalService
  ) {}

  public ngOnInit(): void {
    this.editorFocusStream.subscribe(() => {
      this.styleState = {
        ...this._styleState,
        ...this.adapterService.getStyleState(this.editorId) as any
      };
      this.closeDropdowns();
      this.changeDetector.detectChanges();
    });
  }

  public execCommand(command: string, value: any = ''): void {
    this.adapterService.execCommand(this.editorId, {
      command: command,
      value: value
    });
    this.styleState = {
      ...this.styleState,
      ...this.adapterService.getStyleState(this.editorId)
    };
  }

  public toggleFontStyle(currentState: boolean, newState: boolean, command: string): void {
    if (currentState !== newState) {
      this.execCommand(command);
    }

    // Force sky-checkbox to show changes on user's initial click.
    this.changeDetector.detectChanges();
  }

  public link(): void {
    const priorSelection = this.adapterService.saveSelection(this.editorId);
    const currentLink = this.adapterService.getLink(this.editorId);
    const inputModal = this.modalService.open(SkyTextEditorUrlModalComponent, [{
      provide: SkyUrlModalContext,
      useValue: { urlResult: currentLink }
    }]);
    inputModal.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save' && priorSelection) {
        if (currentLink) {
          const anchor = this.adapterService.getSelectedAnchorTag(this.editorId);
          this.adapterService.selectElement(this.editorId, anchor);
        }

        this.execCommand('unlink');
        if (result.data.target === UrlTarget.None) {
          // Current window
          this.execCommand('createLink', result.data.url);
        } else {
          // New Window
          const sText = this.adapterService.getCurrentSelection(this.editorId);
          this.execCommand('insertHTML', '<a href="' + result.data.url + '" rel="noopener noreferrer" target="_blank">' + sText + '</a>');
        }
      }
    });
  }

  public unlink(): void {
    let currentSelectionRange = this.adapterService.getCurrentSelection(this.editorId).getRangeAt(0);
    if (currentSelectionRange.toString().length <= 0) {
      const anchorTag = this.adapterService.getSelectedAnchorTag(this.editorId);
      this.adapterService.selectElement(this.editorId, anchorTag);
    }
    this.execCommand('unlink');
  }

  public changeFontSize(size: number): void {
    this.adapterService.setFontSize(this.editorId, size);
    this.styleState = {
      ...this.styleState,
      ...this.adapterService.getStyleState(this.editorId)
    };
  }

  public onColorpickerColorChanged(color: SkyColorpickerOutput, isBackground = false): void {
    this.execCommand(isBackground ? 'backColor' : 'foreColor', color.hex);
  }

  private closeDropdowns(): void {
    const message: SkyColorpickerMessage = { type: SkyColorpickerMessageType.Close };
    this.colorpickerStream.next(message);
    this.backColorpickerStream.next(message);
    this.fontPickerStream.next({ type: SkyDropdownMessageType.Close });
    this.fontSizeStream.next({ type: SkyDropdownMessageType.Close });
  }

  private getFontName(fontName: string): string {
    for (let i = 0; i < this.fontList.length; i++) {
      if (fontName.indexOf(this.fontList[i].name) > -1) {
          return this.fontList[i].name;
      }
    }
  }
}
