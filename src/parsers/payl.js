// ISO/IEC 14496-30:2014 - WebVTT Cue Payload Box. Return ArrayBuffer
ISOBox.prototype._boxParsers['payl'] = function() {
  this.cue_text_raw = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
  this.cue_text = ISOBoxer.Utils.dataViewToString(this.cue_text_raw, 'utf-8');
}
