// ISO/IEC 14496-12:2012 - 8.6.6 Edit List Box
ISOBox.prototype._boxProcessors['elst'] = function() {
  this._procFullBox();
  this._procField('entry_count', 'uint', 32);
  this._procEntries('entries', this.entry_count, function(entry) {
    this._procEntryField(entry, 'segment_duration',     'uint', (this.version === 1) ? 64 : 32);
    this._procEntryField(entry, 'media_time',           'int',  (this.version === 1) ? 64 : 32);
    this._procEntryField(entry, 'media_rate_integer',   'int',  16);
    this._procEntryField(entry, 'media_rate_fraction',  'int',  16);
  });
};
