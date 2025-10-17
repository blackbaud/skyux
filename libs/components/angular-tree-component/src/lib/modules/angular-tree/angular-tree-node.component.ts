import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  ITreeState,
  TreeModule,
  TreeNode,
} from '@blackbaud/angular-tree-component';
import { SkyContentInfoProvider } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';

import { SkyAngularTreeAdapterService } from './angular-tree-adapter.service';
import { SkyAngularTreeContextMenuComponent } from './angular-tree-context-menu.component';
import { SkyAngularTreeWrapperComponent } from './angular-tree-wrapper.component';

/**
 * Replaces the default tree node template with a SKY UX node as part of the `SkyAngularTreeModule` that
 * provides SKY UX components and styles to complement the `angular-tree-component` library and apply SKY UX
 * themes and functionality to hierarchical list views. You must wrap this component in an `ng-template`
 * tag with the template reference variable `#treeNodeFullTemplate`. For information about tree node templates,
 * see the [Angular tree component documentation](https://angular2-tree.readme.io/docs/templates).
 * To display context menus with actions for individual items in hierarchical lists, place
 * [dropdowns](https://developer.blackbaud.com/skyux-popovers/docs/dropdown?docs-active-tab=design) inside the
 * Angular tree node component, which automatically handles styling and positioning for context menus.
 */
@Component({
  selector: 'sky-angular-tree-node',
  templateUrl: './angular-tree-node.component.html',
  providers: [SkyAngularTreeAdapterService, SkyContentInfoProvider],
  imports: [
    TreeModule,
    SkyAngularTreeContextMenuComponent,
    SkyCheckboxModule,
    SkyHelpInlineModule,
    SkyIconModule,
    NgTemplateOutlet,
  ],
})
export class SkyAngularTreeNodeComponent implements AfterViewInit, OnInit {
  /**
   * The `index` property from the parent `ng-template`.
   * @required
   */
  @Input()
  public index: number | undefined;

  /**
   * The `node` property from the parent `ng-template`. For information about the `TreeNode` object, see the
   * [Angular tree component documentation](https://angular2-tree.readme.io/docs/api).
   * @required
   */
  @Input()
  public node: TreeNode | undefined;

  /**
   * The `templates` property from the parent `ng-template`.
   */
  @Input()
  public templates: any;

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the tree node label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the tree node. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  public set childFocusIndex(value: number | undefined) {
    if (value !== this.#_childFocusIndex) {
      this.#_childFocusIndex = value;
      if (this.#focusableChildren.length > 0 && value !== undefined) {
        this.#focusableChildren[value].focus();
      } else {
        this.nodeContentWrapperRef?.nativeElement.focus();
      }
    }
  }

  public get childFocusIndex(): number | undefined {
    return this.#_childFocusIndex;
  }

  public set focused(value: boolean) {
    this.tabIndex = value ? 0 : -1;
    if (value) {
      this.nodeContentWrapperRef?.nativeElement.focus();
    }
  }

  public set isPartiallySelected(value: boolean) {
    if (value !== this.#_isPartiallySelected) {
      this.#_isPartiallySelected = value;
      this.#changeDetectorRef.markForCheck();
    }
  }

  public get isPartiallySelected(): boolean {
    return this.#_isPartiallySelected;
  }

  public set isSelected(value: boolean) {
    if (value !== this.#_isSelected) {
      this.#_isSelected = value;
      this.#changeDetectorRef.markForCheck();
    }
  }

  public get isSelected(): boolean {
    return this.#_isSelected;
  }

  public set tabIndex(value: number) {
    this.#_tabIndex = value;
  }

  public get tabIndex(): number {
    return this.#_tabIndex;
  }

  @ViewChild('nodeContentWrapper', { read: ElementRef })
  public nodeContentWrapperRef: ElementRef | undefined;

