import { Component } from '@angular/core';

interface Item {
  title: string;
  note: string;
}

@Component({
  selector: 'test-repeater-harness',
  templateUrl: './repeater-harness-test.component.html',
  standalone: false,
})
export class RepeaterHarnessTestComponent {
  public items: Item[] = [
    {
      title: 'Call Robert Hernandez',
      note: 'Robert recently gave a very generous gift. We should call him to thank him.',
    },
    {
      title: 'Send invitation to Spring Ball',
      note: "The Spring Ball is coming up soon. Let's get those invitations out!",
    },
  ];

  public selectable = false;

  public reorderable = false;

  public expandMode = 'none';

  public activeIndex: number | undefined;
}
