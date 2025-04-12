import {
  ConcatInjectable,
  Count,
  Injectable,
  Observable,
  ReplaySubject,
  Subject,
  TypedCustomEvent,
  TypedEventTarget,
  __publicField,
  __toESM,
  catchError,
  createExtension,
  externalMetricsSubjectFactory,
  getCameraKitUserAgent,
  lensSourcesFactory,
  map,
  of,
  require_browser_headers_umd,
  require_grpc_web_client_umd,
  require_long,
  require_minimal,
  share,
  switchMap,
  toPublicLens
} from "./chunk-TRIVD64I.js";

// node_modules/@snap/push2web/dist/Push2Web.js
var import_grpc_web2 = __toESM(require_grpc_web_client_umd());

// node_modules/@snap/push2web/dist/generated-api-client/camera_kit/v3/push_to_device.js
var import_long3 = __toESM(require_long());
var import_grpc_web = __toESM(require_grpc_web_client_umd());
var import_minimal3 = __toESM(require_minimal());
var import_browser_headers = __toESM(require_browser_headers_umd());

// node_modules/@snap/push2web/dist/generated-api-client/camera_kit/v3/lens.js
var import_long2 = __toESM(require_long());
var import_minimal2 = __toESM(require_minimal());

// node_modules/@snap/push2web/dist/generated-api-client/google/protobuf/any.js
var import_long = __toESM(require_long());
var import_minimal = __toESM(require_minimal());
function createBaseAny() {
  return { typeUrl: "", value: new Uint8Array() };
}
var Any = {
  encode(message, writer = import_minimal.default.Writer.create()) {
    if (message.typeUrl !== "") {
      writer.uint32(10).string(message.typeUrl);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal.default.Reader ? input : new import_minimal.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseAny();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.typeUrl = reader.string();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      typeUrl: isSet(object.typeUrl) ? String(object.typeUrl) : "",
      value: isSet(object.value) ? bytesFromBase64(object.value) : new Uint8Array()
    };
  },
  toJSON(message) {
    const obj = {};
    message.typeUrl !== void 0 && (obj.typeUrl = message.typeUrl);
    message.value !== void 0 && (obj.value = base64FromBytes(message.value !== void 0 ? message.value : new Uint8Array()));
    return obj;
  },
  fromPartial(object) {
    const message = createBaseAny();
    message.typeUrl = object.typeUrl ?? "";
    message.value = object.value ?? new Uint8Array();
    return message;
  }
};
var globalThis = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  if (typeof self !== "undefined")
    return self;
  if (typeof window !== "undefined")
    return window;
  if (typeof global !== "undefined")
    return global;
  throw "Unable to locate global object";
})();
var atob = globalThis.atob || ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}
var btoa = globalThis.btoa || ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
  const bin = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}
if (import_minimal.default.util.Long !== import_long.default) {
  import_minimal.default.util.Long = import_long.default;
  import_minimal.default.configure();
}
function isSet(value) {
  return value !== null && value !== void 0;
}

