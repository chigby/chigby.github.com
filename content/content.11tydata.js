'use strict';

module.exports = {
  eleventyComputed: {
    banner: data => data.banner || data.title,
  }
};
