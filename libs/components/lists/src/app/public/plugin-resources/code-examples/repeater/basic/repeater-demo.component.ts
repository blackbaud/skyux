import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-repeater-demo',
  templateUrl: './repeater-demo.component.html',
  styleUrls: ['./repeater-demo.component.scss']
})
export class RepeaterDemoComponent {

  public items: any[] = [
    {
      title: 'Call Robert Hernandez',
      note: 'Robert recently gave a very generous gift.  We should call him to thank him.',
      status: 'Completed'
    },
    {
      title: 'Send invitation to Spring Ball',
      note: 'The Spring Ball is coming up soon.  Let\'s get those invitations out!',
      status: 'Past due'
    }
  ];
}
