//ISO/IEC 23001-7:2011 - 8.2 Track Encryption Box
ISOBox.prototype._boxProcessors['tenc'] = function() {
    this._procFullBox();

    this._procField('default_IsEncrypted', 'uint', 24);
    this._procField('default_IV_size', 'uint', 8);
    this._procFieldArray('default_KID', 16,    'uint', 8);
 };
