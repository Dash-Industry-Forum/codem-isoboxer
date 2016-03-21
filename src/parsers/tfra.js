// ISO/IEC 14496-12:2012 - 8.8.10 Track Fragment Random Access Box
ISOBox.prototype._boxParsers['tfra'] = function() {
	this._parseFullBox();
	this.track_id = this._readUint(32);
	this.packed = this._readUint(32);

	this.reserved = this.packed >>> 6;

	this.length_size_of_traf_num = (this.packed && 0xFFFF00000000) >>> 4;
	this.length_size_of_trun_num = (this.packed && 0xFFFF0000) >>> 2;
	this.length_size_of_sample_num = this.packed && 0xFF;

	this.num_of_entries = this._readUint(32);

	this.entries = [];

	for (var i = 0; i < this.num_of_entries ; i++){
		var entry = {};

		if(this.version==1){
			entry.time = this._readUint(64);
			entry.moof_offset = this._readUint(64);
		}else{
			entry.time = this._readUint(32);
			entry.moof_offset = this._readUint(32);
		}

		entry.traf_number = this._readUint((this.length_size_of_traf_num + 1) * 8);
		entry.trun_number = this._readUint((this.length_size_of_trun_num + 1) * 8);
		entry.sample_number = this._readUint((this.length_size_of_sample_num + 1) * 8);

		this.entries.push(entry);
	}
}
