import {
  SkyAppOmnibarReadyArgs
} from './omnibar-ready-args';

export abstract class SkyAppOmnibarProvider {

  public abstract ready(): Promise<SkyAppOmnibarReadyArgs>;

}
