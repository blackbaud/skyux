import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  TreeModel
} from 'angular-tree-component';

import {
  ITreeOptions
} from 'angular-tree-component/dist/defs/api';

@Component({
  selector: 'app-angular-tree-docs',
  templateUrl: './angular-tree-docs.component.html'
})
export class AngularTreeDocsComponent {

  public set enableCascading(value: boolean) {
    this.resetSelection();
    this.treeOptions.useTriState = value;
    this.demoSettings.enableCascading = value;

    if (value) {
      this.demoSettings.selectLeafNodesOnly = false;
    }
  }

  public set selectLeafNodesOnly(value: boolean) {
    this.resetSelection();
    this.demoSettings.selectLeafNodesOnly = value;

    if (value) {
      this.demoSettings.enableCascading = false;
    }
  }

  public basicOptions: ITreeOptions = {
    animateExpand: true
  };

  public demoSettings: any = {};

  public dropdownItems: any = [
    { name: 'Insert an item at this level', disabled: false },
    { name: 'Insert an item under this level', disabled: false },
    { name: 'Move up', disabled: false },
    { name: 'Move down', disabled: false },
    { name: 'Move left', disabled: false },
    { name: 'Move right', disabled: false },
    { name: 'Edit', disabled: false },
    { name: 'Delete', disabled: false }
  ];

  public nodes: any[] = [
    {
      id: 1,
      name: 'Animals',
      isExpanded: true,
      children: [
        {
          id: 2,
          name: 'Cats',
          isExpanded:
          true, children: [
            { id: 3, name: 'Burmese' },
            { id: 4, name: 'Persian' },
            { id: 5, name: 'Tabby' }
          ]
        },
        {
          id: 6,
          name: 'Dogs',
          isExpanded: true,
          children: [
            { id: 7, name: 'Beagle' },
            { id: 8, name: 'German shepherd' },
            { id: 9, name: 'Labrador retriever' }
          ]
        }
      ]
    }
  ];

  public optionsCascading: ITreeOptions = {
    animateExpand: true,
    useCheckbox: true,
    useTriState: true
  };

  public optionsNoncascading: ITreeOptions = {
    animateExpand: true,
    useCheckbox: true,
    useTriState: false
  };

  public selectModeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'multi', label: 'Multi-select' },
    { value: 'single', label: 'Single-select' }
  ];

  public treeModeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'navigation', label: 'Navigation' },
    { value: 'readOnly', label: 'Read-only' },
    { value: 'selection', label: 'Selection' }
  ];

  public treeOptions: ITreeOptions = {
    animateExpand: true,
    useTriState: false
  };

  @ViewChild(TreeModel)
  private tree: TreeModel;

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.contextMenus !== undefined) {
      this.demoSettings.contextMenus = change.contextMenus;
    }

    if (change.toolbar !== undefined) {
      this.demoSettings.toolbar = change.toolbar;
    }

    if (change.selectLeafNodesOnly !== undefined) {
      this.selectLeafNodesOnly = change.selectLeafNodesOnly;
    }

    if (change.enableCascading !== undefined) {
      this.enableCascading = change.enableCascading;
    }

    if (change.treeMode) {
      this.demoSettings.treeMode = change.treeMode;
      switch (change.treeMode) {
        case 'navigation':
          this.demoSettings.readOnly = false;
          this.enableSelection(false);
          break;

        case 'readOnly':
          this.demoSettings.readOnly = true;
          this.enableSelection(false);
          break;

        case 'selection':
          this.demoSettings.readOnly = false;
          this.enableSelection(true);
          break;

        default:
          break;
      }
    }

    if (change.treeSelectMode) {
      this.demoSettings.treeSelectMode = change.treeSelectMode;
      switch (change.treeSelectMode) {
        case 'multi':
          this.resetSelection();
          this.demoSettings.selectSingle = false;
          this.enableCascading = false;
          break;

        case 'single':
          this.resetSelection();
          this.demoSettings.selectSingle = true;
          this.enableCascading = false;
          break;

        default:
          break;
      }
    }
  }

  private enableSelection(value: boolean): void {
    this.resetSelection();
    this.treeOptions.useCheckbox = value;
    this.selectLeafNodesOnly = false;
    this.enableCascading = false;
  }

  private resetSelection(): void {
    this.tree.selectedLeafNodeIds = {};
    this.tree.activeNodeIds = {};
  }
}
