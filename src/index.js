import fs from 'fs';
import sass from 'node-sass';

const NODE_ENV = process.env.NODE_ENV;

export class InlineCSSAMP {
  constructor({
    CSSPathBase,
    CSSFilePath,
    CSSMinify = true,
    fileByRoutes,
    outFile,
    version,
  }) {
    this.CSSFilePath = CSSFilePath;
    this.CSSMinify = CSSMinify;
    this.CSSPathBase = CSSPathBase;
    this.outFile = outFile || `/tmp/generate-by-express-inline-css-amp-${version}.css`;
    this.version = version;
    this.fileByRoutes = fileByRoutes;
  }

  verify() {
    if (!this.CSSFilePath) {
      throw "You need add a file in CSSFilePath param";
   }
  }

  generateCSS(byRoutes) {
    this.verify();
    let options = {
      file: this.CSSFilePath,
      outFile: this.outFile,
      outputStyle: this.CSSMinify ? 'compressed' : '',
    }

    return new Promise((resolve, reject) => {
      try {
        sass.render(options, (err, result) => {
          if(err) {
            console.error(err);
            return reject(err);
          }
          resolve(result.css.toString())
          fs.writeFile(this.outFile, result.css, function(err){
          });
        });
      }
      catch(err) {
        throw err
      }
    })
  }
  
  readCSS() {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(this.outFile, 'utf8', (err, file) => {
          return resolve(file)
        })
      }
      catch(err) {
        throw err
      }
    })
  }
  
  generateCSSByRoutes() {
    this.fileByRoutes.map(route => {
      this.outFile = `${this.CSSPathBase}${route}`;
      this.CSSFilePath =  `${this.CSSPathBase}${route}`;
    });
  }

  run (view) {
    if (NODE_ENV && NODE_ENV != 'development' && fs.existsSync(this.outFile)) {
      return this.readCSS();
    }
    this.generateCSSByRoutes();
  }

  tagStyle(html, content) {
    const er = /(<\/head>)/i;
    if (!er.test(html)) return html;
    return html.replace(er, `<style amp-custom>${content}</style>$1`);
  }
}

module.exports = object => {
  const inlinecss = new InlineCSSAMP(object);
  const render = (req, res, next) => {
    const renderCallback = function(view)  {
     
      return function (err, html) {
        inlinecss.run(view).then(content => {
          res.send(inlinecss.tagStyle(html,content));
        })
      }
    }

    res.Render = res.render
    res.render = function (view, renders, callback) {
      this.Render(view, renders, renderCallback(view))
    }

    return next()
  }

  return render;

}

