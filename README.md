
# express-inline-css-amp
[![CircleCI](https://circleci.com/gh/eder/express-inline-css-amp/tree/master.svg?style=svg&circle-token=4bbaf0984d2072700bf57071ee2379bc2851d1be)](https://circleci.com/gh/eder/express-inline-css-amp/tree/master)
> :zap: Express middleware to generate inline rendering CSS for AMP:
```html
<!doctype html>
<html ⚡>
  <head>
    <title>Exemple</title>
    <style amp-custom>
      ...
    </style>
  </head>
</html>
```

## Installation

```sh
  npm install --save express-inline-css-amp
```

## Preview
```js
// The render method
import path from 'path';
import express from 'express';
import inlineCSSAMP from 'express-inline-css-amp';

const app = express();
// Yes its works with css, scss and sass \o/
app.use(inlineCSSAMP({
  CSSFilePath: path.join(__dirname,'../public/assets/css/style.scss'),
  version: new Date().getTime(),
}));

app.get('/', (req, res) => {
  res.render('index', {});
});

```
-  Yes its works with css, scss and sass \o/.
- `CSSFilePath`: Path of the final css file where rules are taken out.
- `CCSMinify`:  Default is true, this brings up the possibility of mifying the css file.
- `version`:  value - Now, we can cache from css generated automatically just in production 
## License

MIT © [Eder Eduardo]
