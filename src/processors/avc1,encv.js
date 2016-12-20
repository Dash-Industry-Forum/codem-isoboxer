// ISO/IEC 14496-15:2014 - avc1 box
ISOBox.prototype._boxProcessors['avc1'] = ISOBox.prototype._boxProcessors['encv'] = function() {
  // SampleEntry fields
  this._procFieldArray('reserved1', 6,    'uint', 8);
  this._procField('data_reference_index', 'uint', 16);
  // VisualSampleEntry fields
  this._procField('pre_defined1',         'uint',     16);
  this._procField('reserved2',            'uint',     16);
  this._procFieldArray('pre_defined2', 3, 'uint',     32);
  this._procField('width',                'uint',     16);
  this._procField('height',               'uint',     16);
  this._procField('horizresolution',      'template', 32);
  this._procField('vertresolution',       'template', 32);
  this._procField('reserved3',            'uint',     32);
  this._procField('frame_count',          'uint',     16);
  this._procFieldArray('compressorname', 32,'uint',    8);
  this._procField('depth',                'uint',     16);
  this._procField('pre_defined3',         'int',      16);
  // AVCSampleEntry fields
  this._procField('config', 'data', -1);
};
