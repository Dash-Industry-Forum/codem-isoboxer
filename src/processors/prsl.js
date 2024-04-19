// ISO/IEC 14496-12:202x - 8.18.4.1 Preselection group box
ISOBox.prototype._boxProcessors['prsl'] = function() {
  this._procFullBox();
  this._procField('group_id', 'uint', 32);
  this._procField('num_entities_in_group', 'uint', 32);
  this._procEntries('entities', this.num_entities_in_group, function(entry) {
    this._procEntryField(entry, 'entity_id', 'uint', 32);
  });
  if (this.flags & 0x1000) this._procField('preselection_tag', 'utf8string');
  if (this.flags & 0x2000) this._procField('selection_priority', 'uint', 8);
  this._procField('interleaving_tag', 'utf8string');

  /* rest of the boxes will be read by _parseContainerBox */
};
