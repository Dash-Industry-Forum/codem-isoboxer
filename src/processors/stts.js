// ISO/IEC 14496-12:2012 - 8.6.1.2 Decoding Time To Sample Box
ISOBox.prototype._boxProcessors['stts'] = function() {
  this._procFullBox();
  this._procField('entry_count', 'uint', 32);
  this._procEntries('entries', this.entry_count, function(entry) {
    this._procEntryField(entry, 'sample_count', 'uint', 32);
    this._procEntryField(entry, 'sample_delta', 'uint', 32);
  });
};
