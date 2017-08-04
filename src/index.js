import sass from 'node-sass';

export class InlineCSSAMP {
  constructor({CSSFilePath, CSSMinify = true}) {
    this.CSSFilePath = CSSFilePath;
    this.CSSMinify = CSSMinify;
  }

  verify() {
    if (!this.CSSFilePath) {
      throw "You need add a file in CSSFilePath param";
      return
   }
  }

  readCSS() {
    this.verify();

    let options = {
      file: this.CSSFilePath,
      outputStyle: this.CSSMinify ? 'compressed' : '',

    }

    return new Promise((resolve, reject) => {

      try {
        sass.render(options, (err, result) => {
          resolve(result.css.toString())
        });
      }
      catch(err) {
        throw err
        return reject(err)
      }
    })
  }

  tagStyle(html, content) {
    const er = /(<\/head>)/i;
    if (!er.test(html)) return html;
    return html.replace(er, `<style amp-custom>${content}</style>$1`);
  }
}

const inlineCSSAMP = object => {
  const inlinecss = new InlineCSSAMP(object);
  const render = (req, res, next) => {
    const renderCallback = function(callback)  {
      return function (err, html) {
        inlinecss.readCSS().then(content => {
          res.send(inlinecss.tagStyle(html,content));
        })
      }
    }

    res.Render = res.render
    res.render = function (view, renders, callback) {
      this.Render(view, renders, renderCallback(callback))
    }

    return next()
  }

  return render;

}


export default inlineCSSAMP;
