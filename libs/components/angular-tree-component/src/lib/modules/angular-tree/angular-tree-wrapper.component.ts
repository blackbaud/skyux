import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
} from '@angular/core';
import {
  KEYS,
  TREE_ACTIONS,
  TreeComponent,
  TreeModel,
  TreeNode,
} from '@blackbaud/angular-tree-component';

/**
 * Wraps the Angular `tree-root` component as part of the `SkyAngularTreeModule` that provides
 * SKY UX components and styles to complement the `angular-tree-component` library and apply SKY UX
 * themes and functionality to hierarchical list views. For information about the `tree-root` component, see the
 * [Angular tree component documentation](https://angular2-tree.readme.io/docs).
 */
@Component({
  selector: 'sky-angular-tree-wrapper',
  templateUrl: './angular-tree-wrapper.component.html',
  styleUrls: ['./angular-tree-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyAngularTreeWrapperComponent implements AfterViewInit {
  /**
   * Whether to render the tree view in read-only mode.
   * This mode disables selected and active states on the tree view nodes.
   * @default false
   */
  @Input()
  public readOnly: boolean | undefined = false;

  /**
   * Whether to use leaf-only selection mode. For tree views with
   * [checkboxes](https://angular2-tree.readme.io/docs/tri-state-checkboxes),
   * this mode limits user selections to leaf nodes and prevents users from selecting parent nodes.
   * @default false
   */
  @Input()
  public selectLeafNodesOnly: boolean | undefined = false;

  /**
   * Whether to use single-select mode. For tree views with
   * [checkboxes](https://angular2-tree.readme.io/docs/tri-state-checkboxes),
   * this mode limits user selections to one node at a time.
   * @default false
   */
  @Input()
  public selectSingle: boolean | undefined = false;

  /**
   * Whether to display a toolbar with buttons to expand and collapse all nodes and buttons to select and clear all checkboxes.
   * The select and clear buttons only appear when you enable checkboxes.
   * To enable [checkboxes](https://angular2-tree.readme.io/docs/tri-state-checkboxes).
   * @default false
   */
  @Input()
  public showToolbar: boolean | undefined = false;

  public selectableNodeIds: Record<string, unknown> = {};

  @ContentChild(TreeComponent)
  public treeComponent: TreeComponent | undefined;

  public ngAfterViewInit(): void {
    if (
      this.selectSingle &&
      this.treeComponent?.treeModel.options.useTriState
    ) {
      console.warn(
        'Single select mode should not be enabled while the tree is in triState mode (cascading selection). ' +
          'Please set "useTriState" to "false" if you want to remain in single select mode.',
      );
    }
    this.#overrideActionMapping();
  }

  public multiselectable(): boolean {
    return (
      !!this.treeComponent &&
      this.treeComponent.treeModel.options.useCheckbox &&
      !this.selectSingle
    );
  }

  public onClearAllClick(): void {
    /* istanbul ignore else */
    if (!this.selectSingle && this.treeComponent) {
      const currentState = this.treeComponent.treeModel.getState();
      this.treeComponent.state = {
        ...currentState,
        selectedLeafNodeIds: {},
      };
    }
  }

  public onCollapseAllClick(): void {
    this.treeComponent?.treeModel.collapseAll();
  }

  public onExpandAllClick(): void {
    this.treeComponent?.treeModel.expandAll();
  }

  public onSelectAllClick(): void {
    /* istanbul ignore else */
    if (!this.selectSingle && this.treeComponent) {
      // Get a list of all node ids that are selectable.
      this.selectableNodeIds = {};
      const getSelectableNodeIds = (node: TreeNode): void => {
        const selectable =
          node.isSelectable() &&
          !(node.hasChildren && this.selectLeafNodesOnly);
        if (selectable && !node.data.virtual) {
          this.selectableNodeIds[node.id] = true;
        }
        if (!node.children) {
          return;
        }
        node.children.forEach((child) => getSelectableNodeIds(child));
      };
      getSelectableNodeIds(this.treeComponent.treeModel.virtualRoot);

      // Update tree state with new list of selected node ids.
      const currentState = this.treeComponent.treeModel.getState();
      this.treeComponent.state = {
        ...currentState,
        selectedLeafNodeIds: this.selectableNodeIds,
      };
    }
  }

  public showSelectButtons(): boolean {
    return (
      !!this.treeComponent &&
      this.treeComponent.treeModel.options.useCheckbox &&
      !this.selectSingle
    );
  }

  #isSelectable(node: TreeNode): boolean {
    return node.isLeaf || !node.hasChildren || !this.selectLeafNodesOnly;
  }

  #nodeDefaultAction(tree: TreeModel, node: TreeNode, event: any): void {
    if (this.readOnly) {
      return;
    }

    if (node.options.useCheckbox && this.#isSelectable(node)) {
      this.#toggleSelected(node, event);
    } else {
      TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, event);
    }

    return;
  }

  #onKeyDownAction(tree: TreeModel, node: TreeNode, event: any): void {
    const targetNodeId = event.target.getAttribute('data-node-id');

    // Key press did not happen on the node.
    if (!node || targetNodeId !== node.id.toString()) {
      // angular-tree-component will preventDefault() on anything using a key action handler,
      // thus stopping "enter" and "space" keys to throw "click" events on interactive elements.
      // This logic ensures components looking for "clicks" on those keystrokes still work (dropdown component).
      // https://github.com/500tech/angular-tree-component/blob/master/lib/models/tree.model.ts#L341
      /* istanbul ignore else */
      if (event.defaultPrevented) {
        event.target.click();
      }

      return;
    }

    this.#nodeDefaultAction(tree, node, event);
  }

  #overrideActionMapping(): void {
    const defaultActionMapping =
      this.treeComponent?.treeModel.options.actionMapping;

    if (defaultActionMapping?.mouse) {
      // Override default click/enter/space action to check for unsupported options (leaf node, single-select).
      defaultActionMapping.mouse.click = (tree, node, event): void =>
        this.#nodeDefaultAction(tree, node, event);
    }

    if (defaultActionMapping?.keys) {
      defaultActionMapping.keys[KEYS.SPACE] = (tree, node, event): void =>
        this.#onKeyDownAction(tree, node, event);
      defaultActionMapping.keys[KEYS.ENTER] = (tree, node, event): void =>
        this.#onKeyDownAction(tree, node, event);

      // Disable left/right arrow keys to support navigating through interactive elements with keyboard.
      // See onArrowLeft() / onArrowRight() methods inside the angular-tree-node.component.ts.
      /* istanbul ignore next */
      defaultActionMapping.keys[KEYS.RIGHT] = (tree, node, $event): void =>
        undefined;
      /* istanbul ignore next */
      defaultActionMapping.keys[KEYS.LEFT] = (tree, node, $event): void =>
        undefined;
      /* istanbul ignore next */
      defaultActionMapping.keys[KEYS.DOWN] = (tree, node, $event): void =>
        undefined;
      /* istanbul ignore next */
      defaultActionMapping.keys[KEYS.UP] = (tree, node, $event): void =>
        undefined;
    }
  }

  #toggleSelected(node: TreeNode, event: any): void {
    // If single-selection is enabled, only select the node clicked.
    if (this.selectSingle && !node.isSelected) {
      const oldState = this.treeComponent?.treeModel.getState();
      const newState = {
        expandedNodeIds: oldState?.expandedNodeIds,
        selectedLeafNodeIds: Object.assign({}, node.id, { [node.id]: true }),
        activeNodeIds: oldState?.activeNodeIds,
        hiddenNodeIds: oldState?.hiddenNodeIds,
        focusedNodeId: node.id,
      };
      // Reconstruct the state in one go, so we don't create multiple events for the consumer.
      this.treeComponent?.treeModel.setState(newState);
    } else {
      TREE_ACTIONS.TOGGLE_SELECTED(node.treeModel, node, event);
    }
  }
}
