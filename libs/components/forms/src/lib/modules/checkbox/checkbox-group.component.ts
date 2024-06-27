import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  TemplateRef,
  booleanAttribute,
  inject,
  numberAttribute,
} from '@angular/core';
import {
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SkyIdModule, SkyIdService } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SKY_FORM_ERRORS_ENABLED } from '../form-error/form-errors-enabled-token';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyCheckboxGroupHeadingLevel } from './checkbox-group-heading-level';
import { SkyCheckboxGroupHeadingStyle } from './checkbox-group-heading-style';

/**
 * Organizes checkboxes into a group.
 */
@Component({
  selector: 'sky-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    SkyFormErrorsModule,
    SkyFormsResourcesModule,
    SkyHelpInlineModule,
    SkyIdModule,
  ],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SkyCheckboxGroupComponent,
      multi: true,
    },
    { provide: SKY_FORM_ERRORS_ENABLED, useValue: true },
  ],
})
export class SkyCheckboxGroupComponent implements Validator {
  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the checkbox group fieldset legend. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   * @preview
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   * @preview
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * The text to display as the checkbox group's heading.
   * @preview
   */
  @Input({ required: true })
  public headingText!: string;

  /**
   * Indicates whether to hide the `headingText`.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  public headingHidden = false;

  /**
   * The semantic heading level in the document structure. By default, the heading text is not wrapped in a heading element.
   * @preview
   */
  @Input({ transform: numberAttribute })
  public set headingLevel(value: SkyCheckboxGroupHeadingLevel | undefined) {
    this.#_headingLevel = value && !isNaN(value) ? value : undefined;
    this.#updateStackedClasses();
  }

  public get headingLevel(): SkyCheckboxGroupHeadingLevel | undefined {
    return this.#_headingLevel;
  }

  /**
   * The heading [font style](https://developer.blackbaud.com/skyux/design/styles/typography#headings).
   * @preview
   * @default 4
   */
  @Input({ transform: numberAttribute })
  public headingStyle: SkyCheckboxGroupHeadingStyle = 4;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   * @preview
   */
  @Input()
  public hintText: string | undefined;

  /**
   * Whether the checkbox group is required.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  public required = false;

  /**
   * Whether the checkbox group is stacked on another form component. When specified, the appropriate
   * vertical spacing is automatically added to the checkbox group.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  public set stacked(value: boolean) {
    this.#_stacked = value;
    this.#updateStackedClasses();
  }

  public get stacked(): boolean {
    return this.#_stacked;
  }

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the checkbox group heading. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application.
   * @preview
   */
  @Input()
  public helpKey: string | undefined;

  @HostBinding('class.sky-margin-stacked-lg')
  public stackedLg = false;

  @HostBinding('class.sky-margin-stacked-xl')
  public stackedXL = false;

  public get headingClass(): string {
    return `sky-font-heading-${this.headingStyle}`;
  }

  readonly #idSvc = inject(SkyIdService);
  protected errorId = this.#idSvc.generateId();
  protected formErrorsDataId = 'checkbox-group-form-errors';
  protected formGroup: FormGroup | null | undefined;

  #_headingLevel: SkyCheckboxGroupHeadingLevel | undefined;
  #_stacked = false;

  public validate(formGroup: FormGroup): ValidationErrors | null {
    this.formGroup ??= formGroup;

    if (!this.required) {
      return null;
    }

    const controlNames = Object.keys(formGroup.controls);
    let atLeastOneSelected = false;

    controlNames.forEach((controlName) => {
      const control = formGroup.get(controlName);
      if (control?.value) {
        atLeastOneSelected = true;
      }
    });

    if (!atLeastOneSelected) {
      return { required: true };
    } else {
      return null;
    }
  }

  #updateStackedClasses(): void {
    this.stackedLg = !this.headingLevel && this.stacked;
    this.stackedXL = !!this.headingLevel && this.stacked;
  }
}
