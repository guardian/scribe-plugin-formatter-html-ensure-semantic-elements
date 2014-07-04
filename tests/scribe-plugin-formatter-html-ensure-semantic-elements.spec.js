define([
  'src/scribe-plugin-formatter-html-ensure-semantic-elements'
], function (scribePluginFormatterHtmlEnsureSemanticElements) {

  'use strict';

  describe('scribe-plugin-formatter-html-ensure-semantic-elements', function () {
    var ensureSemanticElements;

    var mockScribe = {};
    mockScribe.registerHTMLFormatter = function (name, fn) {
      ensureSemanticElements = fn;
    };

    scribePluginFormatterHtmlEnsureSemanticElements()(mockScribe);

    describe('HTML string as the argument', function () {
      it('should convert I to EM', function () {
        expect(ensureSemanticElements('<i></i>')).toBe('<em></em>');
      });

      it('should convert B to STRONG', function () {
        expect(ensureSemanticElements('<b></b>')).toBe('<strong></strong>');
      });

      it('should work for down the tree', function () {
        expect(ensureSemanticElements('<div><i><b></b></i></div>')).toBe('<div><em><strong></strong></em></div>');
      });

      it('should work across the tree', function () {
        expect(ensureSemanticElements('<b></b><i></i>')).toBe('<strong></strong><em></em>');
      });

      it('should retain the classes', function () {
        expect(ensureSemanticElements('<i class="i em"></i>')).toBe('<em class="i em"></em>');
      });

      it('should retain the id attribute', function () {
        expect(ensureSemanticElements('<i id="i"></i>')).toBe('<em id="i"></em>');
      });

      it('should retain namespaced attributes', function () {
        expect(ensureSemanticElements('<i ui:a-directive=""></i>')).toBe('<em ui:a-directive=""></em>');
      });

      it('should retain hyphenated attributes', function () {
        expect(ensureSemanticElements('<i i-am="a programmer"></i>')).toBe('<em i-am="a programmer"></em>');
      });

      it('should also normalise attributes', function () {
        expect(ensureSemanticElements('<i m-e></i>')).toBe('<em m-e=""></em>');
      });

      it('should retain text contents', function () {
        expect(ensureSemanticElements('<i>1</i>')).toBe('<em>1</em>');
      });

      it('should retain text contents in complex html', function () {
        expect(ensureSemanticElements('<span>0<i>1</i>2</span>')).toBe('<span>0<em>1</em>2</span>');
      });
    });

    describe('HTMLNode as the argument', function () {
      it('should return the element that was passed in as the argument', function () {
        var el = document.createElement('div');
        var el2 = ensureSemanticElements(el);
        expect(typeof el2).toBe('object');
        expect(el2).toBe(el);
      });

      it('should not change root node', function () {
        var el = document.createElement('b');
        var el2 = ensureSemanticElements(el);
        expect(el2.nodeName).toBe('B');
        expect(el2).toBe(el);
      });

      it('should work for a node with complex children', function () {
        var el = document.createElement('div');
        el.innerHTML = 'h<b>0</b><i>1</i><b><i>2</i>u</b>y';
        expect(ensureSemanticElements(el).innerHTML).toBe('h<strong>0</strong><em>1</em><strong><em>2</em>u</strong>y');
      });
    });
  });
});
