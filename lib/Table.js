var where = function (records, properties) {
  var matches = [];
  for (var i=0, numItems=records.length; i<numItems; i++) {
    var record = records[i];
    var isMatching = true;
    for (var property in properties) {
      var desiredVal = properties[property];
      if (isMatching) {
        if (property === 'like') {
          var comparisons = properties[property];
          var compares = false;
          for (var comp in comparisons) {
            compares = compares || (record[comp].toLowerCase().indexOf(comparisons[comp].toLowerCase()) !== -1);
          }
          isMatching = compares;
        } else if (isArray(desiredVal)) {
          isMatching = (desiredVal.indexOf(record[property]) !== -1);
        } else {
          isMatching = (record[property] === properties[property]);
        }
      }
    }
    if (isMatching) matches.push(record);
  }
  return matches;
};

var isArray = function (data) {
  return (data instanceof Array);
};

var isFunction = function (fn) {
  return (typeof fn === 'function');
};

var cloneArray = function (arr) {
  return arr.slice();
};

var Table = function () {
  this.init.apply(this, arguments);
};

Table.prototype.init = function (opts) {
  this.records = opts.records || [];
  this.defaults = opts.defaults || {};
};

Table.prototype.find = function (opts, cb) {
  var records = cloneArray(this.records);

  if (opts.where) {
    records = where(records, opts.where);
  }

  if (opts.limit) {
    records = records.slice(0, opts.limit);
  }

  if (isFunction(cb)) cb(null, records);

  return records;
};

Table.prototype.create = function (data, cb) {
  var defaults = this.defaults;
  for (var attr in defaults) {
    if (!data.hasOwnProperty(attr)) {
      var defaultValue = defaults[attr];
      if (typeof defaultValue === 'function') {
        defaultValue = defaultValue.call(this);
      }
      data[attr] = defaultValue;
    }
  }

  this.records.push(data);
  cb(null, data);
};

Table.prototype.update = function (opts, data, cb) {
  var records = this.find(opts);
  var numRecords = records.length;
  for (var i=0; i<numRecords; i++) {
    var record = records[i];
    var index = this.records.indexOf(record);
    this.updateAt(index, data);
  }

  cb(null, data);

  return data;
};

Table.prototype.updateAt = function (i, data) {
  for (var attr in data) {
    this.records[i][attr] = data[attr];
  }
};

Table.prototype.destroy = function (opts, cb) {
  var records = this.find(opts);
  while(records.length) {
    var index = this.records.indexOf(records.pop());
    this.destroyAt(index);
  }
  cb(null, {});
};

Table.prototype.destroyAt = function (index) {
  this.records.splice(index, 1);
};

module.exports = Table;