  protected set nodeName(value: string) {
    this.#_nodeName = value;
    this.#contentInfoProvider.patchInfo({
      descriptor: { type: 'text', value },
    });
  }

  protected get nodeName(): string {
    return this.#_nodeName;
  }

  #focusableChildren: HTMLElement[] = [];

  #mouseDown = false;

  #_childFocusIndex: number | undefined;

  #_isPartiallySelected = false;

  #_isSelected = false;

  #_tabIndex = -1;

  #_nodeName = '';

  readonly #adapterService = inject(SkyAngularTreeAdapterService);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #contentInfoProvider = inject(SkyContentInfoProvider);
  readonly #skyAngularTreeWrapper = inject(SkyAngularTreeWrapperComponent, {
    optional: true,
  });

  public ngOnInit(): void {
    if (!this.#skyAngularTreeWrapper) {
      console.error(
        `<sky-angular-tree-node-wrapper> must be wrapped inside a <sky-angular-tree-wrapper> component.`,
      );
    }

    if (this.node) {
      this.nodeName = this.node.data.name;
      // Because we're binding the checkbox to node's children properties, we need to manually control change detection.
      // Here, we listen to the tree's state and force change detection in the setters if the value has changed.
      this.node.treeModel.subscribeToState((state: ITreeState) => {
        if (this.node) {
          this.isSelected = this.node.isSelected;
          this.isPartiallySelected = this.node.isPartiallySelected;

          if (state.focusedNodeId) {
            this.focused = state.focusedNodeId === this.node.id;
          }
        }
      });

      this.node.treeModel.subscribe('updateData', () => {
        if (this.node) {
          this.nodeName = this.node.data.name;
        }
      });

      // Make the first root node tabbable.
      if (this.node.isRoot && this.node.index === 0) {
        this.tabIndex = 0;
      }
    }
  }

  public ngAfterViewInit(): void {
    // Wait 1s for the node to render, then reset all child tabIndexes to -1.
    // Units smaller than 1s may consistently fail if there are many nodes, or multiple trees are on the same screen.
    setTimeout(() => {
      if (this.nodeContentWrapperRef) {
        this.#focusableChildren = this.#adapterService.getFocusableChildren(
          this.nodeContentWrapperRef.nativeElement,
        );
        this.#adapterService.setTabIndexOfFocusableEls(
          this.nodeContentWrapperRef.nativeElement,
          -1,
        );
      }
    }, 1000);
  }

  /**
   * If single-select, set aria-selected=true for the selected node and undefined for all the others.
   * For multiple-select, set aria-selected to either true or false.
   * If node cannot be selected, aria-selected should be undefined (e.g. parent nodes in leaf-select-only mode).
   * @internal
   */
  public ariaSelected(): boolean | undefined {
    if (!this.#skyAngularTreeWrapper) {
      return;
    }

    if (this.#skyAngularTreeWrapper.selectSingle) {
      return this.isSelected ? true : undefined;
    }

    if (!this.#isSelectable()) {
      return;
    }

    return !!this.isSelected;
  }

  public showCheckbox(): boolean {
    // Check for checkbox mode enabled, but also respect leaf-node and single-select settings.
    return (
      !!this.node &&
      this.node.options.useCheckbox &&
      this.#isSelectable() &&
      (!this.#skyAngularTreeWrapper ||
        !this.#skyAngularTreeWrapper.selectSingle)
    );
  }

  public showSelectedClass(): boolean {
    return this.#isSelectable() && this.isSelected && !this.isPartiallySelected;
  }

  public showActiveClass(): boolean {
    return (
      !!this.node &&
      this.node.isActive &&
      !this.node.treeModel.options.useCheckbox
    );
  }

  public showTogglePlaceholder(): boolean {
    return (
      !this.node?.hasChildren &&
      !this.#skyAngularTreeWrapper?.selectLeafNodesOnly
    );
  }

  public onFocus(): void {
    // <tree-node-content> has its own click handler, so we need to check if this focus event
    // is coming from the mouse click or the keyboard to prevent the logic from running twice.
    if (!this.#mouseDown) {
      this.node?.treeModel.setFocus(true);
      this.node?.focus();
      this.childFocusIndex = undefined;
    }
  }

  public onMouseDown(): void {
    this.#mouseDown = true;
  }

  public onMouseUp(): void {
    this.#mouseDown = false;
  }

  public onKeyDown(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (document.activeElement === event.target) {
      const key = event.key.toLowerCase();
      switch (key) {
        case 'up':
        case 'arrowup':
          // Focus on previous node.
          this.node?.treeModel.focusPreviousNode();
          break;

        case 'down':
        case 'arrowdown':
          // Focus on next node.
          this.node?.treeModel.focusNextNode();
          break;

        case 'left':
        case 'arrowleft':
          // Cycle backwards through interactive child elements
          // If user reaches the beginning, activate drill up.
          /* istanbul ignore else */
          if (this.childFocusIndex !== undefined) {
            if (this.childFocusIndex === 0) {
              this.childFocusIndex = undefined;
            } else {
              this.childFocusIndex--;
            }
          } else {
            this.node?.setIsExpanded(false);
          }
          event.stopPropagation();
          event.preventDefault();
          break;

        case 'right':
        case 'arrowright':
          // Cycle forward through interactive child elements.
          // If user reaches the end, activate drill down.
          /* istanbul ignore else */
          if (
            this.#focusableChildren.length <= 0 ||
            this.childFocusIndex === this.#focusableChildren.length - 1
          ) {
            this.node?.setIsExpanded(true);
          } else {
            if (this.childFocusIndex === undefined) {
              this.childFocusIndex = 0;
            } else {
              this.childFocusIndex++;
            }
          }
          event.stopPropagation();
          event.preventDefault();
          break;

        default:
          break;
      }
    }
  }

  #isSelectable(): boolean {
    if (this.#skyAngularTreeWrapper) {
      return (
        !!this.node &&
        (this.node.isLeaf ||
          !this.node.hasChildren ||
          !this.#skyAngularTreeWrapper.selectLeafNodesOnly)
      );
    } else {
      return false;
    }
  }
}
