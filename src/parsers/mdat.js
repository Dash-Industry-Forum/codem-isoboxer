// ISO/IEC 14496-12:2012 - 8.1.1 Media Data Box
ISOBox.prototype._boxParsers['mdat'] = function() {
  this.data = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
}