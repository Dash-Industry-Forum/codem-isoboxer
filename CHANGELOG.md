## codem-isoboxer 0.2.2 (2016/02/01) ##

* Added support for WebVTT cues (vttC, vttc, vlab, payl, vtte)
* Updated UTF-8 decoder

## codem-isoboxer 0.2.1 (2015/07/29) ##

* Added support for `elst` box
* Fixed build

## codem-isoboxer 0.2.0 (2015/07/29) ##

* Added support for modular builds (#1). See README (Advanced build options) for details.

## codem-isoboxer 0.1.1 (2015/07/06) ##

* Added support for `hdlr` box

## codem-isoboxer 0.1.0 (2015/06/02) ##

* Improved performance for `fetch` function

## codem-isoboxer 0.0.6 (2015/05/13) ##

* Basic support for incomplete buffers (flagged with `_incomplete` property)
* Added support for `ssix` box
* Added `_root` property

## codem-isoboxer 0.0.5 (2015/04/17) ##

* Added support for TextDecoder to convert DataViews to strings (when available)
* Added test suite

## codem-isoboxer 0.0.4 (2015/04/02) ##

* Renamed ISOBoxer.create to ISOBoxer.parseBuffer (be explicit about function names)
* Fixed error in bit-shifting

## codem-isoboxer 0.0.3 (2015/03/26) ##

* Added a simple utility function to convert a DataView to a string (ISOBoxer.Utils.dataViewToString)

## codem-isoboxer 0.0.2 (2015/03/26) ##

* Added `fetch` and `fetchAll` functions to ISOFile

## codem-isoboxer 0.0.1 (2015/03/26) ##

* Initial release