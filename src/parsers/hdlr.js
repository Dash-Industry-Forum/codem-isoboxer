// ISO/IEC 14496-12:2012 - 8.4.3 Handler Reference Box
ISOBox.prototype._boxParsers['hdlr'] = function() {
  this._parseFullBox();
  this.pre_defined = this._readUint(32);
  this.handler_type = this._readString(4);
  this.reserved = [this._readUint(32), this._readUint(32), this._readUint(32)]
  this.name = this._readTerminatedString()
}