// node_modules/@snap/push2web/dist/generated-api-client/camera_kit/v3/lens.js
var Lens_CameraFacing;
(function(Lens_CameraFacing2) {
  Lens_CameraFacing2["CAMERA_FACING_UNSET"] = "CAMERA_FACING_UNSET";
  Lens_CameraFacing2["CAMERA_FACING_FRONT"] = "CAMERA_FACING_FRONT";
  Lens_CameraFacing2["CAMERA_FACING_BACK"] = "CAMERA_FACING_BACK";
  Lens_CameraFacing2["UNRECOGNIZED"] = "UNRECOGNIZED";
})(Lens_CameraFacing || (Lens_CameraFacing = {}));
function lens_CameraFacingFromJSON(object) {
  switch (object) {
    case 0:
    case "CAMERA_FACING_UNSET":
      return Lens_CameraFacing.CAMERA_FACING_UNSET;
    case 1:
    case "CAMERA_FACING_FRONT":
      return Lens_CameraFacing.CAMERA_FACING_FRONT;
    case 2:
    case "CAMERA_FACING_BACK":
      return Lens_CameraFacing.CAMERA_FACING_BACK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Lens_CameraFacing.UNRECOGNIZED;
  }
}
function lens_CameraFacingToJSON(object) {
  switch (object) {
    case Lens_CameraFacing.CAMERA_FACING_UNSET:
      return "CAMERA_FACING_UNSET";
    case Lens_CameraFacing.CAMERA_FACING_FRONT:
      return "CAMERA_FACING_FRONT";
    case Lens_CameraFacing.CAMERA_FACING_BACK:
      return "CAMERA_FACING_BACK";
    default:
      return "UNKNOWN";
  }
}
var LensAssetManifestItem_Type;
(function(LensAssetManifestItem_Type2) {
  LensAssetManifestItem_Type2["DEVICE_DEPENDENT_ASSET_UNSET"] = "DEVICE_DEPENDENT_ASSET_UNSET";
  LensAssetManifestItem_Type2["ASSET"] = "ASSET";
  LensAssetManifestItem_Type2["UNRECOGNIZED"] = "UNRECOGNIZED";
})(LensAssetManifestItem_Type || (LensAssetManifestItem_Type = {}));
function lensAssetManifestItem_TypeFromJSON(object) {
  switch (object) {
    case 0:
    case "DEVICE_DEPENDENT_ASSET_UNSET":
      return LensAssetManifestItem_Type.DEVICE_DEPENDENT_ASSET_UNSET;
    case 1:
    case "ASSET":
      return LensAssetManifestItem_Type.ASSET;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LensAssetManifestItem_Type.UNRECOGNIZED;
  }
}
function lensAssetManifestItem_TypeToJSON(object) {
  switch (object) {
    case LensAssetManifestItem_Type.DEVICE_DEPENDENT_ASSET_UNSET:
      return "DEVICE_DEPENDENT_ASSET_UNSET";
    case LensAssetManifestItem_Type.ASSET:
      return "ASSET";
    default:
      return "UNKNOWN";
  }
}
var LensAssetManifestItem_RequestTiming;
(function(LensAssetManifestItem_RequestTiming2) {
  LensAssetManifestItem_RequestTiming2["PRELOAD_UNSET"] = "PRELOAD_UNSET";
  LensAssetManifestItem_RequestTiming2["ON_DEMAND"] = "ON_DEMAND";
  LensAssetManifestItem_RequestTiming2["REQUIRED"] = "REQUIRED";
  LensAssetManifestItem_RequestTiming2["UNRECOGNIZED"] = "UNRECOGNIZED";
})(LensAssetManifestItem_RequestTiming || (LensAssetManifestItem_RequestTiming = {}));
function lensAssetManifestItem_RequestTimingFromJSON(object) {
  switch (object) {
    case 0:
    case "PRELOAD_UNSET":
      return LensAssetManifestItem_RequestTiming.PRELOAD_UNSET;
    case 1:
    case "ON_DEMAND":
      return LensAssetManifestItem_RequestTiming.ON_DEMAND;
    case 2:
    case "REQUIRED":
      return LensAssetManifestItem_RequestTiming.REQUIRED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return LensAssetManifestItem_RequestTiming.UNRECOGNIZED;
  }
}
function lensAssetManifestItem_RequestTimingToJSON(object) {
  switch (object) {
    case LensAssetManifestItem_RequestTiming.PRELOAD_UNSET:
      return "PRELOAD_UNSET";
    case LensAssetManifestItem_RequestTiming.ON_DEMAND:
      return "ON_DEMAND";
    case LensAssetManifestItem_RequestTiming.REQUIRED:
      return "REQUIRED";
    default:
      return "UNKNOWN";
  }
}
function createBaseLens() {
  return {
    id: "",
    name: "",
    vendorData: {},
    content: void 0,
    isThirdParty: false,
    cameraFacingPreference: Lens_CameraFacing.CAMERA_FACING_UNSET,
    featureMetadata: [],
    lensCreator: void 0,
    scannable: void 0
  };
}
var Lens = {
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : new import_minimal2.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLens();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          const entry3 = Lens_VendorDataEntry.decode(reader, reader.uint32());
          if (entry3.value !== void 0) {
            message.vendorData[entry3.key] = entry3.value;
          }
          break;
        case 4:
          message.content = Content.decode(reader, reader.uint32());
          break;
        case 5:
          message.isThirdParty = reader.bool();
          break;
        case 6:
          message.cameraFacingPreference = lens_CameraFacingFromJSON(reader.int32());
          break;
        case 7:
          message.featureMetadata.push(Any.decode(reader, reader.uint32()));
          break;
        case 8:
          message.lensCreator = LensCreator.decode(reader, reader.uint32());
          break;
        case 9:
          message.scannable = Scannable.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      id: isSet2(object.id) ? String(object.id) : "",
      name: isSet2(object.name) ? String(object.name) : "",
      vendorData: isObject(object.vendorData) ? Object.entries(object.vendorData).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {}) : {},
      content: isSet2(object.content) ? Content.fromJSON(object.content) : void 0,
      isThirdParty: isSet2(object.isThirdParty) ? Boolean(object.isThirdParty) : false,
      cameraFacingPreference: isSet2(object.cameraFacingPreference) ? lens_CameraFacingFromJSON(object.cameraFacingPreference) : Lens_CameraFacing.CAMERA_FACING_UNSET,
      featureMetadata: Array.isArray(object == null ? void 0 : object.featureMetadata) ? object.featureMetadata.map((e) => Any.fromJSON(e)) : [],
      lensCreator: isSet2(object.lensCreator) ? LensCreator.fromJSON(object.lensCreator) : void 0,
      scannable: isSet2(object.scannable) ? Scannable.fromJSON(object.scannable) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    message.id !== void 0 && (obj.id = message.id);
    message.name !== void 0 && (obj.name = message.name);
    obj.vendorData = {};
    if (message.vendorData) {
      Object.entries(message.vendorData).forEach(([k, v]) => {
        obj.vendorData[k] = v;
      });
    }
    message.content !== void 0 && (obj.content = message.content ? Content.toJSON(message.content) : void 0);
    message.isThirdParty !== void 0 && (obj.isThirdParty = message.isThirdParty);
    message.cameraFacingPreference !== void 0 && (obj.cameraFacingPreference = lens_CameraFacingToJSON(message.cameraFacingPreference));
    if (message.featureMetadata) {
      obj.featureMetadata = message.featureMetadata.map((e) => e ? Any.toJSON(e) : void 0);
    } else {
      obj.featureMetadata = [];
    }
    message.lensCreator !== void 0 && (obj.lensCreator = message.lensCreator ? LensCreator.toJSON(message.lensCreator) : void 0);
    message.scannable !== void 0 && (obj.scannable = message.scannable ? Scannable.toJSON(message.scannable) : void 0);
    return obj;
  },
  fromPartial(object) {
    var _a;
    const message = createBaseLens();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.vendorData = Object.entries(object.vendorData ?? {}).reduce((acc, [key, value]) => {
      if (value !== void 0) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.content = object.content !== void 0 && object.content !== null ? Content.fromPartial(object.content) : void 0;
    message.isThirdParty = object.isThirdParty ?? false;
    message.cameraFacingPreference = object.cameraFacingPreference ?? Lens_CameraFacing.CAMERA_FACING_UNSET;
    message.featureMetadata = ((_a = object.featureMetadata) == null ? void 0 : _a.map((e) => Any.fromPartial(e))) || [];
    message.lensCreator = object.lensCreator !== void 0 && object.lensCreator !== null ? LensCreator.fromPartial(object.lensCreator) : void 0;
    message.scannable = object.scannable !== void 0 && object.scannable !== null ? Scannable.fromPartial(object.scannable) : void 0;
    return message;
  }
};
function createBaseLens_VendorDataEntry() {
  return { key: "", value: "" };
}
var Lens_VendorDataEntry = {
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : new import_minimal2.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLens_VendorDataEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? String(object.key) : "",
      value: isSet2(object.value) ? String(object.value) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    message.key !== void 0 && (obj.key = message.key);
    message.value !== void 0 && (obj.value = message.value);
    return obj;
  },
  fromPartial(object) {
    const message = createBaseLens_VendorDataEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  }
};
function createBaseContent() {
  return {
    lnsUrl: "",
    lnsSha256: "",
    iconUrl: "",
    preview: void 0,
    assetManifest: [],
    defaultHintId: "",
    hintTranslations: {},
    lnsUrlBolt: "",
    iconUrlBolt: ""
  };
}
var Content = {
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : new import_minimal2.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseContent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lnsUrl = reader.string();
          break;
        case 2:
          message.lnsSha256 = reader.string();
          break;
        case 3:
          message.iconUrl = reader.string();
          break;
        case 4:
          message.preview = Preview.decode(reader, reader.uint32());
          break;
        case 5:
          message.assetManifest.push(LensAssetManifestItem.decode(reader, reader.uint32()));
          break;
        case 6:
          message.defaultHintId = reader.string();
          break;
        case 7:
          const entry7 = Content_HintTranslationsEntry.decode(reader, reader.uint32());
          if (entry7.value !== void 0) {
            message.hintTranslations[entry7.key] = entry7.value;
          }
          break;
        case 8:
          message.lnsUrlBolt = reader.string();
          break;
        case 9:
          message.iconUrlBolt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      lnsUrl: isSet2(object.lnsUrl) ? String(object.lnsUrl) : "",
      lnsSha256: isSet2(object.lnsSha256) ? String(object.lnsSha256) : "",
      iconUrl: isSet2(object.iconUrl) ? String(object.iconUrl) : "",
      preview: isSet2(object.preview) ? Preview.fromJSON(object.preview) : void 0,
      assetManifest: Array.isArray(object == null ? void 0 : object.assetManifest) ? object.assetManifest.map((e) => LensAssetManifestItem.fromJSON(e)) : [],
      defaultHintId: isSet2(object.defaultHintId) ? String(object.defaultHintId) : "",
      hintTranslations: isObject(object.hintTranslations) ? Object.entries(object.hintTranslations).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {}) : {},
      lnsUrlBolt: isSet2(object.lnsUrlBolt) ? String(object.lnsUrlBolt) : "",
      iconUrlBolt: isSet2(object.iconUrlBolt) ? String(object.iconUrlBolt) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    message.lnsUrl !== void 0 && (obj.lnsUrl = message.lnsUrl);
    message.lnsSha256 !== void 0 && (obj.lnsSha256 = message.lnsSha256);
    message.iconUrl !== void 0 && (obj.iconUrl = message.iconUrl);
    message.preview !== void 0 && (obj.preview = message.preview ? Preview.toJSON(message.preview) : void 0);
    if (message.assetManifest) {
      obj.assetManifest = message.assetManifest.map((e) => e ? LensAssetManifestItem.toJSON(e) : void 0);
    } else {
      obj.assetManifest = [];
    }
    message.defaultHintId !== void 0 && (obj.defaultHintId = message.defaultHintId);
    obj.hintTranslations = {};
    if (message.hintTranslations) {
      Object.entries(message.hintTranslations).forEach(([k, v]) => {
        obj.hintTranslations[k] = v;
      });
    }
    message.lnsUrlBolt !== void 0 && (obj.lnsUrlBolt = message.lnsUrlBolt);
    message.iconUrlBolt !== void 0 && (obj.iconUrlBolt = message.iconUrlBolt);
    return obj;
  },
  fromPartial(object) {
    var _a;
    const message = createBaseContent();
    message.lnsUrl = object.lnsUrl ?? "";
    message.lnsSha256 = object.lnsSha256 ?? "";
    message.iconUrl = object.iconUrl ?? "";
    message.preview = object.preview !== void 0 && object.preview !== null ? Preview.fromPartial(object.preview) : void 0;
    message.assetManifest = ((_a = object.assetManifest) == null ? void 0 : _a.map((e) => LensAssetManifestItem.fromPartial(e))) || [];
    message.defaultHintId = object.defaultHintId ?? "";
    message.hintTranslations = Object.entries(object.hintTranslations ?? {}).reduce((acc, [key, value]) => {
      if (value !== void 0) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.lnsUrlBolt = object.lnsUrlBolt ?? "";
    message.iconUrlBolt = object.iconUrlBolt ?? "";
    return message;
  }
};
function createBaseContent_HintTranslationsEntry() {
  return { key: "", value: "" };
}
var Content_HintTranslationsEntry = {
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : new import_minimal2.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseContent_HintTranslationsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet2(object.key) ? String(object.key) : "",
      value: isSet2(object.value) ? String(object.value) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    message.key !== void 0 && (obj.key = message.key);
    message.value !== void 0 && (obj.value = message.value);
    return obj;
  },
  fromPartial(object) {
    const message = createBaseContent_HintTranslationsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  }
};
function createBaseLensAssetManifestItem() {
  return {
    type: LensAssetManifestItem_Type.DEVICE_DEPENDENT_ASSET_UNSET,
    id: "",
    requestTiming: LensAssetManifestItem_RequestTiming.PRELOAD_UNSET,
    assetUrl: "",
    assetChecksum: ""
  };
}
var LensAssetManifestItem = {
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : new import_minimal2.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLensAssetManifestItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = lensAssetManifestItem_TypeFromJSON(reader.int32());
          break;
        case 2:
          message.id = reader.string();
          break;
        case 3:
          message.requestTiming = lensAssetManifestItem_RequestTimingFromJSON(reader.int32());
          break;
        case 4:
          message.assetUrl = reader.string();
          break;
        case 5:
          message.assetChecksum = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      type: isSet2(object.type) ? lensAssetManifestItem_TypeFromJSON(object.type) : LensAssetManifestItem_Type.DEVICE_DEPENDENT_ASSET_UNSET,
      id: isSet2(object.id) ? String(object.id) : "",
      requestTiming: isSet2(object.requestTiming) ? lensAssetManifestItem_RequestTimingFromJSON(object.requestTiming) : LensAssetManifestItem_RequestTiming.PRELOAD_UNSET,
      assetUrl: isSet2(object.assetUrl) ? String(object.assetUrl) : "",
      assetChecksum: isSet2(object.assetChecksum) ? String(object.assetChecksum) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    message.type !== void 0 && (obj.type = lensAssetManifestItem_TypeToJSON(message.type));
    message.id !== void 0 && (obj.id = message.id);
    message.requestTiming !== void 0 && (obj.requestTiming = lensAssetManifestItem_RequestTimingToJSON(message.requestTiming));
    message.assetUrl !== void 0 && (obj.assetUrl = message.assetUrl);
    message.assetChecksum !== void 0 && (obj.assetChecksum = message.assetChecksum);
    return obj;
  },
  fromPartial(object) {
    const message = createBaseLensAssetManifestItem();
    message.type = object.type ?? LensAssetManifestItem_Type.DEVICE_DEPENDENT_ASSET_UNSET;
    message.id = object.id ?? "";
    message.requestTiming = object.requestTiming ?? LensAssetManifestItem_RequestTiming.PRELOAD_UNSET;
    message.assetUrl = object.assetUrl ?? "";
    message.assetChecksum = object.assetChecksum ?? "";
    return message;
  }
};
function createBasePreview() {
  return { imageUrl: "", imageSequenceSize: 0, imageSequenceWebpUrlPattern: "" };
}
var Preview = {
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : new import_minimal2.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBasePreview();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.imageUrl = reader.string();
          break;
        case 2:
          message.imageSequenceSize = reader.int32();
          break;
        case 3:
          message.imageSequenceWebpUrlPattern = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      imageUrl: isSet2(object.imageUrl) ? String(object.imageUrl) : "",
      imageSequenceSize: isSet2(object.imageSequenceSize) ? Number(object.imageSequenceSize) : 0,
      imageSequenceWebpUrlPattern: isSet2(object.imageSequenceWebpUrlPattern) ? String(object.imageSequenceWebpUrlPattern) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    message.imageUrl !== void 0 && (obj.imageUrl = message.imageUrl);
    message.imageSequenceSize !== void 0 && (obj.imageSequenceSize = Math.round(message.imageSequenceSize));
    message.imageSequenceWebpUrlPattern !== void 0 && (obj.imageSequenceWebpUrlPattern = message.imageSequenceWebpUrlPattern);
    return obj;
  },
  fromPartial(object) {
    const message = createBasePreview();
    message.imageUrl = object.imageUrl ?? "";
    message.imageSequenceSize = object.imageSequenceSize ?? 0;
    message.imageSequenceWebpUrlPattern = object.imageSequenceWebpUrlPattern ?? "";
    return message;
  }
};
function createBaseLensCreator() {
  return { displayName: "" };
}
var LensCreator = {
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : new import_minimal2.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseLensCreator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.displayName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      displayName: isSet2(object.displayName) ? String(object.displayName) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    message.displayName !== void 0 && (obj.displayName = message.displayName);
    return obj;
  },
  fromPartial(object) {
    const message = createBaseLensCreator();
    message.displayName = object.displayName ?? "";
    return message;
  }
};
function createBaseScannable() {
  return { snapcodeImageUrl: "", snapcodeDeeplink: "" };
}
var Scannable = {
  decode(input, length) {
    const reader = input instanceof import_minimal2.default.Reader ? input : new import_minimal2.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseScannable();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.snapcodeImageUrl = reader.string();
          break;
        case 2:
          message.snapcodeDeeplink = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      snapcodeImageUrl: isSet2(object.snapcodeImageUrl) ? String(object.snapcodeImageUrl) : "",
      snapcodeDeeplink: isSet2(object.snapcodeDeeplink) ? String(object.snapcodeDeeplink) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    message.snapcodeImageUrl !== void 0 && (obj.snapcodeImageUrl = message.snapcodeImageUrl);
    message.snapcodeDeeplink !== void 0 && (obj.snapcodeDeeplink = message.snapcodeDeeplink);
    return obj;
  },
  fromPartial(object) {
    const message = createBaseScannable();
    message.snapcodeImageUrl = object.snapcodeImageUrl ?? "";
    message.snapcodeDeeplink = object.snapcodeDeeplink ?? "";
    return message;
  }
};
if (import_minimal2.default.util.Long !== import_long2.default) {
  import_minimal2.default.util.Long = import_long2.default;
  import_minimal2.default.configure();
}
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isSet2(value) {
  return value !== null && value !== void 0;
}

