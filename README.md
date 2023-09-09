# astra-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
### Instructions to test the code 

You have two options to test the functionality of the code. The first one is to enter the instructions in the text area, following the PDF instructions. On the first line, you should input the sizes of the strings, on the second line, the first instruction, on the third line, the second instruction, and on the fourth line, the hidden message. All of this should be done without spaces, using "CamelCase."

The second option is to click the button to select a TXT file from your computer, following the same rules mentioned above.

Here are some use cases:

First Example:

Input:
```sh
11 15 38
CeseAlFuego
CorranACubierto
XXcaaamakkCCessseAAllFueeegooDLLKmmNNN
```
Output:
SI
NO

Second Example:

Input:
```sh
14 11 30
EsperenLaSeñal
AtaqueAereo
WWAttaquuueeAAerreoooERRkmmNNN
```
Output:
NO
SI

Third example:

Input:
```sh
10 9 24
Javascript
Programar
zXXVolaarrrBajjjoooXXLLL
```
Output:
NO
NO

Fourth example:

Input:
```sh
5 7 29
Tomar
Cerveza
zXXTTooomarrCCCervvezzzaXXLLL
```
Output:
SI
SI
