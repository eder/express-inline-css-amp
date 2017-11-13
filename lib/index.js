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

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NODE_ENV = process.env.NODE_ENV;

var InlineCSSAMP = exports.InlineCSSAMP = function () {
  function InlineCSSAMP(_ref) {
    var CSSFilePath = _ref.CSSFilePath,
        _ref$CSSMinify = _ref.CSSMinify,
        CSSMinify = _ref$CSSMinify === undefined ? true : _ref$CSSMinify,
        outFile = _ref.outFile,
        version = _ref.version;
    (0, _classCallCheck3.default)(this, InlineCSSAMP);

    this.CSSFilePath = CSSFilePath;
    this.CSSMinify = CSSMinify;
    this.outFile = outFile || '/tmp/generate-by-express-inline-css-amp-' + version + '.css';
    this.version = version;
  }

  (0, _createClass3.default)(InlineCSSAMP, [{
    key: 'verify',
    value: function verify() {
      if (!this.CSSFilePath) {
        throw "You need add a file in CSSFilePath param";
      }
    }
  }, {
    key: 'generateCSS',
    value: function generateCSS() {
      var _this = this;

      this.verify();
      var options = {
        file: this.CSSFilePath,
        outFile: this.outFile,
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
            _fs2.default.writeFile(_this.outFile, result.css, function (err) {});
          });
        } catch (err) {
          throw err;
        }
      });
    }
  }, {
    key: 'readCSS',
    value: function readCSS() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          _fs2.default.readFile(_this2.outFile, 'utf8', function (err, file) {
            return resolve(file);
          });
        } catch (err) {
          throw err;
        }
      });
    }
  }, {
    key: 'run',
    value: function run() {
      if (NODE_ENV && NODE_ENV != 'development' && _fs2.default.existsSync(this.outFile)) {
        return this.readCSS();
      }
      return this.generateCSS();
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

module.exports = function (object) {
  var inlinecss = new InlineCSSAMP(object);
  var render = function render(req, res, next) {
    var renderCallback = function renderCallback() {
      return function (err, html) {
        inlinecss.run().then(function (content) {
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