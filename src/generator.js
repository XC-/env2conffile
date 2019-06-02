const fs = require("fs");
const YAML = require("yaml");
const handlebars = require("handlebars");

const DEFAULT_JSON_INDENT = 2;

const errors = {
  "UNKNOWN_OUTPUT": 1,
  "UNKNOWN_RENDERER": 2,
  "NO_OUTPUT_FILE": 3,
  "NO_TEMPLATE": 4
};

function Generate({output, outputFile, renderer, template, varPrefix, varSuffix, env, debug}) {

  const outputs = {
    file: (rendered) => fs.writeFileSync(outputFile, rendered, "utf-8"),
    stdout: (rendered) => console.log(rendered),
    stderr: (rendered) => console.error(rendered)
  };

  const renderers = {
    json: (obj) => JSON.stringify(obj, null, DEFAULT_JSON_INDENT),
    yaml: (obj) => YAML.stringify(obj),
    handlebars: (context) => handlebars.compile(fs.readFileSync(template, "utf-8"), { strict: true })(context)
  };

  if (Object.keys(outputs).indexOf(output) === -1) {
    console.error("Unsupported output type.");
    return process.exit(errors.UNKNOWN_OUTPUT);
  }

  if (Object.keys(renderers).indexOf(renderer) === -1) {
    console.error("Unsupported renderer.");
    return process.exit(errors.UNKNOWN_RENDERER);
  }

  if (output === "file" && !outputFile) {
    console.error("Output file and path must be defined when using file output option.");
    return process.exit(errors.NO_OUTPUT_FILE);
  }

  if (renderer === "handlebars" && !template) {
    console.error("Path to Handlebars template must be defined when using Handlebars renderer.");
    return process.exit(errors.NO_TEMPLATE);
  }

  if (!env) {
    console.log("Using process environment...");
    env = process.env;
  }

  const filteredEnv = {};
  Object.keys(env)
    .filter((key) => varPrefix ? key.startsWith(varPrefix) : true)
    .filter((key) => varSuffix ? key.endsWith(varSuffix) : true)
    .forEach((key) => filteredEnv[key.replace(new RegExp("^" + varPrefix), "").replace(new RegExp(varSuffix + "$"), "")] = env[key]);

  if (debug) console.debug("Renderer context: ", JSON.stringify(filteredEnv, null, DEFAULT_JSON_INDENT));

  outputs[output](renderers[renderer](filteredEnv));
}

module.exports = {
  Generate
};
