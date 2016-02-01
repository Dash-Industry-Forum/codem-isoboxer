// ISO/IEC 14496-30:2014 - WebVTT Cue Payload Box.
ISOBox.prototype._boxParsers['payl'] = function() {
  var cue_text_raw = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
  this.cue_text = ISOBoxer.Utils.dataViewToString(cue_text_raw);
}
