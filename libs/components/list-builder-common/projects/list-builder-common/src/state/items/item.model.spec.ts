import {
  ListItemModel
} from './item.model';

describe('list items', () => {
  describe('list item model', () => {
    it('should throw an error when initializing without an id', () => {
      expect(function () {
        return new ListItemModel(undefined, 'something');
      }).toThrow(new Error('All list item models require an ID'));
    });

    it('should not set optional properties (data, isSelected) when they are undefined', () => {
      let item = new ListItemModel('id');
      expect(item.data).toBeUndefined();
      expect(item.isSelected).toBeUndefined();
    });

    it('should set optional properties (data, isSelected)', () => {
      let item = new ListItemModel('id', { foo: 'bar' }, true);
      expect(item.data).toEqual({ foo: 'bar' });
      expect(item.isSelected).toEqual(true);
    });
  });
});
