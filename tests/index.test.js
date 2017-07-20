import path from 'path';
import { InlineCSSAMP } from '../src';

test('Should return CSS content not minified', () => {
  const inlinecss = new InlineCSSAMP({
    CSSFilePath: path.join(__dirname,'/css/test.css'),
  });

  inlinecss.readCSS().then( data => {
    expect(data).not.toBeNull(); 
  })
});

test('Should return a error when try read file without the params', () => {
  const inlinecss = new InlineCSSAMP({});
    expect(inlinecss.readCSS()).rejects.toThrow();
});

test('Should return CSS content minified', () => {
  const inlinecss =  new InlineCSSAMP({
    CSSFilePath: path.join(__dirname,'/css/test.css'),
    CSSMinify: true
  });

  expect(inlinecss.minifyCSS()).toBe('body{background:blue}')
});

test('Should return a error when try minify file without the params', () => {
  const inlinecss =  new InlineCSSAMP({});
  expect(() => {
    inlinecss.minifyCSS();
  }).toThrow();
});



