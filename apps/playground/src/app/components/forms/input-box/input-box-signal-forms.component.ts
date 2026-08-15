import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import type {
  ReadonlyFieldTree,
  ValidationError,
} from '@angular/forms/signals';
import {
  FormField,
  disabled,
  email,
  form,
  hidden,
  max,
  maxDate,
  maxLength,
  min,
  minDate,
  minLength,
  pattern,
  readonly,
  required,
  submit,
  validate,
  validateAsync,
  validateTree,
} from '@angular/forms/signals';
import type { SkyTimepickerTimeOutput } from '@skyux/datetime';
import { SkyDatepickerModule, SkyTimepickerModule } from '@skyux/datetime';
import { SkyFormErrorModule, SkyInputBoxModule } from '@skyux/forms';
import type { SkyCountryFieldCountry } from '@skyux/lookup';
import {
  SkyAutocompleteModule,
  SkyCountryFieldModule,
  SkyLookupModule,
} from '@skyux/lookup';
import { SkyPhoneFieldModule } from '@skyux/phone-field';

interface DemoItem {
  name: string;
}

interface DemoModel {
  native: {
    name: string;
    email: string;
    age: number | null;
    password: string;
    confirmPassword: string;
    website: string;
    favoriteColor: string;
    bio: string;
  };
  sky: {
    startDate: Date | null;
    startTime: SkyTimepickerTimeOutput | string | null;
    phone: string;
    country: SkyCountryFieldCountry | null;
    favoriteFruit: DemoItem | string | null;
    teamLead: DemoItem[];
    teamMembers: DemoItem[];
  };
  validators: {
    couponCode: string;
    quantity: number | null;
    nickname: string;
    projectName: string;
    username: string;
  };
  logic: {
    subscribed: string;
    newsletterEmail: string;
    accountId: string;
    referralCode: string;
  };
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const RESERVED_PROJECT_NAMES = ['admin', 'system'];
const TAKEN_USERNAMES = ['admin', 'root'];

/**
 * Targets a validation error at a specific field, for validators that can
 * report errors anywhere in the tree. The cast works around an
 * `@angular/forms/signals` typing gap: a `ReadonlyFieldTree` for a primitive
 * value isn't assignable to the `ReadonlyFieldTree<unknown>` that `fieldTree`
 * declares.
 */
function targetError(
  fieldTree: unknown,
  error: ValidationError,
): ValidationError.WithOptionalFieldTree {
  return { ...error, fieldTree: fieldTree as ReadonlyFieldTree<unknown> };
}

function createModel(): DemoModel {
  return {
    native: {
      name: '',
      email: '',
      age: null,
      password: '',
      confirmPassword: '',
      website: '',
      favoriteColor: '',
      bio: '',
    },
    sky: {
      startDate: null,
      startTime: null,
      phone: '',
      country: null,
      favoriteFruit: null,
      teamLead: [],
      teamMembers: [],
    },
    validators: {
      couponCode: '',
      quantity: null,
      nickname: '',
      projectName: '',
      username: '',
    },
    logic: {
      subscribed: 'no',
      newsletterEmail: '',
      accountId: 'ACC-000123',
      referralCode: '',
    },
  };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    SkyAutocompleteModule,
    SkyCountryFieldModule,
    SkyDatepickerModule,
    SkyFormErrorModule,
    SkyInputBoxModule,
    SkyLookupModule,
    SkyPhoneFieldModule,
    SkyTimepickerModule,
  ],
  styles: `
    .input-box-signal-forms {
      max-width: 400px;
    }

    .input-box-signal-forms-section {
      margin-bottom: 30px;
    }
  `,
  templateUrl: './input-box-signal-forms.component.html',
})
export class InputBoxSignalFormsComponent {
  readonly #injector = inject(Injector);
  readonly #today = new Date(new Date().setHours(0, 0, 0, 0));
  readonly #thirtyDaysOut = new Date(Date.now() + 30 * DAY_IN_MS);

  protected readonly fruits: DemoItem[] = [
    { name: 'Apple' },
    { name: 'Banana' },
    { name: 'Cherry' },
    { name: 'Grape' },
    { name: 'Orange' },
  ];

  protected readonly people: DemoItem[] = [
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Carol' },
    { name: 'David' },
    { name: 'Erin' },
    { name: 'Frank' },
  ];

  protected readonly model = signal(createModel());

