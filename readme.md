Angular 2 Front End for CB Reference Application
===============

Travel-Sample Application for CB 4.5 including support for new features :
- CBFT
- Subdoc
- Array Indexing  

This application uses Angular 2.0 and typescript.  The developer environment requires Angular-CLI to build.

## Steps to Build
 - [1] Install NPM 6.0.0 or later

 - [2] Clone this repo.

 - [3] Make sure you have `angular-cli` installed (**this was build using angular-cli `1.0.0-beta.14`**):

> `npm install -g angular-cli`

 - [3] Install node dependencies, build and serve using angular-cli:

> `npm install`
> `ng serve`


To build a distributable version that can be embedded in a try-cb backend implementation, you can also use production mode:

> `rm -rf dist/*`
> `ng build --prod`
> Then copy the content of `dist/` over...

**If you have globally installed an older angular-cli**:

> `npm uninstall -g angular-cli`
> `npm cache clean`
> `npm install -g angular-cli@latest`

Note the `latest` will likely evolve into something different, so you might have to force it to `1.0.0-beta14` instead if it still doesn't work...