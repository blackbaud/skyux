import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'anchor-demo',
  templateUrl: './demo-anch.component.html'
})
export class StachePageAnchorTestComponent implements OnInit {
  public anchors = [
    {
      name: 'foo'
    },
    {
      name: 'bar'
    },
    {
      name: 'some route'
    }
  ];

  public changeable: string = 'Value One';

  public ngOnInit(): void {
    setTimeout(() => {
      this.changeable = 'different value';
    }, 2000);
  }
}
