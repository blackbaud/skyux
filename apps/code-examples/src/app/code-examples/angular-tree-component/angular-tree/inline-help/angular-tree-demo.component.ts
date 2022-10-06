import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class AngularTreeDemoComponent {
  public nodes = [
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
}
