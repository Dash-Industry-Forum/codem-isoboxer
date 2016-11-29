// ISO/IEC 14496-12:2012 - 8.7.2 Data Reference Box
ISOBox.prototype._boxParsers['url '] = ISOBox.prototype._boxParsers['urn '] = function() {
  this._parseFullBox();
  if (this.type === 'urn ') {
    this.name = this._readTerminatedString();
  }
  this.location = this._readTerminatedString();
};
