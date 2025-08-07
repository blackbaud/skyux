import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  booleanAttribute,
  inject,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyToolbarModule } from '@skyux/layout';
import {
  SkyDropdownMessage,
  SkyDropdownMessageType,
  SkyDropdownModule,
} from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import he from 'he';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyTextEditorResourcesModule } from '../../shared/sky-text-editor-resources.module';
import { SkyTextEditorAdapterService } from '../services/text-editor-adapter.service';
import { SkyTextEditorMenuType } from '../types/menu-type';
import { SkyTextEditorMergeField } from '../types/text-editor-merge-field';

const FORMAT_MENU_ACTION = 'skyux_text_editor_format_menu_action_';
const EDIT_MENU_ACTION = 'skyux_text_editor_edit_menu_action_';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-editor-menubar',
  templateUrl: './text-editor-menubar.component.html',
  styleUrls: ['./text-editor-menubar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyTextEditorResourcesModule,
    SkyThemeModule,
    SkyToolbarModule,
  ],
})
export class SkyTextEditorMenubarComponent implements OnDestroy, OnInit {
  @Input()
  public editorFocusStream = new Subject<void>();

  @Input()
  public menus: SkyTextEditorMenuType[] = [];

  @Input()
  public mergeFields: SkyTextEditorMergeField[] = [];

  @Input({ transform: booleanAttribute })
  public disabled = false;

  public editDropdownStream = new Subject<SkyDropdownMessage>();

  public editItems:
    | {
        function?: () => void;
        isDivider?: boolean;
        label?: string;
        keyShortcut?: string;
      }[]
    | undefined;

  public formatDropdownStream = new Subject<SkyDropdownMessage>();

  public formatItems:
    | {
        function?: () => void;
        isDivider?: boolean;
        label?: string;
        keyShortcut?: string;
      }[]
    | undefined;

  public mergeFieldDropdownStream = new Subject<SkyDropdownMessage>();

  #ngUnsubscribe = new Subject<void>();

  readonly #adapterService = inject(SkyTextEditorAdapterService);
  readonly #resources = inject(SkyLibResourcesService);

  public ngOnInit(): void {
    this.editorFocusStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#closeDropdowns();
      });

    this.#resources
      .getStrings({
        bold: FORMAT_MENU_ACTION + 'bold_label',
        boldShort: FORMAT_MENU_ACTION + 'bold_key_shortcut',
        italic: FORMAT_MENU_ACTION + 'italic_label',
        italicShort: FORMAT_MENU_ACTION + 'italic_key_shortcut',
        underline: FORMAT_MENU_ACTION + 'underline_label',
        underlineShort: FORMAT_MENU_ACTION + 'underline_key_shortcut',
        strikethrough: FORMAT_MENU_ACTION + 'strikethrough_label',
        clearFormatting: FORMAT_MENU_ACTION + 'clear_formatting_label',
        undo: EDIT_MENU_ACTION + 'undo_label',
        undoShort: EDIT_MENU_ACTION + 'undo_key_shortcut',
        redo: EDIT_MENU_ACTION + 'redo_label',
        redoShort: EDIT_MENU_ACTION + 'redo_key_shortcut',
        cut: EDIT_MENU_ACTION + 'cut_label',
        cutShort: EDIT_MENU_ACTION + 'cut_key_shortcut',
        copy: EDIT_MENU_ACTION + 'copy_label',
        copyShort: EDIT_MENU_ACTION + 'copy_key_shortcut',
        paste: EDIT_MENU_ACTION + 'paste_label',
        pasteShort: EDIT_MENU_ACTION + 'paste_key_shortcut',
        selectAll: EDIT_MENU_ACTION + 'select_all_label',
        selectAllShort: EDIT_MENU_ACTION + 'select_all_key_shortcut',
      })
      .pipe(take(1), takeUntil(this.#ngUnsubscribe))
      .subscribe((resources) => {
        this.formatItems = [
          {
            function: (): void => this.execCommand('bold'),
            label: resources.bold,
            keyShortcut: resources.boldShort,
          },
          {
            function: (): void => this.execCommand('italic'),
            label: resources.italic,
            keyShortcut: resources.italicShort,
          },
          {
            function: (): void => this.execCommand('underline'),
            label: resources.underline,
            keyShortcut: resources.underlineShort,
          },
          {
            function: (): void => this.execCommand('strikethrough'),
            label: resources.strikethrough,
          },
          {
            isDivider: true,
          },
          {
            function: (): void => this.#clearFormat(),
            label: resources.clearFormatting,
          },
        ];
        this.editItems = [
          {
            function: (): void => this.execCommand('undo'),
            label: resources.undo,
            keyShortcut: resources.undoShort,
          },
          {
            function: (): void => this.execCommand('redo'),
            label: resources.redo,
            keyShortcut: resources.redoShort,
          },
          {
            isDivider: true,
          },
          {
            function: (): void => this.execCommand('cut'),
            label: resources.cut,
            keyShortcut: resources.cutShort,
          },
          {
            function: (): void => this.execCommand('copy'),
            label: resources.copy,
            keyShortcut: resources.copyShort,
          },
          {
            function: (): void => this.execCommand('paste'),
            label: resources.paste,
            keyShortcut: resources.pasteShort,
          },
          {
            isDivider: true,
          },
          {
            function: (): void => this.execCommand('selectAll'),
            label: resources.selectAll,
            keyShortcut: resources.selectAllShort,
          },
        ];
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public execCommand(command: string, value = ''): void {
    void this.#adapterService.execCommand({
      command: command,
      value: value,
    });
  }

  public insertMergeField(field: SkyTextEditorMergeField): void {
    this.execCommand(
      'insertHTML',
      '<img style="display: inline; cursor: grab;" data-fieldid="' +
        he.escape(field.id) +
        '" data-fielddisplay="' +
        he.escape(field.name) +
        '" src="' +
        (field.previewImageUrl ||
          this.#adapterService.getMergeFieldDataURI(field.name)) +
        '">',
    );
  }

  #closeDropdowns(): void {
    this.editDropdownStream.next({ type: SkyDropdownMessageType.Close });
    this.formatDropdownStream.next({ type: SkyDropdownMessageType.Close });
    this.mergeFieldDropdownStream.next({ type: SkyDropdownMessageType.Close });
  }

  #clearFormat(): void {
    const currentSelection = this.#adapterService.getCurrentSelection();
    /* istanbul ignore else */
    if (
      currentSelection &&
      currentSelection.rangeCount > 0 &&
      currentSelection.getRangeAt(0).toString().length <= 0
    ) {
      this.execCommand('selectAll');
    }
    this.execCommand('removeFormat');
  }
}
