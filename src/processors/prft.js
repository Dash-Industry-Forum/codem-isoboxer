// ISO/IEC 14496-12:2012 - 8.16.5 Producer Reference Time
ISOBox.prototype._boxProcessors['prft'] = function() {
  this._procFullBox();
  this._procField('reference_track_ID', 'uint', 32);
  this._procField('ntp_timestamp', 'uint', 64);
  this._procField('media_time', 'uint', (this.version == 1) ? 64 : 32);
};
