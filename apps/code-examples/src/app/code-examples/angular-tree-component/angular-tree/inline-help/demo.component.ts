import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TreeModule } from '@blackbaud/angular-tree-component';
import { SkyAngularTreeModule } from '@skyux/angular-tree-component';
import { SkyHelpInlineModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkyAngularTreeModule,
    SkyHelpInlineModule,
    TreeModule,
  ],
})
export class DemoComponent {
  protected nodes = [
    {
      name: 'Animals',
      isExpanded: true,
      showHelp: true,
      children: [
        {
          name: 'Cats',
          isExpanded: true,
          showHelp: true,
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
              showHelp: true,
            },
            { name: 'German shepherd' },
            { name: 'Labrador retriever' },
          ],
        },
      ],
    },
  ];

  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
