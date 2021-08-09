# gift-track

This is a web app created with SvelteKit.

Here are the steps I took to create this project:

- `npm init svelte@next gift-track`

  Note that "@next" will change when SvelteKit is out of beta.
  This asks several questions.  I selected "Skeleton project",
  TypeScript Yes, ESLint Yes, and Prettier Yes.

- `cd gift-track`
- `npm install`
- `git init`
- `git add -A`
- `git commit -m "initial commit"`
- `git remote add origin git@github.com:mvolkmann/gift-track.git`
- `git branch -M main`
- `git push -u origin main`
- modified `.prettierrc` to match my preferences
- modified `.eslintrc.cjc` to match my preferences

To format the source files, enter `npm run format`.

To check for issues, enter `npm run lint`.
To check for even more issues, enter `npm run check`.

To run the app locally in your default browser,
enter `npm run dev -- --open`.

Before creating a production version of your app,
install an [adapter](https://kit.svelte.dev/docs#adapters)
for your target environment.
Then enter `npm run build` to build the production version.

To preview the built app locally, enter `npm run preview`.
