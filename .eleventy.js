const { minify } = require('terser');
const CleanCSS = require("clean-css");
const JSON5 = require('json5');
const pluginRss = require("@11ty/eleventy-plugin-rss");

const configUtils = require('./src/plugins/utils');
const typeUtils = require('./src/plugins/type');
const timeUtils = require('./src/plugins/time');

module.exports = function(eleventyConfig) {  // Set custom directories for input, output, includes, and data
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
    code,
    callback
  ) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.err('Terser error', err);
      // Fail gracefully
      callback(null, code);
    }
  });
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(configUtils);
  eleventyConfig.addPlugin(typeUtils);
  eleventyConfig.addPlugin(timeUtils);

  // configure json5 support for data files
  eleventyConfig.addDataExtension('json5', JSON5.parse);

  // separate projects included fully
  eleventyConfig.addPassthroughCopy("content/darken/index.html");
  eleventyConfig.addPassthroughCopy("content/offset-cipher");
  eleventyConfig.addPassthroughCopy("src/pq");
  eleventyConfig.addPassthroughCopy("src/twine");

  // assets
  eleventyConfig.addPassthroughCopy("content/css");
  eleventyConfig.addPassthroughCopy("content/fonts");
  eleventyConfig.addPassthroughCopy("content/img");
  eleventyConfig.addPassthroughCopy("content/vid");
  eleventyConfig.addPassthroughCopy("content/**/*.txt");
  eleventyConfig.addPassthroughCopy("content/favicon.ico");
  eleventyConfig.addPassthroughCopy("content/CNAME");
  return {
    markdownTemplateEngine: 'njk',
    templateFormats: [
      "njk",
      "md"
    ],
    dir: {
      input: "content",
      includes: "_includes",
      data: "_data",
      output: "docs"
    }
  };
};
