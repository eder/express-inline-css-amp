'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InlineCSSAMP = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InlineCSSAMP = exports.InlineCSSAMP = function () {
  function InlineCSSAMP(_ref) {
    var CSSFilePath = _ref.CSSFilePath,
        _ref$CSSMinify = _ref.CSSMinify,
        CSSMinify = _ref$CSSMinify === undefined ? true : _ref$CSSMinify;
    (0, _classCallCheck3.default)(this, InlineCSSAMP);

    this.CSSFilePath = CSSFilePath;
    this.CSSMinify = CSSMinify;
  }

  (0, _createClass3.default)(InlineCSSAMP, [{
    key: 'verify',
    value: function verify() {
      if (!this.CSSFilePath) {
        throw "You need add a file in CSSFilePath param";
      }
    }
  }, {
    key: 'readCSS',
    value: function readCSS() {
      this.verify();

      var options = {
        file: this.CSSFilePath,
        outputStyle: this.CSSMinify ? 'compressed' : ''

      };

      return new Promise(function (resolve, reject) {

        try {
          _nodeSass2.default.render(options, function (err, result) {
            if (err) {
              console.error(err);
              return reject(err);
            }
            resolve(result.css.toString());
          });
        } catch (err) {
          throw err;
        }
      });
    }
  }, {
    key: 'tagStyle',
    value: function tagStyle(html, content) {
      var er = /(<\/head>)/i;
      if (!er.test(html)) return html;
      return html.replace(er, '<style amp-custom>' + content + '</style>$1');
    }
  }]);
  return InlineCSSAMP;
}();

var inlineCSSAMP = function inlineCSSAMP(object) {
  var inlinecss = new InlineCSSAMP(object);
  var render = function render(req, res, next) {
    var renderCallback = function renderCallback() {
      return function (err, html) {
        inlinecss.readCSS().then(function (content) {
          res.send(inlinecss.tagStyle(html, content));
        });
      };
    };

    res.Render = res.render;
    res.render = function (view, renders, callback) {
      this.Render(view, renders, renderCallback(callback));
    };

    return next();
  };

  return render;
};

exports.default = inlineCSSAMP;