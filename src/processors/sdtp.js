// ISO/IEC 14496-12:2012 - 8.6.4.1 sdtp box 
ISOBox.prototype._boxProcessors['sdtp'] = function() {
  this._procFullBox();

  var sample_count = -1;
  if (this._parsing) {
    sample_count = (this._raw.byteLength - (this._cursor.offset - this._raw.byteOffset));
  }

  this._procFieldArray('sample_dependency_table', sample_count, 'uint', 8);
};
