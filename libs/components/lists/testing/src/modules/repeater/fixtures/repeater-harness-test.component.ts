import { Component, input, model } from '@angular/core';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormConfig,
} from '@skyux/inline-form';

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

  public selectable = input(false);

  public reorderable = input(false);

  public expandMode = input('none');

  public activeIndex = model<number | undefined>(undefined);

  public disabled = input(false);

  public ariaLabel = input<string | undefined>(undefined);

  public inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel,
  };

  public showInlineForm = input<boolean>(true);
}
