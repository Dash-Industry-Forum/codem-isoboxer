//ISO/IEC 23001-7:2011 - 8.1 Protection System Specific Header Box
ISOBox.prototype._boxProcessors['pssh'] = function() {
  this._procFullBox();
  
  this._procFieldArray('SystemID', 16, 'uint', 8);
  this._procField('DataSize', 'uint', 32);
  this._procFieldArray('Data', this.DataSize, 'uint', 8);
};