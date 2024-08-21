// ISO/IEC 14496-12:202x - 8.11.1 Meta box
ISOBox.prototype._boxProcessors['meta'] = function() {
  this._procFullBox();

  /* rest of the boxes will be read by _parseContainerBox */
};
