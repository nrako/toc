
var j = require('jquery'),
    range = require('range'),
    slug = require('slug'),
    tpl = require('./template');

module.exports = Toc;

var list = j(tpl),
    liTpl = list.html(),
    listTag = list.get(0).tagName;

function Toc(context, selector) {

  this.context = context || 'body';
  this.selector = selector || 'h' + range(1, 6, true).join(',h');

  this.el = list;

  this.parse(context, this.selector);
  this.build();
}

Toc.prototype.parse = function(context, selector) {
  context = context || this.context;
  selector = selector || this.selector;

  this.tree = {
    el: null,
    level: 0,
    depth: 0,
    parent: null,
    children: []
  };

  this.headings = j(selector, context);

  var node = this.tree;
  var parent = this.tree;
  var depth = 0;

  this.headings.each(function () {
    var $el = j(this),
        id = $el.attr('id'),
        level = parseInt(/h(\d)/i.exec(this.tagName)[1], 10);

    while (level < node.level) {
      node = node.parent || tree;
      parent = node.parent;
      depth--;
    }

    if (level > node.level) {
      parent = node;
      depth++;
    }

    // assign a unique friendly slug id if heading doesnt have one
    if (!id)
      id = assignUniqueSlugId($el);

    node = {
      id: id,
      $el: $el,
      level: level,
      depth: depth,
      parent: parent,
      children: []
    };

    parent.children.push(node);
  });
};

Toc.prototype.build = function() {
  this.el.html('');
  var list = this.el;

  j.each(this.tree.children, function (index, value) {
    traverseDown(value, list);
  });
};

var traverseDown = function(node, parent) {
  var li = j(liTpl);

  if (parent.is('li'))
    parent = parent.children(listTag).length ? parent.children(listTag) : j('<' + listTag + '>').appendTo(parent);

  li.find('a')
    .addClass(node.$el.get(0).tagName.toLowerCase())
    .text(node.$el.text())
    .attr('href', '#' + node.id);

  if (node.level !== node.depth)
    li.addClass('warning').attr('title', 'Expected level ' + node.level + ' found at ' + node.depth);

  parent.append(li);

  j.each(node.children, function (index, value) {
    traverseDown(value, li);
  });
};

var assignUniqueSlugId = function ($el) {
  var slugId = slug($el.text(), { separator: '_' }),
      increment = 0,
      id = null;

  // fastest solution to found friendly unique id
  var mapId = function() { return this.id; };
  var similarIds = j('[id^="' + slugId  + '"]').map(mapId).get();
  while (similarIds.indexOf(slugId + (increment === 0 ? '' : '-' + increment)) >= 0) {
    increment++;
  }

  id = slugId + (increment === 0 ? '' : '-' + increment);

  $el.attr('id', id);

  return id;
}