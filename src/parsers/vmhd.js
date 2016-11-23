// ISO/IEC 14496-12:2012 - 8.4.5.2 Video Media Header Box
ISOBox.prototype._boxParsers['vmhd'] = function() {
  this._parseFullBox();

  this.graphicsmode = this._readUint(16);
  this.opcolor = [];
  for (var i=0; i<3; i++) {
    this.opcolor.push(this._readUint(16));
  }
};
