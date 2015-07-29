// ISO/IEC 14496-12:2012 - 8.1.2 Free Space Box
ISOBox.prototype._boxParsers['free'] = ISOBox.prototype._boxParsers['skip'] = function() {
  this.data = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
}