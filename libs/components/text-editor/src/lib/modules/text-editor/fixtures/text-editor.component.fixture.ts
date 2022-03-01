import { Component } from '@angular/core';

import { FONT_LIST_DEFAULTS } from '../defaults/font-list-defaults';
import { FONT_SIZE_LIST_DEFAULTS } from '../defaults/font-size-list-defaults';
import { SkyTextEditorMenuType } from '../types/menu-type';
import { SkyTextEditorStyleState } from '../types/style-state';
import { SkyTextEditorMergeField } from '../types/text-editor-merge-field';
import { SkyTextEditorToolbarActionType } from '../types/toolbar-action-type';

/**
 * @internal
 */
@Component({
  selector: 'sky-text-editor-test',
  templateUrl: './text-editor.component.fixture.html',
})
export class TextEditorFixtureComponent {
  public autofocus = false;
  public disabled = false;
  public fontList = FONT_LIST_DEFAULTS;
  public fontSizeList = FONT_SIZE_LIST_DEFAULTS;
  public initialStyleState: SkyTextEditorStyleState =
    {} as SkyTextEditorStyleState;
  public menus: SkyTextEditorMenuType[] = ['edit', 'format', 'merge-field'];
  public mergeFields: SkyTextEditorMergeField[] = [
    {
      id: '0',
      name: 'Best field',
    },
    {
      id: '1',
      name: 'Second best field',
    },
    {
      id: '2',
      name: 'A field that is really too long for its own good',
    },
  ];
  public placeholder: string;
  public toolbarActions: SkyTextEditorToolbarActionType[] = [
    'font-family',
    'font-size',
    'color',
    'list',
    'font-style',
    'alignment',
    'indentation',
    'undo-redo',
    'link',
  ];
  public value = '<p>Some text</p>';
}
