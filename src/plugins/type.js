'use strict';

const markdownit = require('markdown-it');

const marker = markdownit({
  html: true,
  typographer: true,
});

const inline = (content) => (content ? marker.renderInline(content.trim()) : "");

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter("mdInline", inline);
};
