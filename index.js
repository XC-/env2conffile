#!/usr/bin/env node

const path = require("path");
const minimist = require("minimist");

const { Generate } = require("./src/generator");

const DEFAULTS = {
  output: "stdout",
  renderer: "json",
  varPrefix: "",
  varSuffix: "",
  doNotStrip: "false"
};

const HELP = {
  output: {
    description: "Output target.",
    values: ["file", "stdout", "stderr"]
  },
  outputFile: {
    description: "Filename and path of the file when using file output."
  },
  renderer: {
    description: "Renderer used to format the configuration.",
    values: ["json", "yaml", "handlebars"]
  },
  template: {
    description: "Filename and path of the Handlebars template file."
  },
  varPrefix: {
    description: "Variable prefix used to filter the environment variables."
  },
  varSuffix: {
    description: "Variable suffix used to filter the environment variables."
  },
  doNotStrip: {
    description: "Do not strip prefix and suffix from the environment variable."
  }
};

const pkgJson = require(path.join(__dirname, "package.json"));

function outputHelp() {
  console.log(`${pkgJson.name} version ${pkgJson.version} command line parameters:\n`);
  Object.keys(HELP).forEach((key) => {
    console.log(`${key}:`);
    console.log(`    Description: ${HELP[key].description}`);
    if (HELP[key].values) {
      console.log(`    Possible values: ${HELP[key].values.join(", ")}`);
    }
    if (DEFAULTS[key]) {
      console.log(`    Default value: ${DEFAULTS[key]}`);
    }
  })
}

function outputVersion() {
    console.log(`${pkgJson.name} ${pkgJson.version}`);
}


if (!module.parent) {
  const args = process.argv.slice(2);
  const opts = minimist(args, { default: DEFAULTS, alias: { h: "help", v: "version", d: "debug" } });
  if (opts.help) {
    outputHelp();
    process.exit(0);
  }

  if (opts.version) {
    outputVersion();
    process.exit(0);
  }

  if (opts.debug) console.debug("Command line arguments: ", JSON.stringify(opts, null, 2));
  Generate(opts);
}