// node_modules/@snap/push2web/dist/generated-api-client/camera_kit/v3/push_to_device.js
var PushLensSubscriptionResponse_ExcludedLens_Code;
(function(PushLensSubscriptionResponse_ExcludedLens_Code2) {
  PushLensSubscriptionResponse_ExcludedLens_Code2["UNSET"] = "UNSET";
  PushLensSubscriptionResponse_ExcludedLens_Code2["UNKNOWN"] = "UNKNOWN";
  PushLensSubscriptionResponse_ExcludedLens_Code2["NOT_FOUND"] = "NOT_FOUND";
  PushLensSubscriptionResponse_ExcludedLens_Code2["INCOMPATIBLE_LENS_CORE_VERSION"] = "INCOMPATIBLE_LENS_CORE_VERSION";
  PushLensSubscriptionResponse_ExcludedLens_Code2["ARCHIVED_OR_INVISIBLE"] = "ARCHIVED_OR_INVISIBLE";
  PushLensSubscriptionResponse_ExcludedLens_Code2["CONTAINS_MUSIC"] = "CONTAINS_MUSIC";
  PushLensSubscriptionResponse_ExcludedLens_Code2["UNRECOGNIZED"] = "UNRECOGNIZED";
})(PushLensSubscriptionResponse_ExcludedLens_Code || (PushLensSubscriptionResponse_ExcludedLens_Code = {}));
function pushLensSubscriptionResponse_ExcludedLens_CodeFromJSON(object) {
  switch (object) {
    case 0:
    case "UNSET":
      return PushLensSubscriptionResponse_ExcludedLens_Code.UNSET;
    case 1:
    case "UNKNOWN":
      return PushLensSubscriptionResponse_ExcludedLens_Code.UNKNOWN;
    case 2:
    case "NOT_FOUND":
      return PushLensSubscriptionResponse_ExcludedLens_Code.NOT_FOUND;
    case 3:
    case "INCOMPATIBLE_LENS_CORE_VERSION":
      return PushLensSubscriptionResponse_ExcludedLens_Code.INCOMPATIBLE_LENS_CORE_VERSION;
    case 4:
    case "ARCHIVED_OR_INVISIBLE":
      return PushLensSubscriptionResponse_ExcludedLens_Code.ARCHIVED_OR_INVISIBLE;
    case 5:
    case "CONTAINS_MUSIC":
      return PushLensSubscriptionResponse_ExcludedLens_Code.CONTAINS_MUSIC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PushLensSubscriptionResponse_ExcludedLens_Code.UNRECOGNIZED;
  }
}
function pushLensSubscriptionResponse_ExcludedLens_CodeToJSON(object) {
  switch (object) {
    case PushLensSubscriptionResponse_ExcludedLens_Code.UNSET:
      return "UNSET";
    case PushLensSubscriptionResponse_ExcludedLens_Code.UNKNOWN:
      return "UNKNOWN";
    case PushLensSubscriptionResponse_ExcludedLens_Code.NOT_FOUND:
      return "NOT_FOUND";
    case PushLensSubscriptionResponse_ExcludedLens_Code.INCOMPATIBLE_LENS_CORE_VERSION:
      return "INCOMPATIBLE_LENS_CORE_VERSION";
    case PushLensSubscriptionResponse_ExcludedLens_Code.ARCHIVED_OR_INVISIBLE:
      return "ARCHIVED_OR_INVISIBLE";
    case PushLensSubscriptionResponse_ExcludedLens_Code.CONTAINS_MUSIC:
      return "CONTAINS_MUSIC";
    default:
      return "UNKNOWN";
  }
}
var ListenLensPushResponse_ExcludedLens_Code;
(function(ListenLensPushResponse_ExcludedLens_Code2) {
  ListenLensPushResponse_ExcludedLens_Code2["UNSET"] = "UNSET";
  ListenLensPushResponse_ExcludedLens_Code2["UNKNOWN"] = "UNKNOWN";
  ListenLensPushResponse_ExcludedLens_Code2["NOT_FOUND"] = "NOT_FOUND";
  ListenLensPushResponse_ExcludedLens_Code2["INCOMPATIBLE_LENS_CORE_VERSION"] = "INCOMPATIBLE_LENS_CORE_VERSION";
  ListenLensPushResponse_ExcludedLens_Code2["ARCHIVED_OR_INVISIBLE"] = "ARCHIVED_OR_INVISIBLE";
  ListenLensPushResponse_ExcludedLens_Code2["CONTAINS_MUSIC"] = "CONTAINS_MUSIC";
  ListenLensPushResponse_ExcludedLens_Code2["UNRECOGNIZED"] = "UNRECOGNIZED";
})(ListenLensPushResponse_ExcludedLens_Code || (ListenLensPushResponse_ExcludedLens_Code = {}));
function listenLensPushResponse_ExcludedLens_CodeFromJSON(object) {
  switch (object) {
    case 0:
    case "UNSET":
      return ListenLensPushResponse_ExcludedLens_Code.UNSET;
    case 1:
    case "UNKNOWN":
      return ListenLensPushResponse_ExcludedLens_Code.UNKNOWN;
    case 2:
    case "NOT_FOUND":
      return ListenLensPushResponse_ExcludedLens_Code.NOT_FOUND;
    case 3:
    case "INCOMPATIBLE_LENS_CORE_VERSION":
      return ListenLensPushResponse_ExcludedLens_Code.INCOMPATIBLE_LENS_CORE_VERSION;
    case 4:
    case "ARCHIVED_OR_INVISIBLE":
      return ListenLensPushResponse_ExcludedLens_Code.ARCHIVED_OR_INVISIBLE;
    case 5:
    case "CONTAINS_MUSIC":
      return ListenLensPushResponse_ExcludedLens_Code.CONTAINS_MUSIC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ListenLensPushResponse_ExcludedLens_Code.UNRECOGNIZED;
  }
}
function listenLensPushResponse_ExcludedLens_CodeToJSON(object) {
  switch (object) {
    case ListenLensPushResponse_ExcludedLens_Code.UNSET:
      return "UNSET";
    case ListenLensPushResponse_ExcludedLens_Code.UNKNOWN:
      return "UNKNOWN";
    case ListenLensPushResponse_ExcludedLens_Code.NOT_FOUND:
      return "NOT_FOUND";
    case ListenLensPushResponse_ExcludedLens_Code.INCOMPATIBLE_LENS_CORE_VERSION:
      return "INCOMPATIBLE_LENS_CORE_VERSION";
    case ListenLensPushResponse_ExcludedLens_Code.ARCHIVED_OR_INVISIBLE:
      return "ARCHIVED_OR_INVISIBLE";
    case ListenLensPushResponse_ExcludedLens_Code.CONTAINS_MUSIC:
      return "CONTAINS_MUSIC";
    default:
      return "UNKNOWN";
  }
}
function createBasePushLensSubscriptionRequest() {
  return { accountId: "", extensionRequestContext: new Uint8Array(), heartbeat: 0 };
}
var PushLensSubscriptionRequest = {
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.accountId !== "") {
      writer.uint32(10).string(message.accountId);
    }
    if (message.extensionRequestContext.length !== 0) {
      writer.uint32(18).bytes(message.extensionRequestContext);
    }
    if (message.heartbeat !== 0) {
      writer.uint32(24).int32(message.heartbeat);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : new import_minimal3.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBasePushLensSubscriptionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountId = reader.string();
          break;
        case 2:
          message.extensionRequestContext = reader.bytes();
          break;
        case 3:
          message.heartbeat = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      accountId: isSet3(object.accountId) ? String(object.accountId) : "",
      extensionRequestContext: isSet3(object.extensionRequestContext) ? bytesFromBase642(object.extensionRequestContext) : new Uint8Array(),
      heartbeat: isSet3(object.heartbeat) ? Number(object.heartbeat) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    message.accountId !== void 0 && (obj.accountId = message.accountId);
    message.extensionRequestContext !== void 0 && (obj.extensionRequestContext = base64FromBytes2(message.extensionRequestContext !== void 0 ? message.extensionRequestContext : new Uint8Array()));
    message.heartbeat !== void 0 && (obj.heartbeat = Math.round(message.heartbeat));
    return obj;
  },
  fromPartial(object) {
    const message = createBasePushLensSubscriptionRequest();
    message.accountId = object.accountId ?? "";
    message.extensionRequestContext = object.extensionRequestContext ?? new Uint8Array();
    message.heartbeat = object.heartbeat ?? 0;
    return message;
  }
};
function createBasePushLensSubscriptionResponse() {
  return { lens: void 0, excludedLens: void 0, heartbeat: 0, lenses: {} };
}
var PushLensSubscriptionResponse = {
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : new import_minimal3.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBasePushLensSubscriptionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lens = Lens.decode(reader, reader.uint32());
          break;
        case 2:
          message.excludedLens = PushLensSubscriptionResponse_ExcludedLens.decode(reader, reader.uint32());
          break;
        case 3:
          message.heartbeat = reader.int32();
          break;
        case 4:
          const entry4 = PushLensSubscriptionResponse_LensesEntry.decode(reader, reader.uint32());
          if (entry4.value !== void 0) {
            message.lenses[entry4.key] = entry4.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      lens: isSet3(object.lens) ? Lens.fromJSON(object.lens) : void 0,
      excludedLens: isSet3(object.excludedLens) ? PushLensSubscriptionResponse_ExcludedLens.fromJSON(object.excludedLens) : void 0,
      heartbeat: isSet3(object.heartbeat) ? Number(object.heartbeat) : 0,
      lenses: isObject2(object.lenses) ? Object.entries(object.lenses).reduce((acc, [key, value]) => {
        acc[key] = bytesFromBase642(value);
        return acc;
      }, {}) : {}
    };
  },
  toJSON(message) {
    const obj = {};
    message.lens !== void 0 && (obj.lens = message.lens ? Lens.toJSON(message.lens) : void 0);
    message.excludedLens !== void 0 && (obj.excludedLens = message.excludedLens ? PushLensSubscriptionResponse_ExcludedLens.toJSON(message.excludedLens) : void 0);
    message.heartbeat !== void 0 && (obj.heartbeat = Math.round(message.heartbeat));
    obj.lenses = {};
    if (message.lenses) {
      Object.entries(message.lenses).forEach(([k, v]) => {
        obj.lenses[k] = base64FromBytes2(v);
      });
    }
    return obj;
  },
  fromPartial(object) {
    const message = createBasePushLensSubscriptionResponse();
    message.lens = object.lens !== void 0 && object.lens !== null ? Lens.fromPartial(object.lens) : void 0;
    message.excludedLens = object.excludedLens !== void 0 && object.excludedLens !== null ? PushLensSubscriptionResponse_ExcludedLens.fromPartial(object.excludedLens) : void 0;
    message.heartbeat = object.heartbeat ?? 0;
    message.lenses = Object.entries(object.lenses ?? {}).reduce((acc, [key, value]) => {
      if (value !== void 0) {
        acc[key] = value;
      }
      return acc;
    }, {});
    return message;
  }
};
function createBasePushLensSubscriptionResponse_LensesEntry() {
  return { key: "", value: new Uint8Array() };
}
var PushLensSubscriptionResponse_LensesEntry = {
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : new import_minimal3.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBasePushLensSubscriptionResponse_LensesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet3(object.key) ? String(object.key) : "",
      value: isSet3(object.value) ? bytesFromBase642(object.value) : new Uint8Array()
    };
  },
  toJSON(message) {
    const obj = {};
    message.key !== void 0 && (obj.key = message.key);
    message.value !== void 0 && (obj.value = base64FromBytes2(message.value !== void 0 ? message.value : new Uint8Array()));
    return obj;
  },
  fromPartial(object) {
    const message = createBasePushLensSubscriptionResponse_LensesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? new Uint8Array();
    return message;
  }
};
function createBasePushLensSubscriptionResponse_ExcludedLens() {
  return { lensId: "0", code: PushLensSubscriptionResponse_ExcludedLens_Code.UNSET };
}
var PushLensSubscriptionResponse_ExcludedLens = {
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : new import_minimal3.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBasePushLensSubscriptionResponse_ExcludedLens();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lensId = longToString(reader.int64());
          break;
        case 2:
          message.code = pushLensSubscriptionResponse_ExcludedLens_CodeFromJSON(reader.int32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      lensId: isSet3(object.lensId) ? String(object.lensId) : "0",
      code: isSet3(object.code) ? pushLensSubscriptionResponse_ExcludedLens_CodeFromJSON(object.code) : PushLensSubscriptionResponse_ExcludedLens_Code.UNSET
    };
  },
  toJSON(message) {
    const obj = {};
    message.lensId !== void 0 && (obj.lensId = message.lensId);
    message.code !== void 0 && (obj.code = pushLensSubscriptionResponse_ExcludedLens_CodeToJSON(message.code));
    return obj;
  },
  fromPartial(object) {
    const message = createBasePushLensSubscriptionResponse_ExcludedLens();
    message.lensId = object.lensId ?? "0";
    message.code = object.code ?? PushLensSubscriptionResponse_ExcludedLens_Code.UNSET;
    return message;
  }
};
function createBaseListenLensPushRequest() {
  return { extensionRequestContext: new Uint8Array(), heartbeat: 0 };
}
var ListenLensPushRequest = {
  encode(message, writer = import_minimal3.default.Writer.create()) {
    if (message.extensionRequestContext.length !== 0) {
      writer.uint32(18).bytes(message.extensionRequestContext);
    }
    if (message.heartbeat !== 0) {
      writer.uint32(24).int32(message.heartbeat);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : new import_minimal3.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseListenLensPushRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.extensionRequestContext = reader.bytes();
          break;
        case 3:
          message.heartbeat = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      extensionRequestContext: isSet3(object.extensionRequestContext) ? bytesFromBase642(object.extensionRequestContext) : new Uint8Array(),
      heartbeat: isSet3(object.heartbeat) ? Number(object.heartbeat) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    message.extensionRequestContext !== void 0 && (obj.extensionRequestContext = base64FromBytes2(message.extensionRequestContext !== void 0 ? message.extensionRequestContext : new Uint8Array()));
    message.heartbeat !== void 0 && (obj.heartbeat = Math.round(message.heartbeat));
    return obj;
  },
  fromPartial(object) {
    const message = createBaseListenLensPushRequest();
    message.extensionRequestContext = object.extensionRequestContext ?? new Uint8Array();
    message.heartbeat = object.heartbeat ?? 0;
    return message;
  }
};
function createBaseListenLensPushResponse() {
  return { excludedLens: void 0, heartbeat: 0, lenses: {} };
}
var ListenLensPushResponse = {
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : new import_minimal3.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseListenLensPushResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.excludedLens = ListenLensPushResponse_ExcludedLens.decode(reader, reader.uint32());
          break;
        case 3:
          message.heartbeat = reader.int32();
          break;
        case 4:
          const entry4 = ListenLensPushResponse_LensesEntry.decode(reader, reader.uint32());
          if (entry4.value !== void 0) {
            message.lenses[entry4.key] = entry4.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      excludedLens: isSet3(object.excludedLens) ? ListenLensPushResponse_ExcludedLens.fromJSON(object.excludedLens) : void 0,
      heartbeat: isSet3(object.heartbeat) ? Number(object.heartbeat) : 0,
      lenses: isObject2(object.lenses) ? Object.entries(object.lenses).reduce((acc, [key, value]) => {
        acc[key] = bytesFromBase642(value);
        return acc;
      }, {}) : {}
    };
  },
  toJSON(message) {
    const obj = {};
    message.excludedLens !== void 0 && (obj.excludedLens = message.excludedLens ? ListenLensPushResponse_ExcludedLens.toJSON(message.excludedLens) : void 0);
    message.heartbeat !== void 0 && (obj.heartbeat = Math.round(message.heartbeat));
    obj.lenses = {};
    if (message.lenses) {
      Object.entries(message.lenses).forEach(([k, v]) => {
        obj.lenses[k] = base64FromBytes2(v);
      });
    }
    return obj;
  },
  fromPartial(object) {
    const message = createBaseListenLensPushResponse();
    message.excludedLens = object.excludedLens !== void 0 && object.excludedLens !== null ? ListenLensPushResponse_ExcludedLens.fromPartial(object.excludedLens) : void 0;
    message.heartbeat = object.heartbeat ?? 0;
    message.lenses = Object.entries(object.lenses ?? {}).reduce((acc, [key, value]) => {
      if (value !== void 0) {
        acc[key] = value;
      }
      return acc;
    }, {});
    return message;
  }
};
function createBaseListenLensPushResponse_LensesEntry() {
  return { key: "", value: new Uint8Array() };
}
var ListenLensPushResponse_LensesEntry = {
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : new import_minimal3.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseListenLensPushResponse_LensesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      key: isSet3(object.key) ? String(object.key) : "",
      value: isSet3(object.value) ? bytesFromBase642(object.value) : new Uint8Array()
    };
  },
  toJSON(message) {
    const obj = {};
    message.key !== void 0 && (obj.key = message.key);
    message.value !== void 0 && (obj.value = base64FromBytes2(message.value !== void 0 ? message.value : new Uint8Array()));
    return obj;
  },
  fromPartial(object) {
    const message = createBaseListenLensPushResponse_LensesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? new Uint8Array();
    return message;
  }
};
function createBaseListenLensPushResponse_ExcludedLens() {
  return { lensId: "0", code: ListenLensPushResponse_ExcludedLens_Code.UNSET };
}
var ListenLensPushResponse_ExcludedLens = {
  decode(input, length) {
    const reader = input instanceof import_minimal3.default.Reader ? input : new import_minimal3.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseListenLensPushResponse_ExcludedLens();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lensId = longToString(reader.int64());
          break;
        case 2:
          message.code = listenLensPushResponse_ExcludedLens_CodeFromJSON(reader.int32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      lensId: isSet3(object.lensId) ? String(object.lensId) : "0",
      code: isSet3(object.code) ? listenLensPushResponse_ExcludedLens_CodeFromJSON(object.code) : ListenLensPushResponse_ExcludedLens_Code.UNSET
    };
  },
  toJSON(message) {
    const obj = {};
    message.lensId !== void 0 && (obj.lensId = message.lensId);
    message.code !== void 0 && (obj.code = listenLensPushResponse_ExcludedLens_CodeToJSON(message.code));
    return obj;
  },
  fromPartial(object) {
    const message = createBaseListenLensPushResponse_ExcludedLens();
    message.lensId = object.lensId ?? "0";
    message.code = object.code ?? ListenLensPushResponse_ExcludedLens_Code.UNSET;
    return message;
  }
};
var PushToDeviceClientImpl = class {
  constructor(rpc) {
    __publicField(this, "rpc");
    this.rpc = rpc;
    this.PushLensSubscription = this.PushLensSubscription.bind(this);
    this.ListenLensPush = this.ListenLensPush.bind(this);
  }
  PushLensSubscription(request, metadata) {
    return this.rpc.invoke(PushToDevicePushLensSubscriptionDesc, request, metadata);
  }
  ListenLensPush(request, metadata) {
    return this.rpc.invoke(PushToDeviceListenLensPushDesc, ListenLensPushRequest.fromPartial(request), metadata);
  }
};
var PushToDeviceDesc = {
  serviceName: "com.snap.camerakit.v3.PushToDevice"
};
var PushToDevicePushLensSubscriptionDesc = {
  methodName: "PushLensSubscription",
  service: PushToDeviceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return PushLensSubscriptionRequest.encode(this).finish();
    }
  },
  responseType: {
    deserializeBinary(data) {
      return { ...PushLensSubscriptionResponse.decode(data), toObject() {
        return this;
      } };
    }
  }
};
var PushToDeviceListenLensPushDesc = {
  methodName: "ListenLensPush",
  service: PushToDeviceDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary() {
      return ListenLensPushRequest.encode(this).finish();
    }
  },
  responseType: {
    deserializeBinary(data) {
      return { ...ListenLensPushResponse.decode(data), toObject() {
        return this;
      } };
    }
  }
};
var GrpcWebImpl = class {
  constructor(host, options) {
    __publicField(this, "host");
    __publicField(this, "options");
    this.host = host;
    this.options = options;
  }
  unary(methodDesc, _request, metadata) {
    var _a;
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata = metadata && this.options.metadata ? new import_browser_headers.BrowserHeaders({ ...(_a = this.options) == null ? void 0 : _a.metadata.headersMap, ...metadata == null ? void 0 : metadata.headersMap }) : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      import_grpc_web.grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function(response) {
          if (response.status === import_grpc_web.grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new Error(response.statusMessage);
            err.code = response.status;
            err.metadata = response.trailers;
            reject(err);
          }
        }
      });
    });
  }
  invoke(methodDesc, _request, metadata) {
    var _a;
    const upStreamCodes = [2, 4, 8, 9, 10, 13, 14, 15];
    const DEFAULT_TIMEOUT_TIME = 3e3;
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata = metadata && this.options.metadata ? new import_browser_headers.BrowserHeaders({ ...(_a = this.options) == null ? void 0 : _a.metadata.headersMap, ...metadata == null ? void 0 : metadata.headersMap }) : metadata || this.options.metadata;
    return new Observable((observer) => {
      const upStream = () => {
        const client = import_grpc_web.grpc.invoke(methodDesc, {
          host: this.host,
          request,
          transport: this.options.streamingTransport || this.options.transport,
          metadata: maybeCombinedMetadata,
          debug: this.options.debug,
          onMessage: (next) => observer.next(next),
          onEnd: (code, message) => {
            if (code === 0) {
              observer.complete();
            } else if (upStreamCodes.includes(code)) {
              setTimeout(upStream, DEFAULT_TIMEOUT_TIME);
            } else {
              observer.error(new Error(`Error ${code} ${message}`));
            }
          }
        });
        observer.add(() => client.close());
      };
      upStream();
    }).pipe(share());
  }
};
var globalThis2 = (() => {
  if (typeof globalThis2 !== "undefined")
    return globalThis2;
  if (typeof self !== "undefined")
    return self;
  if (typeof window !== "undefined")
    return window;
  if (typeof global !== "undefined")
    return global;
  throw "Unable to locate global object";
})();
var atob2 = globalThis2.atob || ((b64) => globalThis2.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase642(b64) {
  const bin = atob2(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}
var btoa2 = globalThis2.btoa || ((bin) => globalThis2.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes2(arr) {
  const bin = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa2(bin.join(""));
}
function longToString(long) {
  return long.toString();
}
if (import_minimal3.default.util.Long !== import_long3.default) {
  import_minimal3.default.util.Long = import_long3.default;
  import_minimal3.default.configure();
}
function isObject2(value) {
  return typeof value === "object" && value !== null;
}
function isSet3(value) {
  return value !== null && value !== void 0;
}

// node_modules/@snap/push2web/dist/generated-api-client/camera_kit/v3/export.js
var import_long4 = __toESM(require_long());
var import_minimal4 = __toESM(require_minimal());
var ExportLensesByIdRequest_Context_Extension_Name;
(function(ExportLensesByIdRequest_Context_Extension_Name2) {
  ExportLensesByIdRequest_Context_Extension_Name2["UNSET"] = "UNSET";
  ExportLensesByIdRequest_Context_Extension_Name2["SHOP_KIT"] = "SHOP_KIT";
  ExportLensesByIdRequest_Context_Extension_Name2["LENS_WEB_BUILDER"] = "LENS_WEB_BUILDER";
  ExportLensesByIdRequest_Context_Extension_Name2["UNRECOGNIZED"] = "UNRECOGNIZED";
})(ExportLensesByIdRequest_Context_Extension_Name || (ExportLensesByIdRequest_Context_Extension_Name = {}));
var ExportLensesByIdResponse_ExcludedLens_Code;
(function(ExportLensesByIdResponse_ExcludedLens_Code2) {
  ExportLensesByIdResponse_ExcludedLens_Code2["UNSET"] = "UNSET";
  ExportLensesByIdResponse_ExcludedLens_Code2["UNKNOWN"] = "UNKNOWN";
  ExportLensesByIdResponse_ExcludedLens_Code2["NOT_FOUND"] = "NOT_FOUND";
  ExportLensesByIdResponse_ExcludedLens_Code2["INCOMPATIBLE_LENS_CORE_VERSION"] = "INCOMPATIBLE_LENS_CORE_VERSION";
  ExportLensesByIdResponse_ExcludedLens_Code2["ARCHIVED_OR_INVISIBLE"] = "ARCHIVED_OR_INVISIBLE";
  ExportLensesByIdResponse_ExcludedLens_Code2["CONTAINS_MUSIC"] = "CONTAINS_MUSIC";
  ExportLensesByIdResponse_ExcludedLens_Code2["UNRECOGNIZED"] = "UNRECOGNIZED";
})(ExportLensesByIdResponse_ExcludedLens_Code || (ExportLensesByIdResponse_ExcludedLens_Code = {}));
function createBaseEnvelope() {
  return { lenses: [] };
}
var Envelope = {
  decode(input, length) {
    const reader = input instanceof import_minimal4.default.Reader ? input : new import_minimal4.default.Reader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseEnvelope();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lenses.push(Lens.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    return {
      lenses: Array.isArray(object == null ? void 0 : object.lenses) ? object.lenses.map((e) => Lens.fromJSON(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.lenses) {
      obj.lenses = message.lenses.map((e) => e ? Lens.toJSON(e) : void 0);
    } else {
      obj.lenses = [];
    }
    return obj;
  },
  fromPartial(object) {
    var _a;
    const message = createBaseEnvelope();
    message.lenses = ((_a = object.lenses) == null ? void 0 : _a.map((e) => Lens.fromPartial(e))) || [];
    return message;
  }
};
var globalThis3 = (() => {
  if (typeof globalThis3 !== "undefined")
    return globalThis3;
  if (typeof self !== "undefined")
    return self;
  if (typeof window !== "undefined")
    return window;
  if (typeof global !== "undefined")
    return global;
  throw "Unable to locate global object";
})();
var atob3 = globalThis3.atob || ((b64) => globalThis3.Buffer.from(b64, "base64").toString("binary"));
var btoa3 = globalThis3.btoa || ((bin) => globalThis3.Buffer.from(bin, "binary").toString("base64"));
if (import_minimal4.default.util.Long !== import_long4.default) {
  import_minimal4.default.util.Long = import_long4.default;
  import_minimal4.default.configure();
}

// node_modules/@snap/push2web/dist/generated-api-client/core/snap_status_code.js
var import_long5 = __toESM(require_long());
var import_minimal5 = __toESM(require_minimal());
var Code;
(function(Code2) {
  Code2["OK"] = "OK";
  Code2["CANCELLED"] = "CANCELLED";
  Code2["UNKNOWN"] = "UNKNOWN";
  Code2["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
  Code2["DEADLINE_EXCEEDED"] = "DEADLINE_EXCEEDED";
  Code2["NOT_FOUND"] = "NOT_FOUND";
  Code2["ALREADY_EXISTS"] = "ALREADY_EXISTS";
  Code2["PERMISSION_DENIED"] = "PERMISSION_DENIED";
  Code2["UNAUTHENTICATED"] = "UNAUTHENTICATED";
  Code2["RESOURCE_EXHAUSTED"] = "RESOURCE_EXHAUSTED";
  Code2["FAILED_PRECONDITION"] = "FAILED_PRECONDITION";
  Code2["ABORTED"] = "ABORTED";
  Code2["OUT_OF_RANGE"] = "OUT_OF_RANGE";
  Code2["UNIMPLEMENTED"] = "UNIMPLEMENTED";
  Code2["INTERNAL"] = "INTERNAL";
  Code2["UNAVAILABLE"] = "UNAVAILABLE";
  Code2["DATA_LOSS"] = "DATA_LOSS";
  Code2["NOT_MODIFIED"] = "NOT_MODIFIED";
  Code2["DECRYPTION_FAILED"] = "DECRYPTION_FAILED";
  Code2["INVALID_MEDIA"] = "INVALID_MEDIA";
  Code2["IN_PROGRESS"] = "IN_PROGRESS";
  Code2["CONTENT_TOO_LARGE"] = "CONTENT_TOO_LARGE";
  Code2["URL_PROTOCOL_NOT_SUPPORTED"] = "URL_PROTOCOL_NOT_SUPPORTED";
  Code2["URL_CONTENT_TYPE_NOT_WHITELISTED"] = "URL_CONTENT_TYPE_NOT_WHITELISTED";
  Code2["URL_DOWNLOAD_FAILURE"] = "URL_DOWNLOAD_FAILURE";
  Code2["CLOUD_STORAGE_FAILURE"] = "CLOUD_STORAGE_FAILURE";
  Code2["UNRECOGNIZED"] = "UNRECOGNIZED";
})(Code || (Code = {}));
function codeFromJSON(object) {
  switch (object) {
    case 0:
    case "OK":
      return Code.OK;
    case 1:
    case "CANCELLED":
      return Code.CANCELLED;
    case 2:
    case "UNKNOWN":
      return Code.UNKNOWN;
    case 3:
    case "INVALID_ARGUMENT":
      return Code.INVALID_ARGUMENT;
    case 4:
    case "DEADLINE_EXCEEDED":
      return Code.DEADLINE_EXCEEDED;
    case 5:
    case "NOT_FOUND":
      return Code.NOT_FOUND;
    case 6:
    case "ALREADY_EXISTS":
      return Code.ALREADY_EXISTS;
    case 7:
    case "PERMISSION_DENIED":
      return Code.PERMISSION_DENIED;
    case 16:
    case "UNAUTHENTICATED":
      return Code.UNAUTHENTICATED;
    case 8:
    case "RESOURCE_EXHAUSTED":
      return Code.RESOURCE_EXHAUSTED;
    case 9:
    case "FAILED_PRECONDITION":
      return Code.FAILED_PRECONDITION;
    case 10:
    case "ABORTED":
      return Code.ABORTED;
    case 11:
    case "OUT_OF_RANGE":
      return Code.OUT_OF_RANGE;
    case 12:
    case "UNIMPLEMENTED":
      return Code.UNIMPLEMENTED;
    case 13:
    case "INTERNAL":
      return Code.INTERNAL;
    case 14:
    case "UNAVAILABLE":
      return Code.UNAVAILABLE;
    case 15:
    case "DATA_LOSS":
      return Code.DATA_LOSS;
    case 100:
    case "NOT_MODIFIED":
      return Code.NOT_MODIFIED;
    case 101:
    case "DECRYPTION_FAILED":
      return Code.DECRYPTION_FAILED;
    case 102:
    case "INVALID_MEDIA":
      return Code.INVALID_MEDIA;
    case 200:
    case "IN_PROGRESS":
      return Code.IN_PROGRESS;
    case 201:
    case "CONTENT_TOO_LARGE":
      return Code.CONTENT_TOO_LARGE;
    case 202:
    case "URL_PROTOCOL_NOT_SUPPORTED":
      return Code.URL_PROTOCOL_NOT_SUPPORTED;
    case 203:
    case "URL_CONTENT_TYPE_NOT_WHITELISTED":
      return Code.URL_CONTENT_TYPE_NOT_WHITELISTED;
    case 204:
    case "URL_DOWNLOAD_FAILURE":
      return Code.URL_DOWNLOAD_FAILURE;
    case 205:
    case "CLOUD_STORAGE_FAILURE":
      return Code.CLOUD_STORAGE_FAILURE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Code.UNRECOGNIZED;
  }
}
if (import_minimal5.default.util.Long !== import_long5.default) {
  import_minimal5.default.util.Long = import_long5.default;
  import_minimal5.default.configure();
}

// node_modules/@snap/push2web/dist/Push2WebSDKExtension.js
function assertUnreachable(_) {
  throw new Error("Reached unreachable code at runtime.");
}
var Push2WebSDKExtension = class {
  constructor() {
    __publicField(this, "extension");
    __publicField(this, "groupId", "PUSH_2_WEB_GROUP_ID");
    __publicField(this, "lastPushedEnvelope");
    __publicField(this, "metricsSubject", new Subject());
    const push2WebLensSource = {
      isGroupOwner: (groupId) => groupId === this.groupId,
      loadLens: async () => {
        if (this.lastPushedEnvelope != void 0) {
          return this.lastPushedEnvelope;
        }
        throw new Error("No pushed lens found.");
      },
      loadLensGroup: async () => {
        if (this.lastPushedEnvelope != void 0) {
          return this.lastPushedEnvelope;
        }
        return new ArrayBuffer(0);
      }
    };
    this.extension = createExtension().provides(ConcatInjectable(lensSourcesFactory.token, () => push2WebLensSource)).provides(Injectable(externalMetricsSubjectFactory.token, () => this.metricsSubject));
  }
  updateEnvelope(newEnvelope) {
    this.lastPushedEnvelope = newEnvelope;
  }
  reportEvent(events) {
    const { type } = events;
    switch (type) {
      case "error": {
        const dimensions = {};
        if (events.detail.name === "CommunicationError") {
          dimensions["type"] = "subscription";
          dimensions["cause"] = events.detail.grpcStatus;
        } else if (events.detail.name === "LensExcludedError") {
          dimensions["type"] = "lens_excluded";
          dimensions["cause"] = events.detail.cause.message;
        }
        this.metricsSubject.next(Count.count("push2web_error", 1, dimensions));
        break;
      }
      case "lensReceived": {
        this.metricsSubject.next(Count.count("push2web_received", 1));
        break;
      }
      case "subscriptionChanged":
        break;
      default: {
        assertUnreachable(type);
      }
    }
  }
};

// node_modules/@snap/push2web/dist/Push2Web.js
var Push2Web = class {
  /**
   * Create new instance of Push2Web object,
   * it can be used to start listening for the events,
   * subscribe or unsubscribe for notifications from Lens Studio.
   * Also provides the extension object for the @snap/camera-kit package.
   */
  constructor() {
    /**
     * Use this property to subscribe for the different types of events that can occur during push 2 web execution.
     *
     * Subscribe to `error` event to be aware if something has happened during the lens push,
     * with network communication or any other type of error,
     * event object also contains detailed explanation of the cause.
     *
     * Use `subscriptionChanged` event to be aware when subscription state is changed.
     *
     * Use `lensReceived` event to be aware when new lens is received from Lens Studio,
     * also you can get the additional details about the pushed lens.
     *
     * @example
     *```ts
     *push2web.events.addEventListener('error', ({ detail }) => {
     *   if (detail.name === 'LensExcludedError') {
     *     console.log(`Lens is excluded from the push, by the following reason: ${detail.reason}.`)
     *   }
     *})
     *```
     */
    __publicField(this, "events", new TypedEventTarget());
    __publicField(this, "push2WebExtension", new Push2WebSDKExtension());
    __publicField(this, "pushedLenses");
    __publicField(this, "accessToken", new ReplaySubject(1));
    __publicField(this, "subscription");
    this.pushedLenses = this.accessToken.pipe(switchMap((accessToken) => {
      const metadata = new import_grpc_web2.grpc.Metadata();
      metadata.append("Authorization", `Bearer ${accessToken}`);
      metadata.append("x-snap-client-user-agent", getCameraKitUserAgent());
      const grpcWeb = new GrpcWebImpl("https://api-kit.snapchat.com", {
        metadata
      });
      const push2WebClient = new PushToDeviceClientImpl(grpcWeb);
      return push2WebClient.ListenLensPush(ListenLensPushRequest.fromPartial({})).pipe(map(({ lenses, excludedLens }) => {
        if (excludedLens) {
          return new TypedCustomEvent("error", {
            name: "LensExcludedError",
            cause: new Error(listenLensPushResponse_ExcludedLens_CodeFromJSON(excludedLens.code)),
            lensId: excludedLens.lensId,
            reason: listenLensPushResponse_ExcludedLens_CodeFromJSON(excludedLens.code)
          });
        }
        const envelope = Object.values(lenses)[0];
        this.push2WebExtension.updateEnvelope(envelope);
        const [lens] = Envelope.decode(envelope).lenses;
        const groupId = this.push2WebExtension.groupId;
        return new TypedCustomEvent("lensReceived", toPublicLens({ ...lens, groupId }));
      }), catchError((error) => {
        const grpcError = /Error ([\d]{1,3})/.exec(error.message);
        if (grpcError) {
          this.events.dispatchEvent(new TypedCustomEvent("subscriptionChanged", State.Unsubscribed));
          const grpcCode = parseInt(grpcError[1]);
          return of(new TypedCustomEvent("error", {
            name: "CommunicationError",
            cause: error,
            grpcStatus: codeFromJSON(grpcCode),
            grpcCode
          }));
        }
        return of(new TypedCustomEvent("error", { name: "GenericError", cause: error }));
      }));
    }));
  }
  /**
   * The extension object must be passed to the Camera Kit object during its bootstrap process.
   * This is a requirement for the proper functioning of push to web functionality.
   *
   * @example
   * ```ts
   *import { bootstrapCameraKit } from "@snap/camera-kit";
   *
   *const push2web = new Push2Web();
   *const extensions = (container) => container.provides(push2Web.extension);
   *
   *const cameraKit = await bootstrapCameraKit({ apiToken: "token from developer portal" }, extensions);
   *const cameraKitSession = await cameraKit.createSession();
   * ```
   */
  get extension() {
    return this.push2WebExtension.extension;
  }
  /**
   * Initiate subscription for the events from Lens Studio.
   *
   * @param accessToken - After user will be logged in to the web page,
   * using Snapchat account, you can get access token from Login Kit.
   * @param cameraKitSession - Instance of CameraKitSession object form @snap/camera-kit package.
   * @param repository - Instance of LensRepository object from @snap/camera-kit package.
   * @returns @SubscriptionInstance
   */
  subscribe(accessToken, cameraKitSession, repository) {
    var _a;
    (_a = this.subscription) == null ? void 0 : _a.unsubscribe();
    this.accessToken.next(accessToken);
    this.subscription = this.pushedLenses.subscribe({
      next: async (event) => {
        this.events.dispatchEvent(event);
        if (event.type === "lensReceived") {
          try {
            const lens = await repository.loadLens(event.detail.id, this.push2WebExtension.groupId);
            await cameraKitSession.removeLens();
            await cameraKitSession.applyLens(lens);
          } catch (error) {
            this.events.dispatchEvent(new TypedCustomEvent("error", {
              name: "GenericError",
              cause: error
            }));
          }
        }
        this.push2WebExtension.reportEvent(event);
      }
    });
    this.events.dispatchEvent(new TypedCustomEvent("subscriptionChanged", State.Subscribed));
    return {
      unsubscribe: async () => {
        if (this.subscription) {
          this.subscription.unsubscribe();
          this.subscription = void 0;
          this.events.dispatchEvent(new TypedCustomEvent("subscriptionChanged", State.Unsubscribed));
        }
      },
      updateAccessToken: (accessToken2) => {
        this.accessToken.next(accessToken2);
      }
    };
  }
};
var State;
(function(State2) {
  State2["Subscribed"] = "Subscribed";
  State2["Unsubscribed"] = "Unsubscribed";
})(State || (State = {}));
export {
  Code,
  ListenLensPushResponse_ExcludedLens_Code,
  Push2Web,
  State
};
//# sourceMappingURL=@snap_push2web.js.map
