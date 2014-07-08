/**
 * Plugin to replace unsemantic HTML tags with semantic ones
 *
 * Currently replaces:
 * B => STRONG
 * I => EM
 *
 */
define(function () {

    'use strict';

    return function () {
        return function (scribe) {
            var map = {
                'B': 'strong',
                'I': 'em'
            };

            /**
             * Moves the children elements from one node into another
             * @param fromNode  {HTMLElement}  source node
             * @param toNode    {HTMLElement}  destination node
             */
            function moveChildren(fromNode, toNode) {
                var nextChild;
                var child = fromNode.firstChild;
                while (child) {
                    nextChild = child.nextSibling;
                    toNode.appendChild(child);
                    child = nextChild;
                }
            }

            /**
             * Copies the attributes from one node to another
             * @param fromNode  {HTMLElement}  source node
             * @param toNode    {HTMLElement}  destination node
             */
            function copyAttributes(fromNode, toNode) {
                if (fromNode.hasAttributes()) {
                    for (var i = 0, ii = fromNode.attributes.length; i < ii; i++) {
                        var attr = fromNode.attributes[i].cloneNode(false);
                        toNode.attributes.setNamedItem(attr);
                    }
                }
            }

            /**
             * Replaces a node with a new node of different name
             * @param node      {HTMLElement} node to replace
             * @param nodeName  {String}      name of the new node
             */
            function replaceNode(node, nodeName) {
                var newNode = document.createElement(nodeName);
                moveChildren(node, newNode);
                copyAttributes(node, newNode);
                node.parentNode.replaceChild(newNode, node);
            }

            /**
             * Recursively traverse the tree replacing unsemantic nodes with semantic version
             * @param parentNode  {HTMLElement}
             */
            function traverse(parentNode) {
                var el = parentNode.firstElementChild;
                var nextSibling;
                while (el) {
                    nextSibling = el.nextElementSibling;
                    traverse(el);
                    var nodeName = map[el.nodeName];
                    if (nodeName) {
                        replaceNode(el, nodeName);
                    }
                    el = nextSibling;
                }
            }

            scribe.registerHTMLFormatter('normalize', function (html) {
                if (typeof html === 'string') {
                    var node = document.createElement('div');
                    node.innerHTML = html;
                    traverse(node);
                    return node.innerHTML;
                } else {
                    traverse(html);
                    return html
                }
            });
        };
    };

});
