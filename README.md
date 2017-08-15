
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
import from path
import express from 'express';
import inlineCSSAMP from 'express-inline-css-amp';

const app = express();

app.use(inlineCSSAMP({
  CSSFilePath: path.join(__dirname,'../public/assets/css/style.scss') // Yes its works with css, scss our sass \o/
}));

app.get('/', (req, res) => {
  res.render('index', {});
});

```

- `CSSFilePath`: Path of the final css file where rules are taken out.
- `CCSMinify`:  Default is true, this brings up the possibility of mifying the css file.

## License

MIT © [Eder Eduardo]
