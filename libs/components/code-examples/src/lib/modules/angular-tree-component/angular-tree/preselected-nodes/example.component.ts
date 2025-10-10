import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ITreeOptions,
  ITreeState,
  TreeModule,
} from '@blackbaud/angular-tree-component';
import { SkyAngularTreeModule } from '@skyux/angular-tree-component';
import { SkyHelpInlineModule } from '@skyux/help-inline';

/**
 * @title Tree view with pre selected nodes example
 */
@Component({
  selector: 'app-angular-tree-component-angular-tree-preselected-nodes-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyAngularTreeModule, SkyHelpInlineModule, TreeModule],
})
export class AngularTreeComponentAngularTreePreselectedNodesExampleComponent {
  protected nodes = [
    {
      id: 'animals-node',
      name: 'Animals',
      isExpanded: true,
      helpPopoverContent: 'Example help content for animals.',
      children: [
        {
          id: 'cat-node',
          name: 'Cats',
          isExpanded: true,
          helpPopoverContent: 'Example help content for cats.',
          helpPopoverTitle: 'What is a cat?',
          children: [
            { id: 'cat-burmese-node', name: 'Burmese' },
            { id: 'cat-persian-node', name: 'Persian' },
            { id: 'cat-tabby-node', name: 'Tabby' },
          ],
        },
        {
          id: 'dog-node',
          name: 'Dogs',
          isExpanded: true,
          children: [
            {
              id: 'dog-beagle-node',
              name: 'Beagle',
              helpPopoverContent: 'Example help content for beagles.',
            },
            { id: 'dog-german-shepherd-node', name: 'German shepherd' },
            { id: 'dog-labrador-retriever-node', name: 'Labrador retriever' },
          ],
        },
      ],
    },
  ];

  protected state: ITreeState = {
    selectedLeafNodeIds: {
      'dog-labrador-retriever-node': true,
      'cat-burmese-node': true,
      'cat-persian-node': true,
      'cat-tabby-node': true,
    },
  };

  protected options: ITreeOptions = {
    useCheckbox: true,
  };
}
