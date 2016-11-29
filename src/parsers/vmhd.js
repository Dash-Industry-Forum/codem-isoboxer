// ISO/IEC 14496-12:2012 - 8.4.5.2 Video Media Header Box
ISOBox.prototype._boxParsers['vmhd'] = function() {
  this._parseFullBox();

  this.graphicsmode = this._readUint(16);
  this.opcolor = [this._readUint(16), this._readUint(16), this._readUint(16)];
};
