import path from 'path';
import { InlineCSSAMP } from '../src';

test('Should return CSS content not minified', () => {
  const inlinecss = new InlineCSSAMP({
    CSSFilePath: path.join(__dirname,'/css/test.css'),
    CSSMinify: false,
  });

  inlinecss.readCSS().then( data => {
    expect(data).not.toBeNull();
  })
});
``
test('Should return SCSS content not minified', () => {
  const inlinecss = new InlineCSSAMP({
    CSSFilePath: path.join(__dirname,'/css/test.scss'),
    CSSMinify: false,
  });

  inlinecss.readCSS().then( data => {
    expect(data).not.toBeNull();
  })
});

test('Should return a error when try read file without the params', () => {
  const inlinecss = new InlineCSSAMP({});
  expect(() => {
    inlinecss.readCSS();
  }).toThrow();
});

test('Should return CSS content minified', () => {
  const inlinecss =  new InlineCSSAMP({
    CSSFilePath: path.join(__dirname,'/css/test.css'),
    CSSMinify: true
  });

  inlinecss.readCSS().then( data => {
    expect(data).toMatch('body{background:blue}');
  })
});

test('Should return SCSS content minified', () => {
  const inlinecss =  new InlineCSSAMP({
    CSSFilePath: path.join(__dirname,'/css/test.scss'),
    CSSMinify: true
  });

  inlinecss.readCSS().then( data => {
    expect(data).toMatch('body p{color:blue}');
  })
});

test('Should replace content in <head> with <style amp-custom>', () => {
  const inlinecss = new InlineCSSAMP({});
  const html = '<head></head>';
  const content = 'body{colo: blue;}';
  const result = inlinecss.tagStyle(html, content);
  expect(result).toMatch(/amp-custom/);;
});

test('Should return content but, do not search <head> tag' , () => {
  const inlinecss = new InlineCSSAMP({});
  const html = '<body> </body>';
  const result = inlinecss.tagStyle(html);
  expect(result).toMatch(/body/);;
});
