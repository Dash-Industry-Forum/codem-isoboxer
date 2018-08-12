// ISO/IEC 23009-1:2014 - 5.10.3.3 Event Message Box
ISOBox.prototype._boxProcessors['emsg'] = function() {
  this._procFullBox();
  if (this.version == 1) {
    this._procField('timescale',                'uint',   32);
    this._procField('presentation_time',        'uint',   64);
    this._procField('event_duration',           'uint',   32);
    this._procField('id',                       'uint',   32);
    this._procField('scheme_id_uri',            'string', -1);
    this._procField('value',                    'string', -1);
  } else {
    this._procField('scheme_id_uri',            'string', -1);
    this._procField('value',                    'string', -1);
    this._procField('timescale',                'uint',   32);
    this._procField('presentation_time_delta',  'uint',   32);
    this._procField('event_duration',           'uint',   32);
    this._procField('id',                       'uint',   32);
  }
  this._procField('message_data',             'data',   -1);
};