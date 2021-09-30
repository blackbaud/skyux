export class ModalMockMutationObserverService {

  public create(cb: any): any {
    return {
      observe(el: any) {
        this.el = el;
      },
      disconnect() { }
    };
  }

}
