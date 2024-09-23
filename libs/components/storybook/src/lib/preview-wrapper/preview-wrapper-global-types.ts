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
          title: 'Modern theme, dark',
          value: 'modern-dark',
        },
        {
          title: 'Modern theme, gemini',
          value: 'modern-gemini-light',
        },
      ],
    },
  },
};
