import { ComponentHarness } from '@angular/cdk/testing';

export class NonexistentHarness extends ComponentHarness {
  public static hostSelector = '.does-not-exist';
}
