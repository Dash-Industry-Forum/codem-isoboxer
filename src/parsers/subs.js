// ISO/IEC 14496-12:2015 - 8.7.7 Sub-Sample Information Box
ISOBox.prototype._boxParsers['subs'] = function () {
  this._parseFullBox();
  this.entry_count = this._readUint(32);
  this.samples_with_subsamples = [];
  var sample_nr = 0
  for (var i = 0; i < this.entry_count; i++) {
    var sample_delta = this._readUint(32)
    sample_nr += sample_delta;
    var subsample_count = this._readUint(16);
    if (subsample_count > 0) {
      var sample = {'nr': sample_nr, 'subsamples': [] }
      for (var j = 0; j < subsample_count; j++) {
        var subsample = {};
        if (this.version & 0x1) {
          subsample.size = this._readUint(32);
        } else {
          subsample.size = this._readUint(16);
        }
        subsample.priority = this._readUint(8);
        subsample.discardable = this._readUint(8);
        subsample.codec_specific_parameters = this._readUint(32);
        sample.subsamples.push(subsample);
      }
      this.samples_with_subsamples.push(sample);
    }
  }
}