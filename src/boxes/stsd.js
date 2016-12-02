// ISO/IEC 14496-12:2012 - 8.5.2 Sample Description Box
ISOBox.prototype._boxProcessors['stsd'] = function() {
  this._procFullBox();
  this._procField('entry_count', 'uint', 32);
  this._procSubBoxes('entries', this.entry_count);
  // Store entries as (sub)boxes when parsing.
  // if (this._parsing) {
  //   this.boxes = [];
  //   for (var i = 0; i < this.entry_count; i++) {
  //     this.boxes.push(ISOBox.parse(this));
  //   }
  // }
};
