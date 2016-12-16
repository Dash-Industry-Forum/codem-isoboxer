// ISO/IEC 14496-12:2012 - 8.8.12 Track Fragmnent Decode Time
ISOBox.prototype._boxProcessors['tfdt'] = function() {
  this._procFullBox();
  this._procField('baseMediaDecodeTime', 'uint', (this.version == 1) ? 64 : 32);
};