  protected readonly signalForm = form(this.model, (p) => {
    required(p.native.name);
    maxLength(p.native.name, 50);

    required(p.native.email);
    email(p.native.email);

    min(p.native.age, 18, { message: 'Age must be at least 18.' });
    max(p.native.age, 120, { message: 'Age must be 120 or less.' });

    required(p.native.password);
    minLength(p.native.password, 8);

    // A custom validator can read a sibling field through `valueOf`.
    validate(p.native.confirmPassword, ({ value, valueOf }) =>
      value() && value() !== valueOf(p.native.password)
        ? { kind: 'passwordMismatch', message: 'The passwords do not match.' }
        : undefined,
    );

    pattern(p.native.website, /^https:\/\/.+/, {
      message: 'The website must start with https://.',
    });

    required(p.native.favoriteColor);
    validate(p.native.favoriteColor, ({ value }) =>
      value() === 'invalid'
        ? { kind: 'invalidColor', message: 'Invalid color is not a color.' }
        : undefined,
    );

    maxLength(p.native.bio, 200);

    required(p.sky.startDate);
    minDate(p.sky.startDate, this.#today, {
      message: 'The start date cannot be in the past.',
    });
    maxDate(p.sky.startDate, this.#thirtyDaysOut, {
      message: 'The start date must be within the next 30 days.',
    });

    required(p.sky.startTime);
    required(p.sky.phone);
    required(p.sky.country);
    required(p.sky.favoriteFruit);

    // `required` treats an empty array as a value, and `minLength` reports a
    // character-count message, so array-valued controls need their own message.
    validate(p.sky.teamLead, ({ value }) =>
      value().length === 0
        ? { kind: 'noTeamLead', message: 'Select a team lead.' }
        : undefined,
    );
    validate(p.sky.teamMembers, ({ value }) =>
      value().length < 2
        ? {
            kind: 'notEnoughMembers',
            message: 'Select at least two team members.',
          }
        : undefined,
    );

    pattern(p.validators.couponCode, /^[A-Z]{3}-\d{4}$/, {
      message: 'Enter a coupon code in the format ABC-1234.',
    });

    min(p.validators.quantity, 1, { message: 'Order at least 1.' });
    max(p.validators.quantity, 10, { message: 'Order no more than 10.' });

    validate(p.validators.nickname, ({ value }) =>
      value().includes(' ')
        ? { kind: 'noSpaces', message: 'The nickname cannot contain spaces.' }
        : undefined,
    );

    // This error carries no `message`, so the template renders its own
    // `sky-form-error` for it.
    validate(p.validators.projectName, ({ value }) =>
      RESERVED_PROJECT_NAMES.includes(value().toLowerCase())
        ? { kind: 'reserved' }
        : undefined,
    );

    validateAsync(p.validators.username, {
      params: ({ value }) => value(),
      debounce: 500,
      factory: (username) =>
        resource({
          injector: this.#injector,
          params: () => username(),
          loader: async ({ params }) => {
            await new Promise((resolve) => setTimeout(resolve, 750));

            return !TAKEN_USERNAMES.includes((params ?? '').toLowerCase());
          },
        }),
      onSuccess: (isAvailable) =>
        isAvailable
          ? undefined
          : {
              kind: 'usernameTaken',
              message: 'That username is already taken.',
            },
      onError: () => ({
        kind: 'usernameCheckFailed',
        message: 'The username could not be verified. Try again.',
      }),
    });

    // A tree validator sees the whole group and can target its error at any
    // field within it.
    validateTree(p.native, ({ value, fieldTreeOf }) => {
      const { name, password } = value();

      return name && password.toLowerCase().includes(name.toLowerCase())
        ? targetError(fieldTreeOf(p.native.password), {
            kind: 'passwordContainsName',
            message: 'The password cannot contain the name.',
          })
        : undefined;
    });

    disabled(
      p.logic.newsletterEmail,
      ({ valueOf }) =>
        valueOf(p.logic.subscribed) === 'no' &&
        'Subscribe to the newsletter to enter an address.',
    );
    required(p.logic.newsletterEmail);
    email(p.logic.newsletterEmail);

    readonly(p.logic.accountId);

    hidden(p.logic.referralCode, ({ valueOf }) => {
      return valueOf(p.logic.subscribed) === 'no';
    });
  });

  protected readonly submitModel = signal({ displayName: '' });

  protected readonly submitForm = form(this.submitModel, (p) => {
    required(p.displayName);
  });

  protected readonly submitMessage = signal<string | undefined>(undefined);

  protected readonly projectNameReserved = computed(() => {
    const state = this.signalForm.validators.projectName();

    return (state.touched() || state.dirty()) && !!state.getError('reserved');
  });

  protected readonly formValue = computed(() =>
    JSON.stringify(this.signalForm().value(), undefined, 2),
  );

  protected markAllAsTouched(): void {
    this.signalForm().markAsTouched();
    this.submitForm().markAsTouched();
  }

  protected async onSubmit(): Promise<void> {
    this.submitMessage.set(undefined);

    const succeeded = await submit(this.submitForm, async (f) => {
      await new Promise((resolve) => setTimeout(resolve, 750));

      if (f().value().displayName.toLowerCase() === 'taken') {
        return [
          targetError(this.submitForm.displayName, {
            kind: 'server',
            message: 'That display name is already in use.',
          }),
        ];
      }

      return undefined;
    });

    this.submitMessage.set(
      succeeded ? 'Saved.' : 'The form could not be saved.',
    );
  }
}
