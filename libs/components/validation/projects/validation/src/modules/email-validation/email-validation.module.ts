import {
  NgModule
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';

import { SkyEmailValidationDirective } from './email-validation.directive';

@NgModule({
    declarations: [
        SkyEmailValidationDirective
    ],
    imports: [
        FormsModule
    ],
    exports: [
        SkyEmailValidationDirective
    ]
})
export class SkyEmailValidationModule { }
