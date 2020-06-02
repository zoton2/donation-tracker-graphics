# nodecg-vue-ts-template
Template for NodeCG bundles that use Vue.js and TypeScript.


## Technical Details

- Extension uses *TypeScript*.
- Browser uses *Vue.js*, with *TypeScript* for the scripting.
  - *TypeScript* uses decorators, with [vue-class-component](https://github.com/vuejs/vue-class-component), [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) and [vuex-class](https://github.com/ktsn/vuex-class) to help (I chose this because in my experience it helped with correct typings while building Single File Components).
  - Includes *Vuex* and some example files for using it with replicants.
  - Dashboard also includes *Vuetify*, for easy styling of UI.
  - Builds using *webpack*.
- *ESLint* is included for both extension/browser.
  - Extends [airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base), alongside a few other recommended packages.
  - Has some personal choices/override rules, but not many.
- I personally use *Visual Studio Code* with some appropriate extensions, so have made sure it works well in that editor.
- `script/typeschemas.js` included to help you convert JSON schemas to *TypeScript* typings.


## Package Commands

- `autofix`: Automatically fix any possible linting errors using ESLint.
- `autofix:browser`: See above, but only for browser based code.
- `autofix:extension`: See above, but only for extension based code.
- `build`: Build written code for use in production.
- `build:browser`: See above, but only for browser based code.
- `build:extension`: See above, but only for extension based code.
- `clean`: Clean up all build/watched files.
- `start`: Start NodeCG.
- `typeschemas`: Create TypeScript typings of anything in the `schemas` directory, and also the `Configschema.json` if it exists.
- `watch`: Build code and watch for changes, for use in development.
- `watch:browser`: See above, but only for browser based code.
- `watch:extension`: See above, but only for extension based code.
