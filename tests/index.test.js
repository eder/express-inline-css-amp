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
  const inlinecss = new InlineCSSAMP({});
  expect(() => {
    inlinecss.minifyCSS();
  }).toThrow();
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



