export interface SkySummaryActionBarFixtureAction {
  buttonText: string;
  isDisabled: boolean;

  click(): Promise<void>;
}
