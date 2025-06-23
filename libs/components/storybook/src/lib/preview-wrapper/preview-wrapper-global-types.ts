export const previewWrapperGlobalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'default',
    toolbar: {
      icon: 'paintbrush',
      items: [
        {
          title: 'Default theme',
          value: 'default',
        },
        {
          title: 'Modern theme',
          value: 'modern-light',
        },
        {
          title: 'Modern theme, v2',
          value: 'modern-v2-light',
        },
        {
          title: 'Modern theme, v2, dark',
          value: 'modern-v2-dark',
        },
      ],
    },
  },
};
