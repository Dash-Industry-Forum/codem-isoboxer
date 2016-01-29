// ISO/IEC 14496-30:2014 - WebVTT Configuration Box
ISOBox.prototype._boxParsers['vttC'] = function() {
  this.config_raw = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
  this.config = ISOBoxer.Utils.dataViewToString(this.config_raw, 'utf-8');
}
