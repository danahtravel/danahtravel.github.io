// .eleventy.js
module.exports = function(eleventyConfig) {
  // Tell 11ty to copy assets and media directly to /public
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/media");

  return {
    dir: {
      input: "src",         // Where you write code
      output: "public",     // Where 11ty builds the site
      includes: "_includes",// Your layouts/partials
      data: "_data"         // Global data
    }
  };
};