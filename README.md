## eslint-plugin-riot
[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

An [ESLint](http://eslint.org/) plugin to extract and lint scripts from [riot](riotjs.com) tag.

Supported extensions are `.html` and `.tag`.

It only lints `es6`, `babel` or `javascript` script in tag. It does not support riot mini es6 syntax.

### Usage

Install the plugin:

```sh
npm install --save-dev eslint-plugin-riot
```

Add it to your `.eslintrc`:

```json
{
  "plugins": ["riot"]
}
```

Write your riot tag file with extension `.html` or `.tag`, and wrap your script with `<script type="es6"> </script>`, for example:

```html
<postcell>
  <div>
    <span>Id: {opts.data.postId}</span>
    <span>Title: <a href="#detail/{opts.data.postId}">{opts.data.title}</a></span>
    <span>{opts.data.likes} Likes</span>
    <button onclick={likePost}>Like</button>
  </div>

  <script type="es6">
  this.likePost = () => {
    riot.control.trigger(riot.VE.LIKE_POST, opts.data.postId)
  }
  </script>
</postcell>
```

### Example

[Here](https://github.com/txchen/feplay/tree/gh-pages/riot_webpack) is an example of project that use riot + es6 + webpack + eslint + eslint-plugin-riot. It will show you how to use this plugin to configure your project.


[codeclimate-image]:https://codeclimate.com/github/txchen/eslint-plugin-riot/badges/gpa.svg
[codeclimate-url]:https://codeclimate.com/github/txchen/eslint-plugin-riot

[npm-version-image]:http://img.shields.io/npm/v/eslint-plugin-riot.svg?style=flat-square
[npm-url]:https://www.npmjs.com/package/eslint-plugin-riot

[travis-image]:https://api.travis-ci.org/txchen/eslint-plugin-riot.svg?branch=master
[travis-url]:https://travis-ci.org/txchen/eslint-plugin-riot
