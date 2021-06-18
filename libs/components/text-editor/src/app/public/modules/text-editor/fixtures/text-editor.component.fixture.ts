import {
  Component
} from '@angular/core';

import {
  FONT_LIST_DEFAULTS
} from '../defaults/font-list-defaults';

import {
  SkyTextEditorStyleState
} from '../types/style-state';
import {
  SkyTextEditorToolbarActions
} from '../types/toolbar-action';

import {
  FONT_SIZE_LIST_DEFAULTS
} from '../defaults/font-size-list-defaults';

import {
  SkyTextEditorMenu
} from '../types/menu';

import {
  SkyTextEditorMergeField
} from '../types/text-editor-merge-field';

/**
 * @internal
 */
@Component({
  selector: 'text-editor-test',
  templateUrl: './text-editor.component.fixture.html'
})
export class TextEditorFixtureComponent {
  public value: string = '<p>Some text</p>';
  public placeholder: string;

  public fontSizeList = FONT_SIZE_LIST_DEFAULTS;

  public fontList = FONT_LIST_DEFAULTS;

  public toolbarActions: SkyTextEditorToolbarActions[] = [
    SkyTextEditorToolbarActions.FontFamily,
    SkyTextEditorToolbarActions.FontSize,
    SkyTextEditorToolbarActions.Color,
    SkyTextEditorToolbarActions.List,
    SkyTextEditorToolbarActions.FontStyle,
    SkyTextEditorToolbarActions.Alignment,
    SkyTextEditorToolbarActions.Indentation,
    SkyTextEditorToolbarActions.UndoRedo,
    SkyTextEditorToolbarActions.Link
  ];

  public menus: SkyTextEditorMenu[] = [
    SkyTextEditorMenu.Edit,
    SkyTextEditorMenu.Format,
    SkyTextEditorMenu.MergeField
  ];

  public autofocus = false;

  public mergeFields: SkyTextEditorMergeField[] = [
    {
      id: '0',
      name: 'Best field'
    },
    {
      id: '1',
      name: 'Second best field'
    },
    {
      id: '2',
      name: 'A field that is really too long for its own good'
    }
  ];

  public initialStyleState: SkyTextEditorStyleState = {} as SkyTextEditorStyleState;
}
