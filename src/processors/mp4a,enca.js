// ISO/IEC 14496-12:2012 - 8.5.2.2 mp4a box (use AudioSampleEntry definition and naming)
ISOBox.prototype._boxProcessors['mp4a'] = ISOBox.prototype._boxProcessors['enca'] = function() {
  // SampleEntry fields
  this._procFieldArray('reserved1', 6,    'uint', 8);
  this._procField('data_reference_index', 'uint', 16);
  // AudioSampleEntry fields
  this._procFieldArray('reserved2', 2,    'uint', 32);
  this._procField('channelcount',         'uint', 16);
  this._procField('samplesize',           'uint', 16);
  this._procField('pre_defined',          'uint', 16);
  this._procField('reserved3',            'uint', 16);
  this._procField('samplerate',           'template', 32);
  // ESDescriptor fields
  this._procField('esds',                 'data', -1);
};
