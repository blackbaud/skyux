import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TreeModule } from '@blackbaud/angular-tree-component';
import { SkyAngularTreeModule } from '@skyux/angular-tree-component';
import { SkyHelpInlineModule } from '@skyux/help-inline';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyAngularTreeModule, SkyHelpInlineModule, TreeModule],
})
export class DemoComponent {
  protected nodes = [
    {
      name: 'Animals',
      isExpanded: true,
      helpPopoverContent: 'Example help content for animals.',
      children: [
        {
          name: 'Cats',
          isExpanded: true,
          helpPopoverContent: 'Example help content for cats.',
          helpPopoverTitle: 'What is a cat?',
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
            {
              name: 'Beagle',
              helpPopoverContent: 'Example help content for beagles.',
            },
            { name: 'German shepherd' },
            { name: 'Labrador retriever' },
          ],
        },
      ],
    },
  ];
}
