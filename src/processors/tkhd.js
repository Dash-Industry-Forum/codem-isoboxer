// ISO/IEC 14496-12:2012 - 8.3.2 Track Header Box
ISOBox.prototype._boxProcessors['tkhd'] = function() {
  this._procFullBox();
  this._procField('creation_time',      'uint',     (this.version == 1) ? 64 : 32);
  this._procField('modification_time',  'uint',     (this.version == 1) ? 64 : 32);
  this._procField('track_ID',           'uint',     32);
  this._procField('reserved1',          'uint',     32);
  this._procField('duration',           'uint',     (this.version == 1) ? 64 : 32);
  this._procFieldArray('reserved2', 2,  'uint',     32);
  this._procField('layer',              'uint',     16);
  this._procField('alternate_group',    'uint',     16);
  this._procField('volume',             'template', 16);
  this._procField('reserved3',          'uint',     16);
  this._procFieldArray('matrix', 9,     'template', 32);
  this._procField('width',              'template', 32);
  this._procField('height',             'template', 32);
};
