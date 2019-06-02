# env2conffile
env2conffile (name pending): Create a configuration file from env variables

# Installation

`npm install -g env2conffile` for global install or `npm install env2conffile` for local.

# Usage

Command line parameters:
```
output:
    description: Output target.
    possible values: file, stdout, stderr
    default value: stdout
outputFile:
    description: Filename and path of the file when using file output.
renderer:
    description: Renderer used to format the configuration.
    possible values: json, yaml, handlebars
    default value: json
template:
    description: Filename and path of the Handlebars template file.
varPrefix:
    description: Variable prefix used to filter the environment variables.
varSuffix:
    description: Variable suffix used to filter the environment variables.
```

Following examples assume that the package is installed globally.

Example using handlebars template:

`BAR_SOMETHING_ELSE_FOO=000 BAR_SOMETHING_FOO=123 BAR_SOME=456 SOME_FOO=789 env2conffile --renderer handlebars --varSuffix _FOO --varPrefix BAR_ --template test.hb --output file --outputFile ../foobar`

Example with default json output and stdout:

`BAR_SOMETHING_ELSE_FOO=000 BAR_SOMETHING_FOO=123 BAR_SOME=456 SOME_FOO=789 env2conffile --varSuffix _FOO --varPrefix BAR_`

## Notice

In the configuration file when not using a handlebars template, the prefix and suffix are stripped from the variable name.
