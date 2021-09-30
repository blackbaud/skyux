import {
  SkyViewkeeperService
} from './viewkeeper.service';

describe('Viewkeeper service', () => {

  it('should create and destroy viewkeeper instances', () => {
    const testEl = document.createElement('div');
    const testBoundaryEl = document.createElement('div');

    const svc = new SkyViewkeeperService();

    const viewkeeper = svc.create({
      boundaryEl: testBoundaryEl,
      el: testEl
    });

    expect(viewkeeper).toEqual(
      jasmine.objectContaining({
        boundaryEl: testBoundaryEl,
        el: testEl
      } as any)
    );

    const destroySpy = spyOn(viewkeeper, 'destroy');

    svc.destroy(viewkeeper);

    expect(destroySpy).toHaveBeenCalled();
  });

  it('should apply host options', () => {
    const testEl = document.createElement('div');
    const testBoundaryEl = document.createElement('div');

    const svc = new SkyViewkeeperService({
      setWidth: false,
      viewportMarginTop: 50
    });

    const viewkeeper = svc.create({
      boundaryEl: testBoundaryEl,
      el: testEl,
      setWidth: true
    });

    expect(viewkeeper).toEqual(
      jasmine.objectContaining({
        boundaryEl: testBoundaryEl,
        el: testEl,
        setWidth: true,
        viewportMarginTop: 50
      } as any)
    );

    svc.destroy(viewkeeper);
  });

});
