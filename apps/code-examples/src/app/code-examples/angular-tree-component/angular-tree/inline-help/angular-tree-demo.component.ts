import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-angular-tree-component-demo',
  styleUrls: ['./angular-tree-demo.component.scss'],
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

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
