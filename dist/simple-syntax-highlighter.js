(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.simpleSyntaxHighlighter = global.simpleSyntaxHighlighter || {})));
}(this, (function (exports) { 'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(function () {
  if (typeof document !== 'undefined') {
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style'),
        css = "";style.type = 'text/css';if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }head.appendChild(style);
  }
})();

var regexBasics = {
  quote: /("(?:\\"|[^"])*")|('(?:\\'|[^'])*')/, // Match simple and double quotes by pair.
  comment: /(\/\/.*|\/\*[\s\S]*?\*\/)/, // Comments blocks (/* ... */) or trailing comments (// ...).
  htmlTag: /(<([^>])*>)/,
  punctuation: /(!==?|(?:[[\](){}.:;,+\-?=]|&lt;|&gt;)+|&&|\|\|)/, // punctuation not in html tag.
  number: /(-?(?:\.\d+|\d+(?:\.\d+)?))/,
  boolean: /\b(true|false)\b/

  // The html tags names, attribute and inner special chars are treated inside the
  // htmlTag regex above because javascript does not support lookbehind.
};var dictionary = {
  shell: {
    quote: regexBasics.quote,
    comment: /(#.*?)\n/,
    keyword: /(?:^|\b)(npm|yarn|install|run)(?:\b|$)/,
    param: /( --(?:save|save-dev))(?:\s|$)/
  },
  xml: {
    quote: regexBasics.quote,
    comment: /(&lt;!--[\s\S]*?--&gt;)/,
    tag: /(&lt;\/?)([a-zA-Z\-:]+)(.*?)(\/?&gt;)/
  },
  html: {
    quote: regexBasics.quote,
    comment: /(&lt;!--[\s\S]*?--&gt;)/,
    tag: /(&lt;\/?)([a-z]\w*)(.*?)(\/?&gt;)/
  },
  'html-vue': {
    quote: regexBasics.quote,
    comment: /(&lt;!--[\s\S]*?--&gt;)/,
    tag: /(&lt;\/?)([a-z][a-z_-]*)((?:.|\s)*?)(\/?&gt;)/
  },
  css: {
    quote: regexBasics.quote,
    comment: /(\/\*[\s\S]*?\*\/)/,
    pseudo: /(:(?:hover|active|focus|visited|before|after|(?:first|last|nth)-child))/,
    'selector keyword vendor': /(@-(?:moz|o|webkit|ms)-(?=keyframes\s))/,
    'selector keyword': /((?:@(?:import|media|font-face|keyframes)|screen|print|and)(?=[\s({])|keyframes|\s(?:ul|ol|li|table|div|pre|p|a|img|br|hr|h[1-6]|em|strong|span|html|body|iframe|video|audio|input|button|form|label|fieldset|small|abbr|i|dd|dt)\b)/,
    selector: /((?:[.#-\w\*+ >:,\[\]="~\n]|&gt;)+)(?=\s*\{)/, // Any part before '{'.
    'attribute keyword vendor': /(-(?:moz|o|webkit|ms)-(?=transform|transition|user-select|animation|background-size|box-shadow))/,
    'attribute keyword': /\b(content|float|display|position|top|left|right|bottom|(?:(?:max|min)-)?width|(?:(?:max|min|line)-)?height|font(?:-(?:family|style|size|weight|variant|stretch))?|vertical-align|color|opacity|visibility|z-index|transform(?:-(?:origin|style|delay|duration|property|timing-function))?|transition(?:-(?:delay|duration))?|animation(?:-(?:name|delay|duration|direction|fill-mode))?|background(?:-(?:color|position|image|repeat|size))?|(?:padding|margin|border)(?:-(?:top|left|right|bottom))?|border(?:-radius)|white-space|text-(?:align|transform|decoration|shadow|indent)|overflow(?:-(?:x|y))?|(?:letter|word)-spacing|word-break|box-(?:sizing|shadow)|stroke(?:-(?:width|opacity|dasharray|dashoffset|linecap|linejoin))?|fill|speak|outline|user-select|cursor)(?=\s*:)/,
    'value keyword vendor': /(-(?:moz|o|webkit|ms)-(?=linear-gradient))/,
    'value keyword important': /( ?\!important)/,
    'value keyword': /\b(inline-block|inline|block|absolute|relative|static|fixed|inherit|initial|normal|none|auto|hidden|visible|top|left|right|bottom|center|middle|baseline|solid|dotted|dashed|(?:pre-|no)?wrap|pre|break-word|(?:upper|lower)case|capitalize|italic|bold|linear(?:-gradient)?|ease(?:-in)?(?:-out)?|all|infinite|cubic-bezier|(?:translate|rotate)(?:[X-Z]|3d)?|skew[XY]?|scale|(?:no-)?repeat|repeat(?:-x|-y)|contain|cover|!important|url|inset|pointer|flex)(?=\s*[,;}(]|\s+[\da-z])/,
    number: regexBasics.number,
    color: /(transparent|#(?:[\da-fA-F]{6}|[\da-fA-F]{3})|rgba?\([\d., ]*\))/,
    // punctuation: /([:,;{}@#()]+)/,// @todo Why can't use this one if text contains '<' or '>' ??
    htmlentity: /(&.*?;)/,
    punctuation: /([:,;{}@#()]+|&lt;|&gt;)/,
    attribute: /([a-zA-Z-]+)(?=\s*:)/,
    unit: /(px|pt|%|r?em|m?s|deg|vh|vw|vmin|vmax)(?=(?:\s*[;,{}}\)]|\s+[\-\da-z#]))/
  },
  json: {
    quote: regexBasics.quote,
    comment: regexBasics.comment,
    number: regexBasics.number,
    boolean: regexBasics.boolean,
    punctuation: /([[\](){}:;,-]+)/ // Override default to simplify.
  },
  js: {
    quote: regexBasics.quote,
    comment: regexBasics.comment,
    number: /\b(\d+(?:\.\d+)?|null)\b/,
    boolean: regexBasics.boolean,
    this: /\b(this)(?=\W)/,
    keyword: /\b(new|getElementsBy(?:Tag|Class|)Name|getElementById|arguments|if|else|do|return|case|default|function|typeof|undefined|instanceof|document|window|while|for|forEach|switch|in|break|continue|length|var|let|const|export|import|require|from|Number|Boolean|String|Array|Object|(?:clear|set)(?:Timeout|Interval)|Math(?=\.)|Date)(?=\W)/,
    punctuation: /(!==?|(?:[[\](){}:;,+\-%*/?=]|&lt;|&gt;)+|\.+(?![a-zA-Z])|&amp;&amp;|\|\|)/, // Override default since '.' can be part of js variable.
    variable: /(\.?[a-zA-Z]\w*)/,
    htmlentity: /(&.*?;)/,
    dollar: /(\$|jQuery)(?=\W|$)/ // jQuery or $.
  },
  php: {
    quote: regexBasics.quote,
    comment: regexBasics.comment,
    punctuation: regexBasics.punctuation,
    number: regexBasics.number,
    boolean: regexBasics.boolean,
    keyword: /\b(define|echo|die|print_r|var_dump|if|else|do|return|case|default|function|\$this|while|for|switch|in|break|continue)(?=\W|$)/,
    variable: /(?:(?=\W))(\$\w+)/
  },
  sql: {
    quote: regexBasics.quote,
    comment: regexBasics.comment,
    punctuation: regexBasics.punctuation,
    number: /\b(\d+(?:\.\d+)?|null)\b/,
    boolean: regexBasics.boolean,
    keyword: /\b(\*|CREATE|ALL|DATABASE|TABLE|GRANT|PRIVILEGES|IDENTIFIED|FLUSH|SELECT|UPDATE|DELETE|INSERT|FROM|WHERE|(?:ORDER|GROUP) BY|LIMIT|(?:(?:LEFT|RIGHT|INNER|OUTER) |)JOIN|AS|ON|COUNT|CASE|TO|IF|WHEN|BETWEEN|AND|OR|CONCAT)(?=\W|$)/
  }
};

var attributesRegex = {
  xml: /(\s*)([a-zA-Z\-:]+)=("|')(.*?)\3/g,
  html: /(\s*)([a-zA-Z\-]+)=("|')(.*?)\3/g,
  'html-vue': /(\s*)(:?[a-zA-Z\-]+)(?:(?:=("|')(.*?)\3)|)/g
};

var simpleSyntaxHighlighter = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('pre', { staticClass: "ssh-pre", attrs: { "data-type": _vm.language, "data-label": _vm.label }, domProps: { "innerHTML": _vm._s(_vm.content) } });
  }, staticRenderFns: [],
  name: 'ssh-pre',
  props: {
    language: {
      type: String,
      default: ''
    },
    label: {
      type: [String, Boolean],
      default: false
    }
  },
  data: function data() {
    return {
      knownLanguages: Object.keys(dictionary),
      content: ''
    };
  },
  methods: {
    htmlize: function htmlize(string) {
      return string.replace(/&(lt|gt|amp);/g, function (m0, m1) {
        return { lt: '<', gt: '>', amp: '&' }[m1];
      });
    },
    unhtmlize: function unhtmlize(string) {
      return string.replace(/[<>]/g, function (m) {
        return { '<': '&lt;', '>': '&gt;' }[m];
      });
    },
    isColorDark: function isColorDark(colorString) {
      var rgbColor = void 0,
          hexColor = void 0,
          rDark = void 0,
          gDark = void 0,
          bDark = void 0,
          alphaLow = void 0;

      if (rgbColor = colorString.match(/rgba?\((.*),\s*(.*),\s*(.*?)(?:,\s*([^)]*))\)/)) {
        rDark = parseInt(rgbColor[1]) <= 100;
        gDark = parseInt(rgbColor[2]) <= 100;
        bDark = parseInt(rgbColor[3]) <= 100;
        alphaLow = parseFloat(rgbColor[4]) < 0.3;
      } else if (hexColor = colorString.match(/#([\da-f]{3}(?:[\da-f]{3})?)/)) {
        var has3chars = hexColor[1].length === 3;
        rDark = parseInt(hexColor[1][0]) <= 9;
        gDark = parseInt(hexColor[1][has3chars ? 1 : 2]) <= 9;
        bDark = parseInt(hexColor[1][has3chars ? 2 : 4]) <= 9;
      }

      // #00f blue is also a dark color...
      return (rDark && gDark && bDark || rDark && gDark && !bDark || !rDark && gDark && bDark) && !alphaLow;
    },

    // Create a single regex pattern from assembling the regex pieces of the selected language.
    // This regex pattern will be used all at once for the string replacement.
    createRegexPattern: function createRegexPattern(string) {
      var pattern = '';
      var classMap = [];

      for (var Class in dictionary[this.language]) {
        classMap.push(Class);

        if (Class === 'quote') {
          // Add twice because 2 captures are made in the quote regexp.
          classMap.push(Class);
        }

        if (['xml', 'html', 'html-vue'].indexOf(this.language) > -1 && Class === 'tag') {
          classMap.push(Class, Class, Class);
        }

        pattern += (pattern ? '|' : '') + dictionary[this.language][Class].source;
      }

      return [pattern, classMap];
    },
    syntaxHighlightHtmlTag: function syntaxHighlightHtmlTag(dictionaryMatches) {
      var tagPieces = dictionaryMatches.slice(3);

      // Converts every html attribute with syntax highlighting, e.g:
      // ` class="my-class"` => ` <span class="attribute">class</span><span class="punctuation">=</span><span class="quote">"my-class"</span>`,
      // ` checked` => ` <span class="attribute">checked</span><span class="punctuation">=</span><span class="quote">"my-class"</span>`.
      var renderAttributesList = function renderAttributesList() {
        return (
          // `attribute-name`
          arguments[1] + '<span class="attribute">' + arguments[2] + '</span>' + (
          // `=`
          arguments[4] ? '<span class="punctuation">=</span>' : '') + (
          // `"attribute value"`
          arguments[4] ? '<span class="quote">' + (arguments[3] || '') + (arguments[4] || '') + (arguments[3] || '') + '</span>' : '')
        );
      };
      var attributesList = (tagPieces[2] || '').replace(attributesRegex[this.language], renderAttributesList);

      // Considering these 3 possible captures of html tags:
      // `<tag-name attrs>` or `<tag-name attrs />` or `</tag-name>`,
      return (
        // Will be the tag opening: `</` or `<`.
        '<span class="punctuation">' + tagPieces[0] + '</span>' + (
        // Will be the tag-name + attributes list if any.
        '<span class="tag-name">' + tagPieces[1] + '</span>') + attributesList + (
        // Will be the tag end `>` or `/>`.
        '<span class="punctuation">' + tagPieces[3] + '</span>')
      );
    },
    syntaxHighlightContent: function syntaxHighlightContent(string) {
      var _this = this;

      // Only proceed if the language is supported.
      if (this.knownLanguages.indexOf(this.language) > -1) {
        var _createRegexPattern = this.createRegexPattern(),
            _createRegexPattern2 = _slicedToArray(_createRegexPattern, 2),
            regexPattern = _createRegexPattern2[0],
            classMap = _createRegexPattern2[1];

        string = this.unhtmlize(string).replace(new RegExp(regexPattern, 'g'), function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var match = void 0,
              Class = void 0;

          // "arguments.length - 2" because the function is called with arguments like so:
          // function(strMatch, c1, c2, ..., cn, matchOffset, sourceString){}. With c = the captures.
          var dictionaryMatches = Array.prototype.slice.call(args, 1, args.length - 2);
          for (var i = 0; i < dictionaryMatches.length; i++) {
            if (dictionaryMatches[i]) {
              match = dictionaryMatches[i];
              Class = classMap[i];
              break;
            }
          }

          if (Class === 'quote') match = _this.unhtmlize(args[1] || args[2]);
          if (Class === 'comment') match = _this.unhtmlize(match);
          if (Class === 'tag' && ['xml', 'html', 'html-vue'].indexOf(_this.language) > -1) {
            return _this.syntaxHighlightHtmlTag(dictionaryMatches);
          }

          if (Class === 'variable' && match[0] === '.' && _this.language === 'js') {
            /**
             * @todo don't apply variable color if char before '.' is not '\w'.
             */
            return '<span class="punctuation">.</span><span class="objAttr">' + match.substr(1) + '</span>';
          }

          var styles = '';
          if (Class === 'color' && _this.language === 'css') {
            styles = ' style="background-color: ' + match + ';color: #' + (_this.isColorDark(match) ? 'fff' : '000') + '"';
          }

          return '<span class="' + Class + '"' + styles + '>' + match + '</span>';
        });
      }

      return string;
    }
  },
  created: function created() {
    var _this2 = this;

    (this.$slots.default || []).forEach(function (pieceOfCode) {
      if (pieceOfCode.text) {
        _this2.content += pieceOfCode.text;
      }
    });
    this.content = this.syntaxHighlightContent(this.content);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('simple-syntax-highlighter', simpleSyntaxHighlighter);
}

exports.simpleSyntaxHighlighter = simpleSyntaxHighlighter;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=simple-syntax-highlighter.js.map
