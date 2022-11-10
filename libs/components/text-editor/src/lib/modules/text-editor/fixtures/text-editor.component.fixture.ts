import { Component } from '@angular/core';

import { FONT_LIST_DEFAULTS } from '../defaults/font-list-defaults';
import { FONT_SIZE_LIST_DEFAULTS } from '../defaults/font-size-list-defaults';
import { SkyTextEditorFont } from '../types/font-state';
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
  public fontList: SkyTextEditorFont[] | undefined = FONT_LIST_DEFAULTS;
  public fontSizeList: number[] | undefined = FONT_SIZE_LIST_DEFAULTS;
  public id: string | undefined = 'id-from-fixture';
  public initialStyleState: SkyTextEditorStyleState =
    {} as SkyTextEditorStyleState;
  public menus: SkyTextEditorMenuType[] | undefined = [
    'edit',
    'format',
    'merge-field',
  ];
  public mergeFields: SkyTextEditorMergeField[] | undefined = [
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
  public placeholder: string | undefined;
  public toolbarActions: SkyTextEditorToolbarActionType[] | undefined = [
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
