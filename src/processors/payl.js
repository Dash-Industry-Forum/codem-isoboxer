// ISO/IEC 14496-30:2014 - WebVTT Cue Payload Box.
ISOBox.prototype._boxProcessors['payl'] = function() {
  this._procField('cue_text', 'utf8');
};
