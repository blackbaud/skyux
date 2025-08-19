import { Component, ViewChild } from '@angular/core';
import {
  ITreeOptions,
  ITreeState,
  TreeComponent,
} from '@blackbaud/angular-tree-component';

@Component({
  templateUrl: './tree-view.fixture.component.html',
  standalone: false,
})
export class SkyTreeViewFixtureComponent {
  public activeNodeIds: any;

  public contextMenuAriaLabel: string | undefined;

  public expandedNodeIds: Record<string, unknown> | undefined;

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

  public options: ITreeOptions | undefined;

  public readOnly = false;

  public selectedLeafNodeIds: Record<string, unknown> | undefined;

  public selectLeafNodesOnly: boolean | undefined;

  public selectSingle: boolean | undefined;

  public showContextMenus = false;

  public showInvalidTree = false;

  public showToolbar = false;

  public state: ITreeState | undefined;

  public stateChange: any;

  @ViewChild(TreeComponent)
  public treeComponent!: TreeComponent;

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
