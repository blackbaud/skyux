import { Component } from '@angular/core';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
  standalone: false,
})
export class ValidationComponent {
  public textInput: string | undefined;
  public textInputTouched: string | undefined;
  public selectInput: string | undefined;
  public selectInputTouched: string | undefined;
}
