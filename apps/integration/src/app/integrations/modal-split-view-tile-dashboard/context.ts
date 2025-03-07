import { ModalDemoData } from './data';

export class ModalDemoContext {
  constructor(
    public data: ModalDemoData,
    public layout?: 'fit' | 'none',
  ) {}
}
