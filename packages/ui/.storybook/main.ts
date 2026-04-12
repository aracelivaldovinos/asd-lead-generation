import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { join, dirname } from "path"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    {
      "name": getAbsolutePath('@storybook/addon-essentials'),
      "options": {
        "docs": false
      }
    },
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-interactions')
  ],
  "framework": {
    "name": getAbsolutePath('@storybook/react-vite'),
    "options": {}
  },
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins || []), tailwindcss()];
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
        'react-dom/test-utils': require.resolve('react-dom/test-utils'),
        'react-dom/client': require.resolve('react-dom/client'),
        'react-dom': require.resolve('react-dom'),
        react: require.resolve('react'),
      }
    };
    return config;
  }
};
export default config;