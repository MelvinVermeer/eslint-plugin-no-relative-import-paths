# eslint-plugin-no-relative-import-paths

Moving a file to different folder, could result in changing all imports statement in that file. This will not happen is the import paths are absolute. The eslint rule helps enforcing having absolute import paths.
Support eslint --fix to automatically change imports to absolute paths.  

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally. (Note that locally, per project, is strongly preferred)

```sh
$ npm install eslint --save-dev
```

If you installed `ESLint` globally, you have to install this plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-no-relative-import-paths --save-dev
```

# Configuration

Add the plugin to the plugins section, and configure the rule options.

```json
{
  "plugins": ["no-relative-import-paths"],
  "rules": {
    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      { "allowSameFolder": true }
    ]
  }
}
```

## Rule options

```json
...
"no-relative-import-paths/no-relative-import-paths": [
  "warn",
  { "allowSameFolder": true, "rootDir": "src" }
]
...
```

- `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
- `ignorePureComponents`: optional boolean set to `true` to allow relative import paths for imported files from the same folder (default to `false`).

### `allowSameFolder`

When `true` the rule will ignore relative import paths for imported files from the same folder

Examples of code for this rule:

```js
// when true this will be ignored
// when false this will generate a warning
import Something from "./something";

// will always generate a warning
import Something from "../modules/something";
```

### `rootDir`

Useful when auto-fixing and the rootDir should not be included in the absolute path.

Examples of code for this rule:

```js
// when not configured:
import Something from "../../components/something";

// will result in
import Something from "src/components/something";
```

```js
// when configured as { "rootDir": "src" }
import Something from "../../components/something";

// will result in
import Something from "components/something";
//                     ^- no 'src/' prefix is added
```

