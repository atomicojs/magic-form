### Hi, I'm [@uppercod](https://twitter.com/uppercod), This repo provides what you need to start creating module and browser compatible packages (DOM).

If you need help you can find it at:

[![twitter](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/twitter.svg)](https://twitter.com/atomicojs)
[![discord](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/discord.svg)](https://discord.gg/7z3rNhmkNE)

Now what you have installed is a quick start kit based on Vite, which you can scale for your project, now to continue you must execute the following commands:

1. `npm install`
2. `npm start` : Initialize the development server
3. `npm build` : Optional, Generate a build of your project from the html file [index.html](index.html).

## Workspace

### Recommended structure

```bash
src
  |- module.js
```

### Add testing

The test environment is preconfigured for [@web/test-runner](https://modern-web.dev/docs/test-runner/overview/), you must complete the installation of the following devDependencies, installed the devDependencies you can execute the command `npm run test`:

```bash
npm install -D @web/test-runner @esm-bundle/chai vite-web-test-runner-plugin
```

#### Test example

```js
import { expect } from "@esm-bundle/chai";

describe("my test", () => {
    it("foo is bar", () => {
        expect("foo").to.equal("bar");
    });
});
```

> `@web/test-runner` supports asynchrony, coverage, [viewport and more](https://modern-web.dev/docs/test-runner/commands/).

### NPM export

Atomico owns the [@atomico/exports](https://atomico.gitbook.io/doc/atomico/atomico-exports) tool that simplifies the generation of builds, types and exports by distributing webcomponents in NPM, you must complete the installation of the following devDependencies, installed the devDependencies you can execute the command `npm run exports`:

```bash
npm install -D @atomico/exports
```

### Postcss

This configuration already depends on Postcss, you can more plugins through `package.json#postcss`, example:

```json
"postcss": {
  "plugins": {
    "postcss-import": {}
  }
}
```

> In case of build, Atomico will minify the CSS code.

### Github page

Add to `package.json#scripts.build`:

```bash
--outDir docs # modify the destination directory
--base my-repo # github page folder
```
