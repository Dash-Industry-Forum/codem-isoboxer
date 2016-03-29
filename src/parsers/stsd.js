// ISO/IEC 14496-12:2012 - 8.5.2 Sample Description Box
// TODO: This needs cleanup and a much more complete implementation
ISOBox.prototype._boxParsers['stsd'] = function() {
  this._parseFullBox();
  this.entry_count = this._readUint(32);
  this.entries = [];

  for (var i = 0; i < this.entry_count ; i++){
    var entry = {};
    entry.size = this._readUint(32);
    entry.char_code = this._readString(4);
    entry.reserved = [ this._readUint(16), this._readUint(16), this._readUint(16) ]
    entry.data_reference_index = this._readUint(16);

    // common data audio / video
    entry.version = this._readUint(16);
    entry.revision_level = this._readUint(16);
    entry.vendor = this._readUint(32);

    if (entry.char_code == "avc1"){
      //avc
      entry.temporal_quality = this._readUint(32);
      entry.spatial_quality = this._readUint(32);
      entry.width = this._readUint(16);
      entry.height = this._readUint(16);
      entry.horizontal_resolution = this._readUint(32);
      entry.vertical_resolution = this._readUint(32);
      entry.data_size = this._readUint(32);   // must be 0x0
      entry.frame_count = this._readUint(16);  // frames per sample
      entry.compressor_name = this._readUint(32);
      entry.depth = this._readUint(16);
      entry.color_table_id = this._readUint(16);


    }else if(entry.char_code == "mp4a"){
      //mp4a
      entry.channels = this._readUint(16);
      entry.sample_size = this._readUint(16); // 8 or 16
      entry.compression_id = this._readUint(16);
      entry.packet_size = this._readUint(16);  // should be 0x0
      entry.sample_rate = this._readUint(32);
    }

    //entry.data = this.data = new DataView(this._raw.buffer, this._cursor.offset, entry.size - 8);
    this.entries.push(entry);
  }

}
