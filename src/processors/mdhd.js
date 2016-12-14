// ISO/IEC 14496-12:2012 - 8.4.2 Media Header Box
ISOBox.prototype._boxProcessors['mdhd'] = function() {
  this._procFullBox();
  this._procField('creation_time',      'uint', (this.version == 1) ? 64 : 32);
  this._procField('modification_time',  'uint', (this.version == 1) ? 64 : 32);
  this._procField('timescale',          'uint', 32);
  this._procField('duration',           'uint', (this.version == 1) ? 64 : 32);
  if (!this._parsing && typeof this.language === 'string') {
    // In case of writing and language has been set as a string, then convert it into char codes array
    this.language = ((this.language.charCodeAt(0) - 0x60) << 10) |
                    ((this.language.charCodeAt(1) - 0x60) << 5) |
                    ((this.language.charCodeAt(2) - 0x60));
  }
  this._procField('language',           'uint', 16);
  if (this._parsing) {
    this.language = String.fromCharCode(((this.language >> 10) & 0x1F) + 0x60,
                                        ((this.language >> 5) & 0x1F) + 0x60,
                                        (this.language & 0x1F) + 0x60);
  }
  this._procField('pre_defined',        'uint', 16);
};
