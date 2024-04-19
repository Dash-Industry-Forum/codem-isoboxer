// ISO/IEC 14496-12:202x - 12.2.8 Audio rendering indication box
ISOBox.prototype._boxProcessors['ardi'] = function() {
  this._procFullBox();
  this._procField('audio_rendering_indication', 'uint', 8);
};
