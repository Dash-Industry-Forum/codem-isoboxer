// ISO/IEC 14496-12:2012 - 8.4.5.3 Sound Media Header Box
ISOBox.prototype._boxParsers['smhd'] = function() {
  this._parseFullBox();

  this.balance = this._readTemplate(16);
  this.reserved = this._readUint(16);
};
