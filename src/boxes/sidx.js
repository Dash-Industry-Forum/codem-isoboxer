// ISO/IEC 14496-12:2012 - 8.16.3 Segment Index Box
ISOBox.prototype._boxProcessors['sidx'] = function() {
  this._procFullBox();
  this._procField('reference_ID', 'uint', 32);
  this._procField('timescale', 'uint', 32);
  this._procField('earliest_presentation_time', 'uint', (this.version == 1) ? 64 : 32);
  this._procField('first_offset', 'uint', (this.version == 1) ? 64 : 32);
  this._procField('reserved', 'uint', 16);
  this._procField('reference_count', 'uint', 16);
  this._procEntries('references', this.reference_count, function(entry) {
    if (!this._parsing) {
      entry.reference  = (entry.reference_type  & 0x00000001) << 31;
      entry.reference |= (entry.referenced_size & 0x7FFFFFFF);
      entry.sap  = (entry.starts_with_SAP & 0x00000001) << 31;
      entry.sap |= (entry.SAP_type        & 0x00000003) << 28;
      entry.sap |= (entry.SAP_delta_time  & 0x0FFFFFFF);
    }
    this._procEntryField(entry, 'reference', 'uint', 32);
    this._procEntryField(entry, 'subsegment_duration', 'uint', 32);
    this._procEntryField(entry, 'sap', 'uint', 32);
    if (this._parsing) {
      entry.reference_type = (entry.reference >> 31) & 0x00000001;
      entry.referenced_size = entry.reference & 0x7FFFFFFF;
      entry.starts_with_SAP  = (entry.sap >> 31) & 0x00000001;
      entry.SAP_type = (entry.sap >> 28) & 0x00000007;
      entry.SAP_delta_time = (entry.sap  & 0x0FFFFFFF);
    }
  });
};
