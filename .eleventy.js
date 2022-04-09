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

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/darken");
  eleventyConfig.addPassthroughCopy("src/**/*.txt");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  //eleventyConfig.addPassthroughCopy({ 'src/fonts': 'assets/fonts' });
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
