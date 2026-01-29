import fontAwesomePlugin from "@11ty/font-awesome";

/** @param {import('@11ty/eleventy')} config */
export default async function(config) {
  config.addTemplateFormats("css");

  // Layout aliases
  config.addLayoutAlias("base", "layouts/base.njk");

  // Font Awesome SVG icons (using span instead of i)
  config.addPlugin(fontAwesomePlugin);

  config.addPassthroughCopy({
    "node_modules/smart-webcomponents/source/": "assets/smart-webcomponents/",
    "node_modules/@patternfly/patternfly/*.css": "assets/css/patternfly/",
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "../_includes",
      layouts: "../_includes/layouts",
      data: "../_data"
    }
  };
};
