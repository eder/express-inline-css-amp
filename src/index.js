import fs from 'fs';
import uglifycss from 'uglifycss';

export class InlineCSSAMP {
  constructor({CSSFilePath, CSSMinify = true}) {
    this.CSSFilePath = CSSFilePath;
    this.CSSMinify = CSSMinify;
  
  }
  
  readCSS() {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(this.CSSFilePath, 'utf8', (err, file) => {
          return resolve(file)
        }) 
      }
      catch(err) {
        throw err
        return reject(err)
      }
    })
  }

  minifyCSS () {
    if (!this.CSSFilePath) {
      throw "You need add a file in CSSFilePath param";
      return
    }
    
    try {
      return uglifycss.processFiles([this.CSSFilePath]);
    }
    
    catch(err) {
      console.trace(err);
      return err;
    }
  }

  sendCSSContent() {
    return new Promise((resolve, reject) => {
      if (!this.CSSMinify) {
        this.readCSS().then(data => {
          return resolve(data);
        });
      }
      return resolve(this.minifyCSS())
    })
  }

  tagStyle(data) {
    return `<style amp-custom>${data}</style> </head>`
  }

}

const inlineCSSAMP = object => {
  const inlinecss = new InlineCSSAMP(object);
  const render = (req, res, next) => {
    const renderCallback = function(callback)  {
      return function (err, html) {
        inlinecss.sendCSSContent().then(content => {
          res.send(html.replace(/(<\/head>)/i, inlinecss.tagStyle(content))); 
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
