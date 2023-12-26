'use strict';

const styles = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => value ? `${key}:${value};${acc}` : acc, "");
};

module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter('styles', styles);
};
