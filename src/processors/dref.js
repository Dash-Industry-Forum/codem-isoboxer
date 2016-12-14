// ISO/IEC 14496-12:2012 - 8.7.2 Data Reference Box
ISOBox.prototype._boxProcessors['dref'] = function() {
  this._procFullBox();
  this._procField('entry_count', 'uint', 32);
  this._procSubBoxes('entries', this.entry_count);
};
