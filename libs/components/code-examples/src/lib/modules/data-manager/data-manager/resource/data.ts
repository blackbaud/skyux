export interface FruitServerItem {
  id: string;
  name: string;
  color: string;
}

export interface FruitServerPage {
  items: FruitServerItem[];
  totalCount: number;
}

const ALL_FRUIT: FruitServerItem[] = [
  { id: '1', name: 'Orange', color: 'orange' },
  { id: '2', name: 'Mango', color: 'orange' },
  { id: '3', name: 'Lime', color: 'green' },
  { id: '4', name: 'Strawberry', color: 'red' },
  { id: '5', name: 'Blueberry', color: 'blue' },
  { id: '6', name: 'Banana', color: 'yellow' },
];

export interface FruitServerParams {
  page: number;
  pageSize: number;
  searchText?: string;
  sort?: { propertyName: string; descending: boolean };
}

export function getServerPage(params: FruitServerParams): FruitServerPage {
  let items = ALL_FRUIT;

  if (params.searchText) {
    const search = params.searchText.toLowerCase();
    items = items.filter((item) => item.name.toLowerCase().includes(search));
  }

  if (params.sort) {
    const { propertyName, descending } = params.sort;
    items = [...items].sort((a, b) => {
      const result = (a as unknown as Record<string, string>)[
        propertyName
      ].localeCompare((b as unknown as Record<string, string>)[propertyName]);
      return descending ? -result : result;
    });
  }

  const totalCount = items.length;
  const start = (params.page - 1) * params.pageSize;

  return { items: items.slice(start, start + params.pageSize), totalCount };
}
