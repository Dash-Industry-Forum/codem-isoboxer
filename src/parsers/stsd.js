// ISO/IEC 14496-12:2012 - 8.5.2 Sample Description Box
ISOBox.prototype._boxParsers['stsd'] = function() {
  this._parseFullBox();
  this.entry_count = this._readUint(32);
  this.entries = [];

  for (var i = 0; i < this.entry_count ; i++){
    this.entries.push(ISOBox.parse(this));
  }
}
