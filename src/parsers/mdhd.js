// ISO/IEC 14496-12:2012 - 8.4.2 Media Header Box
ISOBox.prototype._boxParsers['mdhd'] = function() {
  this._parseFullBox();
  if (this.version == 1) {
    this.creation_time = this._readUint(64);
    this.modification_time = this._readUint(64);
    this.timescale = this._readUint(32);
    this.duration = this._readUint(64);
  } else {
    this.creation_time = this._readUint(32);
    this.modification_time = this._readUint(32);
    this.timescale = this._readUint(32);
    this.duration = this._readUint(32);
  }
  var language = this._readUint(16);
  this.pad = (language >> 15);
  this.language = String.fromCharCode(
    ((language >> 10) & 0x1F) + 0x60,
    ((language >> 5) & 0x1F) + 0x60,
    (language & 0x1F) + 0x60
  );
  this.pre_defined = this._readUint(16);
}