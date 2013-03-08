
# toc

  Table Of Content UI component

## Installation

    $ component install nrako/toc

## Example

```js
var Toc = require('toc');
var toc = new Toc;
console.log(toc.tree);
toc.el.appendTo('body');
```

Define default context and selector

```js
var Toc = require('toc');
var toc = new Toc('article', 'h2[id],h3[id],h4[id]');
toc.el.appendTo('body');
```

Rebuild toc with new selector

```js
var Toc = require('toc');
var toc = new Toc('article');
toc.el.appendTo('body');

toc.parse('article', 'h2[id],h3[id],h4[id]');
toc.build();
```

## Features

* Accept context and selector — OMG!
* Use list nesting for hierarchy.
* Hierarchy fault tolerant, add `.warning` on heading when its hierarchy is messed-up.
* For anchoring assign unique friendly slug id to heading when missing

## API

### `new Toc([context, selector])`

  Initialize a new `Toc`.
  Can take a new given default `context` default to `'body'` and given `selector`,
  default to `'h1,h2,h3,h4,h5,h6'`.

### `Toc.parse([context, selector])`

  Parse headings and define `tree` data for the given arguments.
  Same arguments signature than `new Toc([context, selector])` constructor but it wont redefine default values.
  Default values for arguments are the optional defaults values passed to constructor.

### `Toc.build()`

  Build dom `el` toc content from `tree` data.

## TODO

* Get ride of jquery — maybe

## License

  MIT
