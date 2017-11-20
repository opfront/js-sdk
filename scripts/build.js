'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({silent: true});

var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var url = require('url');
var webpack = require('webpack');
var config = require('../config/webpack.config');
var paths = require('../config/paths');

var useYarn = fs.existsSync(paths.yarnLockFile);

// Print out errors
function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

// Create the production build and print the deployment instructions.
function build() {
  console.log(chalk.cyan('Creating an optimized production build...'))
  webpack(config).run((err, stats) => {
    if (err) {
      printErrors('Failed to compile.', [err]);
      process.exit(1);
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      printErrors('Failed to compile.', info.errors);
      process.exit(1);
    }

    if (process.env.CI && stats.hasWarnings()) {
     printErrors('Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.', info.warnings);
     process.exit(1);
   }

    console.log(chalk.green('Compiled successfully.'));
    console.log();
    var build = path.relative(process.cwd(), paths.appBuild);
    console.log('The ' + chalk.cyan(build) + ' folder is ready to be deployed.');
    console.log()
  });
}

build()
