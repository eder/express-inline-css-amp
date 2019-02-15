import fs from 'fs';
import sass from 'node-sass';

const NODE_ENV = process.env.NODE_ENV;

export class InlineCSSAMP {
  constructor({
    CSSPathBase,
    CSSFilePath,
    CSSMinify = true,
    outFile,
    version,
  }) {
    this.CSSFilePath = CSSFilePath;
    this.CSSMinify = CSSMinify;
    this.CSSPathBase = CSSPathBase;
    this.outFile = outFile || `/tmp/generate-by-express-inline-css-amp-${version}.css`;
    this.version = version;
    this.pathToReadCSS =  this.outFile;
  }

  verify() {
    if (!this.CSSFilePath) {
      throw "You need add a file in CSSFilePath param";
   }
  }

  async generateCSS(view) {
    this.pathToReadCSS =  `${this.CSSPathBase}${view}.scss`;
    const response = await this.readCSS(view);
    if (response) {
      this.outFile = `/tmp/generate-by-express-inline-css-amp-${this.version}-${view}.scss`;
      this.CSSFilePath =  `${this.CSSPathBase}${view}.scss`;
    } else {
      this.pathToReadCSS = this.outFile;
    }
    
    return new Promise((resolve, reject) => {
        let options = {
          file: this.CSSFilePath,
          outFile: this.outFile,
          outputStyle: this.CSSMinify ? 'compressed' : '',
        }
        try {
          sass.render(options, (err, result) => {
            if(err) {
              console.error(err);
              return reject(err);
            }
            fs.writeFile(this.outFile, result.css, function(err){
            });
          });
        }
        catch(err) {
          throw err
        }
        resolve();
    })
  }
  
  readCSS() {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(this.pathToReadCSS, 'utf8', (err, file) => {
          return resolve(file)
        })
      }
      catch(err) {
        throw err
      }
    })
  }
  
  async run (view) {
    if (NODE_ENV && NODE_ENV != 'development' && fs.existsSync(this.pathToReadCSS)) {
      return this.readCSS();
    }
    await this.generateCSS(view);
    return this.readCSS();

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

