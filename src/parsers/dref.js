// ISO/IEC 14496-12:2012 - 8.7.2 Data Reference Box
ISOBox.prototype._boxParsers['dref'] = function() {
  this._parseFullBox();
  this.entry_count = this._readUint(32);
  this.entries = [];
  for (var i = 0; i < this.entry_count ; i++){
    this.entries.push(ISOBox.parse(this));
  }
};
