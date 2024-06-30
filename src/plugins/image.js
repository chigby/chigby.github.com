'use strict';

const path = require('path');

const IMG_SRC = './content/images/';

const Image = require('@11ty/eleventy-img');

const imageAttrs = {
  loading: 'lazy',
  decoding: 'async',
};

const imageOptions = {
  widths: [640, 960, 1600],
  formats: ['avif', 'jpeg'],
  sharpJpegOptions: {
    quality: 80, // default
    progressive: true,
  },
  sharpAvifOptions: {
    quality: 80,
  },
};

const getImage = (
  src,
  alt = '',
  sizes = 'default',
  attrs = {},
) => {
  let urlPath = '/images';
  let outputDir = './docs/images/';

  const fullSrc = `${IMG_SRC}${src}`;
  if (fullSrc.startsWith(IMG_SRC)) {
    const dir = path.dirname(src);
    outputDir = `${outputDir}${dir}`;
    urlPath = `${urlPath}${dir}`;
  }
  const opts = {
    ...imageOptions,
    outputDir,
    urlPath,
  };

  Image(fullSrc, opts);
  const metadata = Image.statsSync(fullSrc, opts);

  const imageAttributes = {
    ...imageAttrs,
    ...attrs,
    alt,
    sizes: '(min-width: 65em) 60vw, 95vw',
  };
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: 'inline',
  });
};


const image = (src, alt = '', sizes = 'default', attrs = {}) => getImage(src, alt, sizes, attrs);

module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode('img', image);
};
