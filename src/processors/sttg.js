// ISO/IEC 14496-30:2014 - WebVTT Cue Settings Box.
ISOBox.prototype._boxProcessors['sttg'] = function() {
    this._procField('settings', 'utf8');
};
