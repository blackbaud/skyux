import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SkyInputBoxHostService } from '@skyux/forms';

@Component({
  selector: 'app-input-box-visual-host',
  templateUrl: './input-box-visual-host.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class InputBoxVisualHostComponent implements OnInit {
  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public inputTemplateRef: TemplateRef<unknown>;

  public inputBoxHostSvc = inject(SkyInputBoxHostService, { optional: true });

  public ngOnInit(): void {
    if (this.inputBoxHostSvc) {
      this.inputBoxHostSvc.populate({
        inputTemplate: this.inputTemplateRef,
      });
      this.inputBoxHostSvc.setHintText('Host hint text.');
    }
  }
}
