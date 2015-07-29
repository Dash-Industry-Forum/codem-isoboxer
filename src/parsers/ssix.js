// ISO/IEC 14496-12:2012 - 8.16.4 Subsegment Index Box
ISOBox.prototype._boxParsers['ssix'] = function() {
  this._parseFullBox();
  this.subsegment_count = this._readUint(32);
  this.subsegments = [];

  for (var i=0; i<this.subsegment_count; i++) {
    var subsegment = {};
    subsegment.ranges_count = this._readUint(32);
    subsegment.ranges = [];
    
    for (var j=0; j<subsegment.ranges_count; j++) {
      var range = {};
      range.level = this._readUint(8);
      range.range_size = this._readUint(24);
      subsegment.ranges.push(range);
    }
    this.subsegments.push(subsegment);
  }
}