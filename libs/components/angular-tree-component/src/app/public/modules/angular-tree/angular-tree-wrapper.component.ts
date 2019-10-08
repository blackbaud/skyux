import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input
} from '@angular/core';

import {
  KEYS,
  TREE_ACTIONS,
  TreeComponent,
  TreeModel,
  TreeNode
} from 'angular-tree-component';

import {
  IDTypeDictionary
} from 'angular-tree-component/dist/defs/api';

@Component({
  selector: 'sky-angular-tree-wrapper',
  templateUrl: './angular-tree-wrapper.component.html',
  styleUrls: ['./angular-tree-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAngularTreeWrapperComponent implements AfterViewInit {

  @Input()
  public readOnly: boolean = false;

  @Input()
  public selectLeafNodesOnly: boolean = false;

  @Input()
  public selectSingle: boolean = false;

  @Input()
  public set showToolbar(value: boolean) {
    this._showToolbar = value;
  }

  public get showToolbar(): boolean {
    return this._showToolbar || false;
  }

  public selectableNodeIds: IDTypeDictionary;

  @ContentChild(TreeComponent)
  private treeComponent: TreeComponent;

  private _showToolbar: boolean;

  public ngAfterViewInit(): void {
    if (this.selectSingle && this.treeComponent.treeModel.options.useTriState) {
      console.warn(
        'Single select mode should not be enabled while the tree is in triState mode (cascading selection). '
        + 'Please set "useTriState" to "false" if you want to remain in single select mode.'
      );
    }
    this.overrideActionMapping();
  }

  public multiselectable(): boolean {
    return this.treeComponent.treeModel.options.useCheckbox && !this.selectSingle;
  }

  public onClearAllClick(): void {
    /* istanbul ignore else */
    if (!this.selectSingle) {
      const currentState = this.treeComponent.treeModel.getState();
      this.treeComponent.state = {
        ...currentState,
        selectedLeafNodeIds: {}
      };
    }
  }

  public onCollapseAllClick(): void {
    this.treeComponent.treeModel.collapseAll();
  }

  public onExpandAllClick(): void {
    this.treeComponent.treeModel.expandAll();
  }

  public onSelectAllClick(): void {
    /* istanbul ignore else */
    if (!this.selectSingle) {

      // Get a list of all node ids that are selectable.
      this.selectableNodeIds = {};
      let getSelectableNodeIds = (node: TreeNode) => {
        const selectable = node.isSelectable() && !(node.hasChildren && this.selectLeafNodesOnly);
        if (selectable) {
          this.selectableNodeIds[node.id] = true;
        }
        if (!node.children) {
          return;
        }
        node.children.forEach(child => getSelectableNodeIds(child));
      };
      getSelectableNodeIds(this.treeComponent.treeModel.virtualRoot);

      // Update tree state with new list of selected node ids.
      const currentState = this.treeComponent.treeModel.getState();
      this.treeComponent.state = {
        ...currentState,
        selectedLeafNodeIds: this.selectableNodeIds
      };
    }
  }

  public showSelectButtons(): boolean {
    return this.treeComponent.treeModel.options.useCheckbox && !this.selectSingle;
  }

  private isSelectable(node: TreeNode): boolean {
    return node.isLeaf || !node.hasChildren || !this.selectLeafNodesOnly;
  }

  private nodeDefaultAction(tree: TreeModel, node: TreeNode, event: any): void {
    if (this.readOnly) {
      return;
    }

    if (node.options.useCheckbox && this.isSelectable(node)) {
      this.toggleSelected(node, event);
    } else {
      TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, event);
    }
  }

  private overrideActionMapping(): void {
    const defaultActionMapping = this.treeComponent.treeModel.options.actionMapping;

    // Override default click/enter/space action to check for unsupported options (leaf node, single-select).
    defaultActionMapping.mouse.click = (tree, node, $event) => this.nodeDefaultAction(tree, node, event);
    defaultActionMapping.keys[KEYS.SPACE] = (tree, node, $event) => this.nodeDefaultAction(tree, node, event);
    defaultActionMapping.keys[KEYS.ENTER] = (tree, node, $event) => this.nodeDefaultAction(tree, node, event);

    // Disable left/right arrow keys to support navigating through interactive elements with keyboard.
    // See onArrowLeft() / onArrowRight() methods inside the angular-tree-node.component.ts.
    /* istanbul ignore next */
    defaultActionMapping.keys[KEYS.RIGHT] = (tree, node, $event) => undefined;
    /* istanbul ignore next */
    defaultActionMapping.keys[KEYS.LEFT] = (tree, node, $event) => undefined;
  }

  private toggleSelected(node: TreeNode, event: any): void {
    // If single-selection is enabled, first de-select all other nodes.
    if (this.selectSingle && !node.isSelected) {
      const selectedNodes = node.treeModel.selectedLeafNodes;
      selectedNodes
        .forEach((n: TreeNode) => {
          n.setIsSelected(false);
        });
    }

    TREE_ACTIONS.TOGGLE_SELECTED(node.treeModel, node, event);
  }
}
