# Nimbus Tech Flat ESLint Config

Welcome to the config! All Nimbus Tech projects should use this eslint config to ensure a consistent coding style.

## How to add it your project

Install it via:

`yarn add -D eslint-config-nimbus-tech@latest`

Note: You don't need `eslint` as a dependency because it's already included.

And then add it to your `eslint.config.mjs` file:

```js
import nimbusConfig from 'eslint-config-nimbus-tech';

export default [
  ...nimbusConfig,
  {
    /** your custom config goes here **/
  },
];
```

Then you can lint via

```
ESLINT_USE_FLAT_CONFIG=true eslint -c eslint.config.mjs .
```

We use the .mjs extension so that we can use modules regardless of the "type" property in our `package.json` file.

### Setup with VS Code

Add a `.vscode` directory inside of the project if you don't have one already.

Then add a `settings.json` file if you don't have one already.

Inside of it, add the following:

```json
{
  "eslint.experimental.useFlatConfig": true,
  "eslint.options": {
    "overrideConfigFile": "eslint.config.mjs"
  }
}
```

Note: You need to have the VS Code Eslint plugin for this to be relevant.

### Next.js project example

```js
import nimbusTechConfig from 'eslint-config-nimbus-tech';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'error',
    },
  },
  ...nimbusTechConfig,
  {
    ignores: ['.next/*', '*.cjs'],
  },
];
```

You need to install `@next/eslint-plugin-next`, `eslint-plugin-react` and `eslint-plugin-react-hooks` as dev dependencies.

### Monorepo projects

Place the file in the root of the directory, and then define a lint command for each of the submodules like this

```json
"lint": "ESLINT_USE_FLAT_CONFIG=true eslint -c ../../eslint.config.mjs ."
```

And in the root `package.json`, have a command that runs all the `lint` commands of the submodules.

```js
export default [
  ...nimbusConfig,
  {
    ignores: ['**/.turbo/*', '**/cdk.out/*'],
  },
];
```

## How to add new rules?

Open a pull request with new updates and wait for a new version to be released.

For more info, contact [NimbusTech](https://nimbus-tech.io/).

# Conventions

## Interface names

Interfaces should not be prefixed by an `I` since they are the ones that should be imported by most consumers, therefore, their names should be natural.

Let's say we have a user repository: The interface could be named `UserRepository`, and the implementing class could be a `TypeOrmUserRepository`. The fact that we're using TypeORM as the underlying implementation for our repository is something that should be irrelevant to the consumers, they should only use `UserRepository`.

In conclusion, the name of the interface should be about what contracts its providing (i.e. handling User data access), and the name of the implementing class should signify what implementation details we are using in this particular implementation.

## Enum names

Enums are basically spruced up objects that define constants. However, since they are a construct such as `class`es, it makes sense to give them PascalCase names. Since the values inside of the enum are constants, it makes sense to give them UPPER_CASE names, just like you would name constants outside of enums. An example:

```ts
enum ExampleEnum {
  EXAMPLE_VALUE,
  ANOTHER_EXAMPLE_VALUE,
}
```

## Usage of `any`

### Philosophy

Using `any` is dangerous and detrimental in the long run. What helps you today will come back to bite you later down the road.

Keeping the code typesafe should come down to checking the edges of your application, in other words:

- outputs from untyped or badly typed libraries
- outputs from external services

These two edges should be, ideally, unit and/or integration tested and made sure that they conform to the interfaces that have been defined for them.

Keeping the code typesafe inside of the app is then trivial, because you always can expect all the types to be exactly what they state to be, since they are either:

- external and we have covered them with the above
- internal and in our absolute control

### Alternatives

Use `unknown`. If you get a type error for an `unknown`, that means that, when using `any`, you would be completely unsafely accessing a property of an object that you have no idea whether it exists or not.

If you get a type error for an `unknown`, that means that it's time to look up or define a type. Since TypeScript supports [duck typing](https://www.typescriptlang.org/docs/handbook/interfaces.html), you can at least define an interface with the set of fields you are using until you find a better type or you don't start maintaining your type more seriously and you move it out into its own file.

Example

Using `any`

```ts
function convertBackendResponseToUiModel(response: any) {
  return {
    // You have no idea whether this exists
    // or not without running the code.
    // You have no way of defending
    // yourself against this type
    // changing in the future other
    // than running the app and it
    // failing in runtime
    name: response.user.name;
  }
}
```

Using `unknown`

```ts
function convertBackendResponseToUiModel(response: unknown) {
  return {
    // Using unknown here throws an
    // error, and rightfully so
    // You said that you have no
    // idea what the type is, and yet
    // you're accessing fields on
    // it - how can you be sure they exist?
    name: response.user.name;
  }
}
```

So, if no other type exists, you can at least do this.

```ts

interface Response {
  user: {
    name: string | undefined;
  }
}

function convertBackendResponseToUiModel(response: Response) {
  return {
    // This now works, although it
    // still misses tests to
    // confirm behavior
    name: response.user.name;
  }
}
```

We should still be able to define `any` in extreme situations, by disabling the eslint rule for that line **and** leaving a comment as to why we defined the type that way.

You'll notice that most of the time the comments won't be as justfied as just finding out a type or making one.

Do keep in mind that if you have a lot of instances in your code where you're not sure what type something is - that means that the boundary isolation is not well-defined. Insecure types should be pushed out to the edges of the code, making things such as these a less frequent occurence.

### Using type predicates

You can infer types from `unknown` or `any` values by using [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). For example:

```ts
interface Response {
  veryImportantData: string;
}

/**
 * Checkes whether the object passed
 * in is not null, then whether it's
 * an object and then whether it has
 * a property called `veryImportantData`
 */
function isResponse(someObject: unknown): someObject is Response {
  return !!someObject && typeof someObject === 'object' && 'veryImportantData' in someObject;
}
```

Later in code, you can do:

```ts
const someFunction = () => {
  // untyped API
  const unknownResponse = getData();

  if (isResponse(unknownResponse)) {
    // unknownResponse now has
    // the type of Response and
    // you can be sure that it contains
    // the field `veryImportantData`
  }
};
```
