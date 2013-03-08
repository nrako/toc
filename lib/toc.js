
var j = require('jquery'),
    range = require('range'),
    tpl = require('./template');

module.exports = Toc;

var list = j(tpl),
    liTpl = list.html(),
    listTag = list.get(0).tagName;

function Toc(context, selector) {

  this.context = context || 'body';
  this.selector = selector || 'h' + range(1, 6, true).join('[id],h') + '[id]';

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
    var level = parseInt(/h(\d)/i.exec(this.tagName)[1], 10);

    while (level < node.level) {
      node = node.parent || tree;
      parent = node.parent;
      depth--;
    }

    if (level > node.level) {
      parent = node;
      depth++;
    }

    node = {
      $el: j(this),
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
    .attr('href', '#' + node.$el.attr('id'));

  if (node.level !== node.depth)
    li.addClass('warning').attr('title', 'Expected level ' + node.level + ' found at ' + node.depth);

  parent.append(li);

  j.each(node.children, function (index, value) {
    traverseDown(value, li);
  });
};