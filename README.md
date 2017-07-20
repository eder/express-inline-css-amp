# express-inline-css-amp
> :zap: Express middleware to generate inline rendering CSS to AMP:
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

import express from 'express';
import inlineCSSAMP from 'express-inline-css-amp';

const app = express();

app.use(inlineCSSAMP({
  CSSFilePath: path.join(__dirname,'../public/assets/css/style.css'),
  CCSMinify: true,
}));


app.get('/', (req, res) => {
  res.render('index', {});
});

```

- `CSSFilePath`: Path of the final css file where rules are taken out.
- `CCSMinify` (optional): This brings up the possibility of mifying the css file.

## License

MIT © [Eder Eduardo]
