// ISO/IEC 14496-12:2012 - 8.4.5.2 Video Media Header Box
ISOBox.prototype._boxProcessors['vmhd'] = function() {
  this._procFullBox();
  this._procField('graphicsmode', 'uint', 16);
  this._procFieldArray('opcolor', 3, 'uint', 16);
};
