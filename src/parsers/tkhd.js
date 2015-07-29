// ISO/IEC 14496-12:2012 - 8.3.2 Track Header Box
ISOBox.prototype._boxParsers['tkhd'] = function() {
  this._parseFullBox();
  
  if (this.version == 1) {
    this.creation_time     = this._readUint(64);
    this.modification_time = this._readUint(64);
    this.track_ID          = this._readUint(32);
    this.reserved1         = this._readUint(32);
    this.duration          = this._readUint(64);
  } else {
    this.creation_time     = this._readUint(32);
    this.modification_time = this._readUint(32);
    this.track_ID          = this._readUint(32);
    this.reserved1         = this._readUint(32);
    this.duration          = this._readUint(32);
  }
  
  this.reserved2 = [
    this._readUint(32),
    this._readUint(32)
  ];
  this.layer = this._readUint(16);
  this.alternate_group = this._readUint(16);
  this.volume = this._readTemplate(16);
  this.reserved3 = this._readUint(16);
  this.matrix = [];
  for (var i=0; i<9; i++) {
    this.matrix.push(this._readTemplate(32));
  }
  this.width = this._readUint(32);
  this.height = this._readUint(32);
}