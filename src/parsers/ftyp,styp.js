// ISO/IEC 14496-12:2012 - 4.3 File Type Box / 8.16.2 Segment Type Box
ISOBox.prototype._boxParsers['ftyp'] = ISOBox.prototype._boxParsers['styp'] = function() {
  this.major_brand = this._readString(4);
  this.minor_versions = this._readUint(32);
  this.compatible_brands = [];
  
  while (this._cursor.offset - this._raw.byteOffset < this._raw.byteLength) {
    this.compatible_brands.push(this._readString(4));
  }
}