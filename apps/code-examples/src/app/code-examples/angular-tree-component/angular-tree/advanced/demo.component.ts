import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  ITreeOptions,
  ITreeState,
  TreeModel,
  TreeModule,
  TreeNode,
} from '@blackbaud/angular-tree-component';
import { SkyAngularTreeModule } from '@skyux/angular-tree-component';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';
import { SkyFluidGridModule, SkyFormatModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

import { Subject, takeUntil } from 'rxjs';

import { AngularTreeDemoNode } from './node';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAngularTreeModule,
    SkyCheckboxModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyFormatModule,
    SkyRadioModule,
    TreeModule,
  ],
})
export class DemoComponent implements OnInit, OnDestroy {
  protected set enableCascading(value: boolean) {
    this.#resetSelection();
    this.treeOptions.useTriState = value;
    this.#_enableCascading = value;

    if (value) {
      this.selectLeafNodesOnly = false;
    }
  }

  protected get enableCascading(): boolean {
    return this.#_enableCascading;
  }

  protected set selectLeafNodesOnly(value: boolean) {
    this.#resetSelection();
    this.#_selectLeafNodesOnly = value;

    if (value) {
      this.enableCascading = false;
    }
  }

  protected get selectLeafNodesOnly(): boolean {
    return this.#_selectLeafNodesOnly;
  }

  protected formGroup: FormGroup;

  protected dropdownItems: { name: string; disabled: boolean }[] = [
    {
      name: 'Insert an item adjacent to {0}',
      disabled: false,
    },
    { name: 'Insert an item under {0}', disabled: false },
    { name: 'Move up {0}', disabled: false },
    { name: 'Move down {0}', disabled: false },
    { name: 'Move left {0}', disabled: false },
    { name: 'Move right {0}', disabled: false },
    { name: 'Edit {0}', disabled: false },
    { name: 'Delete {0}', disabled: false },
  ];

  protected nodes: AngularTreeDemoNode[] = [
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

  protected readOnly = false;
  protected selectSingle = false;
  protected treeOptions: ITreeOptions = {
    animateExpand: true,
    useTriState: false,
  };

  @ViewChild(TreeModel)
  private tree: TreeModel | undefined;

  #_enableCascading = false;
  #_selectLeafNodesOnly = false;

  #ngUnsubscribe = new Subject<void>();

  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      treeMode: new FormControl('navigation'),
      selectMode: new FormControl('multiSelect'),
      selectLeafNodesOnly: new FormControl(),
      enableCascading: new FormControl(),
      showToolbar: new FormControl(),
      showContextMenus: new FormControl(),
    });
  }

  public ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((value) => {
        if (value.treeMode) {
          switch (value.treeMode) {
            case 'selection':
              this.readOnly = false;
              this.#enableSelection(true);
              break;

            case 'readOnly':
              this.readOnly = true;
              this.#enableSelection(false);
              break;

            case 'navigation':
              this.readOnly = false;
              this.#enableSelection(false);
              break;

            default:
              break;
          }
        }

        if (value.selectMode) {
          switch (value.selectMode) {
            case 'singleSelect':
              this.#resetSelection();
              this.selectSingle = true;
              this.enableCascading = false;
              break;

            case 'multiSelect':
              this.#resetSelection();
              this.selectSingle = false;
              this.enableCascading = false;
              break;

            default:
              break;
          }
        }

        if (value.enableCascading) {
          this.enableCascading = value.enableCascading;
        }

        if (value.selectLeafNodesOnly) {
          this.selectLeafNodesOnly = value.selectLeafNodesOnly;
        }

        this.#changeDetectorRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  protected actionClicked(name: string, node: TreeNode): void {
    // Add custom actions here.
    alert(name.replace('{0}', node.data.name) + ' clicked!');
  }

  protected onTreeStateChange(treeModel: ITreeState): void {
    // Watch for tree state changes here.
    console.log(treeModel);
  }

  #enableSelection(value: boolean): void {
    this.#resetSelection();
    this.treeOptions.useCheckbox = value;
    this.selectLeafNodesOnly = false;
    this.enableCascading = false;
  }

  #resetSelection(): void {
    if (this.tree) {
      this.tree.selectedLeafNodeIds = {};
      this.tree.activeNodeIds = {};
    }
  }
}
