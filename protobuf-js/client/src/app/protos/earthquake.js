/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function (global, factory) { /* global define, require, module */

  /* AMD */
  if (typeof define === 'function' && define.amd)
    define(["protobufjs/minimal"], factory);

  /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
    module.exports = factory(require("protobufjs/minimal"));

})(this, function ($protobuf) {
  "use strict";

  // Common aliases
  var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

  // Exported root namespace
  var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

  $root.Earthquake = (function () {

    /**
     * Properties of an Earthquake.
     * @exports IEarthquake
     * @interface IEarthquake
     * @property {string|null} [id] Earthquake id
     * @property {string|null} [time] Earthquake time
     * @property {number|null} [latitude] Earthquake latitude
     * @property {number|null} [longitude] Earthquake longitude
     * @property {number|null} [depth] Earthquake depth
     * @property {number|null} [mag] Earthquake mag
     * @property {string|null} [place] Earthquake place
     * @property {string|null} [magType] Earthquake magType
     */

    /**
     * Constructs a new Earthquake.
     * @exports Earthquake
     * @classdesc Represents an Earthquake.
     * @implements IEarthquake
     * @constructor
     * @param {IEarthquake=} [properties] Properties to set
     */
    function Earthquake(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * Earthquake id.
     * @member {string} id
     * @memberof Earthquake
     * @instance
     */
    Earthquake.prototype.id = "";

    /**
     * Earthquake time.
     * @member {string} time
     * @memberof Earthquake
     * @instance
     */
    Earthquake.prototype.time = "";

    /**
     * Earthquake latitude.
     * @member {number} latitude
     * @memberof Earthquake
     * @instance
     */
    Earthquake.prototype.latitude = 0;

    /**
     * Earthquake longitude.
     * @member {number} longitude
     * @memberof Earthquake
     * @instance
     */
    Earthquake.prototype.longitude = 0;

    /**
     * Earthquake depth.
     * @member {number} depth
     * @memberof Earthquake
     * @instance
     */
    Earthquake.prototype.depth = 0;

    /**
     * Earthquake mag.
     * @member {number} mag
     * @memberof Earthquake
     * @instance
     */
    Earthquake.prototype.mag = 0;

    /**
     * Earthquake place.
     * @member {string} place
     * @memberof Earthquake
     * @instance
     */
    Earthquake.prototype.place = "";

    /**
     * Earthquake magType.
     * @member {string} magType
     * @memberof Earthquake
     * @instance
     */
    Earthquake.prototype.magType = "";

    /**
     * Creates a new Earthquake instance using the specified properties.
     * @function create
     * @memberof Earthquake
     * @static
     * @param {IEarthquake=} [properties] Properties to set
     * @returns {Earthquake} Earthquake instance
     */
    Earthquake.create = function create(properties) {
      return new Earthquake(properties);
    };

    /**
     * Encodes the specified Earthquake message. Does not implicitly {@link Earthquake.verify|verify} messages.
     * @function encode
     * @memberof Earthquake
     * @static
     * @param {IEarthquake} message Earthquake message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Earthquake.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.id != null && Object.hasOwnProperty.call(message, "id"))
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
      if (message.time != null && Object.hasOwnProperty.call(message, "time"))
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.time);
      if (message.latitude != null && Object.hasOwnProperty.call(message, "latitude"))
        writer.uint32(/* id 3, wireType 1 =*/25).double(message.latitude);
      if (message.longitude != null && Object.hasOwnProperty.call(message, "longitude"))
        writer.uint32(/* id 4, wireType 1 =*/33).double(message.longitude);
      if (message.depth != null && Object.hasOwnProperty.call(message, "depth"))
        writer.uint32(/* id 5, wireType 5 =*/45).float(message.depth);
      if (message.mag != null && Object.hasOwnProperty.call(message, "mag"))
        writer.uint32(/* id 6, wireType 5 =*/53).float(message.mag);
      if (message.place != null && Object.hasOwnProperty.call(message, "place"))
        writer.uint32(/* id 7, wireType 2 =*/58).string(message.place);
      if (message.magType != null && Object.hasOwnProperty.call(message, "magType"))
        writer.uint32(/* id 8, wireType 2 =*/66).string(message.magType);
      return writer;
    };

    /**
     * Encodes the specified Earthquake message, length delimited. Does not implicitly {@link Earthquake.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Earthquake
     * @static
     * @param {IEarthquake} message Earthquake message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Earthquake.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Earthquake message from the specified reader or buffer.
     * @function decode
     * @memberof Earthquake
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Earthquake} Earthquake
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Earthquake.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Earthquake();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.id = reader.string();
            break;
          case 2:
            message.time = reader.string();
            break;
          case 3:
            message.latitude = reader.double();
            break;
          case 4:
            message.longitude = reader.double();
            break;
          case 5:
            message.depth = reader.float();
            break;
          case 6:
            message.mag = reader.float();
            break;
          case 7:
            message.place = reader.string();
            break;
          case 8:
            message.magType = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an Earthquake message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Earthquake
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Earthquake} Earthquake
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Earthquake.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Earthquake message.
     * @function verify
     * @memberof Earthquake
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Earthquake.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.id != null && message.hasOwnProperty("id"))
        if (!$util.isString(message.id))
          return "id: string expected";
      if (message.time != null && message.hasOwnProperty("time"))
        if (!$util.isString(message.time))
          return "time: string expected";
      if (message.latitude != null && message.hasOwnProperty("latitude"))
        if (typeof message.latitude !== "number")
          return "latitude: number expected";
      if (message.longitude != null && message.hasOwnProperty("longitude"))
        if (typeof message.longitude !== "number")
          return "longitude: number expected";
      if (message.depth != null && message.hasOwnProperty("depth"))
        if (typeof message.depth !== "number")
          return "depth: number expected";
      if (message.mag != null && message.hasOwnProperty("mag"))
        if (typeof message.mag !== "number")
          return "mag: number expected";
      if (message.place != null && message.hasOwnProperty("place"))
        if (!$util.isString(message.place))
          return "place: string expected";
      if (message.magType != null && message.hasOwnProperty("magType"))
        if (!$util.isString(message.magType))
          return "magType: string expected";
      return null;
    };

    /**
     * Creates an Earthquake message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Earthquake
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Earthquake} Earthquake
     */
    Earthquake.fromObject = function fromObject(object) {
      if (object instanceof $root.Earthquake)
        return object;
      var message = new $root.Earthquake();
      if (object.id != null)
        message.id = String(object.id);
      if (object.time != null)
        message.time = String(object.time);
      if (object.latitude != null)
        message.latitude = Number(object.latitude);
      if (object.longitude != null)
        message.longitude = Number(object.longitude);
      if (object.depth != null)
        message.depth = Number(object.depth);
      if (object.mag != null)
        message.mag = Number(object.mag);
      if (object.place != null)
        message.place = String(object.place);
      if (object.magType != null)
        message.magType = String(object.magType);
      return message;
    };

    /**
     * Creates a plain object from an Earthquake message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Earthquake
     * @static
     * @param {Earthquake} message Earthquake
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Earthquake.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.defaults) {
        object.id = "";
        object.time = "";
        object.latitude = 0;
        object.longitude = 0;
        object.depth = 0;
        object.mag = 0;
        object.place = "";
        object.magType = "";
      }
      if (message.id != null && message.hasOwnProperty("id"))
        object.id = message.id;
      if (message.time != null && message.hasOwnProperty("time"))
        object.time = message.time;
      if (message.latitude != null && message.hasOwnProperty("latitude"))
        object.latitude = options.json && !isFinite(message.latitude) ? String(message.latitude) : message.latitude;
      if (message.longitude != null && message.hasOwnProperty("longitude"))
        object.longitude = options.json && !isFinite(message.longitude) ? String(message.longitude) : message.longitude;
      if (message.depth != null && message.hasOwnProperty("depth"))
        object.depth = options.json && !isFinite(message.depth) ? String(message.depth) : message.depth;
      if (message.mag != null && message.hasOwnProperty("mag"))
        object.mag = options.json && !isFinite(message.mag) ? String(message.mag) : message.mag;
      if (message.place != null && message.hasOwnProperty("place"))
        object.place = message.place;
      if (message.magType != null && message.hasOwnProperty("magType"))
        object.magType = message.magType;
      return object;
    };

    /**
     * Converts this Earthquake to JSON.
     * @function toJSON
     * @memberof Earthquake
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Earthquake.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Earthquake;
  })();

  $root.Earthquakes = (function () {

    /**
     * Properties of an Earthquakes.
     * @exports IEarthquakes
     * @interface IEarthquakes
     * @property {Array.<IEarthquake>|null} [earthquakes] Earthquakes earthquakes
     */

    /**
     * Constructs a new Earthquakes.
     * @exports Earthquakes
     * @classdesc Represents an Earthquakes.
     * @implements IEarthquakes
     * @constructor
     * @param {IEarthquakes=} [properties] Properties to set
     */
    function Earthquakes(properties) {
      this.earthquakes = [];
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * Earthquakes earthquakes.
     * @member {Array.<IEarthquake>} earthquakes
     * @memberof Earthquakes
     * @instance
     */
    Earthquakes.prototype.earthquakes = $util.emptyArray;

    /**
     * Creates a new Earthquakes instance using the specified properties.
     * @function create
     * @memberof Earthquakes
     * @static
     * @param {IEarthquakes=} [properties] Properties to set
     * @returns {Earthquakes} Earthquakes instance
     */
    Earthquakes.create = function create(properties) {
      return new Earthquakes(properties);
    };

    /**
     * Encodes the specified Earthquakes message. Does not implicitly {@link Earthquakes.verify|verify} messages.
     * @function encode
     * @memberof Earthquakes
     * @static
     * @param {IEarthquakes} message Earthquakes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Earthquakes.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.earthquakes != null && message.earthquakes.length)
        for (var i = 0; i < message.earthquakes.length; ++i)
          $root.Earthquake.encode(message.earthquakes[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
      return writer;
    };

    /**
     * Encodes the specified Earthquakes message, length delimited. Does not implicitly {@link Earthquakes.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Earthquakes
     * @static
     * @param {IEarthquakes} message Earthquakes message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Earthquakes.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Earthquakes message from the specified reader or buffer.
     * @function decode
     * @memberof Earthquakes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Earthquakes} Earthquakes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Earthquakes.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Earthquakes();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            if (!(message.earthquakes && message.earthquakes.length))
              message.earthquakes = [];
            message.earthquakes.push($root.Earthquake.decode(reader, reader.uint32()));
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an Earthquakes message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Earthquakes
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Earthquakes} Earthquakes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Earthquakes.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Earthquakes message.
     * @function verify
     * @memberof Earthquakes
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Earthquakes.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.earthquakes != null && message.hasOwnProperty("earthquakes")) {
        if (!Array.isArray(message.earthquakes))
          return "earthquakes: array expected";
        for (var i = 0; i < message.earthquakes.length; ++i) {
          var error = $root.Earthquake.verify(message.earthquakes[i]);
          if (error)
            return "earthquakes." + error;
        }
      }
      return null;
    };

    /**
     * Creates an Earthquakes message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Earthquakes
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Earthquakes} Earthquakes
     */
    Earthquakes.fromObject = function fromObject(object) {
      if (object instanceof $root.Earthquakes)
        return object;
      var message = new $root.Earthquakes();
      if (object.earthquakes) {
        if (!Array.isArray(object.earthquakes))
          throw TypeError(".Earthquakes.earthquakes: array expected");
        message.earthquakes = [];
        for (var i = 0; i < object.earthquakes.length; ++i) {
          if (typeof object.earthquakes[i] !== "object")
            throw TypeError(".Earthquakes.earthquakes: object expected");
          message.earthquakes[i] = $root.Earthquake.fromObject(object.earthquakes[i]);
        }
      }
      return message;
    };

    /**
     * Creates a plain object from an Earthquakes message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Earthquakes
     * @static
     * @param {Earthquakes} message Earthquakes
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Earthquakes.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.arrays || options.defaults)
        object.earthquakes = [];
      if (message.earthquakes && message.earthquakes.length) {
        object.earthquakes = [];
        for (var j = 0; j < message.earthquakes.length; ++j)
          object.earthquakes[j] = $root.Earthquake.toObject(message.earthquakes[j], options);
      }
      return object;
    };

    /**
     * Converts this Earthquakes to JSON.
     * @function toJSON
     * @memberof Earthquakes
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Earthquakes.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Earthquakes;
  })();

  return $root;
});
