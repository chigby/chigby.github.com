const { minify } = require('terser');
const CleanCSS = require("clean-css");

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

  // separate projects included fully
  eleventyConfig.addPassthroughCopy("src/darken");
  eleventyConfig.addPassthroughCopy("src/offsetCipher");
  eleventyConfig.addPassthroughCopy("src/pq");
  eleventyConfig.addPassthroughCopy("src/twine");

  // assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/vid");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/**/*.txt");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  return {
    templateFormats: [
      "njk",
    ],
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "docs"
    }
  };
};
