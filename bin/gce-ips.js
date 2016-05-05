#!/usr/bin/env node

var GCEIP = require('../')
var ipRangeCheck = require('ip-range-check')
require('yargs')
  .usage('$0')
  .command('list', 'return list of IPs within GCE', function (yargs) {
    return yargs.option('f', {
      alias: 'format',
      describe: 'format that results should be returned in (json, or text)',
      default: 'text'
    })
  }, function (argv) {
    GCEIP(argv).lookup(function (err, ips) {
      if (err) {
        console.error(err.message)
        process.exit(1)
      } else {
        if (argv.format === 'text') console.log(ips.join('\n'))
        else console.log(JSON.stringify(ips, null, 2))
      }
    })
  })
  .command('check <ip>', 'check whether IP is within GCE', function (yargs) {
    return yargs
  }, function (argv) {
    GCEIP(argv).lookup(function (err, ips) {
      if (err) {
        console.log(err.message)
        process.exit(1)
      }
      if (ipRangeCheck(argv.ip, ips)) {
        console.log(argv.ip + ' is in GCE')
        process.exit(0)
      } else {
        console.log(argv.ip + ' is not in GCE')
        process.exit(1)
      }
    })
  })
  .help()
  .alias('h', 'help')
  .demand(1, "provide one of 'list' or 'lookup'")
  .epilog('fetch a list of Google Compute Engine IPs using DNS lookup')
  .strict()
  .argv
