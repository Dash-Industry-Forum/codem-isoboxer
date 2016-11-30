// ISO/IEC 14496-12:2015 - 8.7.7 Sub-Sample Information Box
ISOBox.prototype._boxParsers['subs'] = function () {
    this._parseFullBox();
    this.entry_count = this._readUint(32);
    this.entries = [];
    for (var i = 0; i < this.entry_count; i++) {
        var entry = {};
        entry.sample_delta = this._readUint(32);
        entry.subsample_count = this._readUint(16);
        entry.subsamples = [];
        for (var j = 0; j < entry.subsample_count; j++) {
            var subsample = {};
            if (this.version & 0x1) {
                subsample.subsample_size = this._readUint(32);
            } else {
                subsample.subsample_size = this._readUint(16);
            }
            subsample.subsample_priority = this._readUint(8);
            subsample.discardable = this._readUint(8);
            subsample.reserved = this._readUint(32);
            entry.subsamples.push(subsample);
        }
        this.entries.push(entry);
    }
};