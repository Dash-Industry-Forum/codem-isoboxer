// Simple container boxes, all from ISO/IEC 14496-12:2012 except vttc which is from 14496-30.
[
  'moov', 'trak', 'tref', 'mdia', 'minf', 'stbl', 'edts', 'dinf',
  'mvex', 'moof', 'traf', 'mfra', 'udta', 'meco', 'strk', 'vttc'
].forEach(function(boxType) {
  ISOBox.prototype._boxParsers[boxType] = function() {
    this.boxes = [];
    while (this._cursor.offset - this._raw.byteOffset < this._raw.byteLength) {
      this.boxes.push(ISOBox.parse(this));
    }  
  }  
})
