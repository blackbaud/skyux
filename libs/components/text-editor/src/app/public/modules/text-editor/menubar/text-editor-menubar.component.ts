import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

import {
  forkJoin,
  Subject
} from 'rxjs';

import {
  take,
  takeUntil
} from 'rxjs/operators';

import {
  SkyTextEditorAdapterService
} from '../services/text-editor-adapter.service';

import {
  SkyTextEditorMenuType
} from '../types/menu-type';

import {
  SkyTextEditorMergeField
} from '../types/text-editor-merge-field';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-editor-menubar',
  templateUrl: './text-editor-menubar.component.html',
  styleUrls: ['./text-editor-menubar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTextEditorMenubarComponent implements OnDestroy, OnInit {

  @Input()
  public editorFocusStream = new Subject();

  @Input()
  public editorId: string;

  @Input()
  public menus: SkyTextEditorMenuType[] = [];

  @Input()
  public mergeFields: SkyTextEditorMergeField[] = [];

  public editDropdownStream = new Subject<SkyDropdownMessage>();

  public editItems: {
    function?: () => void,
    isDivider?: boolean,
    label?: string,
    keyShortcut?: string
  }[];

  public formatDropdownStream = new Subject<SkyDropdownMessage>();

  public formatItems: {
    function?: () => void,
    isDivider?: boolean,
    label?: string,
    keyShortcut?: string
  }[];

  public mergeFieldDropdownStream = new Subject<SkyDropdownMessage>();

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private adapterService: SkyTextEditorAdapterService,
    private resources: SkyLibResourcesService
  ) {}

  public ngOnInit(): void {
    this.editorFocusStream
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe(() => {
        this.closeDropdowns();
      });

    forkJoin([
      // Format menu strings.
      this.resources.getString('skyux_text_editor_format_menu_action_bold_label'),
      this.resources.getString('skyux_text_editor_format_menu_action_bold_key_shortcut'),
      this.resources.getString('skyux_text_editor_format_menu_action_italic_label'),
      this.resources.getString('skyux_text_editor_format_menu_action_italic_key_shortcut'),
      this.resources.getString('skyux_text_editor_format_menu_action_underline_label'),
      this.resources.getString('skyux_text_editor_format_menu_action_underline_key_shortcut'),
      this.resources.getString('skyux_text_editor_format_menu_action_strikethrough_label'),
      this.resources.getString('skyux_text_editor_format_menu_action_clear_formatting_label'),

      // Edit menu string - start at index 8.
      this.resources.getString('skyux_text_editor_edit_menu_action_undo_label'),
      this.resources.getString('skyux_text_editor_edit_menu_action_undo_key_shortcut'),
      this.resources.getString('skyux_text_editor_edit_menu_action_redo_label'),
      this.resources.getString('skyux_text_editor_edit_menu_action_redo_key_shortcut'),
      this.resources.getString('skyux_text_editor_edit_menu_action_cut_label'),
      this.resources.getString('skyux_text_editor_edit_menu_action_cut_key_shortcut'),
      this.resources.getString('skyux_text_editor_edit_menu_action_copy_label'),
      this.resources.getString('skyux_text_editor_edit_menu_action_copy_key_shortcut'),
      this.resources.getString('skyux_text_editor_edit_menu_action_paste_label'),
      this.resources.getString('skyux_text_editor_edit_menu_action_paste_key_shortcut'),
      this.resources.getString('skyux_text_editor_edit_menu_action_select_all_label'),
      this.resources.getString('skyux_text_editor_edit_menu_action_select_all_key_shortcut')

    ])
      .pipe(take(1))
      .subscribe(resources => {
        this.formatItems = [
          {
            function: () => this.execCommand('bold'),
            label: resources[0],
            keyShortcut: resources[1]
          },
          {
            function: () => this.execCommand('italic'),
            label: resources[2],
            keyShortcut: resources[3]
          },
          {
            function: () => this.execCommand('underline'),
            label: resources[4],
            keyShortcut: resources[5]
          },
          {
            function: () => this.execCommand('strikethrough'),
            label: resources[6]
          },
          {
            isDivider: true
          },
          {
            function: () => this.clearFormat(),
            label: resources[7]
          }
        ];
        this.editItems = [
          {
            function: () => this.execCommand('undo'),
            label: resources[8],
            keyShortcut: resources[9]
          },
          {
            function: () => this.execCommand('redo'),
            label: resources[10],
            keyShortcut: resources[11]
          },
          {
            isDivider: true
          },
          {
            function: () => this.execCommand('cut'),
            label: resources[12],
            keyShortcut: resources[13]
          },
          {
            function: () => this.execCommand('copy'),
            label: resources[14],
            keyShortcut: resources[15]
          },
          {
            function: () => this.execCommand('paste'),
            label: resources[16],
            keyShortcut: resources[17]
          },
          {
            isDivider: true
          },
          {
            function: () => this.execCommand('selectAll'),
            label: resources[18],
            keyShortcut: resources[19]
          }
        ];
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public execCommand(command: string, value: any = ''): void {
    this.adapterService.execCommand(this.editorId, {
      command: command,
      value: value
    });
  }

  public insertMergeField(field: SkyTextEditorMergeField): void {
    this.execCommand(
      'insertHTML',
      '<img style="display: inline; cursor: grab;" data-fieldid="' + field.id +
        '" data-fielddisplay="' + field.name +
        '" src="' + (field.previewImageUrl || this.adapterService.getMergeFieldDataURI(field.name)) + '">'
    );
  }

  private closeDropdowns(): void {
    this.editDropdownStream.next({ type: SkyDropdownMessageType.Close });
    this.formatDropdownStream.next({ type: SkyDropdownMessageType.Close });
    this.mergeFieldDropdownStream.next({ type: SkyDropdownMessageType.Close });
  }

  private clearFormat(): void {
    let currentSelection = this.adapterService.getCurrentSelection(this.editorId);
    if (currentSelection.rangeCount > 0 && currentSelection.getRangeAt(0).toString().length <= 0) {
      this.execCommand('selectAll');
    }
    this.execCommand('removeFormat');
  }

}
