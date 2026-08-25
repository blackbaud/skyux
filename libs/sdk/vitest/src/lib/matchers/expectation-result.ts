export interface ExpectationResult {
  pass: boolean;
  message: () => string;
}
