//import path from 'path';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    ssr: false, // needed to rely on localStorage
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: {
      resolve: {
        alias: {
          //TODO: This didn't work, even after adding a "$routes"
          //TODO: path in both jsconfig.json and tsconfig.json.
          //$routes: path.resolve('./src/routes')
        }
      }
    }
  }
};

export default config;
