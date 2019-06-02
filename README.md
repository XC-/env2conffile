# env2conffile
env2conffile (name pending): Create a configuration file from env variables

# Why

Why indeed. This little script was inspired by Gitlab CI and outside of CI/CD, there might not be too much use for this.
In CI/CD pipelines it is sometimes useful to generate configuration files depending on the target environment and sometimes
using tools such as Ansible or Terraform can be overkill if the intention is to just generate simple files. Since most of the
information is relayed via environment variables, templating and/or automatic creation of the said configuration files is a 
tempting option.

This little script does just that. In CI environment one can define variables for example `PRODUCTION_DOMAIN` or `STAGING_DOMAIN`
and this script does the rest so that just the `DOMAIN` part ends up in the configuration file. At simplest the files are
plain JSON or YAML, but can be more complex. For that use case this tool supports [Handlebars](https://handlebarsjs.com/) templates.

# Installation

`npm install -g env2conffile` for global install or `npm install env2conffile` for local.

# Usage

Command line parameters:
```
output:
    Description: Output target.
    Possible values: file, stdout, stderr
    Default value: stdout
outputFile:
    Description: Filename and path of the file when using file output.
renderer:
    Description: Renderer used to format the configuration.
    Possible values: json, yaml, handlebars
    Default value: json
template:
    Description: Filename and path of the Handlebars template file.
varPrefix:
    Description: Variable prefix used to filter the environment variables.
varSuffix:
    Description: Variable suffix used to filter the environment variables.
doNotStrip:
    Description: Do not strip prefix and suffix from the environment variable.
    Default value: false
```

Following examples assume that the package is installed globally.

Example using handlebars template:

`BAR_SOMETHING_ELSE_FOO=000 BAR_SOMETHING_FOO=123 BAR_SOME=456 SOME_FOO=789 env2conffile --renderer handlebars --varSuffix _FOO --varPrefix BAR_ --template test.hb --output file --outputFile ../foobar`

Example with default json output and stdout:

`BAR_SOMETHING_ELSE_FOO=000 BAR_SOMETHING_FOO=123 BAR_SOME=456 SOME_FOO=789 env2conffile --varSuffix _FOO --varPrefix BAR_`

## Notice

In the configuration file when not using a handlebars template, the prefix and suffix are stripped from the variable name.
