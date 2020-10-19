import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  ListState,
  ListStateDispatcher
} from '@skyux/list-builder';

const dispatcher = new ListStateDispatcher();

const state = new ListState(dispatcher);

@Component({
  selector: 'app-list-toolbar-docs',
  templateUrl: './list-toolbar-docs.component.html',
  providers: [
    {
      provide: ListState,
      useValue: state
    },
    {
      provide: ListStateDispatcher,
      useValue: dispatcher
    }
  ]
})
export class ListToolbarDocsComponent implements OnInit {

  public data: any[] = [];

  public myForm: FormGroup;

  public views: any[] = [
    { icon: 'table', label: 'Table', name: 'table' },
    { icon: 'list', label: 'List', name: 'list' },
    { icon: 'th-large', label: 'Cards', name: 'cards' },
    { icon: 'map-marker', label: 'Map', name: 'map' }
  ];

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      myView: this.views[0].name
    });
  }

}
