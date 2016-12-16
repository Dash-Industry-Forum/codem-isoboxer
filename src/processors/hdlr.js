// ISO/IEC 14496-12:2012 - 8.4.3 Handler Reference Box
ISOBox.prototype._boxProcessors['hdlr'] = function() {
  this._procFullBox();
  this._procField('pre_defined',      'uint',   32);
  this._procField('handler_type',     'string', 4);
  this._procFieldArray('reserved', 3, 'uint', 32);
  this._procField('name',             'string', -1);
};
