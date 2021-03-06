# gift-track

This is a web app created with SvelteKit.
It tracks gift ideas and purchased gifts for multiple people and
multiple occasions throughout the year.

Here is list of the things that can be done in the app:

- people: list, add, edit, and delete
- occasions: list, add, edit, and delete
- gifts
  - list gifts for a selected person and occasion
  - add a gift for a selected person and occasion
  - edit a gift
  - delete a gift

Here are the steps I took to create this project:

- `npm init svelte@next gift-track`

  Note that "@next" will change when SvelteKit is out of beta.
  This asks several questions. I selected "Skeleton project",
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

Navigate to the About, People, Occasions, and Gifts pages
by clicking the nav links near the top.
On the Gift page, after gifts are displayed click the "Go to Report" button.
Note that this changes the URL to
"/person/{personId}/occasion/{occasionId}/gift"
and navigate to that page.

Before creating a production version of your app,
install an [adapter](https://kit.svelte.dev/docs#adapters)
for your target environment.
Then enter `npm run build` to build the production version.

To preview the built app locally, enter `npm run preview`.
