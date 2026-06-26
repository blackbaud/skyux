import { Component, Input } from '@angular/core';
import { ITreeOptions } from '@blackbaud/angular-tree-component';

@Component({
  selector: 'app-angular-tree-component',
  templateUrl: './angular-tree-component.component.html',
  styleUrls: ['./angular-tree-component.component.scss'],
  standalone: false,
})
export class AngularTreeComponentComponent {
  @Input()
  public showModes = false;

  @Input()
  public set useCheckbox(flag: boolean) {
    this.basicOptions.useCheckbox = flag;
  }

  @Input()
  public set allowCascading(flag: boolean) {
    this.basicOptions.useTriState = flag;
  }

  @Input()
  public singleSelectFlag = false;

  public basicOptions: ITreeOptions = {
    animateExpand: true,
  };

  public selectionOptions: ITreeOptions = {
    animateExpand: true,
    useCheckbox: true,
  };

  public modeNodes: any[] = [
    {
      if: 1,
      name: 'United States',
      isExpanded: true,
      showHelp: true,
      children: [{ id: 2, name: 'Alabama' }],
    },
  ];

  public nodes: any[] = [
    {
      id: 1,
      name: 'United States',
      isExpanded: true,
      showHelp: true,
      children: [
        { id: 2, name: 'Alabama' },
        { id: 3, name: 'California' },
        {
          id: 4,
          name: 'Indiana',
          isExpanded: false,
          children: [
            { id: 5, name: 'Adams' },
            { id: 6, name: 'Allen' },
            { id: 7, name: 'Bartholomew' },
          ],
        },
        { id: 13, name: 'Florida' },
      ],
    },
    {
      id: 12,
      name: 'Mexico',
      showHelp: true,
      isExpanded: true,
      children: [],
    },
    {
      id: 8,
      name: 'Canada',
      isExpanded: false,
      children: [
        { id: 9, name: 'Alberta' },
        { id: 10, name: 'British Columbia' },
        { id: 11, name: 'Manitoba' },
      ],
    },
    {
      id: 14,
      name: 'Argentina',
      isExpanded: true,
      children: [],
    },
  ];
}
