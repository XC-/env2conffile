#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

const { Generate } = require("./src/generator");

const CONFIGURATION_FILE = ".e2crc";

const DEFAULT_ENV_FILE = path.join(process.cwd(), ".env");

const DEFAULTS = {
  output: "stdout",
  renderer: "json",
  varPrefix: "",
  varSuffix: "",
  doNotStrip: false
};

const HELP = {
  envFile: {
    description: "Variable file (dotenv-like). Used for additional variables and is applied AFTER filtering with varPrefix and varSuffix"
  },
  output: {
    description: "Output target.",
    values: ["file", "stdout", "stderr"]
  },
  outputFile: {
    description: "Filename and path of the file when using file output. Sets '--output file' automatically."
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
  },
  debug: {
    description: "Show debug prints."
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
    if (JSON.stringify(DEFAULTS[key])) {
      console.log(`    Default value: ${DEFAULTS[key]}`);
    }
  })
}

function outputVersion() {
    console.log(`${pkgJson.name} ${pkgJson.version}`);
}

if (!module.parent) {
  const args = process.argv.slice(2);
  let optsFromFile;
  try {
    const rawConfFromFile = fs.readFileSync(path.join(process.cwd(), CONFIGURATION_FILE));
    optsFromFile = JSON.parse(rawConfFromFile);
  } catch(e) {
    // pass
  }
  const optsFromLine = minimist(args, { alias: { h: "help", v: "version", d: "debug" } });

  const opts = Object.assign({}, DEFAULTS, optsFromFile, optsFromLine);
  if (opts.debug) console.debug("Raw command line arguments: ", JSON.stringify(opts, null, 2));

  if (opts.help) {
    outputHelp();
    process.exit(0);
  }

  if (opts.version) {
    outputVersion();
    process.exit(0);
  }

  if (opts.outputFile) opts.output = "file";

  if (!opts.envFile) {
    if (fs.existsSync(DEFAULT_ENV_FILE)) opts.envFile = DEFAULT_ENV_FILE;
  }

  if (opts.debug) console.debug("Options: ", JSON.stringify(opts, null, 2));

  Generate(opts);
}
