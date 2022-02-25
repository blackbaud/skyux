import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {
  ITreeOptions,
  ITreeState,
  TreeModel,
  TreeNode,
} from '@circlon/angular-tree-component';

@Component({
  selector: 'app-angular-tree-component-demo',
  styles: [
    `
      .app-demo-container {
        border: 1px solid #cdcfd2;
        padding: 20px;

        .angular-tree-component {
          background: #fff;
        }
      }
    `,
  ],
  templateUrl: './angular-tree-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularTreeDemoComponent implements OnInit {
  public demoOptions: FormGroup;

  public set enableCascading(value: boolean) {
    this.resetSelection();
    this.treeOptions.useTriState = value;
    this._enableCascading = value;

    if (value) {
      this.selectLeafNodesOnly = false;
    }
  }

  public get enableCascading(): boolean {
    return this._enableCascading;
  }

  public readOnly: boolean = false;

  public selectedSelectMode: string = 'multiSelect';

  public set selectLeafNodesOnly(value: boolean) {
    this.resetSelection();
    this._selectLeafNodesOnly = value;

    if (value) {
      this.enableCascading = false;
    }
  }

  public get selectLeafNodesOnly(): boolean {
    return this._selectLeafNodesOnly;
  }

  public selectSingle: boolean = false;

  public showContextMenus: boolean = false;

  public showToolbar: boolean = false;

  private _enableCascading = false;

  private _selectLeafNodesOnly = false;

  public treeOptions: ITreeOptions = {
    animateExpand: true,
    useTriState: false,
  };

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

  public nodes: any[] = [
    {
      name: 'Animals',
      isExpanded: true,
      children: [
        {
          name: 'Cats',
          isExpanded: true,
          children: [
            { name: 'Burmese' },
            { name: 'Persian' },
            { name: 'Tabby' },
          ],
        },
        {
          name: 'Dogs',
          isExpanded: true,
          children: [
            { name: 'Beagle' },
            { name: 'German shepherd' },
            { name: 'Labrador retriever' },
          ],
        },
      ],
    },
  ];

  @ViewChild(TreeModel)
  private tree: TreeModel;

  constructor(
    private changeRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.demoOptions = this.formBuilder.group({
      treeMode: new FormControl('navigation'),
      selectMode: new FormControl('multiSelect'),
      selectLeafNodesOnly: new FormControl(),
      enableCascading: new FormControl(),
      showToolbar: new FormControl(),
      showContextMenus: new FormControl(),
    });

    this.demoOptions.valueChanges.subscribe((value) => {
      if (value.treeMode) {
        switch (value.treeMode) {
          case 'selection':
            this.readOnly = false;
            this.enableSelection(true);
            break;

          case 'readOnly':
            this.readOnly = true;
            this.enableSelection(false);
            break;

          case 'navigation':
            this.readOnly = false;
            this.enableSelection(false);
            break;

          default:
            break;
        }
      }

      if (value.selectMode) {
        switch (value.selectMode) {
          case 'singleSelect':
            this.resetSelection();
            this.selectSingle = true;
            this.enableCascading = false;
            break;

          case 'multiSelect':
            this.resetSelection();
            this.selectSingle = false;
            this.enableCascading = false;
            break;

          default:
            break;
        }
      }

      if (!!value.enableCascading) {
        this.enableCascading = value.enableCascading;
      }

      if (!!value.selectLeafNodesOnly) {
        this.selectLeafNodesOnly = value.selectLeafNodesOnly;
      }

      this.changeRef.markForCheck();
    });
  }

  public actionClicked(name: string, node: TreeNode): void {
    // Add custom actions here.
    console.log(name + `: "${node.data.name}"`);
  }

  public onTreeStateChange(treeModel: ITreeState): void {
    // Watch for tree state changes here.
    console.log(treeModel);
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
