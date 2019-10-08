import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  ITreeOptions,
  TreeNode
} from 'angular-tree-component';

import {
  IDTypeDictionary,
  ITreeState
} from 'angular-tree-component/dist/defs/api';

@Component({
  selector: 'sky-angular-tree-visual',
  templateUrl: './angular-tree-visual.component.html',
  styleUrls: ['./angular-tree-visual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAngularTreeVisualComponent {

  public activeNodeIds: string[] = [];

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

  public basicOptions: ITreeOptions = {
    animateExpand: true
  };

  public expandedNodeIds: string[] = [];

  public focusedNodeId: string;

  public nodes: any[] = [
    {
      id: 1,
      name: 'United States',
      isExpanded: true,
      children: [
        { id: 2, name: 'Alabama' },
        { id: 3, name: 'California' },
        { id: 4, name: 'Indiana', isExpanded: true, children: [
          { id: 5, name: 'Adams' },
          { id: 6, name: 'Allen' },
          { id: 7, name: 'Bartholomew' }
          ]
        }
      ]
    },
    {
      id: 8,
      name: 'Canada',
      isExpanded: true,
      children: [
        { id: 9, name: 'Alberta' },
        { id: 10, name: 'British Columbia' },
        { id: 11, name: 'Manitoba' }
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

  public selectedNodeIds: string[] = [];

  public actionClicked(name: string, node: TreeNode): void {
    console.log(name);
  }

  public onStateChange(event: ITreeState): void {
    this.expandedNodeIds = this.getDictionaryValue(event.expandedNodeIds);
    this.selectedNodeIds = this.getDictionaryValue(event.selectedLeafNodeIds);
    this.activeNodeIds = this.getDictionaryValue(event.activeNodeIds);
    this.focusedNodeId = event.focusedNodeId ? event.focusedNodeId.toString() : undefined;
  }

  private getDictionaryValue(dictionary: IDTypeDictionary): string[] {
    const returnValue: string[] = [];
    for (let key in dictionary) {
      if (dictionary[key] && dictionary[key]) {
        returnValue.push(key);
      }
    }
    return returnValue;
  }

}
