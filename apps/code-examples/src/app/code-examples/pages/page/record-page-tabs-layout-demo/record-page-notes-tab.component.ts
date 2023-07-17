import { Component } from '@angular/core';

@Component({
  selector: 'app-record-page-notes-tab',
  templateUrl: './record-page-notes-tab.component.html',
})
export class RecordPageNotesTabComponent {
  public notes = [
    {
      noteNumber: 1,
      content: 'Attended our gala last year and had a great time.',
      date: '11/17/2024',
    },
    {
      noteNumber: 2,
      content:
        'Is a business owner and has a lot of connections in the community.',
      date: '10/11/2024',
    },
  ];
}
