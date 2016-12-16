// ISO/IEC 14496-12:2012 - 8.8.3 Track Extends Box
ISOBox.prototype._boxProcessors['trex'] = function() {
  this._procFullBox();
  this._procField('track_ID',                         'uint', 32);
  this._procField('default_sample_description_index', 'uint', 32);
  this._procField('default_sample_duration',          'uint', 32);
  this._procField('default_sample_size',              'uint', 32);
  this._procField('default_sample_flags',             'uint', 32);
};
