// ISO/IEC 14496-12:2012 - 8.12.5 Scheme Type Box
ISOBox.prototype._boxProcessors['schm'] = function() {
    this._procFullBox();
    
    this._procField('scheme_type', 'uint', 32);
    this._procField('scheme_version', 'uint', 32);

    if (this.flags & 0x000001) {
        this._procField('scheme_uri', 'string', -1);
    }
};