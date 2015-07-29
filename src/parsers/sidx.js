// ISO/IEC 14496-12:2012 - 8.16.3 Segment Index Box
ISOBox.prototype._boxParsers['sidx'] = function() {
  this._parseFullBox();
  this.reference_ID = this._readUint(32);
  this.timescale = this._readUint(32);
  if (this.version == 0) {
    this.earliest_presentation_time = this._readUint(32);
    this.first_offset = this._readUint(32);
  } else {
    this.earliest_presentation_time = this._readUint(64);
    this.first_offset = this._readUint(64);    
  }
  this.reserved = this._readUint(16);
  this.reference_count = this._readUint(16);
  this.references = [];
  for (var i=0; i<this.reference_count; i++) {
    var ref = {};
    var reference = this._readUint(32);
    ref.reference_type = (reference >> 31) & 0x1;
    ref.referenced_size = reference & 0x7FFFFFFF;
    ref.subsegment_duration = this._readUint(32);
    var sap = this._readUint(32);
    ref.starts_with_SAP = (sap >> 31) & 0x1;
    ref.SAP_type = (sap >> 28) & 0x7;
    ref.SAP_delta_time = sap & 0xFFFFFFF;
    this.references.push(ref);
  }
}