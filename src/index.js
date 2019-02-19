import fs from 'fs';
import sass from 'node-sass';

const NODE_ENV = process.env.NODE_ENV;

export class InlineCSSAMP {
  constructor({
    CSSPathBase = '/tmp/',
    CSSFilePath,
    CSSMinify = true,
    outFile,
    version,
  }) {
    this.CSSOutDefault = `/tmp/generate-by-express-inline-css-amp-${version}.css`;
    this.CSSFilePath = CSSFilePath;
    this.CSSMinify = CSSMinify;
    this.CSSPathBase = CSSPathBase;
    this.outFile = outFile || this.CSSOutDefault
    this.version = version;
    this.pathToReadCSS =  this.outFile;
  }

  async generateCSS(view) {
    this.pathToReadCSS = `${this.CSSPathBase}${view}.scss`;
    const response = fs.existsSync(`${this.CSSPathBase}${view}.scss`)
    if (response) {
      this.outFileTemp = `/tmp/generate-by-express-inline-css-amp-${this.version}-${view}.scss`;
      this.CSSFilePathTemp = this.pathToReadCSS;
    } else {
      this.CSSFilePathTemp = this.CSSFilePath;
      this.pathToReadCSS = this.outFile;
      this.outFileTemp  = this.outFile;
    }


    return new Promise((resolve, reject) => {
      let options = {
        file: this.CSSFilePathTemp,
        outFile: this.outFileTemp,
        outputStyle: this.CSSMinify ? 'compressed' : '',
      }
      
      if (NODE_ENV != 'development') {
        if (fs.existsSync(this.outFileTemp) && fs.existsSync(this.CSSOutDefault)) {

          return  resolve();
        } else {
          if(!fs.existsSync(this.CSSFilePathTemp) && fs.existsSync(this.CSSOutDefault)) {
            return  resolve();
          }
        }
      }

      try {
        sass.render(options, (err, result) => {
          if(err) {
            console.error(err);
            return reject(err);
          }

          fs.writeFile(this.outFileTemp, result.css, function(err){
          });
        });
      }
      catch(err) {
        throw err
      }
      resolve();
    })
  }
  
  readCSS(view) {
    const viewFile = `/tmp/generate-by-express-inline-css-amp-${this.version}-${view}.scss`;
    const file = fs.existsSync(viewFile) ? viewFile : this.CSSOutDefault;

    return new Promise((resolve, reject) => {
      try {
        fs.readFile(file, 'utf8', (err, file) => {
          return resolve(file)
        })
      }
      catch(err) {
        throw err
      }
    })
  }
  async run (view) {
    await this.generateCSS(view);
    return this.readCSS(view);
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

