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
const LINE_END_RE = /\r\n|\n/;

const ENVFILE_COMMENT_CHAR = "#";
const ENVFILE_VAR_SEPARATOR = "=";

function jsonPrettyPrint(msg, j) {
  console.log(msg, JSON.stringify(j, null, DEFAULT_JSON_INDENT));
}

function Generate({output, outputFile, renderer, template, varPrefix, varSuffix, doNotStrip, envFile, env, debug}) {

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
    .forEach((key) => {
      let outputKey = key;
      if (!doNotStrip) {
        outputKey = key.replace(new RegExp("^" + varPrefix), "").replace(new RegExp(varSuffix + "$"), "");
      }
      filteredEnv[outputKey] = env[key]
    });

  if (debug) jsonPrettyPrint("Renderer context before envFile: ", filteredEnv);

  let envFromFile = {};
  if (envFile) {
    fs.readFileSync(envFile, "utf-8")
      .split(LINE_END_RE)
      .map((line) => line.trim())
      .filter((line) => !!line)
      .filter((line) => !line.startsWith(ENVFILE_COMMENT_CHAR))
      .map((line) => {
        let parts = line.split(ENVFILE_VAR_SEPARATOR);
        return [parts[0], parts.slice(1).join(ENVFILE_VAR_SEPARATOR)];
      })
      .forEach((pair) => envFromFile[pair[0]] = pair[1]);

      if (debug) jsonPrettyPrint("Variables from envFile: ", envFromFile);
  }

  const finalEnv = Object.assign({}, envFromFile, filteredEnv);

  if (debug) jsonPrettyPrint("Combined env: ", finalEnv);

  outputs[output](renderers[renderer](finalEnv));
}

module.exports = {
  Generate
};
