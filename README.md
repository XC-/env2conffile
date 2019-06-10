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

### Command line parameters:
```
envFile:
    Description: Variable file (dotenv-like). Used for additional variables and is applied AFTER filtering with varPrefix and varSuffix
output:
    Description: Output target.
    Possible values: file, stdout, stderr
    Default value: stdout
outputFile:
    Description: Filename and path of the file when using file output. Sets '--output file' automatically.
renderer:
    Description: Renderer used to format the configuration.
    Possible values: json, yaml, handlebars
    Default value: json
template:
    Description: Filename and path of the Handlebars template file.
varPrefix:
    Description: Variable prefix used to filter the environment variables.
    Default value: 
varSuffix:
    Description: Variable suffix used to filter the environment variables.
    Default value: 
doNotStrip:
    Description: Do not strip prefix and suffix from the environment variable.
    Default value: false
debug:
    Description: Show debug prints.
```

### Configuration file

Now a configuration file can be used to configure the... configuration file creating tool (I honestly did not realize how
meta this is until writing this down :D ). The configuration file is named `.e2crc` and must be placed to the working directory.
The order of evaluation for configuration is: 1. Defaults, 2. `.e2crc` 3. CLI arguments.


### .env file

env2conffile supports now dotenv-like `.env` file. By this I mean that just like with dotenv, the file is placed to the
working directory and variables are defined `<KEY>=<VALUE>`, the formatting done to the variables, however, does differentiate
from dotenv. This means that while comments (lines starting with #) are supported, features like quote conversion and multiline
are missing. While it is not guaranteed that at some point down the line the tool would have full dotenv file support, it is
also not guaranteed that it will happen, only time will tell. 


Following examples assume that the package is installed globally.

Example using handlebars template:

`BAR_SOMETHING_ELSE_FOO=000 BAR_SOMETHING_FOO=123 BAR_SOME=456 SOME_FOO=789 env2conffile --renderer handlebars --varSuffix _FOO --varPrefix BAR_ --template test.hb --output file --outputFile ../foobar`

Example with default json output and stdout:

`BAR_SOMETHING_ELSE_FOO=000 BAR_SOMETHING_FOO=123 BAR_SOME=456 SOME_FOO=789 env2conffile --varSuffix _FOO --varPrefix BAR_`

## Notice

In the configuration file when not using a handlebars template, the prefix and suffix are stripped from the variable name.
