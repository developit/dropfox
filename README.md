# Dropfox

[![Greenkeeper badge](https://badges.greenkeeper.io/developit/dropfox.svg)](https://greenkeeper.io/)

A dropbox client powered by [Preact], [Electron] and [Photon].

> ### [Download Dropfox ➞](https://github.com/developit/dropfox/releases)

<img src="http://i.imgur.com/fN1PmUN.png" width="717">


> **Note:** building the app requires a Dropbox API Key, specified as `DROPBOX_API_KEY` env var.
>
> If you need a key, [generate one here](https://www.dropbox.com/developers/apps/).


## Installation

```sh
npm install
```


### Run for Development

Runs a local copy of Electron (via electron-prebuilt), rendering the app with Live-Reload / [HMR] via [webpack-dev-server].

> **Note:** you may need to reload _(Cmd/Ctrl + R)_ after the initial Webpack build completes.

```sh
npm start
```


### Build

To build the app for OS X, Linux, and Windows, using [electron-packager]:

```sh
npm run build
```


### Platform-Specific Builds

You can also build the codebase, and then package it only for a given platform:

```sh
# build the electron & web source:
npm run build:all

# generate the package for your platform(s):
npm run build:electron:osx
npm run build:electron:linux
npm run build:electron:win
```


## License

MIT © [Jason Miller](http://jasonformat.com)

[webpack-dev-server]: https://webpack.github.io/docs/webpack-dev-server.html
[HMR]: https://webpack.github.io/docs/hot-module-replacement.html
[preact]: https://github.com/developit/preact
[electron]: https://github.com/atom/electron
[photon]: https://github.com/connors/photon
[electron-packager]: https://github.com/maxogden/electron-packager
