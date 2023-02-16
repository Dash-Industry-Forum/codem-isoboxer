// ISO/IEC 14496-12:2012 - 8.6.1.3 Composition Time To Sample Box
ISOBox.prototype._boxProcessors['ctts'] = function() {
  this._procFullBox();
  this._procField('entry_count', 'uint', 32);
  this._procEntries('entries', this.entry_count, function(entry) {
    this._procEntryField(entry, 'sample_count', 'uint', 32);
    this._procEntryField(entry, 'sample_offset', (this.version === 1) ? 'int' : 'uint', 32);
  });
};
