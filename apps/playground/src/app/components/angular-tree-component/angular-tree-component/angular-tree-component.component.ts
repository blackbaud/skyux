import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ITreeOptions, TreeNode } from '@blackbaud/angular-tree-component';
import {
  IDTypeDictionary,
  ITreeState,
} from '@blackbaud/angular-tree-component/lib/defs/api';

@Component({
  selector: 'app-angular-tree-component',
  templateUrl: './angular-tree-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AngularTreeComponentComponent {
  public activeNodeIds: string[] = [];

  public dropdownItems: any = [
    { name: 'Insert an item at this level', disabled: false },
    { name: 'Insert an item under this level', disabled: false },
    { name: 'Move up', disabled: false },
    { name: 'Move down', disabled: false },
    { name: 'Move left', disabled: false },
    { name: 'Move right', disabled: false },
    { name: 'Edit', disabled: false },
    { name: 'Delete', disabled: false },
  ];

  public basicOptions: ITreeOptions = {
    animateExpand: true,
    allowDrag: true,
  };

  public expandedNodeIds: string[] = [];

  public focusedNodeId: string;

  public nodes: any[] = [
    {
      id: 1,
      name: 'United States',
      isExpanded: true,
      allowDrag: true,
      children: [
        { id: 2, name: 'Alabama', allowDrag: true },
        { id: 3, name: 'California', allowDrag: true },
        {
          id: 4,
          name: 'Indiana',
          isExpanded: true,
          allowDrag: true,
          children: [
            { id: 5, name: 'Adams', allowDrag: true },
            { id: 6, name: 'Allen', allowDrag: true },
            { id: 7, name: 'Bartholomew', allowDrag: true },
          ],
        },
        { id: 13, name: 'Florida', allowDrag: true },
      ],
    },
    {
      id: 12,
      name: 'Mexico',
      isExpanded: true,
      children: [],
      allowDrag: true,
    },
    {
      id: 8,
      name: 'Canada',
      isExpanded: true,
      allowDrag: true,
      children: [
        { id: 9, name: 'Alberta', allowDrag: true },
        { id: 10, name: 'British Columbia', allowDrag: true },
        { id: 11, name: 'Manitoba', allowDrag: true },
      ],
    },
    {
      id: 14,
      name: 'Argentina',
      allowDrag: true,
      isExpanded: true,
      children: [],
    },
  ];

  public optionsCascading: ITreeOptions = {
    animateExpand: true,
    useCheckbox: true,
    useTriState: true,
  };

  public optionsNonCascading: ITreeOptions = {
    animateExpand: true,
    useCheckbox: true,
    useTriState: false,
  };

  public selectedNodeIds: string[] = [];

  public actionClicked(name: string, node: TreeNode): void {
    console.log(name);
  }

  public onStateChange(event: ITreeState): void {
    this.expandedNodeIds = this.getDictionaryValue(event.expandedNodeIds);
    this.selectedNodeIds = this.getDictionaryValue(event.selectedLeafNodeIds);
    this.activeNodeIds = this.getDictionaryValue(event.activeNodeIds);
    this.focusedNodeId = event.focusedNodeId
      ? event.focusedNodeId.toString()
      : undefined;
  }

  private getDictionaryValue(dictionary: IDTypeDictionary): string[] {
    const returnValue: string[] = [];
    for (const key in dictionary) {
      if (dictionary[key] && dictionary[key]) {
        returnValue.push(key);
      }
    }
    return returnValue;
  }
}
