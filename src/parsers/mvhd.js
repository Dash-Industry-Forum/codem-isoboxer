// ISO/IEC 14496-12:2012 - 8.2.2 Movie Header Box
ISOBox.prototype._boxParsers['mvhd'] = function() {
  this._parseFullBox();
  
  if (this.version == 1) {
    this.creation_time     = this._readUint(64);
    this.modification_time = this._readUint(64);
    this.timescale         = this._readUint(32);
    this.duration          = this._readUint(64);
  } else {
    this.creation_time     = this._readUint(32);
    this.modification_time = this._readUint(32);
    this.timescale         = this._readUint(32);
    this.duration          = this._readUint(32);      
  }
  
  this.rate      = this._readTemplate(32);
  this.volume    = this._readTemplate(16);
  this.reserved1 = this._readUint(16);
  this.reserved2 = [ this._readUint(32), this._readUint(32) ];
  this.matrix = [];
  for (var i=0; i<9; i++) {
    this.matrix.push(this._readTemplate(32));
  }
  this.pre_defined = [];
  for (var i=0; i<6; i++) {
    this.pre_defined.push(this._readUint(32));
  }
  this.next_track_ID = this._readUint(32);
}