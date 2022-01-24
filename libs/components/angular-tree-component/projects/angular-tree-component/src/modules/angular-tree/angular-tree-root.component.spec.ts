import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';

import { expect, expectAsync, SkyAppTestUtility } from '@skyux-sdk/testing';

import { SkyTreeViewFixtureComponent } from './fixtures/tree-view.fixture.component';

import { SkyTreeViewFixturesModule } from './fixtures/tree-view.fixture.module';

describe('tree view', () => {
  let component: SkyTreeViewFixtureComponent;
  let fixture: ComponentFixture<SkyTreeViewFixtureComponent>;

  // #region helpers
  function getTreeWrapper(): HTMLElement {
    return document.querySelector('.sky-angular-tree-wrapper');
  }

  function getToolbar(): HTMLElement {
    return document.querySelector('.sky-angular-tree-toolbar') as HTMLElement;
  }

  function getSelectAllButton(): HTMLElement {
    return document.querySelector(
      '.sky-angular-tree-select-all-btn'
    ) as HTMLElement;
  }

  function getClearAllButton(): HTMLElement {
    return document.querySelector(
      '.sky-angular-tree-clear-all-btn'
    ) as HTMLElement;
  }

  function getSkyCheckboxes(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('sky-checkbox');
  }

  function getCheckboxInputs(): NodeListOf<HTMLInputElement> {
    return document.querySelectorAll('sky-checkbox input');
  }

  function getExpandAllButton(): HTMLElement {
    return document.querySelector(
      '.sky-angular-tree-expand-all-btn'
    ) as HTMLElement;
  }

  function getCollapseAllButton(): HTMLElement {
    return document.querySelector(
      '.sky-angular-tree-collapse-all-btn'
    ) as HTMLElement;
  }

  function getToggleChildrenButtons(): NodeListOf<HTMLElement> {
    return document.querySelectorAll(
      '.sky-toggle-children'
    ) as NodeListOf<HTMLElement>;
  }

  function getNodeContentWrappers(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('.node-content-wrapper');
  }

  function getNodeContents(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('tree-node-content');
  }

  function clickNode(index: number): void {
    const nodes = getNodeContents();
    nodes[index].click();
  }

  function getNodeWrappers(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('.node-wrapper');
  }

  function getTogglePlaceholder(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('.toggle-children-placeholder');
  }

  function clickSelectAll(): void {
    getSelectAllButton().click();
    tick(); // Allow time to apply changes to all buttons.
    fixture.detectChanges(); // Update sky-checkbox.
  }

  function clickClearAll(): void {
    getClearAllButton().click();
    tick(); // Allow time to apply changes to all buttons.
    fixture.detectChanges(); // Update sky-checkbox.
  }

  function clickExpand(): void {
    getExpandAllButton().click();
  }

  function clickCollapse(): void {
    getCollapseAllButton().click();
  }

  // Selection helpers
  // Note: validating checkboxes vs nodes should be separate. You may not have a checkbox for every node.
  // For example: Leaf-node only mode will hide checkboxes for parents.
  // expectNodeToBeSelected() will check if the node has proper styles and the tree model is updated correctly.
  // expectCheckboxToBeChecked() will check if our custom implementation of sky-checkbox has the proper checked state.

  // nodeIndex should use 1-based indexes!
  function expectNodeToBeSelected(nodeIndex: number, selected: boolean): void {
    const nodeWrappers = getNodeWrappers();

    if (selected) {
      expect(nodeWrappers[nodeIndex - 1]).toHaveCssClass(
        'sky-angular-tree-node-selected'
      );
      expect(component.selectedLeafNodeIds[nodeIndex]).toEqual(true);
    } else {
      expect(nodeWrappers[nodeIndex - 1]).not.toHaveCssClass(
        'sky-angular-tree-node-selected'
      );
      expect(!!component.selectedLeafNodeIds[nodeIndex]).toEqual(false);
    }
  }

  // nodeIndex should use 1-based indexes!
  function expectCheckboxToBeChecked(
    nodeIndex: number,
    selected: boolean
  ): void {
    const checkboxInputs = getCheckboxInputs();
    expect(checkboxInputs[nodeIndex - 1].checked).toEqual(selected);
  }

  function setupCascadingMode(): void {
    component.showToolbar = true;
    component.options = {
      useCheckbox: true,
      useTriState: true,
    };
  }

  function setupNonCascadingMode(): void {
    component.showToolbar = true;
    component.options = {
      useCheckbox: true,
      useTriState: false,
    };
  }

  function setupLeafSelectOnlyMode(): void {
    setupNonCascadingMode();
    component.selectLeafNodesOnly = true;
  }

  function setupSingleSelectMode(): void {
    setupNonCascadingMode();
    component.selectSingle = true;
  }

  function setupReadOnlyMode(): void {
    component.readOnly = true;
  }

  function keyDownOnElement(
    node: HTMLElement,
    eventName: string,
    keyCode: number
  ): void {
    // Note: We have to use a customEventInit, because the angular-tree-component library goess off of keyCode,
    // which the keyboardEventInit doesn't support yet :( .
    SkyAppTestUtility.fireDomEvent(node, 'keydown', {
      customEventInit: {
        key: eventName,
        keyCode: keyCode,
        which: keyCode,
      },
    });
    fixture.detectChanges();
  }
  // #endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyTreeViewFixturesModule],
    });

    fixture = TestBed.createComponent(
      SkyTreeViewFixtureComponent
    ) as ComponentFixture<SkyTreeViewFixtureComponent>;
    component = fixture.componentInstance as SkyTreeViewFixtureComponent;
  });

  describe('general functionality', () => {
    it('should show toggle children buttons for parent nodes', () => {
      fixture.detectChanges();
      const toggleChildrenButtons = getToggleChildrenButtons();
      const unitedStates =
        toggleChildrenButtons[0].parentElement.parentElement.querySelector(
          'tree-node-content'
        );
      const indiana =
        toggleChildrenButtons[1].parentElement.parentElement.querySelector(
          'tree-node-content'
        );

      expect(toggleChildrenButtons.length).toEqual(2);
      expect(unitedStates).toBeDefined();
      expect(indiana).toBeDefined();
      expect(unitedStates.textContent).toEqual('United States');
      expect(indiana.textContent).toEqual('Indiana');
    });

    it('should expand/collapse nodes when clicking on the toggle children button', () => {
      fixture.detectChanges();
      const toggleChildrenButtons = getToggleChildrenButtons();

      // Expect both parent nodes to start out expanded (United States & Indiana).
      expect(Object.keys(component.expandedNodeIds)).toEqual(['1', '3']);
      expect(component.expandedNodeIds[1]).toEqual(true);
      expect(component.expandedNodeIds[3]).toEqual(true);

      // Click United States toggle.
      toggleChildrenButtons[0].click();

      // Expect United States node to be collapsed.
      expect(Object.keys(component.expandedNodeIds)).toEqual(['1', '3']);
      expect(component.expandedNodeIds[1]).toEqual(false);
      expect(component.expandedNodeIds[3]).toEqual(true);
    });

    it('should toggle between chevron icons when clicking on the toggle children button', () => {
      fixture.detectChanges();
      const toggleChildrenButtons = getToggleChildrenButtons();

      expect(toggleChildrenButtons[0].querySelector('i')).toHaveCssClass(
        'fa-chevron-down'
      );

      toggleChildrenButtons[0].click();

      expect(toggleChildrenButtons[0].querySelector('i')).toHaveCssClass(
        'fa-chevron-right'
      );
    });
  });

  describe('toolbar', () => {
    it('should show toolbar when showToolbar property is set to true', () => {
      component.showToolbar = true;
      fixture.detectChanges();
      const toolbar = getToolbar();

      expect(toolbar).not.toBeNull();
    });

    it('should hide toolbar when showToolbar property is set to false', () => {
      component.showToolbar = false;
      fixture.detectChanges();
      const toolbar = getToolbar();

      expect(toolbar).toBeNull();
    });

    it('should hide select all / clear all buttons when useCheckbox is false', () => {
      component.showToolbar = true;
      component.options = {
        useCheckbox: false,
      };
      fixture.detectChanges();
      const selectAllButton = getSelectAllButton();
      const clearAllButton = getClearAllButton();

      expect(selectAllButton).toBeNull();
      expect(clearAllButton).toBeNull();
    });

    it('should show select all / clear all buttons when the tree view has checkboxes enabled', () => {
      setupCascadingMode();
      fixture.detectChanges();
      const selectAllButton = getSelectAllButton();
      const clearAllButton = getClearAllButton();

      expect(selectAllButton).not.toBeNull();
      expect(clearAllButton).not.toBeNull();
    });

    it('should select all checkboxes when select all is clicked', fakeAsync(() => {
      setupNonCascadingMode();
      fixture.detectChanges();

      clickSelectAll();

      // Note: a "parent" node isn't considered "selected" in triState (cascading) mode.
      // For this test, we have turned triState off, so testing selection is easier.
      expectNodeToBeSelected(1, true);
      expectCheckboxToBeChecked(1, true);

      expectNodeToBeSelected(2, true);
      expectCheckboxToBeChecked(2, true);

      expectNodeToBeSelected(3, true);
      expectCheckboxToBeChecked(3, true);

      expectNodeToBeSelected(4, true);
      expectCheckboxToBeChecked(4, true);

      expectNodeToBeSelected(5, true);
      expectCheckboxToBeChecked(5, true);

      fixture.destroy();
      flush();
    }));

    it('should not select virtual root when select all is clicked and triState is set to false', fakeAsync(() => {
      setupNonCascadingMode();
      fixture.detectChanges();

      clickSelectAll();

      const selectedNodeLength = Object.keys(
        component.selectedLeafNodeIds
      ).length;
      expect(selectedNodeLength).toEqual(6)

      fixture.destroy();
      flush();
    }));

    it('should clear all checkboxes when clear all is clicked', fakeAsync(() => {
      setupCascadingMode();
      fixture.detectChanges();

      clickSelectAll();
      clickClearAll();

      expectNodeToBeSelected(1, false);
      expectCheckboxToBeChecked(1, false);

      expectNodeToBeSelected(2, false);
      expectCheckboxToBeChecked(2, false);

      expectNodeToBeSelected(3, false);
      expectCheckboxToBeChecked(3, false);

      expectNodeToBeSelected(4, false);
      expectCheckboxToBeChecked(4, false);

      expectNodeToBeSelected(5, false);
      expectCheckboxToBeChecked(5, false);

      fixture.destroy();
      flush();
    }));

    it('should send proper commands to API when expand all / collapse all buttons are clicked', () => {
      component.showToolbar = true;
      fixture.detectChanges();
      const expandSpy = spyOn(
        component.treeComponent.treeModel,
        'expandAll'
      ).and.callThrough();
      const collapseSpy = spyOn(
        component.treeComponent.treeModel,
        'collapseAll'
      ).and.callThrough();

      clickExpand();
      expect(expandSpy).toHaveBeenCalledTimes(1);

      clickCollapse();
      expect(collapseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('read-only mode', () => {
    it('should not activate node when clicked', () => {
      setupReadOnlyMode();
      fixture.detectChanges();

      clickNode(0);

      expect(component.activeNodeIds).toEqual({});
    });

    it('should not select node when clicked', () => {
      setupReadOnlyMode();
      fixture.detectChanges();

      clickNode(0);

      expectNodeToBeSelected(1, false);
    });
  });

  describe('select mode', () => {
    it('should show sky-checkboxes when useCheckbox is true', () => {
      component.options = {
        useCheckbox: true,
      };
      fixture.detectChanges();
      const checkboxes = getSkyCheckboxes();

      expect(checkboxes.length).not.toEqual(0);
    });

    it('should not show sky-checkboxes when useCheckbox is false', () => {
      component.options = {
        useCheckbox: false,
      };
      fixture.detectChanges();
      const skyCheckboxes = getSkyCheckboxes();

      expect(skyCheckboxes.length).toEqual(0);
    });

    it('should show a checked sky-checkbox when nodes are selected programatically', () => {
      setupNonCascadingMode();
      fixture.detectChanges();

      // First node should be unchecked.
      expectNodeToBeSelected(1, false);
      expectCheckboxToBeChecked(1, false);

      // Programatically select a node using the 3rd party API.
      fixture.nativeElement.querySelector('#updateStateButton').click();
      fixture.detectChanges();

      // First node should now be checked.
      expectNodeToBeSelected(1, true);
      expectCheckboxToBeChecked(1, true);
    });

    it('should show indeterminate state when parent checkboxes are partially selected in cascade mode', () => {
      setupCascadingMode();
      fixture.detectChanges();
      const skyCheckboxes = getSkyCheckboxes();

      const parentCheckbox = skyCheckboxes[0].querySelector('input');
      const childCheckbox = skyCheckboxes[1].querySelector('input');

      // Select a child of the first parent.
      childCheckbox.click();

      // Expect the parent checkbox to be checked but also indeterminate.
      expect(parentCheckbox.checked).toBe(true);
      expect(skyCheckboxes[0]).toHaveCssClass('sky-checkbox-indeterminate');
    });

    it('should select nodes when node content is clicked', () => {
      setupNonCascadingMode();
      fixture.detectChanges();

      clickNode(0);

      expectNodeToBeSelected(1, true);
      expectCheckboxToBeChecked(1, true);
    });

    it('should select nodes when checkbox is clicked', () => {
      setupNonCascadingMode();
      fixture.detectChanges();
      const checkboxes = getCheckboxInputs();

      checkboxes[0].click();

      expectNodeToBeSelected(1, true);
      expectCheckboxToBeChecked(1, true);
    });

    it('should hide checkboxes and prevent parent node selection when selectLeafNodesOnly is true', () => {
      setupLeafSelectOnlyMode();
      fixture.detectChanges();
      const skyCheckboxes = getSkyCheckboxes();
      const nodeWrappers = getNodeWrappers();
      const unitedStatesCheckbox = nodeWrappers[0].querySelector('input');
      const indianaCheckbox = nodeWrappers[2].querySelector('input');

      // Expect only leaf nodes should have checkboxes.
      expect(skyCheckboxes.length).toEqual(4);
      expect(unitedStatesCheckbox).toBeNull();
      expect(indianaCheckbox).toBeNull();

      // Click the parent node.
      clickNode(0);

      // Expect parent node NOT to be selected.
      expectNodeToBeSelected(1, false);
      expectCheckboxToBeChecked(1, false);
    });

    it('should show and allow parent node selection when selectLeafNodesOnly is false', () => {
      setupNonCascadingMode();
      component.selectLeafNodesOnly = false;
      fixture.detectChanges();
      const skyCheckboxes = getSkyCheckboxes();
      const nodeWrappers = getNodeWrappers();
      const unitedStatesCheckbox = nodeWrappers[0].querySelector('input');
      const indianaCheckbox = nodeWrappers[2].querySelector('input');

      // Expect all nodes to have checkboxes.
      expect(skyCheckboxes.length).toEqual(6);
      expect(unitedStatesCheckbox).not.toBeNull();
      expect(indianaCheckbox).not.toBeNull();

      // Click the parent node.
      clickNode(0);

      // Expect parent node to be selected.
      expectNodeToBeSelected(1, true);
      expectCheckboxToBeChecked(1, true);
    });

    it('should only select leaf nodes when clicking select all and selectLeafNodesOnly is true', fakeAsync(() => {
      setupLeafSelectOnlyMode();
      fixture.detectChanges();
      const checkboxInputs = getCheckboxInputs();
      clickSelectAll();

      // United States (parent). Should not have a checkbox.
      // Expect NOT to be selected.
      expectNodeToBeSelected(1, false);

      // California (leaf). Expect to be selected.
      expectNodeToBeSelected(2, true);
      expect(checkboxInputs[0].checked).toEqual(true);

      // Indiana (parent). Should not have a checkbox.
      // Expect NOT to be selected.
      expectNodeToBeSelected(3, false);

      // Adams (leaf). Expect to be selected.
      expectNodeToBeSelected(4, true);
      expect(checkboxInputs[1].checked).toEqual(true);

      // Allen (leaf). Expect to be selected.
      expectNodeToBeSelected(5, true);
      expect(checkboxInputs[2].checked).toEqual(true);

      fixture.destroy();
      flush();
    }));

    it('should show toggle child placeholders for leaf nodes when selectLeafNodesOnly is false', () => {
      setupNonCascadingMode();
      component.selectLeafNodesOnly = false;
      fixture.detectChanges();
      const togglePlaceholder = getTogglePlaceholder();

      expect(togglePlaceholder.length).toEqual(4);
    });

    it('should not show toggle child placeholders for leaf nodes when selectLeafNodesOnly is true', () => {
      setupNonCascadingMode();
      component.selectLeafNodesOnly = true;
      fixture.detectChanges();
      const togglePlaceholder = getTogglePlaceholder();

      expect(togglePlaceholder.length).toEqual(0);
    });

    it('should throw a console warning if sky-angular-tree-wrapper component is not found', () => {
      const errorSpy = spyOn(console, 'error');
      fixture.detectChanges();

      expect(errorSpy).not.toHaveBeenCalled();

      component.showInvalidTree = true;
      fixture.detectChanges();

      expect(errorSpy).toHaveBeenCalled();
    });

    it('should hide sky-checkboxes when selectSingle is true', () => {
      setupSingleSelectMode();
      fixture.detectChanges();
      const skyCheckboxes = getSkyCheckboxes();

      expect(skyCheckboxes.length).toEqual(0);
    });

    it('should only let users select one node at a time when selectSingle is true', () => {
      setupSingleSelectMode();
      fixture.detectChanges();

      expectNodeToBeSelected(1, false);
      expectNodeToBeSelected(2, false);
      expectNodeToBeSelected(3, false);
      expectNodeToBeSelected(4, false);
      expectNodeToBeSelected(5, false);

      // Click the first node.
      clickNode(0);

      // Expect parent node to be selected.
      expectNodeToBeSelected(1, true);
      expectNodeToBeSelected(2, false);
      expectNodeToBeSelected(3, false);
      expectNodeToBeSelected(4, false);
      expectNodeToBeSelected(5, false);

      // Click a second node.
      clickNode(1);

      // Expect only second node to be selected.
      expectNodeToBeSelected(1, false);
      expectNodeToBeSelected(2, true);
      expectNodeToBeSelected(3, false);
      expectNodeToBeSelected(4, false);
      expectNodeToBeSelected(5, false);
    });

    it('should throw a console warning if selectSingle is used with a cascading tree', () => {
      setupCascadingMode();
      component.selectSingle = true;
      const warnSpy = spyOn(console, 'warn');
      fixture.detectChanges();

      expect(warnSpy).toHaveBeenCalled();
    });

    it('should hide select all/clear all buttons if selectSingle is true', () => {
      setupSingleSelectMode();
      fixture.detectChanges();

      const selectAllButton = getSelectAllButton();
      const clearAllButton = getClearAllButton();

      expect(selectAllButton).toBeNull();
      expect(clearAllButton).toBeNull();
    });

    it('should only emit a change once when selecting a node and selectSingle is true', () => {
      setupSingleSelectMode();
      fixture.detectChanges();
      const spy = spyOn(component, 'onStateChange').and.callThrough();

      // Click the first node.
      clickNode(0);

      // Expect emit to fire once.
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.selectedLeafNodeIds).toEqual({ [1]: true });
      spy.calls.reset();

      // Click a different node.
      clickNode(1);

      // Expect emit to fire once.
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.selectedLeafNodeIds).toEqual({ [2]: true });
    });

    it('should maintain the tree state when selecting a node and selectSingle is true', () => {
      setupSingleSelectMode();
      fixture.detectChanges();
      const expectedExpandedNodeIds = {
        1: true,
        3: true,
      };
      const expectedActiveNodeIds = {};

      // Click the first node.
      clickNode(0);

      // Expect selected and focused to be updated, and the rest to remain the same.
      expect(component.selectedLeafNodeIds).toEqual({ [1]: true });
      expect(component.focusedNodeId).toEqual(1);
      expect(component.expandedNodeIds).toEqual(expectedExpandedNodeIds);
      expect(component.activeNodeIds).toEqual(expectedActiveNodeIds);

      // Click a different node.
      clickNode(1);

      // Expect selected and focused to be updated, and the rest to remain the same.
      expect(component.selectedLeafNodeIds).toEqual({ [2]: true });
      expect(component.focusedNodeId).toEqual(2);
      expect(component.expandedNodeIds).toEqual(expectedExpandedNodeIds);
      expect(component.activeNodeIds).toEqual(expectedActiveNodeIds);
    });

    it('should allow user to deselect node when selectSingle is true', () => {
      setupSingleSelectMode();
      fixture.detectChanges();
      const spy = spyOn(component, 'onStateChange').and.callThrough();

      // Click the first node.
      clickNode(0);

      // Expect emit to fire once and selected/focused to be updated.
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.selectedLeafNodeIds).toEqual({ [1]: true });
      expect(component.focusedNodeId).toEqual(1);
      spy.calls.reset();

      // Click the same node.
      clickNode(0);

      // Expect emit to fire once and selected/focused to be updated.
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.selectedLeafNodeIds).toEqual({ [1]: false });
      expect(component.focusedNodeId).toEqual(1);
    });

    it('should retain focus when select all is clicked', fakeAsync(() => {
      setupCascadingMode();
      fixture.detectChanges();
      const expectedFocusedNode =
        component.treeComponent.treeModel.getFocusedNode();

      clickSelectAll();
      const actualFocusedNode =
        component.treeComponent.treeModel.getFocusedNode();

      expect(actualFocusedNode).toEqual(expectedFocusedNode);

      fixture.destroy();
      flush();
    }));

    it('should retain focus when clear all is clicked', fakeAsync(() => {
      setupCascadingMode();
      fixture.detectChanges();
      const expectedFocusedNode =
        component.treeComponent.treeModel.getFocusedNode();

      clickClearAll();
      const actualFocusedNode =
        component.treeComponent.treeModel.getFocusedNode();

      expect(actualFocusedNode).toEqual(expectedFocusedNode);

      fixture.destroy();
      flush();
    }));
  });

  describe('keyboard navigation', () => {
    it('should initialize with only the first node being tabbable', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      expect(nodes[0].tabIndex).toEqual(0);
      expect(nodes[1].tabIndex).toEqual(-1);
      expect(nodes[2].tabIndex).toEqual(-1);
      expect(nodes[3].tabIndex).toEqual(-1);
      expect(nodes[4].tabIndex).toEqual(-1);
    });

    it('should register focus properties with TreeModel when a node is given focus', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      expect(component.treeComponent.treeModel.isFocused).toEqual(false);
      expect(component.treeComponent.treeModel.focusedNodeId).toBeNull();

      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');

      expect(component.treeComponent.treeModel.isFocused).toEqual(true);
      expect(component.treeComponent.treeModel.focusedNodeId).toEqual(1);
    });

    it('should only fire the onStateChange event once when a node is given focus', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();
      const spy = spyOn(component, 'onStateChange').and.callThrough();

      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should only fire the onStateChange event once when a node is clicked', () => {
      fixture.detectChanges();
      const spy = spyOn(component, 'onStateChange').and.callThrough();

      clickNode(0);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should only fire the onStateChange event once when a node is triggered with the mousedown/mouseup events', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();
      const spy = spyOn(component, 'onStateChange').and.callThrough();

      // Simulate mouse click events in order: mousedown > focus > mouseup > click.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'mousedown');
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      fixture.detectChanges();
      SkyAppTestUtility.fireDomEvent(nodes[0], 'mouseup');
      fixture.detectChanges();
      clickNode(0); // Note: click bubbles down to <tree-node-content>.
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should give the focused node a tabIndex of 0, and the rest a tabIndex of -1', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      SkyAppTestUtility.fireDomEvent(nodes[1], 'focus');

      expect(nodes[0].tabIndex).toEqual(-1);
      expect(nodes[1].tabIndex).toEqual(0);
      expect(nodes[2].tabIndex).toEqual(-1);
      expect(nodes[3].tabIndex).toEqual(-1);
      expect(nodes[4].tabIndex).toEqual(-1);

      SkyAppTestUtility.fireDomEvent(nodes[4], 'focus');

      expect(nodes[0].tabIndex).toEqual(-1);
      expect(nodes[1].tabIndex).toEqual(-1);
      expect(nodes[2].tabIndex).toEqual(-1);
      expect(nodes[3].tabIndex).toEqual(-1);
      expect(nodes[4].tabIndex).toEqual(0);
    });

    it('should toggle active state with the enter key when useCheckbox is false', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      // Expect nothing to be active.
      expect(component.activeNodeIds).toEqual({});

      // Press "Enter" on first node.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      keyDownOnElement(nodes[0], 'Enter', 13);

      // Expect first node to be active, and nothing to be selected.
      expect(Object.keys(component.activeNodeIds)).toEqual(['1']);
      expect(component.activeNodeIds[1]).toEqual(true);
      expect(component.selectedLeafNodeIds).toEqual({});

      // Press "Enter" again.
      keyDownOnElement(nodes[0], 'Enter', 13);

      // Expect node to be un-activated.
      expect(Object.keys(component.activeNodeIds)).toEqual([]);
      expect(component.activeNodeIds[1]).not.toBeDefined();
      expect(component.selectedLeafNodeIds).toEqual({});
    });

    it('should toggle active state with the space key when useCheckbox is false', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      // Expect nothing to be active.
      expect(component.activeNodeIds).toEqual({});

      // Press "Space" on first node.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      keyDownOnElement(nodes[0], 'Space', 32);

      // Expect first node to be active, and nothing to be selected.
      expect(Object.keys(component.activeNodeIds)).toEqual(['1']);
      expect(component.activeNodeIds[1]).toEqual(true);
      expect(component.selectedLeafNodeIds).toEqual({});

      // Press "Space" again.
      keyDownOnElement(nodes[0], 'Space', 32);

      // Expect node to be un-activated.
      expect(Object.keys(component.activeNodeIds)).toEqual([]);
      expect(component.activeNodeIds[1]).not.toBeDefined();
      expect(component.selectedLeafNodeIds).toEqual({});
    });

    it('should toggle select with the enter key when useCheckbox is true', () => {
      setupCascadingMode();
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      // Expect nothing to be selected.
      expectNodeToBeSelected(4, false);

      // Press "Enter" on node.
      SkyAppTestUtility.fireDomEvent(nodes[3], 'focus');
      keyDownOnElement(nodes[3], 'Enter', 13);

      // Expect node to be selected.
      expectNodeToBeSelected(4, true);

      // Press "Enter" again.
      keyDownOnElement(nodes[3], 'Enter', 13);

      // Expect node to be de-selected.
      expectNodeToBeSelected(4, false);
    });

    it('should toggle select with the space key when useCheckbox is true', () => {
      setupCascadingMode();
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      // Expect nothing to be selected.
      expectNodeToBeSelected(4, false);

      // Press "Space" on node.
      SkyAppTestUtility.fireDomEvent(nodes[3], 'focus');
      keyDownOnElement(nodes[3], 'Space', 32);

      // Expect node to be selected.
      expectNodeToBeSelected(4, true);

      // Press "Space" again.
      keyDownOnElement(nodes[3], 'Space', 32);

      // Expect node to be de-selected.
      expectNodeToBeSelected(4, false);
    });

    it('should disable tabbing for all node children', fakeAsync(() => {
      component.showContextMenus = true;
      fixture.detectChanges();
      tick(1000); // Allow angular-tree-node-component to set tabindexes & render context dropdown.
      const dropdownButtons = document.querySelectorAll(
        '.sky-dropdown-button'
      ) as NodeListOf<HTMLButtonElement>;

      expect(dropdownButtons[0].tabIndex).toEqual(-1);
      expect(dropdownButtons[1].tabIndex).toEqual(-1);
      expect(dropdownButtons[2].tabIndex).toEqual(-1);
      expect(dropdownButtons[3].tabIndex).toEqual(-1);
      expect(dropdownButtons[4].tabIndex).toEqual(-1);

      fixture.destroy();
      flush();
    }));

    it('should move between focusable children elements with Left/Right keys', fakeAsync(() => {
      setupCascadingMode();
      component.showContextMenus = true;
      fixture.detectChanges();
      tick(1000); // Allow angular-tree-node-component to set tabindexes & render context dropdown.
      const dropdownButtons = document.querySelectorAll(
        '.sky-dropdown-button'
      ) as NodeListOf<HTMLButtonElement>;
      const checkboxInputs = getCheckboxInputs();
      const nodes = getNodeContentWrappers();

      // Press right arrow key on first node.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      keyDownOnElement(nodes[0], 'Right', 39);

      // Expect first child element to be selected (checkbox).
      expect(document.activeElement).toEqual(checkboxInputs[0]);

      // Press right arrow key on first node.
      keyDownOnElement(checkboxInputs[0], 'Right', 39);

      // Expect second child element to be selected (dropdown menu).
      expect(document.activeElement).toEqual(dropdownButtons[0]);

      // Press left arrow key.
      keyDownOnElement(dropdownButtons[0], 'Left', 37);

      // Active focus should move back to first child element (checkbox).
      expect(document.activeElement).toEqual(checkboxInputs[0]);

      // Press left arrow key.
      keyDownOnElement(checkboxInputs[0], 'Left', 37);

      // Active focus should move back to first node.
      expect(document.activeElement).toEqual(nodes[0]);

      fixture.destroy();
      flush();
    }));

    it('should move between focusable children elements with ArrowLeft/ArrowRight keys', fakeAsync(() => {
      setupCascadingMode();
      component.showContextMenus = true;
      fixture.detectChanges();
      tick(1000); // Allow angular-tree-node-component to set tabindexes & render context dropdown.
      const dropdownButtons = document.querySelectorAll(
        '.sky-dropdown-button'
      ) as NodeListOf<HTMLButtonElement>;
      const checkboxInputs = getCheckboxInputs();
      const nodes = getNodeContentWrappers();

      // Press right arrow key on first node.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      keyDownOnElement(nodes[0], 'ArrowRight', 39);

      // Expect first child element to be selected (checkbox).
      expect(document.activeElement).toEqual(checkboxInputs[0]);

      // Press right arrow key on first node.
      keyDownOnElement(checkboxInputs[0], 'ArrowRight', 39);

      // Expect second child element to be selected (dropdown menu).
      expect(document.activeElement).toEqual(dropdownButtons[0]);

      // Press left arrow key.
      keyDownOnElement(dropdownButtons[0], 'ArrowLeft', 37);

      // Active focus should move back to first child element (checkbox).
      expect(document.activeElement).toEqual(checkboxInputs[0]);

      // Press left arrow key.
      keyDownOnElement(checkboxInputs[0], 'ArrowLeft', 37);

      // Active focus should move back to first node.
      expect(document.activeElement).toEqual(nodes[0]);

      fixture.destroy();
      flush();
    }));

    it('should expand nodes with left/right arrows', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000); // Allow angular-tree-node-component to set tabindexes & render context dropdown.
      const nodes = getNodeContentWrappers();

      // Expect tree to start with both parent nodes expanded.
      expect(Object.keys(component.expandedNodeIds)).toEqual(['1', '3']);
      expect(component.expandedNodeIds[1]).toEqual(true);
      expect(component.expandedNodeIds[3]).toEqual(true);

      // Press left arrow key on first node.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      keyDownOnElement(nodes[0], 'ArrowLeft', 37);

      // Expect first element to no longer be expanded.
      expect(Object.keys(component.expandedNodeIds)).toEqual(['1', '3']);
      expect(component.expandedNodeIds[1]).toEqual(false);
      expect(component.expandedNodeIds[3]).toEqual(true);

      // Press right arrow key on first node.
      keyDownOnElement(nodes[0], 'ArrowRight', 39);

      // Expect first element to no longer be expanded.
      expect(Object.keys(component.expandedNodeIds)).toEqual(['1', '3']);
      expect(component.expandedNodeIds[1]).toEqual(true);
      expect(component.expandedNodeIds[3]).toEqual(true);

      fixture.destroy();
      flush();
    }));

    it('should move between nodes with Up/Down keys', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      // Expect tree to start with nothing focused.
      expect(component.focusedNodeId).toBeNull();

      // Press down arrow twice.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      keyDownOnElement(nodes[0], 'Down', 40);
      keyDownOnElement(nodes[1], 'Down', 40);

      // Expect focus to be on third node.
      expect(component.focusedNodeId).toEqual(3);

      // Press up arrow key on third node.
      keyDownOnElement(nodes[2], 'Up', 38);

      // Expect focus to be on second element.
      expect(component.focusedNodeId).toEqual(2);
    });

    it('should move between nodes with ArrowUp/ArrowDown keys', () => {
      fixture.detectChanges();
      const nodes = getNodeContentWrappers();

      // Expect tree to start with nothing focused.
      expect(component.focusedNodeId).toBeNull();

      // Press down arrow twice.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      keyDownOnElement(nodes[0], 'ArrowDown', 40);
      keyDownOnElement(nodes[1], 'ArrowDown', 40);

      // Expect focus to be on third node.
      expect(component.focusedNodeId).toEqual(3);

      // Press up arrow key on third node.
      keyDownOnElement(nodes[2], 'ArrowUp', 38);

      // Expect focus to be on second element.
      expect(component.focusedNodeId).toEqual(2);
    });

    it('should not execute default node action when enter key is pressed on anything but the node wrapper', fakeAsync(() => {
      component.showContextMenus = true;
      setupNonCascadingMode();
      fixture.detectChanges();
      tick(1000); // Allow angular-tree-node-component to set tabindexes & render context dropdown.
      const dropdownButtons = document.querySelectorAll(
        '.sky-dropdown-button'
      ) as NodeListOf<HTMLButtonElement>;
      const nodes = getNodeContentWrappers();

      // Set focus on first dropdown.
      SkyAppTestUtility.fireDomEvent(nodes[0], 'focus');
      keyDownOnElement(nodes[0], 'ArrowRight', 39);
      keyDownOnElement(nodes[0], 'ArrowRight', 39);
      fixture.detectChanges();

      // Press "Enter" on node.
      keyDownOnElement(dropdownButtons[0], 'Enter', 13);
      fixture.detectChanges();
      tick();
      const dropdownMenu = document.querySelector('.sky-dropdown-menu');
      const dropdownItems = document.querySelectorAll(
        '.sky-dropdown-item'
      ) as NodeListOf<HTMLElement>;

      // Expect node NOT to be selected.
      expectNodeToBeSelected(1, false);
      expect(dropdownMenu).not.toBeNull();

      // Press "Enter" on a menu item.
      SkyAppTestUtility.fireDomEvent(dropdownItems[0], 'focus');
      keyDownOnElement(dropdownItems[0], 'Enter', 13);

      // Expect node NOT to be selected.
      expectNodeToBeSelected(1, false);

      fixture.destroy();
      flush();
    }));

    it('should not execute default action when arrow keys are pressed on anything but the node wrapper', fakeAsync(() => {
      component.showContextMenus = true;
      setupNonCascadingMode();
      fixture.detectChanges();
      tick(1000); // Allow angular-tree-node-component to set tabindexes & render context dropdown.
      const dropdownButtons = document.querySelectorAll(
        '.sky-dropdown-button'
      ) as NodeListOf<HTMLButtonElement>;
      const nodes = getNodeContentWrappers();

      // Open fourth dropdown with arrow keys.
      SkyAppTestUtility.fireDomEvent(nodes[3], 'focus');
      keyDownOnElement(nodes[3], 'ArrowRight', 39);
      keyDownOnElement(nodes[3], 'ArrowRight', 39);
      keyDownOnElement(dropdownButtons[3], 'ArrowDown', 40);
      fixture.detectChanges();
      tick();

      // Expect fourth node to still be focused.
      expect(component.focusedNodeId).toEqual(4);

      // Navigate down context menu with arrow keys.
      const dropdownItems = document.querySelectorAll(
        '.sky-dropdown-item'
      ) as NodeListOf<HTMLElement>;
      keyDownOnElement(dropdownItems[0], 'ArrowDown', 40);

      // Expect fourth node to still be focused.
      expect(component.focusedNodeId).toEqual(4);

      // Navigate up context menu with arrow keys.
      keyDownOnElement(dropdownItems[0], 'ArrowUp', 38);

      // Expect fourth node to still be focused.
      expect(component.focusedNodeId).toEqual(4);

      fixture.destroy();
      flush();
    }));
  });

  describe('accessibility', () => {
    it('should have role="tree" on tree wrapper', () => {
      fixture.detectChanges();
      const tree = getTreeWrapper();

      expect(tree.getAttribute('role')).toEqual('tree');
    });

    it('should have role="treeitem" for each content wrapper', () => {
      fixture.detectChanges();
      const nodes = document.querySelectorAll('.node-content-wrapper');

      const nodeList: Array<Element> = Array.prototype.slice.call(nodes);
      nodeList.forEach((node) => {
        expect(node.getAttribute('role')).toEqual('treeitem');
      });
    });

    it('should have role="group" for each element that contains children', () => {
      fixture.detectChanges();
      const childrenWrappers = document.querySelectorAll('tree-node-children');

      const wrappersList: Array<Element> =
        Array.prototype.slice.call(childrenWrappers);
      wrappersList.forEach((wrapper) => {
        expect(wrapper.getAttribute('role')).toEqual('group');
      });
    });

    it('should have proper aria-expanded attributes for elements that contains children', () => {
      fixture.detectChanges();
      const buttons = getToggleChildrenButtons();
      const nodes = document.querySelectorAll('.node-content-wrapper');

      expect(nodes[0].getAttribute('aria-expanded')).toEqual('true');
      expect(nodes[1].getAttribute('aria-expanded')).toBeNull();
      expect(nodes[2].getAttribute('aria-expanded')).toEqual('true');
      expect(nodes[3].getAttribute('aria-expanded')).toBeNull();
      expect(nodes[4].getAttribute('aria-expanded')).toBeNull();

      buttons[0].click();
      expect(nodes[0].getAttribute('aria-expanded')).toEqual('false');
      expect(nodes[1].getAttribute('aria-expanded')).toBeNull();
      expect(nodes[2].getAttribute('aria-expanded')).toEqual('true');
      expect(nodes[3].getAttribute('aria-expanded')).toBeNull();
      expect(nodes[4].getAttribute('aria-expanded')).toBeNull();
    });

    it('should set aria-current to true for the active node and undefined for all other nodes', () => {
      fixture.detectChanges();
      const nodes = document.querySelectorAll('.node-content-wrapper');

      expect(nodes[0].getAttribute('aria-current')).toBeNull();
      expect(nodes[1].getAttribute('aria-current')).toBeNull();
      expect(nodes[2].getAttribute('aria-current')).toBeNull();
      expect(nodes[3].getAttribute('aria-current')).toBeNull();
      expect(nodes[4].getAttribute('aria-current')).toBeNull();

      clickNode(0);
      fixture.detectChanges();
      expect(nodes[0].getAttribute('aria-current')).toEqual('true');
      expect(nodes[1].getAttribute('aria-current')).toBeNull();
      expect(nodes[2].getAttribute('aria-current')).toBeNull();
      expect(nodes[3].getAttribute('aria-current')).toBeNull();
      expect(nodes[4].getAttribute('aria-current')).toBeNull();
    });

    it('should not set aria-multiselectable when checkboxes are disabled', () => {
      fixture.detectChanges();
      const tree = getTreeWrapper();

      expect(tree.getAttribute('aria-multiselectable')).toBeNull();
    });

    it('should set aria-multiselectable to false when in single-select mode', () => {
      setupSingleSelectMode();
      fixture.detectChanges();
      const tree = getTreeWrapper();

      expect(tree.getAttribute('aria-multiselectable')).toEqual('false');
    });

    it('should set aria-multiselectable to true when in mult-select mode', () => {
      setupCascadingMode();
      fixture.detectChanges();
      const tree = getTreeWrapper();

      expect(tree.getAttribute('aria-multiselectable')).toEqual('true');
    });

    it('should set aria-selected to true for the selected node and undefined for all other nodes when in single-select mode', () => {
      setupSingleSelectMode();
      fixture.detectChanges();
      const nodes = document.querySelectorAll('.node-content-wrapper');

      expect(nodes[0].getAttribute('aria-selected')).toBeNull();
      expect(nodes[1].getAttribute('aria-selected')).toBeNull();
      expect(nodes[2].getAttribute('aria-selected')).toBeNull();
      expect(nodes[3].getAttribute('aria-selected')).toBeNull();
      expect(nodes[4].getAttribute('aria-selected')).toBeNull();

      clickNode(0);
      expect(nodes[0].getAttribute('aria-selected')).toEqual('true');
      expect(nodes[1].getAttribute('aria-selected')).toBeNull();
      expect(nodes[2].getAttribute('aria-selected')).toBeNull();
      expect(nodes[3].getAttribute('aria-selected')).toBeNull();
      expect(nodes[4].getAttribute('aria-selected')).toBeNull();
    });

    it('should not have aria-selected attributes on parent nodes when in leaf-select-only mode', () => {
      setupLeafSelectOnlyMode();
      fixture.detectChanges();
      const nodes = document.querySelectorAll('.node-content-wrapper');

      expect(nodes[0].getAttribute('aria-selected')).toBeNull();
      expect(nodes[1].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[2].getAttribute('aria-selected')).toBeNull();
      expect(nodes[3].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[4].getAttribute('aria-selected')).toEqual('false');

      clickNode(1);
      expect(nodes[0].getAttribute('aria-selected')).toBeNull();
      expect(nodes[1].getAttribute('aria-selected')).toEqual('true');
      expect(nodes[2].getAttribute('aria-selected')).toBeNull();
      expect(nodes[3].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[4].getAttribute('aria-selected')).toEqual('false');
    });

    it('should set aria-selected to true for the selected node and undefined for all other nodes when in multi-select mode', () => {
      setupNonCascadingMode();
      fixture.detectChanges();
      const nodes = document.querySelectorAll('.node-content-wrapper');

      expect(nodes[0].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[1].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[2].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[3].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[4].getAttribute('aria-selected')).toEqual('false');

      clickNode(0);
      clickNode(2);
      expect(nodes[0].getAttribute('aria-selected')).toEqual('true');
      expect(nodes[1].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[2].getAttribute('aria-selected')).toEqual('true');
      expect(nodes[3].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[4].getAttribute('aria-selected')).toEqual('false');
    });

    it('should set aria-selected to true for the selected node and undefined for all other nodes when in multi-select mode', () => {
      setupCascadingMode();
      fixture.detectChanges();
      const nodes = document.querySelectorAll('.node-content-wrapper');

      expect(nodes[0].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[1].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[2].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[3].getAttribute('aria-selected')).toEqual('false');
      expect(nodes[4].getAttribute('aria-selected')).toEqual('false');

      clickNode(0);
      expect(nodes[0].getAttribute('aria-selected')).toEqual('true');
      expect(nodes[1].getAttribute('aria-selected')).toEqual('true');
      expect(nodes[2].getAttribute('aria-selected')).toEqual('true');
      expect(nodes[3].getAttribute('aria-selected')).toEqual('true');
      expect(nodes[4].getAttribute('aria-selected')).toEqual('true');
    });

    it('should pass accessibility in basic setup', async () => {
      fixture.detectChanges();
      await fixture.whenStable().then(async () => {
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });

    it('should pass accessibility in multi-select mode', async () => {
      setupCascadingMode();
      fixture.detectChanges();
      await fixture.whenStable().then(async () => {
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });

    it('should pass accessibility in single-select mode', async () => {
      setupSingleSelectMode();
      fixture.detectChanges();
      await fixture.whenStable().then(async () => {
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });

    it('should pass accessibility in leaf-select-only mode', async () => {
      setupLeafSelectOnlyMode();
      fixture.detectChanges();
      await fixture.whenStable().then(async () => {
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });
  });
});
