import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'stache-layout',
  templateUrl: './layout.component.html'
})
export class StacheLayoutComponent implements OnInit {
  @Input()
  public pageTitle: string;

  @Input()
  public type: string = 'default';

  @Input()
  public routes: any[];

  @Input()
  public inPageRoutes: any[];

  public templateRef;

  @ViewChild('default')
  private defaultTemplateRef;

  @ViewChild('sidebar')
  private sidebarTemplateRef;

  @ViewChild('document')
  private documentTemplateRef;

  public ngOnInit(): void {
    switch (this.type) {
      case 'sidebar':
        this.templateRef = this.sidebarTemplateRef;
        break;
      case 'document':
        this.templateRef = this.documentTemplateRef;
        break;
      default:
        this.templateRef = this.defaultTemplateRef;
        break;
    }
  }
}
