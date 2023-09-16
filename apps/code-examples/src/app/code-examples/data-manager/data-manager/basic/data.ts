export interface DataManagerDemoRow {
  selected?: boolean;
  id: string;
  name: string;
  description: string;
  type: string;
  color: string;
}

export const DATA_MANAGER_DEMO_DATA: DataManagerDemoRow[] = [
  {
    id: '1',
    name: 'Orange',
    description: 'A round, orange fruit. A great source of vitamin C.',
    type: 'citrus',
    color: 'orange',
  },
  {
    id: '2',
    name: 'Mango',
    description:
      "Very difficult to peel. Delicious in smoothies, but don't eat the skin.",
    type: 'other',
    color: 'orange',
  },
  {
    id: '3',
    name: 'Lime',
    description: 'A sour, green fruit used in many drinks. It grows on trees.',
    type: 'citrus',
    color: 'green',
  },
  {
    id: '4',
    name: 'Strawberry',
    description:
      'A red fruit that goes well with shortcake. It is the name of both the fruit and the plant!',
    type: 'berry',
    color: 'red',
  },
  {
    id: '5',
    name: 'Blueberry',
    description:
      'A small, blue fruit often found in muffins. When not ripe, they can be sour.',
    type: 'berry',
    color: 'blue',
  },
  {
    id: '6',
    name: 'Banana',
    description:
      'A yellow fruit with a thick skin. Monkeys love them, and in some countries it is customary to eat the peel.',
    type: 'other',
    color: 'yellow',
  },
];
