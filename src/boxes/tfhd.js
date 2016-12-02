// ISO/IEC 14496-12:2012 - 8.8.7 Track Fragment Header Box
ISOBox.prototype._boxProcessors['tfhd'] = function() {
  this._procFullBox();
  this._procField('track_ID', 'uint', 32);
  if (this.flags & 0x01) this._procField('base_data_offset',          'uint', 64);
  if (this.flags & 0x02) this._procField('sample_description_offset', 'uint', 32);
  if (this.flags & 0x08) this._procField('default_sample_duration',   'uint', 32);
  if (this.flags & 0x10) this._procField('default_sample_size',       'uint', 32);
  if (this.flags & 0x20) this._procField('default_sample_flags',      'uint', 32);
};
