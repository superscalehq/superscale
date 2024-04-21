import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { findWorkspacePackages } from '@pnpm/workspace.find-packages';
import { findWorkspaceDir } from '@pnpm/find-workspace-dir';

async function getChatExtensionDir() {
  const root = await findWorkspaceDir(process.cwd());
  if (!root) {
    console.error(`could not find workspace root from ${process.cwd()}`);
    process.exit(1);
  }
  const packages = await findWorkspacePackages(root);
  const web = packages.find((pkg) => pkg.manifest.name === 'superscale-web');
  if (!web) {
    console.error('could not find superscale-web package');
    process.exit(1);
  }
  const webRoot = web.dir;
  return path.join(webRoot, 'extensions', 'chat');
}

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [
    svelte({
      configFile: path.resolve(__dirname, 'svelte.config.mjs'),
    }),
  ];
  // if building, we want the artifacts to end up in the chat extension directory.
  // this is so that shopify-cli can find the artifacts and upload when deploying a new version of the app.
  if (command === 'build') {
    const chatExtensionDir = await getChatExtensionDir();
    const distDir = path.join(__dirname, 'dist');
    plugins.push(
      viteStaticCopy({
        targets: [
          {
            src: `${distDir}/**/!(*.html)`,
            dest: `${chatExtensionDir}/assets`,
          },
        ],
      })
    );
  }

  return {
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          dir: path.resolve(__dirname, 'dist'),
          entryFileNames: 'index.js',
          assetFileNames: '[name].[ext]',
          chunkFileNames: '[name].js',
          preserveModules: false,
        },
      },
      assetsDir: '.',
    },
    publicDir: path.resolve(__dirname, 'public'),
    plugins,
  };
});
