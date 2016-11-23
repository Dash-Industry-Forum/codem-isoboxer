// ISO/IEC 14496-12:2012 - 8.7.2 Data Reference Box
ISOBox.prototype._boxParsers['dref'] = function() {
  this._parseFullBox();
  this.entry_count = this._readUint(32);
  this.entries = [];
  for (var i=0; i<this.entry_count; i++) {
    var entry = {};
    entry.size = this._readUint(32);
    entry.type = this._readString(4);
    entry.version = this._readUint(8);
    entry.flags = this._readUint(24);
    if (entry.type === 'urn') {
      entry.name = this._readTerminatedString();
    }
    entry.location = this._readTerminatedString();
    this.entries.push(entry);
  }
};
