import { Component, ViewChild } from '@angular/core';

import {
  ITreeOptions,
  ITreeState,
  TreeComponent,
} from '@circlon/angular-tree-component';

import { IDTypeDictionary } from '@circlon/angular-tree-component/lib/defs/api';

@Component({
  templateUrl: './tree-view.fixture.component.html',
})
export class SkyTreeViewFixtureComponent {
  public activeNodeIds: any;

  public expandedNodeIds: IDTypeDictionary;

  public focusedNodeId: any;

  public nodes: any[] = [
    {
      id: 1,
      name: 'United States',
      isExpanded: true,
      children: [
        { id: 2, name: 'California' },
        {
          id: 3,
          name: 'Indiana',
          isExpanded: true,
          children: [
            { id: 4, name: 'Adams' },
            { id: 5, name: 'Allen' },
          ],
        },
      ],
    },
    {
      id: 6,
      name: 'Mexico',
    },
  ];

  public options: ITreeOptions;

  public readOnly = false;

  public selectedLeafNodeIds: IDTypeDictionary;

  public selectLeafNodesOnly: boolean;

  public selectSingle: boolean;

  public showContextMenus = false;

  public showInvalidTree = false;

  public showToolbar = false;

  public state: ITreeState;

  public stateChange: any;

  @ViewChild(TreeComponent)
  public treeComponent: TreeComponent;

  public onStateChange(treeState: ITreeState): void {
    this.stateChange = treeState;
    this.selectedLeafNodeIds = treeState.selectedLeafNodeIds;
    this.focusedNodeId = treeState.focusedNodeId;
    this.activeNodeIds = treeState.activeNodeIds;
    this.expandedNodeIds = treeState.expandedNodeIds;
  }

  public updateState(): void {
    this.state = {
      selectedLeafNodeIds: {
        1: true,
      },
    };
  }
}
