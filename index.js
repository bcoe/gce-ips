var assign = require('lodash.assign')
var dns = require('dns')
var eachLimit = require('async').eachLimit

function GCEIP (opts) {
  assign(this, {
    blockUrl: '_cloud-netblocks.googleusercontent.com',
    concurrency: 4
  })
}

GCEIP.prototype.lookup = function (cb) {
  var _this = this
  this._lookupNetBlocks(function (err, blocks) {
    if (err) return cb(err)
    _this._lookupIps(blocks, function (err, ips) {
      return cb(err, ips)
    })
  })
}

GCEIP.prototype._lookupNetBlocks = function (cb) {
  var _this = this
  dns.resolveTxt(this.blockUrl, function (err, results) {
    if (err) return cb(err)
    results = results[0]
    if (Array.isArray(results)) results = results[0]
    return cb(null, _this._parseBlocks(results))
  })
}

GCEIP.prototype._parseBlocks = function (textRecord) {
  var splitRecord = textRecord.split(' ')
  var blocks = []
  splitRecord.forEach(function (record) {
    if (~record.indexOf('include:')) blocks.push(record.replace('include:', ''))
  })
  return blocks
}

GCEIP.prototype._lookupIps = function (blocks, cb) {
  var _this = this
  var ips = []
  eachLimit(blocks, this.concurrency, function (block, done) {
    dns.resolveTxt(block, function (err, results) {
      if (err) return done(err)
      results = results[0]
      if (Array.isArray(results)) results = results[0]
      ips.push.apply(ips, _this._parseIps(results))
      return done()
    })
  }, function (err) {
    if (err) return cb(err)
    return cb(null, ips)
  })
}

GCEIP.prototype._parseIps = function (textRecord) {
  var splitRecord = textRecord.split(' ')
  var ips = []
  splitRecord.forEach(function (record) {
    if (~record.indexOf('ip4:')) ips.push(record.replace('ip4:', ''))
    if (~record.indexOf('ip6:')) ips.push(record.replace('ip6:', ''))
  })
  return ips
}

module.exports = function (opts) {
  return new GCEIP(opts)
}
