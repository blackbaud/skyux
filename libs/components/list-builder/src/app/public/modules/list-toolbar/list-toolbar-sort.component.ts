import { Component, Input } from '@angular/core';

 @Component({
  selector: 'sky-list-toolbar-sort',
   template: ''
 })
 export class SkyListToolbarSortComponent {
  @Input()
  public label: string;
  @Input()
  public field: string;
  @Input()
  public type: string;
  @Input()
  public descending: boolean;

 }
