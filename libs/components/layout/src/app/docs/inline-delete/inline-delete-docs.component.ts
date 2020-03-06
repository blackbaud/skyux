import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-inline-delete-docs',
  styleUrls: ['./inline-delete-docs.component.scss'],
  templateUrl: './inline-delete-docs.component.html'
})
export class InlineDeleteDocsComponent {

  public originalRepeaterDemoItems: any = [
    {
      title: 'Individual',
      cost: '$75.00',
      description: '1 ticket'
    },
    {
      title: 'Foursome',
      cost: '$250.00',
      description: '4 tickets'
    },
    {
      title: 'Hole sponsor',
      cost: '$1,000.00',
      description: '8 tickets'
    }
  ];

  public repeaterDemoItems: any = this.originalRepeaterDemoItems;

  public repeaterDemoShownInlineDeletes: string[] = [];

  public showInlineDelete(title: string) {
    this.repeaterDemoShownInlineDeletes.push(title);
  }

  public deleteItem(title: string) {
    this.repeaterDemoItems = this.repeaterDemoItems.filter((demoItem: any) => demoItem.title !== title);
    this.repeaterDemoShownInlineDeletes = this.repeaterDemoShownInlineDeletes.filter((demoItem: any) => demoItem !== title);
  }

  public cancelDeletion(title: string) {
    this.repeaterDemoShownInlineDeletes = this.repeaterDemoShownInlineDeletes.filter((demoItem: any) => demoItem !== title);
  }

  public onResetClick() {
    this.repeaterDemoItems = this.originalRepeaterDemoItems;
    this.repeaterDemoShownInlineDeletes = [];
  }

}
