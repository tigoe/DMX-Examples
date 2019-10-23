# How This Repository Is Structured

If you'd like to contribute to this repo, here's how the structure works. 

The public face of the repo is the [GitHub Pages site](https://tigoe.github.io/DMX-Examples). All of the pages for that site live in the [docs](docs/) folder. Put your detailed markdown documentation pages there. There is an [img subdirectory](docs/img) there for images. 

Please include the following on each documentation page:

* Introduction
* Bill of Materials
* Hardware Configuration
* Software Configuration
* Further explanation if needed
* Link to example code

The [ledmx-pro4-control page](docs/ledmx-pro4-control.md) is a decent example. This [template document](docs/template.md) was made from that example. 

Please make sure all documentation is WCAG-compatible, include Figure numbers and references, and image descriptions.

There is also an [_includes](docs/_includes) and [_layouts](docs/_layouts) subdirectory for configuring the templates for GitHub pages. If you need to add links to the nav bar of the pages site, see the nav.html file.

All code samples live in the root of the repo, in directories for each programming environment. 