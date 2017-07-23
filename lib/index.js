'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InlineCSSAMP = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _uglifycss = require('uglifycss');

var _uglifycss2 = _interopRequireDefault(_uglifycss);

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
    key: 'readCSS',
    value: function readCSS() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        try {
          _fs2.default.readFile(_this.CSSFilePath, 'utf8', function (err, file) {
            return resolve(file);
          });
        } catch (err) {
          throw err;
          return reject(err);
        }
      });
    }
  }, {
    key: 'minifyCSS',
    value: function minifyCSS() {
      if (!this.CSSFilePath) {
        throw "You need add a file in CSSFilePath param";
        return;
      }

      try {
        return _uglifycss2.default.processFiles([this.CSSFilePath]);
      } catch (err) {
        console.trace(err);
        return err;
      }
    }
  }, {
    key: 'sendCSSContent',
    value: function sendCSSContent() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (!_this2.CSSMinify) {
          _this2.readCSS().then(function (data) {
            return resolve(data);
          });
        }
        return resolve(_this2.minifyCSS());
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
    var renderCallback = function renderCallback(callback) {
      return function (err, html) {
        inlinecss.sendCSSContent().then(function (content) {
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