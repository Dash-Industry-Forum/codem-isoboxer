// ISO/IEC 23009-1:2014 - 5.10.3.3 Event Message Box
ISOBox.prototype._boxParsers['emsg'] = function() {
  this._parseFullBox();
  this.scheme_id_uri           = this._readTerminatedString();
  this.value                   = this._readTerminatedString();
  this.timescale               = this._readUint(32);
  this.presentation_time_delta = this._readUint(32);
  this.event_duration          = this._readUint(32);
  this.id                      = this._readUint(32);
  this.message_data            = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
}