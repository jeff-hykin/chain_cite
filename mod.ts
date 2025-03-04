var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://deno.land/x/ensure@v1.2.0/src/compare.ts
function isOutdated(minimumVersion, actualVersion) {
  const minimumVersionArr = minimumVersion.split(".");
  const actualVersionArr = actualVersion.split(".");
  versionCategoryEnumeration:
    for (let i = 0; i < minimumVersionArr.length; ++i) {
      const minimumVersionCategoryNum = parseInt(minimumVersionArr[i]);
      const actualVersionCategoryNum = parseInt(actualVersionArr[i]);
      if (minimumVersionCategoryNum > actualVersionCategoryNum) {
        return true;
      } else if (minimumVersionCategoryNum === actualVersionCategoryNum) {
        continue versionCategoryEnumeration;
      } else {
        break versionCategoryEnumeration;
      }
    }
  return false;
}

// https://deno.land/x/ensure@v1.2.0/src/main.ts
var warn = (type, current, expected) => `Your ${type} version is ${current}, but at least version ${expected} is required. Please update to a later version of Deno. Thankies!`;
function ensure(ensureOptions) {
  const { deno: currentDeno, v8: currentV8, typescript: currentTypescript } = Deno.version;
  const {
    denoVersion: expectedDeno,
    v8Version: expectedV8,
    typescriptVersion: expectedTypescript
  } = ensureOptions;
  let atLeastOneOutdated = false;
  const ensureCategories = [
    ["Deno", currentDeno, expectedDeno],
    ["V8", currentV8, expectedV8],
    ["Typescript", currentTypescript, expectedTypescript]
  ];
  for (const [categoryName, currentVersion, expectedVersion] of ensureCategories) {
    if (!expectedVersion) continue;
    const isCategoryOutdated = isOutdated(expectedVersion, currentVersion);
    if (isCategoryOutdated) {
      console.info(warn(categoryName, currentVersion, expectedVersion));
      atLeastOneOutdated = true;
    }
  }
  if (atLeastOneOutdated) {
    Deno.exit(1);
  }
}

// https://deno.land/std@0.128.0/_util/os.ts
var osType = (() => {
  const { Deno: Deno3 } = globalThis;
  if (typeof Deno3?.build?.os === "string") {
    return Deno3.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows = osType === "windows";

// https://deno.land/std@0.128.0/path/win32.ts
var win32_exports = {};
__export(win32_exports, {
  basename: () => basename,
  delimiter: () => delimiter,
  dirname: () => dirname,
  extname: () => extname,
  format: () => format,
  fromFileUrl: () => fromFileUrl,
  isAbsolute: () => isAbsolute,
  join: () => join,
  normalize: () => normalize,
  parse: () => parse,
  relative: () => relative,
  resolve: () => resolve,
  sep: () => sep,
  toFileUrl: () => toFileUrl,
  toNamespacedPath: () => toNamespacedPath
});

// https://deno.land/std@0.128.0/path/_constants.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;
var CHAR_QUESTION_MARK = 63;

// https://deno.land/std@0.128.0/path/_util.ts
function assertPath(path5) {
  if (typeof path5 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path5)}`
    );
  }
}
function isPosixPathSeparator(code2) {
  return code2 === CHAR_FORWARD_SLASH;
}
function isPathSeparator(code2) {
  return isPosixPathSeparator(code2) || code2 === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code2) {
  return code2 >= CHAR_LOWERCASE_A && code2 <= CHAR_LOWERCASE_Z || code2 >= CHAR_UPPERCASE_A && code2 <= CHAR_UPPERCASE_Z;
}
function normalizeString(path5, allowAboveRoot, separator, isPathSeparator3) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code2;
  for (let i = 0, len = path5.length; i <= len; ++i) {
    if (i < len) code2 = path5.charCodeAt(i);
    else if (isPathSeparator3(code2)) break;
    else code2 = CHAR_FORWARD_SLASH;
    if (isPathSeparator3(code2)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path5.slice(lastSlash + 1, i);
        else res = path5.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code2 === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep7, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) return base;
  if (dir === pathObject.root) return dir + base;
  return dir + sep7 + base;
}
var WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace(string) {
  return string.replaceAll(/[\s]/g, (c2) => {
    return WHITESPACE_ENCODINGS[c2] ?? c2;
  });
}

// https://deno.land/std@0.128.0/_util/assert.ts
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}

// https://deno.land/std@0.128.0/path/win32.ts
var sep = "\\";
var delimiter = ";";
function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path5;
    const { Deno: Deno3 } = globalThis;
    if (i >= 0) {
      path5 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path5 = Deno3.cwd();
    } else {
      if (typeof Deno3?.env?.get !== "function" || typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path5 = Deno3.cwd();
      if (path5 === void 0 || path5.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path5 = `${resolvedDevice}\\`;
      }
    }
    assertPath(path5);
    const len = path5.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute7 = false;
    const code2 = path5.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator(code2)) {
        isAbsolute7 = true;
        if (isPathSeparator(path5.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            const firstPart = path5.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator(path5.charCodeAt(j))) break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator(path5.charCodeAt(j))) break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path5.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code2)) {
        if (path5.charCodeAt(1) === CHAR_COLON) {
          device = path5.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator(path5.charCodeAt(2))) {
              isAbsolute7 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator(code2)) {
      rootEnd = 1;
      isAbsolute7 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path5.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute7;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path5) {
  assertPath(path5);
  const len = path5.length;
  if (len === 0) return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute7 = false;
  const code2 = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code2)) {
      isAbsolute7 = true;
      if (isPathSeparator(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          const firstPart = path5.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path5.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code2)) {
      if (path5.charCodeAt(1) === CHAR_COLON) {
        device = path5.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path5.charCodeAt(2))) {
            isAbsolute7 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code2)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(
      path5.slice(rootEnd),
      !isAbsolute7,
      "\\",
      isPathSeparator
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute7) tail = ".";
  if (tail.length > 0 && isPathSeparator(path5.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute7) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute7) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute(path5) {
  assertPath(path5);
  const len = path5.length;
  if (len === 0) return false;
  const code2 = path5.charCodeAt(0);
  if (isPathSeparator(code2)) {
    return true;
  } else if (isWindowsDeviceRoot(code2)) {
    if (len > 2 && path5.charCodeAt(1) === CHAR_COLON) {
      if (isPathSeparator(path5.charCodeAt(2))) return true;
    }
  }
  return false;
}
function join(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0) return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < pathsCount; ++i) {
    const path5 = paths[i];
    assertPath(path5);
    if (path5.length > 0) {
      if (joined === void 0) joined = firstPart = path5;
      else joined += `\\${path5}`;
    }
  }
  if (joined === void 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert(firstPart != null);
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}
function relative(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return "";
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH) break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH) break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_BACKWARD_SLASH) lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
      if (out.length === 0) out += "..";
      else out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath(path5) {
  if (typeof path5 !== "string") return path5;
  if (path5.length === 0) return "";
  const resolvedPath = resolve(path5);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code2 = resolvedPath.charCodeAt(2);
        if (code2 !== CHAR_QUESTION_MARK && code2 !== CHAR_DOT) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path5;
}
function dirname(path5) {
  assertPath(path5);
  const len = path5.length;
  if (len === 0) return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code2 = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code2)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              return path5;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code2)) {
      if (path5.charCodeAt(1) === CHAR_COLON) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path5.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code2)) {
    return path5;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator(path5.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  }
  return path5.slice(0, end);
}
function basename(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (path5.length >= 2) {
    const drive = path5.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path5.charCodeAt(1) === CHAR_COLON) start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path5.length - 1; i >= start; --i) {
      const code2 = path5.charCodeAt(i);
      if (isPathSeparator(code2)) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code2 === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i = path5.length - 1; i >= start; --i) {
      if (isPathSeparator(path5.charCodeAt(i))) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}
function extname(path5) {
  assertPath(path5);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path5.length >= 2 && path5.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path5.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path5.length - 1; i >= start; --i) {
    const code2 = path5.charCodeAt(i);
    if (isPathSeparator(code2)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path5.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("\\", pathObject);
}
function parse(path5) {
  assertPath(path5);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path5.length;
  if (len === 0) return ret;
  let rootEnd = 0;
  let code2 = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code2)) {
      rootEnd = 1;
      if (isPathSeparator(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code2)) {
      if (path5.charCodeAt(1) === CHAR_COLON) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path5.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path5;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path5;
          return ret;
        }
      }
    }
  } else if (isPathSeparator(code2)) {
    ret.root = ret.dir = path5;
    return ret;
  }
  if (rootEnd > 0) ret.root = path5.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path5.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code2 = path5.charCodeAt(i);
    if (isPathSeparator(code2)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path5.slice(startPart, end);
    }
  } else {
    ret.name = path5.slice(startPart, startDot);
    ret.base = path5.slice(startPart, end);
    ret.ext = path5.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path5.slice(0, startPart - 1);
  } else ret.dir = ret.root;
  return ret;
}
function fromFileUrl(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path5 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path5 = `\\\\${url.hostname}${path5}`;
  }
  return path5;
}
function toFileUrl(path5) {
  if (!isAbsolute(path5)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname, pathname] = path5.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname != null && hostname != "localhost") {
    url.hostname = hostname;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.128.0/path/posix.ts
var posix_exports = {};
__export(posix_exports, {
  basename: () => basename2,
  delimiter: () => delimiter2,
  dirname: () => dirname2,
  extname: () => extname2,
  format: () => format2,
  fromFileUrl: () => fromFileUrl2,
  isAbsolute: () => isAbsolute2,
  join: () => join2,
  normalize: () => normalize2,
  parse: () => parse2,
  relative: () => relative2,
  resolve: () => resolve2,
  sep: () => sep2,
  toFileUrl: () => toFileUrl2,
  toNamespacedPath: () => toNamespacedPath2
});
var sep2 = "/";
var delimiter2 = ":";
function resolve2(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path5;
    if (i >= 0) path5 = pathSegments[i];
    else {
      const { Deno: Deno3 } = globalThis;
      if (typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path5 = Deno3.cwd();
    }
    assertPath(path5);
    if (path5.length === 0) {
      continue;
    }
    resolvedPath = `${path5}/${resolvedPath}`;
    resolvedAbsolute = path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
  }
  resolvedPath = normalizeString(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  } else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}
function normalize2(path5) {
  assertPath(path5);
  if (path5.length === 0) return ".";
  const isAbsolute7 = path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
  const trailingSeparator = path5.charCodeAt(path5.length - 1) === CHAR_FORWARD_SLASH;
  path5 = normalizeString(path5, !isAbsolute7, "/", isPosixPathSeparator);
  if (path5.length === 0 && !isAbsolute7) path5 = ".";
  if (path5.length > 0 && trailingSeparator) path5 += "/";
  if (isAbsolute7) return `/${path5}`;
  return path5;
}
function isAbsolute2(path5) {
  assertPath(path5);
  return path5.length > 0 && path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
}
function join2(...paths) {
  if (paths.length === 0) return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path5 = paths[i];
    assertPath(path5);
    if (path5.length > 0) {
      if (!joined) joined = path5;
      else joined += `/${path5}`;
    }
  }
  if (!joined) return ".";
  return normalize2(joined);
}
function relative2(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return "";
  from = resolve2(from);
  to = resolve2(to);
  if (from === to) return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_FORWARD_SLASH) lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (out.length === 0) out += "..";
      else out += "/..";
    }
  }
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH) ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath2(path5) {
  return path5;
}
function dirname2(path5) {
  assertPath(path5);
  if (path5.length === 0) return ".";
  const hasRoot = path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let end = -1;
  let matchedSlash = true;
  for (let i = path5.length - 1; i >= 1; --i) {
    if (path5.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) return hasRoot ? "/" : ".";
  if (hasRoot && end === 1) return "//";
  return path5.slice(0, end);
}
function basename2(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path5.length - 1; i >= 0; --i) {
      const code2 = path5.charCodeAt(i);
      if (code2 === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code2 === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i = path5.length - 1; i >= 0; --i) {
      if (path5.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}
function extname2(path5) {
  assertPath(path5);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path5.length - 1; i >= 0; --i) {
    const code2 = path5.charCodeAt(i);
    if (code2 === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path5.slice(startDot, end);
}
function format2(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("/", pathObject);
}
function parse2(path5) {
  assertPath(path5);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path5.length === 0) return ret;
  const isAbsolute7 = path5.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let start;
  if (isAbsolute7) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path5.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code2 = path5.charCodeAt(i);
    if (code2 === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute7) {
        ret.base = ret.name = path5.slice(1, end);
      } else {
        ret.base = ret.name = path5.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute7) {
      ret.name = path5.slice(1, startDot);
      ret.base = path5.slice(1, end);
    } else {
      ret.name = path5.slice(startPart, startDot);
      ret.base = path5.slice(startPart, end);
    }
    ret.ext = path5.slice(startDot, end);
  }
  if (startPart > 0) ret.dir = path5.slice(0, startPart - 1);
  else if (isAbsolute7) ret.dir = "/";
  return ret;
}
function fromFileUrl2(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl2(path5) {
  if (!isAbsolute2(path5)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(
    path5.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.128.0/path/glob.ts
var path = isWindows ? win32_exports : posix_exports;
var { join: join3, normalize: normalize3 } = path;

// https://deno.land/std@0.128.0/path/mod.ts
var path2 = isWindows ? win32_exports : posix_exports;
var {
  basename: basename3,
  delimiter: delimiter3,
  dirname: dirname3,
  extname: extname3,
  format: format3,
  fromFileUrl: fromFileUrl3,
  isAbsolute: isAbsolute3,
  join: join4,
  normalize: normalize4,
  parse: parse3,
  relative: relative3,
  resolve: resolve3,
  sep: sep3,
  toFileUrl: toFileUrl3,
  toNamespacedPath: toNamespacedPath3
} = path2;

// https://deno.land/std@0.106.0/_util/assert.ts
var DenoStdInternalError2 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert2(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError2(msg);
  }
}

// https://deno.land/std@0.106.0/bytes/mod.ts
function concat(...buf) {
  let length = 0;
  for (const b3 of buf) {
    length += b3.length;
  }
  const output2 = new Uint8Array(length);
  let index = 0;
  for (const b3 of buf) {
    output2.set(b3, index);
    index += b3.length;
  }
  return output2;
}
function copy(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}

// https://deno.land/std@0.106.0/io/buffer.ts
var MIN_READ = 32 * 1024;
var MAX_SIZE = 2 ** 32 - 2;

// https://deno.land/std@0.106.0/fmt/colors.ts
var { Deno: Deno2 } = globalThis;
var noColor = typeof Deno2?.noColor === "boolean" ? Deno2.noColor : true;
var enabled = !noColor;
function code(open, close) {
  return {
    open: `\x1B[${open.join(";")}m`,
    close: `\x1B[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g")
  };
}
function run(str2, code2) {
  return enabled ? `${code2.open}${str2.replace(code2.regexp, code2.open)}${code2.close}` : str2;
}
function bold(str2) {
  return run(str2, code([1], 22));
}
function red(str2) {
  return run(str2, code([31], 39));
}
function green(str2) {
  return run(str2, code([32], 39));
}
function blue(str2) {
  return run(str2, code([34], 39));
}
var ANSI_PATTERN = new RegExp(
  [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
  ].join("|"),
  "g"
);

// https://deno.land/std@0.106.0/io/util.ts
var DEFAULT_BUFFER_SIZE = 32 * 1024;
async function writeAll(w2, arr) {
  let nwritten = 0;
  while (nwritten < arr.length) {
    nwritten += await w2.write(arr.subarray(nwritten));
  }
}
async function* iter(r, options) {
  const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
  const b3 = new Uint8Array(bufSize);
  while (true) {
    const result = await r.read(b3);
    if (result === null) {
      break;
    }
    yield b3.subarray(0, result);
  }
}
async function copy2(src, dst, options) {
  let n = 0;
  const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
  const b3 = new Uint8Array(bufSize);
  let gotEOF = false;
  while (gotEOF === false) {
    const result = await src.read(b3);
    if (result === null) {
      gotEOF = true;
    } else {
      let nwritten = 0;
      while (nwritten < result) {
        nwritten += await dst.write(b3.subarray(nwritten, result));
      }
      n += nwritten;
    }
  }
  return n;
}

// https://deno.land/std@0.106.0/io/bufio.ts
var DEFAULT_BUF_SIZE = 4096;
var MIN_BUF_SIZE = 16;
var MAX_CONSECUTIVE_EMPTY_READS = 100;
var CR = "\r".charCodeAt(0);
var LF = "\n".charCodeAt(0);
var BufferFullError = class extends Error {
  constructor(partial) {
    super("Buffer full");
    this.partial = partial;
  }
  name = "BufferFullError";
};
var PartialReadError = class extends Error {
  name = "PartialReadError";
  partial;
  constructor() {
    super("Encountered UnexpectedEof, data only partially read");
  }
};
var BufReader = class _BufReader {
  buf;
  rd;
  // Reader provided by caller.
  r = 0;
  // buf read position.
  w = 0;
  // buf write position.
  eof = false;
  // private lastByte: number;
  // private lastCharSize: number;
  /** return new BufReader unless r is BufReader */
  static create(r, size = DEFAULT_BUF_SIZE) {
    return r instanceof _BufReader ? r : new _BufReader(r, size);
  }
  constructor(rd, size = DEFAULT_BUF_SIZE) {
    if (size < MIN_BUF_SIZE) {
      size = MIN_BUF_SIZE;
    }
    this._reset(new Uint8Array(size), rd);
  }
  /** Returns the size of the underlying buffer in bytes. */
  size() {
    return this.buf.byteLength;
  }
  buffered() {
    return this.w - this.r;
  }
  // Reads a new chunk into the buffer.
  async _fill() {
    if (this.r > 0) {
      this.buf.copyWithin(0, this.r, this.w);
      this.w -= this.r;
      this.r = 0;
    }
    if (this.w >= this.buf.byteLength) {
      throw Error("bufio: tried to fill full buffer");
    }
    for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
      const rr = await this.rd.read(this.buf.subarray(this.w));
      if (rr === null) {
        this.eof = true;
        return;
      }
      assert2(rr >= 0, "negative read");
      this.w += rr;
      if (rr > 0) {
        return;
      }
    }
    throw new Error(
      `No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`
    );
  }
  /** Discards any buffered data, resets all state, and switches
   * the buffered reader to read from r.
   */
  reset(r) {
    this._reset(this.buf, r);
  }
  _reset(buf, rd) {
    this.buf = buf;
    this.rd = rd;
    this.eof = false;
  }
  /** reads data into p.
   * It returns the number of bytes read into p.
   * The bytes are taken from at most one Read on the underlying Reader,
   * hence n may be less than len(p).
   * To read exactly len(p) bytes, use io.ReadFull(b, p).
   */
  async read(p2) {
    let rr = p2.byteLength;
    if (p2.byteLength === 0) return rr;
    if (this.r === this.w) {
      if (p2.byteLength >= this.buf.byteLength) {
        const rr2 = await this.rd.read(p2);
        const nread = rr2 ?? 0;
        assert2(nread >= 0, "negative read");
        return rr2;
      }
      this.r = 0;
      this.w = 0;
      rr = await this.rd.read(this.buf);
      if (rr === 0 || rr === null) return rr;
      assert2(rr >= 0, "negative read");
      this.w += rr;
    }
    const copied = copy(this.buf.subarray(this.r, this.w), p2, 0);
    this.r += copied;
    return copied;
  }
  /** reads exactly `p.length` bytes into `p`.
   *
   * If successful, `p` is returned.
   *
   * If the end of the underlying stream has been reached, and there are no more
   * bytes available in the buffer, `readFull()` returns `null` instead.
   *
   * An error is thrown if some bytes could be read, but not enough to fill `p`
   * entirely before the underlying stream reported an error or EOF. Any error
   * thrown will have a `partial` property that indicates the slice of the
   * buffer that has been successfully filled with data.
   *
   * Ported from https://golang.org/pkg/io/#ReadFull
   */
  async readFull(p2) {
    let bytesRead = 0;
    while (bytesRead < p2.length) {
      try {
        const rr = await this.read(p2.subarray(bytesRead));
        if (rr === null) {
          if (bytesRead === 0) {
            return null;
          } else {
            throw new PartialReadError();
          }
        }
        bytesRead += rr;
      } catch (err) {
        err.partial = p2.subarray(0, bytesRead);
        throw err;
      }
    }
    return p2;
  }
  /** Returns the next byte [0, 255] or `null`. */
  async readByte() {
    while (this.r === this.w) {
      if (this.eof) return null;
      await this._fill();
    }
    const c2 = this.buf[this.r];
    this.r++;
    return c2;
  }
  /** readString() reads until the first occurrence of delim in the input,
   * returning a string containing the data up to and including the delimiter.
   * If ReadString encounters an error before finding a delimiter,
   * it returns the data read before the error and the error itself
   * (often `null`).
   * ReadString returns err != nil if and only if the returned data does not end
   * in delim.
   * For simple uses, a Scanner may be more convenient.
   */
  async readString(delim) {
    if (delim.length !== 1) {
      throw new Error("Delimiter should be a single character");
    }
    const buffer = await this.readSlice(delim.charCodeAt(0));
    if (buffer === null) return null;
    return new TextDecoder().decode(buffer);
  }
  /** `readLine()` is a low-level line-reading primitive. Most callers should
   * use `readString('\n')` instead or use a Scanner.
   *
   * `readLine()` tries to return a single line, not including the end-of-line
   * bytes. If the line was too long for the buffer then `more` is set and the
   * beginning of the line is returned. The rest of the line will be returned
   * from future calls. `more` will be false when returning the last fragment
   * of the line. The returned buffer is only valid until the next call to
   * `readLine()`.
   *
   * The text returned from ReadLine does not include the line end ("\r\n" or
   * "\n").
   *
   * When the end of the underlying stream is reached, the final bytes in the
   * stream are returned. No indication or error is given if the input ends
   * without a final line end. When there are no more trailing bytes to read,
   * `readLine()` returns `null`.
   *
   * Calling `unreadByte()` after `readLine()` will always unread the last byte
   * read (possibly a character belonging to the line end) even if that byte is
   * not part of the line returned by `readLine()`.
   */
  async readLine() {
    let line;
    try {
      line = await this.readSlice(LF);
    } catch (err) {
      if (err instanceof Deno.errors.BadResource) {
        throw err;
      }
      let { partial } = err;
      assert2(
        partial instanceof Uint8Array,
        "bufio: caught error from `readSlice()` without `partial` property"
      );
      if (!(err instanceof BufferFullError)) {
        throw err;
      }
      if (!this.eof && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
        assert2(this.r > 0, "bufio: tried to rewind past start of buffer");
        this.r--;
        partial = partial.subarray(0, partial.byteLength - 1);
      }
      return { line: partial, more: !this.eof };
    }
    if (line === null) {
      return null;
    }
    if (line.byteLength === 0) {
      return { line, more: false };
    }
    if (line[line.byteLength - 1] == LF) {
      let drop = 1;
      if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
        drop = 2;
      }
      line = line.subarray(0, line.byteLength - drop);
    }
    return { line, more: false };
  }
  /** `readSlice()` reads until the first occurrence of `delim` in the input,
   * returning a slice pointing at the bytes in the buffer. The bytes stop
   * being valid at the next read.
   *
   * If `readSlice()` encounters an error before finding a delimiter, or the
   * buffer fills without finding a delimiter, it throws an error with a
   * `partial` property that contains the entire buffer.
   *
   * If `readSlice()` encounters the end of the underlying stream and there are
   * any bytes left in the buffer, the rest of the buffer is returned. In other
   * words, EOF is always treated as a delimiter. Once the buffer is empty,
   * it returns `null`.
   *
   * Because the data returned from `readSlice()` will be overwritten by the
   * next I/O operation, most clients should use `readString()` instead.
   */
  async readSlice(delim) {
    let s = 0;
    let slice;
    while (true) {
      let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
      if (i >= 0) {
        i += s;
        slice = this.buf.subarray(this.r, this.r + i + 1);
        this.r += i + 1;
        break;
      }
      if (this.eof) {
        if (this.r === this.w) {
          return null;
        }
        slice = this.buf.subarray(this.r, this.w);
        this.r = this.w;
        break;
      }
      if (this.buffered() >= this.buf.byteLength) {
        this.r = this.w;
        const oldbuf = this.buf;
        const newbuf = this.buf.slice(0);
        this.buf = newbuf;
        throw new BufferFullError(oldbuf);
      }
      s = this.w - this.r;
      try {
        await this._fill();
      } catch (err) {
        err.partial = slice;
        throw err;
      }
    }
    return slice;
  }
  /** `peek()` returns the next `n` bytes without advancing the reader. The
   * bytes stop being valid at the next read call.
   *
   * When the end of the underlying stream is reached, but there are unread
   * bytes left in the buffer, those bytes are returned. If there are no bytes
   * left in the buffer, it returns `null`.
   *
   * If an error is encountered before `n` bytes are available, `peek()` throws
   * an error with the `partial` property set to a slice of the buffer that
   * contains the bytes that were available before the error occurred.
   */
  async peek(n) {
    if (n < 0) {
      throw Error("negative count");
    }
    let avail = this.w - this.r;
    while (avail < n && avail < this.buf.byteLength && !this.eof) {
      try {
        await this._fill();
      } catch (err) {
        err.partial = this.buf.subarray(this.r, this.w);
        throw err;
      }
      avail = this.w - this.r;
    }
    if (avail === 0 && this.eof) {
      return null;
    } else if (avail < n && this.eof) {
      return this.buf.subarray(this.r, this.r + avail);
    } else if (avail < n) {
      throw new BufferFullError(this.buf.subarray(this.r, this.w));
    }
    return this.buf.subarray(this.r, this.r + n);
  }
};
var AbstractBufBase = class {
  buf;
  usedBufferBytes = 0;
  err = null;
  /** Size returns the size of the underlying buffer in bytes. */
  size() {
    return this.buf.byteLength;
  }
  /** Returns how many bytes are unused in the buffer. */
  available() {
    return this.buf.byteLength - this.usedBufferBytes;
  }
  /** buffered returns the number of bytes that have been written into the
   * current buffer.
   */
  buffered() {
    return this.usedBufferBytes;
  }
};
var BufWriter = class _BufWriter extends AbstractBufBase {
  constructor(writer, size = DEFAULT_BUF_SIZE) {
    super();
    this.writer = writer;
    if (size <= 0) {
      size = DEFAULT_BUF_SIZE;
    }
    this.buf = new Uint8Array(size);
  }
  /** return new BufWriter unless writer is BufWriter */
  static create(writer, size = DEFAULT_BUF_SIZE) {
    return writer instanceof _BufWriter ? writer : new _BufWriter(writer, size);
  }
  /** Discards any unflushed buffered data, clears any error, and
   * resets buffer to write its output to w.
   */
  reset(w2) {
    this.err = null;
    this.usedBufferBytes = 0;
    this.writer = w2;
  }
  /** Flush writes any buffered data to the underlying io.Writer. */
  async flush() {
    if (this.err !== null) throw this.err;
    if (this.usedBufferBytes === 0) return;
    try {
      await writeAll(this.writer, this.buf.subarray(0, this.usedBufferBytes));
    } catch (e) {
      this.err = e;
      throw e;
    }
    this.buf = new Uint8Array(this.buf.length);
    this.usedBufferBytes = 0;
  }
  /** Writes the contents of `data` into the buffer.  If the contents won't fully
   * fit into the buffer, those bytes that can are copied into the buffer, the
   * buffer is the flushed to the writer and the remaining bytes are copied into
   * the now empty buffer.
   *
   * @return the number of bytes written to the buffer.
   */
  async write(data2) {
    if (this.err !== null) throw this.err;
    if (data2.length === 0) return 0;
    let totalBytesWritten = 0;
    let numBytesWritten = 0;
    while (data2.byteLength > this.available()) {
      if (this.buffered() === 0) {
        try {
          numBytesWritten = await this.writer.write(data2);
        } catch (e) {
          this.err = e;
          throw e;
        }
      } else {
        numBytesWritten = copy(data2, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        await this.flush();
      }
      totalBytesWritten += numBytesWritten;
      data2 = data2.subarray(numBytesWritten);
    }
    numBytesWritten = copy(data2, this.buf, this.usedBufferBytes);
    this.usedBufferBytes += numBytesWritten;
    totalBytesWritten += numBytesWritten;
    return totalBytesWritten;
  }
};

// https://deno.land/std@0.106.0/io/ioutil.ts
var DEFAULT_BUFFER_SIZE2 = 32 * 1024;
async function readShort(buf) {
  const high = await buf.readByte();
  if (high === null) return null;
  const low = await buf.readByte();
  if (low === null) throw new Deno.errors.UnexpectedEof();
  return high << 8 | low;
}
async function readInt(buf) {
  const high = await readShort(buf);
  if (high === null) return null;
  const low = await readShort(buf);
  if (low === null) throw new Deno.errors.UnexpectedEof();
  return high << 16 | low;
}
var MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
async function readLong(buf) {
  const high = await readInt(buf);
  if (high === null) return null;
  const low = await readInt(buf);
  if (low === null) throw new Deno.errors.UnexpectedEof();
  const big = BigInt(high) << 32n | BigInt(low);
  if (big > MAX_SAFE_INTEGER) {
    throw new RangeError(
      "Long value too big to be represented as a JavaScript number."
    );
  }
  return Number(big);
}
function sliceLongToBytes(d3, dest = new Array(8)) {
  let big = BigInt(d3);
  for (let i = 0; i < 8; i++) {
    dest[7 - i] = Number(big & 0xffn);
    big >>= 8n;
  }
  return dest;
}

// https://deno.land/std@0.106.0/_wasm_crypto/crypto.js
var crypto_exports = {};
__export(crypto_exports, {
  DigestContext: () => DigestContext,
  _wasm: () => _wasm,
  _wasmBytes: () => _wasmBytes,
  _wasmInstance: () => _wasmInstance,
  _wasmModule: () => _wasmModule,
  digest: () => digest
});

// https://deno.land/std@0.106.0/encoding/base64.ts
var base64abc = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "/"
];
function encode(data2) {
  const uint8 = typeof data2 === "string" ? new TextEncoder().encode(data2) : data2 instanceof Uint8Array ? data2 : new Uint8Array(data2);
  let result = "", i;
  const l = uint8.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
    result += base64abc[(uint8[i - 1] & 15) << 2 | uint8[i] >> 6];
    result += base64abc[uint8[i] & 63];
  }
  if (i === l + 1) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === l) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
    result += base64abc[(uint8[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
function decode(b64) {
  const binString = atob(b64);
  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

// https://deno.land/std@0.106.0/_wasm_crypto/crypto.wasm.js
var data = decode(
  "AGFzbQEAAAABnYGAgAAXYAAAYAABf2ABfwBgAX8Bf2ABfwF+YAJ/fwBgAn9/AX9gA39/fwBgA39/fwF/YAR/f39/AGAEf39/fwF/YAV/f39/fwBgBX9/f39/AX9gBn9/f39/fwBgBn9/f39/fwF/YAV/f39+fwBgB39/f35/f38Bf2AFf399f38AYAV/f3x/fwBgAn9+AGAEf31/fwBgBH98f38AYAJ+fwF/AtKFgIAADRhfX3diaW5kZ2VuX3BsYWNlaG9sZGVyX18aX193YmdfbmV3X2Y4NWRiZGZiOWNkYmUyZWMABhhfX3diaW5kZ2VuX3BsYWNlaG9sZGVyX18aX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYAAhhfX3diaW5kZ2VuX3BsYWNlaG9sZGVyX18hX193YmdfYnl0ZUxlbmd0aF9lMDUxNWJjOTRjZmM1ZGVlAAMYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fIV9fd2JnX2J5dGVPZmZzZXRfNzdlZWM4NDcxNmEyZTczNwADGF9fd2JpbmRnZW5fcGxhY2Vob2xkZXJfXx1fX3diZ19idWZmZXJfMWM1OTE4YTRhYjY1NmZmNwADGF9fd2JpbmRnZW5fcGxhY2Vob2xkZXJfXzFfX3diZ19uZXd3aXRoYnl0ZW9mZnNldGFuZGxlbmd0aF9lNTdhZDFmMmNlODEyYzAzAAgYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fHV9fd2JnX2xlbmd0aF8yZDU2Y2IzNzA3NWZjZmIxAAMYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fEV9fd2JpbmRnZW5fbWVtb3J5AAEYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fHV9fd2JnX2J1ZmZlcl85ZTE4NGQ2Zjc4NWRlNWVkAAMYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fGl9fd2JnX25ld19lODEwMTMxOWU0Y2Y5NWZjAAMYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fGl9fd2JnX3NldF9lOGFlN2IyNzMxNGU4Yjk4AAcYX193YmluZGdlbl9wbGFjZWhvbGRlcl9fEF9fd2JpbmRnZW5fdGhyb3cABRhfX3diaW5kZ2VuX3BsYWNlaG9sZGVyX18SX193YmluZGdlbl9yZXRocm93AAID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FSABIAUpAwg3AwggASAFKQMANwMAIAUoAnAhByABQcgAaiAFQcgAaikDADcDACABQcAAaiAFQcAAaikDADcDACABQThqIAVBOGopAwA3AwAgAUEwaiAFQTBqKQMANwMAIAFBKGogBUEoaikDADcDACABQSBqIAVBIGopAwA3AwAgAUEYaiAFQRhqKQMANwMAIAEgBSkDEDcDECABIAUpA1A3A1AgAUHYAGogBUHYAGopAwA3AwAgAUHgAGogBUHgAGopAwA3AwAgAUHoAGogBUHoAGopAwA3AwAgASAHNgJwIAFBjAFqIAVBjAFqKQIANwIAIAFBhAFqIAVBhAFqKQIANwIAIAFB/ABqIAVB/ABqKQIANwIAIAEgBSkCdDcCdCABQcwBaiAFQcwBaikCADcCACABQcQBaiAFQcQBaikCADcCACABQbwBaiAFQbwBaikCADcCACABQbQBaiAFQbQBaikCADcCACABQawBaiAFQawBaikCADcCACABQaQBaiAFQaQBaikCADcCACABQZwBaiAFQZwBaikCADcCACABIAUpApQBNwKUAUEDIQUMKgsgASgCBCEFQfgOEBYiAUUNFSAEQbgQakGIAWogBUGIAWopAwA3AwAgBEG4EGpBgAFqIAVBgAFqKQMANwMAIARBuBBqQfgAaiAFQfgAaikDADcDACAEQbgQakEQaiAFQRBqKQMANwMAIARBuBBqQRhqIAVBGGopAwA3AwAgBEG4EGpBIGogBUEgaikDADcDACAEQbgQakEwaiAFQTBqKQMANwMAIARBuBBqQThqIAVBOGopAwA3AwAgBEG4EGpBwABqIAVBwABqKQMANwMAIARBuBBqQcgAaiAFQcgAaikDADcDACAEQbgQakHQAGogBUHQAGopAwA3AwAgBEG4EGpB2ABqIAVB2ABqKQMANwMAIARBuBBqQeAAaiAFQeAAaikDADcDACAEIAUpA3A3A6gRIAQgBSkDCDcDwBAgBCAFKQMoNwPgECAFKQMAIREgBS0AaiEIIAUtAGkhCSAFLQBoIQoCQCAFKAKQAUEFdCIGDQBBACEGDCkLIARBEGpBGGoiCyAFQZQBaiIFQRhqKQAANwMAIARBEGpBEGoiDCAFQRBqKQAANwMAIARBEGpBCGoiDSAFQQhqKQAANwMAIAQgBSkAADcDECAFQSBqIQcgBkFg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IARB8B9qQSBqKAIANgIAIARBuBBqQRhqIARB8B9qQRhqKQMANwMAIARBuBBqQRBqIARB8B9qQRBqKQMANwMAIARBuBBqQQhqIARB8B9qQQhqKQMANwMAIAQgBCkD8B83A7gQIARBsB9qQRhqIgcgBEG4EGpBHGopAgA3AwAgBEGwH2pBEGoiBiAEQbgQakEUaikCADcDACAEQbAfakEIaiIOIARBuBBqQQxqKQIANwMAIAQgBCkCvBA3A7AfIARBuBBqIARBEGpB2AIQYRogBEG4EGogBEGwH2oQQUEgEBYiBUUNGSAFIAQpA7AfNwAAIAVBGGogBykDADcAACAFQRBqIAYpAwA3AAAgBUEIaiAOKQMANwAADAsLIARBEGogAUG4AhBhGiAEQfAfakEsakIANwIAIARB8B9qQSRqQgA3AgAgBEHwH2pBHGpCADcCACAEQfAfakEUakIANwIAIARB8B9qQQxqQgA3AgAgBEIANwL0H0EwIQMgBEEwNgLwHyAEQbgQakEwaiAEQfAfakEwaigCADYCACAEQbgQakEoaiAEQfAfakEoaikDADcDACAEQbgQakEgaiAEQfAfakEgaikDADcDACAEQbgQakEYaiAEQfAfakEYaikDADcDACAEQbgQakEQaiAEQfAfakEQaikDADcDACAEQbgQakEIaiAEQfAfakEIaikDADcDACAEIAQpA/AfNwO4ECAEQbAfakEoaiIHIARBuBBqQSxqKQIANwMAIARBsB9qQSBqIgYgBEG4EGpBJGopAgA3AwAgBEGwH2pBGGoiDiAEQbgQakEcaikCADcDACAEQbAfakEQaiICIARBuBBqQRRqKQIANwMAIARBsB9qQQhqIgsgBEG4EGpBDGopAgA3AwAgBCAEKQK8EDcDsB8gBEG4EGogBEEQakG4AhBhGiAEQbgQaiAEQbAfahA7QTAQFiIFRQ0ZIAUgBCkDsB83AAAgBUEoaiAHKQMANwAAIAVBIGogBikDADcAACAFQRhqIA4pAwA3AAAgBUEQaiACKQMANwAAIAVBCGogCykDADcAAAwKCyAEQRBqIAFBmAIQYRogBEHwH2pBDGpCADcCACAEQfAfakEUakIANwIAIARB8B9qQRxqQgA3AgAgBEHwH2pBJGpCADcCACAEQfAfakEsakIANwIAIARB8B9qQTRqQgA3AgAg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AwAgBCAEKQLMAjcDwAECQCABKALAAUH/AHEiA0UNACADQYABRg0AIAEgA2pBAEGAASADaxBmGgsgAUJ/EBIgBEHIAmpBGGogAUGYAWoiCykDACIYNwMAIARByAJqQRBqIAFBkAFqIgwpAwAiGTcDACAEQcgCakEIaiABQYgBaiINKQMAIho3AwAgBEHIAmpBIGogAUGgAWoiDikDACIbNwMAIARByAJqQShqIAFBqAFqIg8pAwAiHDcDACAEQcgCakEwaiABQbABaiIQKQMAIh03AwAgBEHIAmpBOGogAUG4AWoiESkDACIeNwMAIAQgASkDgAEiHzcDyAIgBEGAAmpBOGoiAyAeNwMAIARBgAJqQTBqIhIgHTcDACAEQYACakEoaiITIBw3AwAgBEGAAmpBIGoiFCAbNwMAIARBgAJqQRhqIhUgGDcDACAEQYACakEQaiIWIBk3AwAgBEGAAmpBCGoiFyAaNwMAIAQgHzcDgAIgAiADKQMANwMAIAUgEikDADcDACAGIBMpAwA3AwAgByAUKQMANwMAIAggFSkDADcDACAJIBYpAwA3AwAgCiAXKQMANwMAIAQgBCkDgAI3A8ABIAEgASkDiAM3A8ABIBEgASABQYgCaiICQYABEGEiA0GAAmopAwA3AwAgECADQfgBaikDADcDACAPIANB8AFqKQMANwMAIA4gA0HoAWopAwA3AwAgCyADQeABaikDADcDACAMIANB2AFqKQMANwMAIA0gA0HQAWopAwA3AwAgAyADKQPIATcDgAFBwAAQFiIBRQ0YIAEgBCkDwAE3AAAgAUE4aiAEQcABakE4aikDADcAACABQTBqIARBwAFqQTBqKQMANwAAIAFBKGogBEHAAWpBKGopAwA3AAAgAUEgaiAEQcABakEgaikDADcAACABQRhqIARBwAFqQRhqKQMANwAAIAFBEGogBEHAAWpBEGopAwA3AAAgAUEIaiAEQcABakEIaikDADcAACADIAMpA4gDNwPAASADIAJBgAEQYRogA0GAAWoiAkE4aiADQcgBaiIDQThqKQMANwMAIAJBMGogA0EwaikDADcDACACQShqIANBKGopAwA3AwAgAkEgaiADQSBqKQMANwMAIAJBGGogA0EYaikDADcDACACQRBqIANBEGopAwA3AwAgAkEIaiADQQhqKQMANwMAIAIgAykDADcDAEEAIQJBwAAhAwwwCyABKAIEIgIoApADIgNBAEgNFAJAAkAgAw0AQQEhAQwBCyADEBYiAUUNGSABQXxqLQAAQQNxRQ0AIAFBACADEGYaCwJAIAIoAsABQf8AcSIFRQ0AIAVBgAFGDQAgAiAFakEAQYABIAVrEGYaCyACQn8QEiAEQcgCakEYaiACQZgBaikDACIYNwMAIARByAJqQRBqIAJBkAFqKQMAIhk3AwAgBEHIAmpBCGogAkGIAWopAwAiGjcDACAEQcgCakEgaiACQaABaikDACIbNwMAIARByAJqQShqIAJBqAFqKQMAIhw3AwAgBEHIAmpBMGogAkGwAWopAwAiHTcDACAEQcgCakE4aiACQbgBaikDACIeNwMAIAQgAikDgAEiHzcDyAIgBEGAAmpBOGogHjcDACAEQYACakEwaiAdNwMAIARBgAJqQShqIBw3AwAgBEGAAmpBIGogGzcDACAEQYACakEYaiAYNwMAIARBgAJqQRBqIBk3AwAgBEGAAmpBCGogGjcDACAEIB83A4ACIANBwQBPDRkgASAEQYACaiADEGEaIAIgAikDiAM3A8ABIAJBgAFqIgVBOGogAiACQYgCakGAARBhIgJBgAJqKQMANwMAIAVBMGogAkH4AWopAwA3AwAgBUEoaiACQfABaikDADcDACAFQSBqIAJB6AFqKQMANwMAIAVBGGogAkHgAWopAwA3AwAgBUEQaiACQdgBaikDADcDACAFQQhqIAJB0AFqKQMANwMAIAUgAikDyAE3AwBBACECDC8LIAEoAgQiAigCkAMiA0EASA0TAkACQCADDQBBASEBDAELIAMQFiIBRQ0aIAFBfGotAABBA3FFDQAgAUEAIAMQZhoLAkAgAigCwAFB/wBxIgVFDQAgBUGAAUYNACACIAVqQQBBgAEgBWsQZhoLIAJCfxASIARByAJqQRhqIAJBmAFqKQMAIhg3AwAgBEHIAmpBEGogAkGQAWopAwAiGTcDACAEQcgCakEIaiACQYgBaikDACIaNwMAIARByAJqQSBqIAJBoAFqKQMAIhs3AwAgBEHIAmpBKGogAkGoAWopAwAiHDcDACAEQcgCakEwaiACQbABaikDACIdNwMAIARByAJqQThqIAJBuAFqKQMAIh43AwAgBCACKQOAASIfNwPIAiAEQYACakE4aiAeNwMAIARBgAJqQTBqIB03AwAgBEGAAmpBKGogHDcDACAEQYACakEgaiAbNwMAIARBgAJqQRhqIBg3AwAgBEGAAmpBEGogGTcDACAEQYACakEIaiAaNwMAIAQgHzcDgAIgA0HBAE8NGiABIARBgAJqIAMQYRogAiACKQOIAzcDwAEgAkGAAWoiBUE4aiACIAJBiAJqQYABEGEiAkGAAmopAwA3AwAgBUEwaiACQfgBaikDADcDACAFQShqIAJB8AFqKQMANwMAIAVBIGogAkHoAWopAwA3AwAgBUEYaiACQeABaikDADcDACAFQRBqIAJB2AFqKQMANwMAIAVBCGogAkHQAWopAwA3AwAgBSACKQPIATcDAEEAIQIMLgsgASgCBCECIARBgAJqQRxqQgA3AgAgBEGAAmpBFGpCADcCACAEQYACakEMakIANwIAIARCADcChAIgBEEgNgKAAiAEQcgCakEYaiAEQYACakEYaiIDKQMANwMAIARByAJqQRBqIgUgBEGAAmpBEGopAwA3AwAgBEHIAmpBCGogBEGAAmpBCGopAwA3AwAgBEHIAmpBIGogBEGAAmpBIGooAgA2AgAgBCAEKQOAAjcDyAIgBEHAAWpBEGoiBiAEQcgCakEUaikCADcDACAEQcABakEIaiIHIARByAJqQQxqKQIANwMAIARBwAFqQRhqIgggBEHIAmpBHGopAgA3AwAgBCAEKQLMAjcDwAECQCACKAIAQT9xIgFFDQAgAUHAAEYNACACIAFqQRBqQQBBwAAgAWsQZhoLIAJBfxAUIAUgAkHgAGoiASkCACIYNwMAIAMgAkHoAGoiBSkCACIZNwMAIAcgAkHYAGoiAykCADcDACAGIBg3AwAgCCAZNwMAIAQgAikCUCIYNwOAAiAEIBg3A8ABIAIgAikDCDcDACACIAIpApQBNwIQIAJBGGogAkGcAWopAgA3AgAgAkEgaiACQaQBaikCADcCACACQShqIAJBrAFqKQIANwIAIAJBMGogAkG0AWopAgA3AgAgAkE4aiACQbwBaikCADcCACACQcAAaiACQcQBaikCADcCACACQcgAaiACQcwBaikCADcCACACIAIpAnQ3AlAgAyACQfwAaikCADcCACABIAJBhAFqKQIANwIAIAUgAkGMAWopAgA3AgBBIBAWIgFFDRogASAEKQPAATcAACABQRhqIARBwAFqQRhqKQMANwAAIAFBEGogBEHAAWpBEGopAwA3AAAgAUEIaiAEQcABakEIaikDADcAACACIAIpAwg3AwAgAkEQaiIFIAJBlAFqIgYpAgA3AgAgBUEIaiAGQQhqKQIANwIAIAVBEGogBkEQaikCADcCACAFQRhqIAZBGGopAgA3AgBBICEDIAVBIGogBkEgaikCADcCACAFQShqIAZBKGopAgA3AgAgBUEwaiAGQTBqKQIANwIAIAVBOGogBkE4aikCADcCACACQdAAaiIFIAJB9ABqIgIpAgA3AgAgBUEIaiACQQhqKQIANwIAIAVBEGogAkEQaikCADcCACAFQRhqIAJBGGopAgA3AgBBACECDC0LIANBAEgNESABKAIEIQUCQAJAIAMNAEEBIQEMAQsgAxAWIgFFDRsgAUF8ai0AAEEDcUUNACABQQAgAxBmGgsgBEHIAmogBRAgIAVCADcDACAFQSBqIAVBiAFqKQMANwMAIAVBGGogBUGAAWopAwA3AwAgBUEQaiAFQfgAaikDADcDACAFIAUpA3A3AwhBACECIAVBKGpBAEHCABBmGgJAIAUoApABRQ0AIAVBADYCkAELIARByAJqIAEgAxAZDCwLIAEoAgQhAUEcIQNBACECIARBgAJqQRxqQQA2AgAgBEGAAmpBFGpCADcCACAEQYACakEMakIANwIAIARCADcChAIgBEEcNgKAAiAEQcgCakEQaiAEQYACakEQaikDADcDACAEQcgCakEIaiAEQYACakEIaikDADcDACAEQcgCakEYaiAEQYACakEYaikDADcDACAEQcABakEIaiIFIARByAJqQQxqKQIANwMAIARBwAFqQRBqIgYgBEHIAmpBFGopAgA3AwAgBEHAAWpBGGoiByAEQcgCakEcaigCADYCACAEIAQpA4ACNwPIAiAEIAQpAswCNwPAASABIARBwAFqED4gAUEAQcwBEGYhCEEcEBYiAUUNGiABIAQpA8ABNwAAIAFBGGogBygCADYAACABQRBqIAYpAwA3AAAgAUEIaiAFKQMANwAAIAhBAEHMARBmGgwrCyABKAIEIQEgBEGAAmpBHGpCADcCACAEQYACakEUakIANwIAIARBgAJqQQxqQgA3AgAgBEIANwKEAkEgIQMgBEEgNgKAAiAEQcgCakEgaiAEQYACakEgaigCADYCACAEQcgCakEYaiAEQYACakEYaikDADcDACAEQcgCakEQaiAEQYACakEQaikDADcDACAEQcgCakEIaiAEQYACakEIaikDADcDACAEIAQpA4ACNwPIAiAEQcABakEYaiIFIARByAJqQRxqKQIANwMAIARBwAFqQRBqIgYgBEHIAmpBFGopAgA3AwAgBEHAAWpBCGoiByAEQcgCakEMaikCADcDACAEIAQpAswCNwPAASABIARBwAFqED9BACECIAFBAEHMARBmIQhBIBAWIgFFDRogASAEKQPAATcAACABQRhqIAUpAwA3AAAgAUEQaiAGKQMANwAAIAFBCGogBykDADcAACAIQQBBzAEQZhoMKgsgASgCBCEBIARBgAJqQSxqQgA3AgAgBEGAAmpBJGpCADcCACAEQYACakEcakIANwIAIARBgAJqQRRqQgA3AgAgBEGAAmpBDGpCADcCACAEQgA3AoQCQTAhAyAEQTA2AoACIARByAJqQTBqIARBgAJqQTBqKAIANgIAIARByAJqQShqIARBgAJqQShqKQMANwMAIARByAJqQSBqIARBgAJqQSBqKQMANwMAIARByAJqQRhqIARBgAJqQRhqKQMANwMAIARByAJqQRBqIARBgAJqQRBqKQMANwMAIARByAJqQQhqIARBgAJqQQhqKQMANwMAIAQgBCkDgAI3A8gCIARBwAFqQShqIgUgBEHIAmpBLGopAgA3AwAgBEHAAWpBIGoiBiAEQcgCakEkaikCADcDACAEQcABakEYaiIHIARByAJqQRxqKQIANwMAIARBwAFqQRBqIgggBEHIAmpBFGopAgA3AwAgBEHAAWpBCGoiCSAEQcgCakEMaikCADcDACAEIAQpAswCNwPAASABIARBwAFqEDpBACECIAFBAEHMARBmIQpBMBAWIgFFDRogASAEKQPAATcAACABQShqIAUpAwA3AAAgAUEgaiAGKQMANwAAIAFBGGogBykDADcAACABQRBqIAgpAwA3AAAgAUEIaiAJKQMANwAAIApBAEHMARBmGgwpCyABKAIEIQEgBEGAAmpBDGpCADcCACAEQYACakEUakIANwIAIARBgAJqQRxqQgA3AgAgBEGAAmpBJGpCADcCACAEQYACakEsakIANwIAIARBgAJqQTRqQgA3AgAgBEGAAmpBPGpCADcCACAEQgA3AoQCQcAAIQMgBEHAADYCgAIgBEHIAmogBEGAAmpBxAAQYRogBEHAAWpBOGoiBSAEQcgCakE8aikCADcDACAEQcABakEwaiIGIARByAJqQTRqKQIANwMAIARBwAFqQShqIgcgBEHIAmpBLGopAgA3AwAgBEHAAWpBIGoiCCAEQcgCakEkaikCADcDACAEQcABakEYaiIJIARByAJqQRxqKQIANwMAIARBwAFqQRBqIgogBEHIAmpBFGopAgA3AwAgBEHAAWpBCGoiCyAEQcgCakEMaikCADcDACAEIAQpAswCNwPAASABIARBwAFqEDNBACECIAFBAEHMARBmIQxBwAAQFiIBRQ0aIAEgBCkDwAE3AAAgAUE4aiAFKQMANwAAIAFBMGogBikDADcAACABQShqIAcpAwA3AAAgAUEgaiAIKQMANwAAIAFBGGogCSkDADcAACABQRBqIAopAwA3AAAgAUEIaiALKQMANwAAIAxBAEHMARBmGgwoCyABKAIEIQUgBEGAAmpBDGpCADcCACAEQgA3AoQCQRAhAyAEQRA2AoACIARByAJqQRBqIARBgAJqQRBqKAIANgIAIARByAJqQQhqIARBgAJqQQhqKQMANwMAIARBwAFqQQhqIgYgBEHIAmpBDGopAgA3AwAgBCAEKQOAAjcDyAIgBCAEKQLMAjcDwAEgBSAEQcABahA9QQAhAiAFQdQAakEAKQKAkUAiGDcCACAFQQApAviQQCIZNwJMIAVBADYCCCAFQgA3AwBBEBAWIgFFDRogASAEKQPAATcAACABQQhqIAYpAwA3AAAgBUIANwMAIAVBzABqIgZBCGogGDcCACAGIBk3AgAgBUEANgIIDCcLIAEoAgQhBUEUIQNBACECIARBgAJqQRRqQQA2AgAgBEGAAmpBDGpCADcCACAEQgA3AoQCIARBFDYCgAIgBEHIAmpBEGogBEGAAmpBEGopAwA3AwAgBEHIAmpBCGogBEGAAmpBCGopAwA3AwAgBEHAAWpBCGoiBiAEQcgCakEMaikCADcDACAEQcABakEQaiIHIARByAJqQRRqKAIANgIAIAQgBCkDgAI3A8gCIAQgBCkCzAI3A8ABIAUgBEHAAWoQOSAFQgA3AwAgBUEANgIcIAVBACkCiJFAIhg3AgggBUEQakEAKQKQkUAiGTcCACAFQRhqQQAoApiRQCIINgIAQRQQFiIBRQ0aIAEgBCkDwAE3AAAgAUEQaiAHKAIANgAAIAFBCGogBikDADcAACAFQgA3AwAgBUEANgIcIAVBCGoiBSAYNwIAIAVBCGogGTcCACAFQRBqIAg2AgAMJgsgASgCBCEFQRQhA0EAIQIgBEGAAmpBFGpBADYCACAEQYACakEMakIANwIAIARCADcChAIgBEEUNgKAAiAEQcgCakEQaiAEQYACakEQaikDADcDACAEQcgCakEIaiAEQYACakEIaikDADcDACAEQcABakEIaiIGIARByAJqQQxqKQIANwMAIARBwAFqQRBqIgcgBEHIAmpBFGooAgA2AgAgBCAEKQOAAjcDyAIgBCAEKQLMAjcDwAEgBSAEQcABahApIAVBADYCHCAFQRhqQQAoApiRQCIINgIAIAVBEGpBACkCkJFAIhg3AgAgBUEAKQKIkUAiGTcCCCAFQgA3AwBBFBAWIgFFDRogASAEKQPAATcAACABQRBqIAcoAgA2AAAgAUEIaiAGKQMANwAAIAVBCGoiBkEQaiAINgIAIAZBCGogGDcCACAGIBk3AgAgBUEANgIcIAVCADcDAAwlCyABKAIEIQFBHCEDQQAhAiAEQYACakEcakEANgIAIARBgAJqQRRqQgA3AgAgBEGAAmpBDGpCADcCACAEQgA3AoQCIARBHDYCgAIgBEHIAmpBEGogBEGAAmpBEGopAwA3AwAgBEHIAmpBCGogBEGAAmpBCGopAwA3AwAgBEHIAmpBGGogBEGAAmpBGGopAwA3AwAgBEHAAWpBCGoiBSAEQcgCakEMaikCADcDACAEQcABakEQaiIGIARByAJqQRRqKQIANwMAIARBwAFqQRhqIgcgBEHIAmpBHGooAgA2AgAgBCAEKQOAAjcDyAIgBCAEKQLMAjcDwAEgASAEQcABahBAIAFBAEHMARBmIQhBHBAWIgFFDRogASAEKQPAATcAACABQRhqIAcoAgA2AAAgAUEQaiAGKQMANwAAIAFBCGogBSkDADcAACAIQQBBzAEQZhoMJAsgASgCBCEBIARBgAJqQRxqQgA3AgAgBEGAAmpBFGpCADcCACAEQYACakEMakIANwIAIARCADcChAJBICEDIARBIDYCgAIgBEHIAmpBIGogBEGAAmpBIGooAgA2AgAgBEHIAmpBGGogBEGAAmpBGGopAwA3AwAgBEHIAmpBEGogBEGAAmpBEGopAwA3AwAgBEHIAmpBCGogBEGAAmpBCGopAwA3AwAgBCAEKQOAAjcDyAIgBEHAAWpBGGoiBSAEQcgCakEcaikCADcDACAEQcABakEQaiIGIARByAJqQRRqKQIANwMAIARBwAFqQQhqIgcgBEHIAmpBDGopAgA3AwAgBCAEKQLMAjcDwAEgASAEQcABahBBQQAhAiABQQBBzAEQZiEIQSAQFiIBRQ0aIAEgBCkDwAE3AAAgAUEYaiAFKQMANwAAIAFBEGogBikDADcAACABQQhqIAcpAwA3AAAgCEEAQcwBEGYaDCMLIAEoAgQhASAEQYACakEsakIANwIAIARBgAJqQSRqQgA3AgAgBEGAAmpBHGpCADcCACAEQYACakEUakIANwIAIARBgAJqQQxqQgA3AgAgBEIANwKEAkEwIQMgBEEwNgKAAiAEQcgCakEwaiAEQYACakEwaigCADYCACAEQcgCakEoaiAEQYACakEoaikDADcDACAEQcgCakEgaiAEQYACakEgaikDADcDACAEQcgCakEYaiAEQYACakEYaikDADcDACAEQcgCakEQaiAEQYACakEQaikDADcDACAEQcgCakEIaiAEQYACakEIaikDADcDACAEIAQpA4ACNwPIAiAEQcABakEoaiIFIARByAJqQSxqKQIANwMAIARBwAFqQSBqIgYgBEHIAmpBJGopAgA3AwAgBEHAAWpBGGoiByAEQcgCakEcaikCADcDACAEQcABakEQaiIIIARByAJqQRRqKQIANwMAIARBwAFqQQhqIgkgBEHIAmpBDGopAgA3AwAgBCAEKQLMAjcDwAEgASAEQcABahA7QQAhAiABQQBBzAEQZiEKQTAQFiIBRQ0aIAEgBCkDwAE3AAAgAUEoaiAFKQMANwAAIAFBIGogBikDADcAACABQRhqIAcpAwA3AAAgAUEQaiAIKQMANwAAIAFBCGogCSkDADcAACAKQQBBzAEQZhoMIgsgASgCBCEBIARBgAJqQQxqQgA3AgAgBEGAAmpBFGpCADcCACAEQYACakEcakIANwIAIARBgAJqQSRqQgA3AgAgBEGAAmpBLGpCADcCACAEQYACakE0akIANwIAIARBgAJqQTxqQgA3AgAgBEIANwKEAkHAACEDIARBwAA2AoACIARByAJqIARBgAJqQcQAEGEaIARBwAFqQThqIgUgBEHIAmpBPGopAgA3AwAgBEHAAWpBMGoiBiAEQcgCakE0aikCADcDACAEQcABakEoaiIHIARByAJqQSxqKQIANwMAIARBwAFqQSBqIgggBEHIAmpBJGopAgA3AwAgBEHAAWpBGGoiCSAEQcgCakEcaikCADcDACAEQcABakEQaiIKIARByAJqQRRqKQIANwMAIARBwAFqQQhqIgsgBEHIAmpBDGopAgA3AwAgBCAEKQLMAjcDwAEgASAEQcABahA0QQAhAiABQQBBzAEQZiEMQcAAEBYiAUUNGiABIAQpA8ABNwAAIAFBOGogBSkDADcAACABQTBqIAYpAwA3AAAgAUEoaiAHKQMANwAAIAFBIGogCCkDADcAACABQRhqIAkpAwA3AAAgAUEQaiAKKQMANwAAIAFBCGogCykDADcAACAMQQBBzAEQZhoMIQsgASgCBCEFQRwhA0EAIQIgBEGAAmpBHGpBADYCACAEQYACakEUakIANwIAIARBgAJqQQxqQgA3AgAgBEIANwKEAiAEQRw2AoACIARByAJqQRBqIARBgAJqQRBqKQMANwMAIARByAJqQQhqIARBgAJqQQhqKQMANwMAIARByAJqQRhqIARBgAJqQRhqKQMANwMAIARBwAFqQQhqIgYgBEHIAmpBDGopAgA3AwAgBEHAAWpBEGoiByAEQcgCakEUaikCADcDACAEQcABakEYaiIIIARByAJqQRxqKAIANgIAIAQgBCkDgAI3A8gCIAQgBCkCzAI3A8ABIAUgBEHAAWoQMCAFQgA3AwAgBUEANgIIIAVBACkCnJFAIhg3AkwgBUHUAGpBACkCpJFAIhk3AgAgBUHcAGpBACkCrJFAIho3AgAgBUHkAGpBACkCtJFAIhs3AgBBHBAWIgFFDRogASAEKQPAATcAACABQRhqIAgoAgA2AAAgAUEQaiAHKQMANwAAIAFBCGogBikDADcAACAFQgA3AwAgBUEANgIIIAVBzABqIgUgGDcCACAFQQhqIBk3AgAgBUEQaiAaNwIAIAVBGGogGzcCAAwgCyABKAIEIQUgBEGAAmpBHGpCADcCACAEQYACakEUakIANwIAIARBgAJqQQxqQgA3AgAgBEIANwKEAkEgIQMgBEEgNgKAAiAEQcgCakEgaiAEQYACakEgaigCADYCACAEQcgCakEYaiAEQYACakEYaikDADcDACAEQcgCakEQaiAEQYACakEQaikDADcDACAEQcgCakEIaiAEQYACakEIaikDADcDACAEIAQpA4ACNwPIAiAEQcABakEYaiIGIARByAJqQRxqKQIANwMAIARBwAFqQRBqIgcgBEHIAmpBFGopAgA3AwAgBEHAAWpBCGoiCCAEQcgCakEMaikCADcDACAEIAQpAswCNwPAASAFIARBwAFqEC0gBUIANwMAQQAhAiAFQQA2AgggBUEAKQK8kUAiGDcCTCAFQdQAakEAKQLEkUAiGTcCACAFQdwAakEAKQLMkUAiGjcCACAFQeQAakEAKQLUkUAiGzcCAEEgEBYiAUUNGiABIAQpA8ABNwAAIAFBGGogBikDADcAACABQRBqIAcpAwA3AAAgAUEIaiAIKQMANwAAIAVCADcDACAFQQA2AgggBUHMAGoiBSAYNwIAIAVBCGogGTcCACAFQRBqIBo3AgAgBUEYaiAbNwIADB8LIAEoAgQhBSAEQYACakEsakIANwIAIARBgAJqQSRqQgA3AgAgBEGAAmpBHGpCADcCACAEQYACakEUakIANwIAIARBgAJqQQxqQgA3AgAgBEIANwKEAkEwIQMgBEEwNgKAAiAEQcgCakEwaiAEQYACakEwaigCADYCACAEQcgCakEoaiAEQYACakEoaikDADcDACAEQcgCakEgaiAEQYACakEgaikDADcDACAEQcgCakEYaiAEQYACakEYaikDADcDACAEQcgCakEQaiAEQYACakEQaikDADcDACAEQcgCakEIaiAEQYACakEIaikDADcDACAEIAQpA4ACNwPIAiAEQcABakEoaiIGIARByAJqQSxqKQIANwMAIARBwAFqQSBqIgcgBEHIAmpBJGopAgA3AwAgBEHAAWpBGGoiCCAEQcgCakEcaikCADcDACAEQcABakEQaiIJIARByAJqQRRqKQIANwMAIARBwAFqQQhqIgogBEHIAmpBDGopAgA3AwAgBCAEKQLMAjcDwAEgBSAEQcABahAoIAVCADcDCCAFQgA3AwBBACECIAVBADYCUCAFQQApA+CRQCIYNwMQIAVBGGpBACkD6JFAIhk3AwAgBUEgakEAKQPwkUAiGjcDACAFQShqQQApA/iRQCIbNwMAIAVBMGpBACkDgJJAIhw3AwAgBUE4akEAKQOIkkAiHTcDACAFQcAAakEAKQOQkkAiHjcDACAFQcgAakEAKQOYkkAiHzcDAEEwEBYiAUUNGiABIAQpA8ABNwAAIAFBKGogBikDADcAACABQSBqIAcpAwA3AAAgAUEYaiAIKQMANwAAIAFBEGogCSkDADcAACABQQhqIAopAwA3AAAgBUIANwMIIAVCADcDACAFQQA2AlAgBUEQaiIFIBg3AwAgBUEIaiAZNwMAIAVBEGogGjcDACAFQRhqIBs3AwAgBUEgaiAcNwMAIAVBKGogHTcDACAFQTBqIB43AwAgBUE4aiAfNwMADB4LIAEoAgQhBSAEQYACakEMakIANwIAIARBgAJqQRRqQgA3AgAgBEGAAmpBHGpCADcCACAEQYACakEkakIANwIAIARBgAJqQSxqQgA3AgAgBEGAAmpBNGpCADcCACAEQYACakE8akIANwIAIARCADcChAJBwAAhAyAEQcAANgKAAiAEQcgCaiAEQYACakHEABBhGiAEQcABakE4aiIGIARByAJqQTxqKQIANwMAIARBwAFqQTBqIgcgBEHIAmpBNGopAgA3AwAgBEHAAWpBKGoiCCAEQcgCakEsaikCADcDACAEQcABakEgaiIJIARByAJqQSRqKQIANwMAIARBwAFqQRhqIgogBEHIAmpBHGopAgA3AwAgBEHAAWpBEGoiCyAEQcgCakEUaikCADcDACAEQcABakEIaiIMIARByAJqQQxqKQIANwMAIAQgBCkCzAI3A8ABIAUgBEHAAWoQJCAFQgA3AwggBUIANwMAQQAhAiAFQQA2AlAgBUEAKQOgkkAiGDcDECAFQRhqQQApA6iSQCIZNwMAIAVBIGpBACkDsJJAIho3AwAgBUEoakEAKQO4kkAiGzcDACAFQTBqQQApA8CSQCIcNwMAIAVBOGpBACkDyJJAIh03AwAgBUHAAGpBACkD0JJAIh43AwAgBUHIAGpBACkD2JJAIh83AwBBwAAQFiIBRQ0aIAEgBCkDwAE3AAAgAUE4aiAGKQMANwAAIAFBMGogBykDADcAACABQShqIAgpAwA3AAAgAUEgaiAJKQMANwAAIAFBGGogCikDADcAACABQRBqIAspAwA3AAAgAUEIaiAMKQMANwAAIAVCADcDCCAF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IAMgAykCkAI3AHkgA0EIakEYaiAEKQAANwMAIANBCGpBEGogACkAADcDACADQQhqQQhqIAYpAAA3AwAgAyADKQB5NwMIQeCSwABBKyADQQhqQdSIwABB3IfAABBSAAsgACACQeyGwAAQVQALIARBwABByIXAABBVAAsgBkHAAEHYhcAAEFUACyAGQSBB6IXAABBVAAsgA0GQAmpBCGoiACAaNgIAIANBkAJqQRBqIgQgGDYCACADQZACakEYaiIBIA42AgAgAyAZNgKcAiADQYEBaiIGIAApAwA3AAAgAyAXNgKkAiADQYkBaiIAIAQpAwA3AAAgAyAINgKsAiADQZEBaiIEIAEpAwA3AAAgAyAbNgKUAiADIBw2ApACIAMgAykDkAI3AHkgA0EIakEYaiAEKQAANwMAIANBCGpBEGogACkAADcDACADQQhqQQhqIAYpAAA3AwAgAyADKQB5NwMIQeCSwABBKyADQQhqQdSIwABB3IfAABBSAAsgA0GQAmpBCGoiACAUNgIAIANBkAJqQRBqIgQgEjYCACADQZACakEYaiIBIBA2AgAgAyATNgKcAiADQYEBaiIGIAApAwA3AAAgAyARNgKkAiADQYkBaiIAIAQpAwA3AAAgAyAPNgKsAiADQZEBaiIEIAEpAwA3AAAgAyAVNgKUAiADIBY2ApACIAMgAykDkAI3AHkgA0EIakEYaiAEKQAANwMAIANBCGpBEGogACkAADcDACADQQhqQQhqIAYpAAA3AwAgAyADKQB5NwMIQeCSwABBKyADQQhqQdSIwABB3IfAABBSAAsgA0GYAmoiACAXNgIAIANBoAJqIgQgDjYCACADQagCaiIBIAg2AgAgAyAaNgKcAiADQfEBaiIGIAApAwA3AAAgAyAZNgKkAiADQfkBaiIHIAQpAwA3AAAgAyAYNgKsAiADQYECaiICIAEpAwA3AAAgAyAbNgKUAiADIBw2ApACIAMgAykDkAI3AOkBIAEgAikAADcDACAEIAcpAAA3AwAgACAGKQAANwMAIAMgAykA6QE3A5ACQeCSwABBKyADQZACakHUiMAAQdyHwAAQUgALIAAgAkH8hsAAEFYACyAAIARBxJbAABBXAAsgBEGQAUHElsAAEFUACyAAQZABQdSWwAAQVgALIAAgBEHElsAAEFcACyAEQYgBQcSWwAAQVQAL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AxBhIQVBmAMQFiIERQ0LIAQgBUGYAxBhGkEBIQUMIQsgA0GAgMAAQQcQXkUNHwJAIANBnYDAAEEHEF5FDQAgA0HkgMAAIAQQXkUNBSADQeuAwAAgBBBeRQ0GIANB8oDAACAEEF5FDQcgA0H5gMAAIAQQXg0KQdgBEBYiBEUNHCACQQA2AgAgAkEEckEAQYABEGYaIAJBgAE2AgAgAkGYA2ogAkGEARBhGiACQbgGaiACQZgDakEEckGAARBhGiAEQcgAakEAKQPYkkA3AwAgBEHAAGpBACkD0JJANwMAIARBOGpBACkDyJJANwMAIARBMGpBACkDwJJANwMAIARBKGpBACkDuJJANwMAIARBIGpBACkDsJJANwMAIARBGGpBACkDqJJANwMAIARBACkDoJJANwMQIARBADYCUCAEQdQAaiACQbgGakGAARBhGiAEQgA3AwggBEIANwMAQRMhBQwhC0HYARAWIgRFDQwgBEIANwMQIARCq7OP/JGjs/DbADcDaCAEQv+kuYjFkdqCm383A2AgBELy5rvjo6f9p6V/NwNYIARCx8yj2NbQ67O7fzcDUCAEQZmag98FNgKQASAEQozRldi5tfbBHzcDiAEgBEK66r+q+s+Uh9EANwOAASAEQoXdntur7ry3PDcDeCAEQqCAgIDwyLmE6wA3A3AgBEIANwMAIARByABqQgA3AwAgBEHAAGpCADcDACAEQThqQgA3AwAgBEEwakIANwMAIARBKGpCADcDACAEQSBqQgA3AwAgBEEYakIANwMAIARBzAFqQgA3AgAgBEIANwMIIARBxAFqQgA3AgAgBEG8AWpCADcCACAEQbQBakIANwIAIARBrAFqQgA3AgAgBEGkAWpCADcCACAEQZwBakIANwIAIARCADcClAFBAyEFDCALAkACQAJAAkAgA0GqgMAAQQoQXkUNACADQbSAwABBChBeRQ0BIANBvoDAAEEKEF5FDQIgA0HIgMAAQQoQXkUNAyADQdWAwABBChBeDQxB4AAQFiIERQ0VIAJBDGpCADcCACACQRRqQgA3AgAgAkEcakIANwIAIAJBJGpCADcCACACQSxqQgA3AgAgAkE0akIANwIAIAJBPGpCADcCACACQgA3AgQgAkHAADYCACACQZgDaiACQcQAEGEaIAJBuAZqQThqIgUgAkGYA2pBPGopAgA3AwAgAkG4BmpBMGoiBiACQZgDakE0aikCADcDACACQbgGakEoaiIHIAJBmANqQSxqKQIANwMAIAJB2AZqIgggAkGYA2pBJGopAgA3AwAgAkG4BmpBGGoiCSACQZgDakEcaikCADcDACACQbgGakEQaiIKIAJBmANqQRRqKQIANwMAIAJBwAZqIgsgAkGYA2pBDGopAgA3AwAgAiACKQKcAzcDuAYgBEEYakEAKAKYkUA2AgAgBEEQakEAKQKQkUA3AgAgBEEAKQKIkUA3AgggBEEANgIcIARCADcDACAEIAIpA7gGNwIgIARBKGogCykDADcCACAEQTBqIAopAwA3AgAgBEE4aiAJKQMANwIAIARBwABqIAgpAwA3AgAgBEHIAGogBykDADcCACAEQdAAaiAGKQMANwIAIARB2ABqIAUpAwA3AgBBCiEFDCMLQeACEBYiBEUNDyAEQQBByAEQZiEFIAJBADYCACACQQRyQQBBkAEQZhogAkGQATYCACACQZgDaiACQZQBEGEaIAJBuAZqIAJBmANqQQRyQZABEGEaIAVBADYCyAEgBUHMAWogAkG4BmpBkAEQYRpBBSEFDCILQdgCEBYiBEUNDyAEQQBByAEQZiEFIAJBADYCACACQQRyQQBBiAEQZhogAkGIATYCACACQZgDaiACQYwBEGEaIAJBuAZqIAJBmANqQQRyQYgBEGEaIAVBADYCyAEgBUHMAWogAkG4BmpBiAEQYRpBBiEFDCELQbgCEBYiBEUNDyAEQQBByAEQZiEFIAJBADYCACACQQRyQQBB6AAQZhogAkHoADYCACACQZgDaiACQewAEGEaIAJBuAZqIAJBmANqQQRyQegAEGEaIAVBADYCyAEgBUHMAWogAkG4BmpB6AAQYRpBByEFDCALQZgCEBYiBEUNDyAEQQBByAEQZiEFIAJBADYCACACQQRyQQBByAAQZhogAkHIADYCACACQZgDaiACQcwAEGEaIAJBuAZqIAJBmANqQQRyQcgAEGEaIAVBADYCyAEgBUHMAWogAkG4BmpByAAQYRpBCCEFDB8LIANB0oDAAEEDEF4NB0HgABAWIgRFDQ8gAkEMakIANwIAIAJBFGpCADcCACACQRxqQgA3AgAgAkEkakIANwIAIAJBLGpCADcCACACQTRqQgA3AgAgAkE8akIANwIAIAJCADcCBCACQcAANgIAIAJBmANqIAJBxAAQYRogAkHwBmoiBSACQZgDakE8aikCADcDACACQegGaiIGIAJBmANqQTRqKQIANwMAIAJB4AZqIgcgAkGYA2pBLGopAgA3AwAgAkHYBmoiCCACQZgDakEkaikCADcDACACQdAGaiIJIAJBmANqQRxqKQIANwMAIAJByAZqIgogAkGYA2pBFGopAgA3AwAgAkHABmoiCyACQZgDakEMaikCADcDACACIAIpApwDNwO4BiAEQQA2AgggBEIANwMAIAQgAikDuAY3AgwgBEEUaiALKQMANwIAIARBHGogCikDADcCACAEQSRqIAkpAwA3AgAgBEEsaiAIKQMANwIAIARBNGogBykDADcCACAEQTxqIAYpAwA3AgAgBEHEAGogBSkDADcCACAEQQApAviQQDcCTCAEQdQAakEAKQKAkUA3AgBBCSEFDB4LIANB34DAAEEFEF4NBkHgABAWIgRFDRAgAkEMakIANwIAIAJBFGpCADcCACACQRxqQgA3AgAgAkEkakIANwIAIAJBLGpCADcCACACQTRqQgA3AgAgAkE8akIANwIAIAJCADcCBCACQcAANgIAIAJBmANqIAJBxAAQYRogAkG4BmpBOGoiBSACQZgDakE8aikCADcDACACQbgGakEwaiIGIAJBmANqQTRqKQIANwMAIAJBuAZqQShqIgcgAkGYA2pBLGopAgA3AwAgAkHYBmoiCCACQZgDakEkaikCADcDACACQbgGakEYaiIJIAJBmANqQRxqKQIANwMAIAJBuAZqQRBqIgogAkGYA2pBFGopAgA3AwAgAkHABmoiCyACQZgDakEMaikCADcDACACIAIpApwDNwO4BiAEQRhqQQAoApiRQDYCACAEQRBqQQApApCRQDcCACAEQQApAoiRQDcCCCAEQQA2AhwgBEIANwMAIAQgAikDuAY3AiAgBEEoaiALKQMANwIAIARBMGogCikDADcCACAEQThqIAkpAwA3AgAgBEHAAGogCCkDADcCACAEQcgAaiAHKQMANwIAIARB0ABqIAYpAwA3AgAgBEHYAGogBSkDADcCAEELIQUMHQsCQAJAAkACQCADKQAAQtOQhZrTxYyZNFENACADKQAAQtOQhZrTxcyaNlENASADKQAAQtOQhZrT5YycNFENAiADKQAAQtOQhZrTpc2YMlENAyADKQAAQtOQhdrUqIyZOFENByADKQAAQtOQhdrUyMyaNlINCUHYAhAWIgRFDR0gBEEAQcgBEGYhBSACQQA2AgAgAkEEckEAQYgBEGYaIAJBiAE2AgAgAkGYA2ogAkGMARBhGiACQbgGaiACQZgDakEEckGIARBhGiAFQQA2AsgBIAVBzAFqIAJBuAZqQYgBEGEaQRUhBQwgC0HgAhAWIgRFDRMgBEEAQcgBEGYhBSACQQA2AgAgAkEEckEAQZABEGYaIAJBkAE2AgAgAkGYA2ogAkGUARBhGiACQbgGaiACQZgDakEEckGQARBhGiAFQQA2AsgBIAVBzAFqIAJBuAZqQZABEGEaQQwhBQwfC0HYAhAWIgRFDRMgBEEAQcgBEGYhBSACQQA2AgAgAkEEckEAQYgBEGYaIAJBiAE2AgAgAkGYA2ogAkGMARBhGiACQbgGaiACQZgDakEEckGIARBhGiAFQQA2AsgBIAVBzAFqIAJBuAZqQYgBEGEaQQ0hBQweC0G4AhAWIgRFDRMgBEEAQcgBEGYhBSACQQA2AgAgAkEEckEAQegAEGYaIAJB6AA2AgAgAkGYA2ogAkHsABBhGiACQbgGaiACQZgDakEEckHoABBhGiAFQQA2AsgBIAVBzAFqIAJBuAZqQegAEGEaQQ4hBQwdC0GYAhAWIgRFDRMgBEEAQcgBEGYhBSACQQA2AgAgAkEEckEAQcgAEGYaIAJByAA2AgAgAkGYA2ogAkHMABBhGiACQbgGaiACQZgDakEEckHIABBhGiAFQQA2AsgBIAVBzAFqIAJBuAZqQcgAEGEaQQ8hBQwcC0HwABAWIgRFDRMgAkEMakIANwIAIAJBFGpCADcCACACQRxqQgA3AgAgAkEkakIANwIAIAJBLGpCADcCACACQTRqQgA3AgAgAkE8akIANwIAIAJCADcCBCACQcAANgIAIAJBmANqIAJBxAAQYRogAkHwBmoiBiACQZgDakE8aikCADcDACACQegGaiIHIAJBmANqQTRqKQIANwMAIAJB4AZqIgggAkGYA2pBLGopAgA3AwAgAkHYBmoiCSACQZgDakEkaikCADcDACACQdAGaiIKIAJBmANqQRxqKQIANwMAQRAhBSACQbgGakEQaiILIAJBmANqQRRqKQIANwMAIAJBwAZqIgwgAkGYA2pBDGopAgA3AwAgAiACKQKcAzcDuAYgBEEANgIIIARB5ABqQQApArSRQDcCACAEQdwAakEAKQKskUA3AgAgBEHUAGpBACkCpJFANwIAIARBACkCnJFANwJMIARBFGogDCkDADcCACAEIAIpA7gGNwIMIARBHGogCykDADcCACAEQSRqIAopAwA3AgAgBEEsaiAJKQMANwIAIARBNGogCCkDADcCACAEQTxqIAcpAwA3AgAgBEHEAGogBikDADcCACAEQgA3AwAMGwtB8AAQFiIERQ0TIAJBDGpCADcCACACQRRqQgA3AgAgAkEcakIANwIAIAJBJGpCADcCACACQSxqQgA3AgAgAkE0akIANwIAIAJBPGpCADcCACACQgA3AgQgAkHAADYCACACQZgDaiACQcQAEGEaIAJB8AZqIgUgAkGYA2pBPGopAgA3AwAgAkHoBmoiBiACQZgDakE0aikCADcDACACQeAGaiIHIAJBmANqQSxqKQIANwMAIAJB2AZqIgggAkGYA2pBJGopAgA3AwAgAkHQBmoiCSACQZgDakEcaikCADcDACACQcgGaiIKIAJBmANqQRRqKQIANwMAIAJBwAZqIgsgAkGYA2pBDGopAgA3AwAgAiACKQKcAzcDuAYgBEEANgIIIARB5ABqQQApAtSRQDcCACAEQdwAakEAKQLMkUA3AgAgBEHUAGpBACkCxJFANwIAIARBACkCvJFANwJMIARBFGogCykDADcCACAEIAIpA7gGNwIMIARBHGogCikDADcCACAEQSRqIAkpAwA3AgAgBEEsaiAIKQMANwIAIARBNGogBykDADcCACAEQTxqIAYpAwA3AgAgBEHEAGogBSkDADcCACAEQgA3AwBBESEFDBoLQdgBEBYiBEUNEyACQQA2AgAgAkEEckEAQYABEGYaIAJBgAE2AgAgAkGYA2ogAkGEARBhGiACQbgGaiACQZgDakEEckGAARBhGiAEQcgAakEAKQOYkkA3AwAgBEHAAGpBACkDkJJANwMAIARBOGpBACkDiJJANwMAIARBMGpBACkDgJJANwMAIARBKGpBACkD+JFANwMAIARBIGpBACkD8JFANwMAIARBGGpBACkD6JFANwMAIARBACkD4JFANwMQIARBADYCUCAEQdQAaiACQbgGakGAARBhGiAEQgA3AwggBEIANwMAQRIhBQwZC0H4AhAWIgRFDRQgBEEAQcgBEGYhBSACQQA2AgAgAkEEckEAQagBEGYaIAJBqAE2AgAgAkGYA2ogAkGsARBhGiACQbgGaiACQZgDakEEckGoARBhGiAFQQA2AsgBIAVBzAFqIAJBuAZqQagBEGEaQRQhBQwYCyADQaSAwABBBhBeRQ0VC0EBIQRBgIHAAEEVEAAhBQwXC0GYA0EIQQAoAryeQCICQQQgAhsRBQAAC0GYA0EIQQAoAryeQCICQQQgAhsRBQAAC0HYAUEIQQAoAryeQCICQQQgAhsRBQAAC0HgAkEIQQAoAryeQCICQQQgAhsRBQAAC0HYAkEIQQAoAryeQCICQQQgAhsRBQAAC0G4AkEIQQAoAryeQCICQQQgAhsRBQAAC0GYAkEIQQAoAryeQCICQQQgAhsRBQAAC0HgAEEIQQAoAryeQCICQQQgAhsRBQAAC0HgAEEIQQAoAryeQCICQQQgAhsRBQAAC0HgAEEIQQAoAryeQCICQQQgAhsRBQAAC0HgAkEIQQAoAryeQCICQQQgAhsRBQAAC0HYAkEIQQAoAryeQCICQQQgAhsRBQAAC0G4AkEIQQAoAryeQCICQQQgAhsRBQAAC0GYAkEIQQAoAryeQCICQQQgAhsRBQAAC0HwAEEIQQAoAryeQCICQQQgAhsRBQAAC0HwAEEIQQAoAryeQCICQQQgAhsRBQAAC0HYAUEIQQAoAryeQCICQQQgAhsRBQAAC0HYAUEIQQAoAryeQCICQQQgAhsRBQAAC0H4AkEIQQAoAryeQCICQQQgAhsRBQAAC0HYAkEIQQAoAryeQCICQQQgAhsRBQAACwJAQfgOEBYiBEUNACAEQQA2ApABIARBiAFqQQApAtSRQCINNwIAIARBgAFqQQApAsyRQCIONwIAIARB+ABqQQApAsSRQCIPNwIAIARBACkCvJFAIhA3AnAgBEIANwMAIAQgEDcCCCAEQRBqIA83AgAgBEEYaiAONwIAIARBIGogDTcCACAEQShqQQBBwwAQZhpBBCEFDAILQfgOQQhBACgCvJ5AIgJBBCACGxEFAAALQZgDEBYiBEUNAiAEQcAAEDhBACEFCyAAQQhqIAQ2AgBBACEECwJAIAFBBGooAgBFDQAgAxAdCyAAIAQ2AgAgACAFNgIEIAJB4AdqJAAPC0GYA0EIQQAoAryeQCICQQQgAhsRBQAAC6YqAgx/An4jAEHQEGsiASQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIABFDQAgACgCACICQX9GDQEgACACQQFqNgIAIABBBGohAgJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAAoAgQOFgABAgMEBQYHCAkKCwwNDg8QERITFBUACyACKAIEIQNBmAMQFiICRQ0XIAFBwAFqIANBgAEQYRogAUHAAWpBuAFqIANBuAFqKQMANwMAIAFBwAFqQbABaiADQbABaikDADcDACABQcABakGoAWogA0GoAWopAwA3AwAgAUHAAWpBoAFqIANBoAFqKQMANwMAIAFBwAFqQZgBaiADQZgBaikDADcDACABQcABakGQAWogA0GQAWopAwA3AwAgAUHAAWpBiAFqIANBiAFqKQMANwMAIAEgAykDgAE3A8ACIAMpA4gDIQ0gAygCkAMhBCADKQPAASEOIAIgASABQcABakHAARBhQcABEGEiBSAONwPAASAFIAMpA8gBNwPIASAFQdABaiADQdABaikDADcDACAFQdgBaiADQdgBaikDADcDACAFQeABaiADQeABaikDADcDACAFQegBaiADQegBaikDADcDACAFQfABaiADQfABaikDADcDACAFQfgBaiADQfgBaikDADcDACAFQYACaiADQYACaikDADcDACAFQYgCaiADQYgCakGAARBhGiAFIAQ2ApADIAUgDTcDiANBACEDDC8LIAIoAgQhA0GYAxAWIgJFDRcgAUHAAWogA0GAARBhGiABQcABakG4AWogA0G4AWopAwA3AwAgAUHAAWpBsAFqIANBsAFqKQMANwMAIAFBwAFqQagBaiADQagBaikDADcDACABQcABakGgAWogA0GgAWopAwA3AwAgAUHAAWpBmAFqIANBmAFqKQMANwMAIAFBwAFqQZABaiADQZABaikDADcDACABQcABakGIAWogA0GIAWopAwA3AwAgASADKQOAATcDwAIgAykDiAMhDSADKAKQAyEEIAMpA8ABIQ4gAiABQcABakHAARBhIgUgDjcDwAEgBSADKQPIATcDyAEgBUHQAWogA0HQAWopAwA3AwAgBUHYAWogA0HYAWopAwA3AwAgBUHgAWogA0HgAWopAwA3AwAgBUHoAWogA0HoAWopAwA3AwAgBUHwAWogA0HwAWopAwA3AwAgBUH4AWogA0H4AWopAwA3AwAgBUGAAmogA0GAAmopAwA3AwAgBUGIAmogA0GIAmpBgAEQYRogBSAENgKQAyAFIA03A4gDQQEhAwwuCyACKAIEIQNBmAMQFiICRQ0XIAFBwAFqIANBgAEQYRogAUHAAWpBuAFqIANBuAFqKQMANwMAIAFBwAFqQbABaiADQbABaikDADcDACABQcABakGoAWogA0GoAWopAwA3AwAgAUHAAWpBoAFqIANBoAFqKQMANwMAIAFBwAFqQZgBaiADQZgBaikDADcDACABQcABakGQAWogA0GQAWopAwA3AwAgAUHAAWpBiAFqIANBiAFqKQMANwMAIAEgAykDgAE3A8ACIAMpA4gDIQ0gAygCkAMhBCADKQPAASEOIAIgAUHAAWpBwAEQYSIFIA43A8ABIAUgAykDyAE3A8gBIAVB0AFqIANB0AFqKQMANwMAIAVB2AFqIANB2AFqKQMANwMAIAVB4AFqIANB4AFqKQMANwMAIAVB6AFqIANB6AFqKQMANwMAIAVB8AFqIANB8AFqKQMANwMAIAVB+AFqIANB+AFqKQMANwMAIAVBgAJqIANBgAJqKQMANwMAIAVBiAJqIANBiAJqQYABEGEaIAUgBDYCkAMgBSANNwOIA0ECIQMMLQsgAigCBCEDQdgBEBYiAkUNFyACIAMpAwg3AwggAiADKQMANwMAIAMoAnAhBSACQcgAaiADQcgAaikDADcDACACQcAAaiADQcAAaikDADcDACACQThqIANBOGopAwA3AwAgAkEwaiADQTBqKQMANwMAIAJBKGogA0EoaikDADcDACACQSBqIANBIGopAwA3AwAgAkEYaiADQRhqKQMANwMAIAIgAykDEDcDECACIAMpA1A3A1AgAkHYAGogA0HYAGopAwA3AwAgAkHgAGogA0HgAGopAwA3AwAgAkHoAGogA0HoAGopAwA3AwAgAiAFNgJwIAJBjAFqIANBjAFqKQIANwIAIAJBhAFqIANBhAFqKQIANwIAIAJB/ABqIANB/ABqKQIANwIAIAIgAykCdDcCdCACQcwBaiADQcwBaikCADcCACACQcQBaiADQcQBaikCADcCACACQbwBaiADQbwBaikCADcCACACQbQBaiADQbQBaikCADcCACACQawBaiADQawBaikCADcCACACQaQBaiADQaQBaikCADcCACACQZwBaiADQZwBaikCADcCACACIAMpApQBNwKUAUEDIQMMLAsgAigCBCEDQfgOEBYiAkUNFyABQcABakGIAWogA0GIAWopAwA3AwAgAUHAAWpBgAFqIANBgAFqKQMANwMAIAFBwAFqQfgAaiADQfgAaikDADcDACABQcABakEQaiADQRBqKQMANwMAIAFBwAFqQRhqIANBGGopAwA3AwAgAUHAAWpBIGogA0EgaikDADcDACABQcABakEwaiADQTBqKQMANwMAIAFBwAFqQThqIANBOGopAwA3AwAgAUHAAWpBwABqIANBwABqKQMANwMAIAFBwAFqQcgAaiADQcgAaikDADcDACABQcABakHQAGogA0HQAGopAwA3AwAgAUHAAWpB2ABqIANB2ABqKQMANwMAIAFBwAFqQeAAaiADQeAAaikDADcDACABIAMpA3A3A7ACIAEgAykDCDcDyAEgASADKQMoNwPoASADKQMAIQ0gAy0AaiEGIAMtAGkhByADLQBoIQgCQCADKAKQAUEFdCIEDQBBACEEDCsLIAFBGGoiCSADQZQBaiIDQRhqKQAANwMAIAFBEGoiCiADQRBqKQAANwMAIAFBCGoiCyADQQhqKQAANwMAIAEgAykAADcDACADQSBqIQUgBEFgaiEMIAFBwAFqQZQBaiEDQQEhBANAIARBOEYNGSADIAEpAwA3AAAgA0EYaiAJKQMANwAAIANBEGogCikDADcAACADQQhqIAspAwA3AAAgDEUNKyAJIAVBGGopAAA3AwAgCiAFQRBqKQAANwMAIAsgBUEIaikAADcDACABIAUpAAA3AwAgA0EgaiEDIARBAWohBCAMQWBqIQwgBUEgaiEFDAALCyACKAIEIQNB4AIQFiICRQ0YIAFBwAFqIANByAEQYRogAUEEciADQcwBahBEIAEgAygCyAE2AgAgAUHAAWpByAFqIAFBlAEQYRogAiABQcABakHgAhBhGkEFIQMMKgsgAigCBCEDQdgCEBYiAkUNGCABQcABaiADQcgBEGEaIAFBBHIgA0HMAWoQRSABIAMoAsgBNgIAIAFBwAFqQcgBaiABQYwBEGEaIAIgAUHAAWpB2AIQYRpBBiEDDCkLIAIoAgQhA0G4AhAWIgJFDRggAUHAAWogA0HIARBhGiABQQRyIANBzAFqEEYgASADKALIATYCACABQcABakHIAWogAUHsABBhGiACIAFBwAFqQbgCEGEaQQchAwwoCyACKAIEIQNBmAIQFiICRQ0YIAFBwAFqIANByAEQYRogAUEEciADQcwBahBHIAEgAygCyAE2AgAgAUHAAWpByAFqIAFBzAAQYRogAiABQcABakGYAhBhGkEIIQMMJwsgAigCBCEDQeAAEBYiAkUNGCADKQMAIQ0gAUHAAWpBBHIgA0EMahA1IAEgAygCCDYCwAEgASABQcABakHEABBhIQUgAiANNwMAIAJBCGogBUHEABBhGiACQdQAaiADQdQAaikCADcCACACIAMpAkw3AkxBCSEDDCYLIAIoAgQhA0HgABAWIgJFDRggAUHAEGoiBSADQRBqKQMANwMAIAFBuBBqQRBqIgQgA0EYaigCADYCACABIAMpAwg3A7gQIAMpAwAhDSABQcABakEEciADQSBqEDUgASADKAIcNgLAASABIAFBwAFqQcQAEGEhAyACIA03AwAgAiADKQO4EDcDCCACQRBqIAUpAwA3AwAgAkEYaiAEKAIANgIAIAJBHGogA0HEABBhGkEKIQMMJQsgAigCBCEDQeAAEBYiAkUNGCABQcAQaiIFIANBEGopAwA3AwAgAUG4EGpBEGoiBCADQRhqKAIANgIAIAEgAykDCDcDuBAgAykDACENIAFBwAFqQQRyIANBIGoQNSABIAMoAhw2AsABIAEgAUHAAWpBxAAQYSEDIAIgDTcDACACIAMpA7gQNwMIIAJBEGogBSkDADcDACACQRhqIAQoAgA2AgAgAkEcaiADQcQAEGEaQQshAwwkCyACKAIEIQNB4AIQFiICRQ0YIAFBwAFqIANByAEQYRogAUEEciADQcwBahBEIAEgAygCyAE2AgAgAUHAAWpByAFqIAFBlAEQYRogAiABQcABakHgAhBhGkEMIQMMIwsgAigCBCEDQdgCEBYiAkUNGCABQcABaiADQcgBEGEaIAFBBHIgA0HMAWoQRSABIAMoAsgBNgIAIAFBwAFqQcgBaiABQYwBEGEaIAIgAUHAAWpB2AIQYRpBDSEDDCILIAIoAgQhA0G4AhAWIgJFDRggAUHAAWogA0HIARBhGiABQQRyIANBzAFqEEYgASADKALIATYCACABQcABakHIAWogAUHsABBhGiACIAFBwAFqQbgCEGEaQQ4hAwwhCyACKAIEIQNBmAIQFiICRQ0YIAFBwAFqIANByAEQYRogAUEEciADQcwBahBHIAEgAygCyAE2AgAgAUHAAWpByAFqIAFBzAAQYRogAiABQcABakGYAhBhGkEPIQMMIAsgAigCBCEDQfAAEBYiAkUNGCADKQMAIQ0gAUHAAWpBBHIgA0EMahA1IAEgAygCCDYCwAEgASABQcABakHEABBhIQUgAiANNwMAIAJBCGogBUHEABBhGiACQeQAaiADQeQAaikCADcCACACQdwAaiADQdwAaikCADcCACACQdQAaiADQdQAaikCADcCACACIAMpAkw3AkxBECEDDB8LIAIoAgQhA0HwABAWIgJFDRggAykDACENIAFBwAFqQQRyIANBDGoQNSABIAMoAgg2AsABIAEgAUHAAWpBxAAQYSEFIAIgDTcDACACQQhqIAVBxAAQYRogAkHkAGogA0HkAGopAgA3AgAgAkHcAGogA0HcAGopAgA3AgAgAkHUAGogA0HUAGopAgA3AgAgAiADKQJMNwJMQREhAwweCyACKAIEIQNB2AEQFiICRQ0YIANBCGopAwAhDSADKQMAIQ4gAUHAAWpBBHIgA0HUAGoQSCABIAMoAlA2AsABIAEgAUHAAWpBhAEQYSEFIAIgDTcDCCACIA43AwAgAiADKQMQNwMQIAJBGGogA0EYaikDADcDACACQSBqIANBIGopAwA3AwAgAkEoaiADQShqKQMANwMAIAJBMGogA0EwaikDADcDACACQThqIANBOGopAwA3AwAgAkHAAGogA0HAAGopAwA3AwAgAkHIAGogA0HIAGopAwA3AwAgAkHQAGogBUGEARBhGkESIQMMHQsgAigCBCEDQdgBEBYiAkUNGCADQQhqKQMAIQ0gAykDACEOIAFBwAFqQQRyIANB1ABqEEggASADKAJQNgLAASABIAFBwAFqQYQBEGEhBSACIA03AwggAiAONwMAIAIgAykDEDcDECACQRhqIANBGGopAwA3AwAgAkEgaiADQSBqKQMANwMAIAJBKGogA0EoaikDADcDACACQTBqIANBMGopAwA3AwAgAkE4aiADQThqKQMANwMAIAJBwABqIANBwABqKQMANwMAIAJByABqIANByABqKQMANwMAIAJB0ABqIAVBhAEQYRpBEyEDDBwLIAIoAgQhA0H4AhAWIgJFDRggAUHAAWogA0HIARBhGiABQQRyIANBzAFqEEkgASADKALIATYCACABQcABakHIAWogAUGsARBhGiACIAFBwAFqQfgCEGEaQRQhAwwbCyACKAIEIQNB2AIQFiICRQ0YIAFBwAFqIANByAEQYRogAUEEciADQcwBahBFIAEgAygCyAE2AgAgAUHAAWpByAFqIAFBjAEQYRogAiABQcABakHYAhBhGkEVIQMMGgsQgQEACxCCAQALQZgDQQhBACgCvJ5AIgFBBCABGxEFAAALQZgDQQhBACgCvJ5AIgFBBCABGxEFAAALQZgDQQhBACgCvJ5AIgFBBCABGxEFAAALQdgBQQhBACgCvJ5AIgFBBCABGxEFAAALQfgOQQhBACgCvJ5AIgFBBCABGxEFAAALEH0AC0HgAkEIQQAoAryeQCIBQQQgARsRBQAAC0HYAkEIQQAoAryeQCIBQQQgARsRBQAAC0G4AkEIQQAoAryeQCIBQQQgARsRBQAAC0GYAkEIQQAoAryeQCIBQQQgARsRBQAAC0HgAEEIQQAoAryeQCIBQQQgARsRBQAAC0HgAEEIQQAoAryeQCIBQQQgARsRBQAAC0HgAEEIQQAoAryeQCIBQQQgARsRBQAAC0HgAkEIQQAoAryeQCIBQQQgARsRBQAAC0HYAkEIQQAoAryeQCIBQQQgARsRBQAAC0G4AkEIQQAoAryeQCIBQQQgARsRBQAAC0GYAkEIQQAoAryeQCIBQQQgARsRBQAAC0HwAEEIQQAoAryeQCIBQQQgARsRBQAAC0HwAEEIQQAoAryeQCIBQQQgARsRBQAAC0HYAUEIQQAoAryeQCIBQQQgARsRBQAAC0HYAUEIQQAoAryeQCIBQQQgARsRBQAAC0H4AkEIQQAoAryeQCIBQQQgARsRBQAAC0HYAkEIQQAoAryeQCIBQQQgARsRBQAACyABIAQ2AtACIAEgBjoAqgIgASAHOgCpAiABIAg6AKgCIAEgDTcDwAEgAiABQcABakH4DhBhGkEEIQMLIAAgACgCAEF/ajYCAAJAQQwQFiIARQ0AIAAgAjYCCCAAIAM2AgQgAEEANgIAIAFB0BBqJAAgAA8LQQxBBEEAKAK8nkAiAUEEIAEbEQUAAAv2HQI5fwF+IwBBwABrIgMkAAJAAkAgAkUNACAAQRBqKAIAIgQgAEE4aigCACIFaiAAQSBqKAIAIgZqIgcgAEE8aigCACIIaiAHIAAtAGhzQRB0IAdBEHZyIgdB8ua74wNqIgkgBnNBFHciCmoiCyAHc0EYdyIMIAlqIg0gCnNBGXchDiALIABB2ABqKAIAIg9qIABBFGooAgAiECAAQcAAaigCACIRaiAAQSRqKAIAIhJqIgcgAEHEAGooAgAiE2ogByAALQBpQQhyc0EQdCAHQRB2ciIHQbrqv6p6aiIJIBJzQRR3IgpqIgsgB3NBGHciFCAJaiIVIApzQRl3IhZqIhcgAEHcAGooAgAiGGohGSALIABB4ABqKAIAIhpqIRsgACgCCCIcIAAoAigiHWogAEEYaigCACIeaiIfIABBLGooAgAiIGohISAAQQxqKAIAIiIgAEEwaigCACIjaiAAQRxqKAIAIiRqIiUgAEE0aigCACImaiEnIABB5ABqKAIAIQcgAEHUAGooAgAhCSAAQdAAaigCACEKIABBzABqKAIAIQsgAEHIAGooAgAhKANAIAMgGSAXICcgJSAAKQMAIjxCIIinc0EQdyIpQYXdntt7aiIqICRzQRR3IitqIiwgKXNBGHciKXNBEHciLSAhIB8gPKdzQRB3Ii5B58yn0AZqIi8gHnNBFHciMGoiMSAuc0EYdyIuIC9qIi9qIjIgFnNBFHciM2oiNCATaiAsIApqIA5qIiwgCWogLCAuc0EQdyIsIBVqIi4gDnNBFHciNWoiNiAsc0EYdyIsIC5qIi4gNXNBGXciNWoiNyAdaiA3IBsgLyAwc0EZdyIvaiIwIAdqIDAgDHNBEHciMCApICpqIilqIiogL3NBFHciL2oiOCAwc0EYdyIwc0EQdyI3IDEgKGogKSArc0EZdyIpaiIrIAtqICsgFHNBEHciKyANaiIxIClzQRR3IilqIjkgK3NBGHciKyAxaiIxaiI6IDVzQRR3IjVqIjsgC2ogOCAFaiA0IC1zQRh3Ii0gMmoiMiAzc0EZdyIzaiI0IBhqIDQgK3NBEHciKyAuaiIuIDNzQRR3IjNqIjQgK3NBGHciKyAuaiIuIDNzQRl3IjNqIjggGmogOCA2ICZqIDEgKXNBGXciKWoiMSAKaiAxIC1zQRB3Ii0gMCAqaiIqaiIwIClzQRR3IilqIjEgLXNBGHciLXNBEHciNiA5ICNqICogL3NBGXciKmoiLyARaiAvICxzQRB3IiwgMmoiLyAqc0EUdyIqaiIyICxzQRh3IiwgL2oiL2oiOCAzc0EUdyIzaiI5IBhqIDEgD2ogOyA3c0EYdyIxIDpqIjcgNXNBGXciNWoiOiAIaiA6ICxzQRB3IiwgLmoiLiA1c0EUdyI1aiI6ICxzQRh3IiwgLmoiLiA1c0EZdyI1aiI7ICNqIDsgNCAHaiAvICpzQRl3IipqIi8gKGogLyAxc0EQdyIvIC0gMGoiLWoiMCAqc0EUdyIqaiIxIC9zQRh3Ii9zQRB3IjQgMiAgaiAtIClzQRl3IilqIi0gCWogLSArc0EQdyIrIDdqIi0gKXNBFHciKWoiMiArc0EYdyIrIC1qIi1qIjcgNXNBFHciNWoiOyAJaiAxIBNqIDkgNnNBGHciMSA4aiI2IDNzQRl3IjNqIjggGmogOCArc0EQdyIrIC5qIi4gM3NBFHciM2oiOCArc0EYdyIrIC5qIi4gM3NBGXciM2oiOSAHaiA5IDogCmogLSApc0EZdyIpaiItIA9qIC0gMXNBEHciLSAvIDBqIi9qIjAgKXNBFHciKWoiMSAtc0EYdyItc0EQdyI5IDIgJmogLyAqc0EZdyIqaiIvIAVqIC8gLHNBEHciLCA2aiIvICpzQRR3IipqIjIgLHNBGHciLCAvaiIvaiI2IDNzQRR3IjNqIjogGmogMSALaiA7IDRzQRh3IjEgN2oiNCA1c0EZdyI1aiI3IB1qIDcgLHNBEHciLCAuaiIuIDVzQRR3IjVqIjcgLHNBGHciLCAuaiIuIDVzQRl3IjVqIjsgJmogOyA4IChqIC8gKnNBGXciKmoiLyAgaiAvIDFzQRB3Ii8gLSAwaiItaiIwICpzQRR3IipqIjEgL3NBGHciL3NBEHciOCAyIBFqIC0gKXNBGXciKWoiLSAIaiAtICtzQRB3IisgNGoiLSApc0EUdyIpaiIyICtzQRh3IisgLWoiLWoiNCA1c0EUdyI1aiI7IAhqIDEgGGogOiA5c0EYdyIxIDZqIjYgM3NBGXciM2oiOSAHaiA5ICtzQRB3IisgLmoiLiAzc0EUdyIzaiI5ICtzQRh3IisgLmoiLiAzc0EZdyIzaiI6IChqIDogNyAPaiAtIClzQRl3IilqIi0gC2ogLSAxc0EQdyItIC8gMGoiL2oiMCApc0EUdyIpaiIxIC1zQRh3Ii1zQRB3IjcgMiAKaiAvICpzQRl3IipqIi8gE2ogLyAsc0EQdyIsIDZqIi8gKnNBFHciKmoiMiAsc0EYdyIsIC9qIi9qIjYgM3NBFHciM2oiOiAHaiAxIAlqIDsgOHNBGHciMSA0aiI0IDVzQRl3IjVqIjggI2ogOCAsc0EQdyIsIC5qIi4gNXNBFHciNWoiOCAsc0EYdyIsIC5qIi4gNXNBGXciNWoiOyAKaiA7IDkgIGogLyAqc0EZdyIqaiIvIBFqIC8gMXNBEHciLyAtIDBqIi1qIjAgKnNBFHciKmoiMSAvc0EYdyIvc0EQdyI5IDIgBWogLSApc0EZdyIpaiItIB1qIC0gK3NBEHciKyA0aiItIClzQRR3IilqIjIgK3NBGHciKyAtaiItaiI0IDVzQRR3IjVqIjsgHWogMSAaaiA6IDdzQRh3IjEgNmoiNiAzc0EZdyIzaiI3IChqIDcgK3NBEHciKyAuaiIuIDNzQRR3IjNqIjcgK3NBGHciKyAuaiIuIDNzQRl3IjNqIjogIGogOiA4IAtqIC0gKXNBGXciKWoiLSAJaiAtIDFzQRB3Ii0gLyAwaiIvaiIwIClzQRR3IilqIjEgLXNBGHciLXNBEHciOCAyIA9qIC8gKnNBGXciKmoiLyAYaiAvICxzQRB3IiwgNmoiLyAqc0EUdyIqaiIyICxzQRh3IiwgL2oiL2oiNiAzc0EUdyIzaiI6IChqIDEgCGogOyA5c0EYdyIxIDRqIjQgNXNBGXciNWoiOSAmaiA5ICxzQRB3IiwgLmoiLiA1c0EUdyI1aiI5ICxzQRh3IiwgLmoiLiA1c0EZdyI1aiI7IA9qIDsgNyARaiAvICpzQRl3IipqIi8gBWogLyAxc0EQdyIvIC0gMGoiLWoiMCAqc0EUdyIqaiIxIC9zQRh3Ii9zQRB3IjcgMiATaiAtIClzQRl3IilqIi0gI2ogLSArc0EQdyIrIDRqIi0gKXNBFHciKWoiMiArc0EYdyIrIC1qIi1qIjQgNXNBFHciNWoiOyAjaiAxIAdqIDogOHNBGHciMSA2aiI2IDNzQRl3IjNqIjggIGogOCArc0EQdyIrIC5qIi4gM3NBFHciM2oiOCArc0EYdyIrIC5qIi4gM3NBGXciM2oiOiARaiA6IDkgCWogLSApc0EZdyIpaiItIAhqIC0gMXNBEHciLSAvIDBqIi9qIjAgKXNBFHciKWoiMSAtc0EYdyItc0EQdyI5IDIgC2ogLyAqc0EZdyIqaiIvIBpqIC8gLHNBEHciLCA2aiIvICpzQRR3IipqIjIgLHNBGHciLCAvaiIvaiI2IDNzQRR3IjNqIjogIGogMSAdaiA7IDdzQRh3IjEgNGoiNCA1c0EZdyI1aiI3IApqIDcgLHNBEHciLCAuaiIuIDVzQRR3IjVqIjcgLHNBGHciLCAuaiIuIDVzQRl3IjVqIjsgC2ogOyA4IAVqIC8gKnNBGXciKmoiLyATaiAvIDFzQRB3Ii8gLSAwaiItaiIwICpzQRR3IipqIjEgL3NBGHciL3NBEHciOCAyIBhqIC0gKXNBGXciKWoiLSAmaiAtICtzQRB3IisgNGoiLSApc0EUdyIpaiIyICtzQRh3IisgLWoiLWoiNCA1c0EUdyI1aiI7ICZqIDEgKGogOiA5c0EYdyIxIDZqIjYgM3NBGXciM2oiOSARaiA5ICtzQRB3IisgLmoiLiAzc0EUdyIzaiI5ICtzQRh3IjogLmoiKyAzc0EZdyIuaiIzIAVqIDMgNyAIaiAtIClzQRl3IilqIi0gHWogLSAxc0EQdyItIC8gMGoiL2oiMCApc0EUdyIxaiI3IC1zQRh3Ii1zQRB3IikgMiAJaiAvICpzQRl3IipqIi8gB2ogLyAsc0EQdyIsIDZqIi8gKnNBFHciMmoiMyAsc0EYdyIqIC9qIi9qIiwgLnNBFHciLmoiNiApc0EYdyIpICRzNgI0IAMgNyAjaiA7IDhzQRh3IjcgNGoiNCA1c0EZdyI1aiI4IA9qIDggKnNBEHciKiAraiIrIDVzQRR3IjVqIjggKnNBGHciKiAeczYCMCADICogK2oiKyAQczYCLCADICkgLGoiLCAcczYCICADICsgOSATaiAvIDJzQRl3Ii9qIjIgGGogMiA3c0EQdyIyIC0gMGoiLWoiMCAvc0EUdyIvaiI3czYCDCADICwgMyAaaiAtIDFzQRl3Ii1qIjEgCmogMSA6c0EQdyIxIDRqIjMgLXNBFHciNGoiOXM2AgAgAyA3IDJzQRh3Ii0gBnM2AjggAyArIDVzQRl3IC1zNgIYIAMgOSAxc0EYdyIrIBJzNgI8IAMgLSAwaiItICJzNgIkIAMgLCAuc0EZdyArczYCHCADIC0gOHM2AgQgAyArIDNqIisgBHM2AiggAyArIDZzNgIIIAMgLSAvc0EZdyAqczYCECADICsgNHNBGXcgKXM2AhQgAC0AcCIpQcEATw0CIAEgAyApakHAACApayIqIAIgAiAqSxsiKhBhISsgACApICpqIik6AHAgAiAqayECAkAgKUH/AXFBwABHDQAgAEEAOgBwIAAgACkDAEIBfDcDAAsgKyAqaiEBIAINAAsLIANBwABqJAAPCyApQcAAQbyHwAAQVgALlRsBIH8gACAAKAIAIAEoAAAiBWogACgCECIGaiIHIAEoAAQiCGogByADp3NBEHciCUHnzKfQBmoiCiAGc0EUdyILaiIMIAEoACAiBmogACgCBCABKAAIIgdqIAAoAhQiDWoiDiABKAAMIg9qIA4gA0IgiKdzQRB3Ig5Bhd2e23tqIhAgDXNBFHciDWoiESAOc0EYdyISIBBqIhMgDXNBGXciFGoiFSABKAAkIg1qIBUgACgCDCABKAAYIg5qIAAoAhwiFmoiFyABKAAcIhBqIBcgBEH/AXFzQRB0IBdBEHZyIhdBuuq/qnpqIhggFnNBFHciFmoiGSAXc0EYdyIac0EQdyIbIAAoAgggASgAECIXaiAAKAIYIhxqIhUgASgAFCIEaiAVIAJB/wFxc0EQdCAVQRB2ciIVQfLmu+MDaiICIBxzQRR3IhxqIh0gFXNBGHciHiACaiIfaiIgIBRzQRR3IhRqIiEgB2ogGSABKAA4IhVqIAwgCXNBGHciDCAKaiIZIAtzQRl3IglqIgogASgAPCICaiAKIB5zQRB3IgogE2oiCyAJc0EUdyIJaiITIApzQRh3Ih4gC2oiIiAJc0EZdyIjaiILIA5qIAsgESABKAAoIglqIB8gHHNBGXciEWoiHCABKAAsIgpqIBwgDHNBEHciDCAaIBhqIhhqIhogEXNBFHciEWoiHCAMc0EYdyIMc0EQdyIfIB0gASgAMCILaiAYIBZzQRl3IhZqIhggASgANCIBaiAYIBJzQRB3IhIgGWoiGCAWc0EUdyIWaiIZIBJzQRh3IhIgGGoiGGoiHSAjc0EUdyIjaiIkIAhqIBwgD2ogISAbc0EYdyIbICBqIhwgFHNBGXciFGoiICAJaiAgIBJzQRB3IhIgImoiICAUc0EUdyIUaiIhIBJzQRh3IhIgIGoiICAUc0EZdyIUaiIiIApqICIgEyAXaiAYIBZzQRl3IhNqIhYgAWogFiAbc0EQdyIWIAwgGmoiDGoiGCATc0EUdyITaiIaIBZzQRh3IhZzQRB3IhsgGSAQaiAMIBFzQRl3IgxqIhEgBWogESAec0EQdyIRIBxqIhkgDHNBFHciDGoiHCARc0EYdyIRIBlqIhlqIh4gFHNBFHciFGoiIiAPaiAaIAJqICQgH3NBGHciGiAdaiIdICNzQRl3Ih9qIiMgBmogIyARc0EQdyIRICBqIiAgH3NBFHciH2oiIyARc0EYdyIRICBqIiAgH3NBGXciH2oiJCAXaiAkICEgC2ogGSAMc0EZdyIMaiIZIARqIBkgGnNBEHciGSAWIBhqIhZqIhggDHNBFHciDGoiGiAZc0EYdyIZc0EQdyIhIBwgDWogFiATc0EZdyITaiIWIBVqIBYgEnNBEHciEiAdaiIWIBNzQRR3IhNqIhwgEnNBGHciEiAWaiIWaiIdIB9zQRR3Ih9qIiQgDmogGiAJaiAiIBtzQRh3IhogHmoiGyAUc0EZdyIUaiIeIAtqIB4gEnNBEHciEiAgaiIeIBRzQRR3IhRqIiAgEnNBGHciEiAeaiIeIBRzQRl3IhRqIiIgBGogIiAjIBBqIBYgE3NBGXciE2oiFiAVaiAWIBpzQRB3IhYgGSAYaiIYaiIZIBNzQRR3IhNqIhogFnNBGHciFnNBEHciIiAcIAFqIBggDHNBGXciDGoiGCAHaiAYIBFzQRB3IhEgG2oiGCAMc0EUdyIMaiIbIBFzQRh3IhEgGGoiGGoiHCAUc0EUdyIUaiIjIAlqIBogBmogJCAhc0EYdyIaIB1qIh0gH3NBGXciH2oiISAIaiAhIBFzQRB3IhEgHmoiHiAfc0EUdyIfaiIhIBFzQRh3IhEgHmoiHiAfc0EZdyIfaiIkIBBqICQgICANaiAYIAxzQRl3IgxqIhggBWogGCAac0EQdyIYIBYgGWoiFmoiGSAMc0EUdyIMaiIaIBhzQRh3IhhzQRB3IiAgGyAKaiAWIBNzQRl3IhNqIhYgAmogFiASc0EQdyISIB1qIhYgE3NBFHciE2oiGyASc0EYdyISIBZqIhZqIh0gH3NBFHciH2oiJCAXaiAaIAtqICMgInNBGHciGiAcaiIcIBRzQRl3IhRqIiIgDWogIiASc0EQdyISIB5qIh4gFHNBFHciFGoiIiASc0EYdyISIB5qIh4gFHNBGXciFGoiIyAFaiAjICEgAWogFiATc0EZdyITaiIWIAJqIBYgGnNBEHciFiAYIBlqIhhqIhkgE3NBFHciE2oiGiAWc0EYdyIWc0EQdyIhIBsgFWogGCAMc0EZdyIMaiIYIA9qIBggEXNBEHciESAcaiIYIAxzQRR3IgxqIhsgEXNBGHciESAYaiIYaiIcIBRzQRR3IhRqIiMgC2ogGiAIaiAkICBzQRh3IhogHWoiHSAfc0EZdyIfaiIgIA5qICAgEXNBEHciESAeaiIeIB9zQRR3Ih9qIiAgEXNBGHciESAeaiIeIB9zQRl3Ih9qIiQgAWogJCAiIApqIBggDHNBGXciDGoiGCAHaiAYIBpzQRB3IhggFiAZaiIWaiIZIAxzQRR3IgxqIhogGHNBGHciGHNBEHciIiAbIARqIBYgE3NBGXciE2oiFiAGaiAWIBJzQRB3IhIgHWoiFiATc0EUdyITaiIbIBJzQRh3IhIgFmoiFmoiHSAfc0EUdyIfaiIkIBBqIBogDWogIyAhc0EYdyIaIBxqIhwgFHNBGXciFGoiISAKaiAhIBJzQRB3IhIgHmoiHiAUc0EUdyIUaiIhIBJzQRh3IhIgHmoiHiAUc0EZdyIUaiIjIAdqICMgICAVaiAWIBNzQRl3IhNqIhYgBmogFiAac0EQdyIWIBggGWoiGGoiGSATc0EUdyITaiIaIBZzQRh3IhZzQRB3IiAgGyACaiAYIAxzQRl3IgxqIhggCWogGCARc0EQdyIRIBxqIhggDHNBFHciDGoiGyARc0EYdyIRIBhqIhhqIhwgFHNBFHciFGoiIyANaiAaIA5qICQgInNBGHciGiAdaiIdIB9zQRl3Ih9qIiIgF2ogIiARc0EQdyIRIB5qIh4gH3NBFHciH2oiIiARc0EYdyIRIB5qIh4gH3NBGXciH2oiJCAVaiAkICEgBGogGCAMc0EZdyIMaiIYIA9qIBggGnNBEHciGCAWIBlqIhZqIhkgDHNBFHciDGoiGiAYc0EYdyIYc0EQdyIhIBsgBWogFiATc0EZdyITaiIWIAhqIBYgEnNBEHciEiAdaiIWIBNzQRR3IhNqIhsgEnNBGHciEiAWaiIWaiIdIB9zQRR3Ih9qIiQgAWogGiAKaiAjICBzQRh3IhogHGoiHCAUc0EZdyIUaiIgIARqICAgEnNBEHciEiAeaiIeIBRzQRR3IhRqIiAgEnNBGHciEiAeaiIeIBRzQRl3IhRqIiMgD2ogIyAiIAJqIBYgE3NBGXciE2oiFiAIaiAWIBpzQRB3IhYgGCAZaiIYaiIZIBNzQRR3IhNqIhogFnNBGHciFnNBEHciIiAbIAZqIBggDHNBGXciDGoiGCALaiAYIBFzQRB3IhEgHGoiGCAMc0EUdyIMaiIbIBFzQRh3IhEgGGoiGGoiHCAUc0EUdyIUaiIjIApqIBogF2ogJCAhc0EYdyIKIB1qIhogH3NBGXciHWoiHyAQaiAfIBFzQRB3IhEgHmoiHiAdc0EUdyIdaiIfIBFzQRh3IhEgHmoiHiAdc0EZdyIdaiIhIAJqICEgICAFaiAYIAxzQRl3IgJqIgwgCWogDCAKc0EQdyIKIBYgGWoiDGoiFiACc0EUdyICaiIYIApzQRh3IgpzQRB3IhkgGyAHaiAMIBNzQRl3IgxqIhMgDmogEyASc0EQdyISIBpqIhMgDHNBFHciDGoiGiASc0EYdyISIBNqIhNqIhsgHXNBFHciHWoiICAVaiAYIARqICMgInNBGHciBCAcaiIVIBRzQRl3IhRqIhggBWogGCASc0EQdyIFIB5qIhIgFHNBFHciFGoiGCAFc0EYdyIFIBJqIhIgFHNBGXciFGoiHCAJaiAcIB8gBmogEyAMc0EZdyIGaiIJIA5qIAkgBHNBEHciDiAKIBZqIgRqIgkgBnNBFHciBmoiCiAOc0EYdyIOc0EQdyIMIBogCGogBCACc0EZdyIIaiIEIA1qIAQgEXNBEHciDSAVaiIEIAhzQRR3IghqIhUgDXNBGHciDSAEaiIEaiICIBRzQRR3IhFqIhMgDHNBGHciDCACaiICIBUgD2ogDiAJaiIPIAZzQRl3IgZqIg4gF2ogDiAFc0EQdyIFICAgGXNBGHciDiAbaiIXaiIVIAZzQRR3IgZqIglzNgIIIAAgASAKIBBqIBcgHXNBGXciEGoiF2ogFyANc0EQdyIBIBJqIg0gEHNBFHciEGoiFyABc0EYdyIBIA1qIg0gCyAYIAdqIAQgCHNBGXciCGoiB2ogByAOc0EQdyIHIA9qIg8gCHNBFHciCGoiDnM2AgQgACAOIAdzQRh3IgcgD2oiDyAXczYCDCAAIAkgBXNBGHciBSAVaiIOIBNzNgIAIAAgAiARc0EZdyAFczYCFCAAIA0gEHNBGXcgB3M2AhAgACAOIAZzQRl3IAxzNgIcIAAgDyAIc0EZdyABczYCGAvqEQEYfyMAIQIgACgCACEDIAAoAgghBCAAKAIMIQUgACgCBCEGIAJBwABrIgJBGGoiB0IANwMAIAJBIGoiCEIANwMAIAJBOGoiCUIANwMAIAJBMGoiCkIANwMAIAJBKGoiC0IANwMAIAJBCGoiDCABKQAINwMAIAJBEGoiDSABKQAQNwMAIAcgASgAGCIONgIAIAggASgAICIPNgIAIAIgASkAADcDACACIAEoABwiEDYCHCACIAEoACQiETYCJCALIAEoACgiEjYCACACIAEoACwiCzYCLCAKIAEoADAiEzYCACACIAEoADQiCjYCNCAJIAEoADgiFDYCACACIAEoADwiCTYCPCAAIAMgDSgCACINIA8gEyACKAIAIhUgESAKIAIoAgQiFiACKAIUIhcgCiARIBcgFiATIA8gDSAGIBUgAyAEIAZxaiAFIAZBf3NxampB+Miqu31qQQd3aiIBaiAGIAIoAgwiGGogBCAMKAIAIgxqIAUgFmogASAGcWogBCABQX9zcWpB1u6exn5qQQx3IAFqIgIgAXFqIAYgAkF/c3FqQdvhgaECakERdyACaiIHIAJxaiABIAdBf3NxakHunfeNfGpBFncgB2oiASAHcWogAiABQX9zcWpBr5/wq39qQQd3IAFqIghqIBAgAWogDiAHaiAXIAJqIAggAXFqIAcgCEF/c3FqQaqMn7wEakEMdyAIaiICIAhxaiABIAJBf3NxakGTjMHBempBEXcgAmoiASACcWogCCABQX9zcWpBgaqaampBFncgAWoiByABcWogAiAHQX9zcWpB2LGCzAZqQQd3IAdqIghqIAsgB2ogEiABaiARIAJqIAggB3FqIAEgCEF/c3FqQa/vk9p4akEMdyAIaiICIAhxaiAHIAJBf3NxakGxt31qQRF3IAJqIgEgAnFqIAggAUF/c3FqQb6v88p4akEWdyABaiIHIAFxaiACIAdBf3NxakGiosDcBmpBB3cgB2oiCGogFCABaiAKIAJqIAgg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AgggAUEAKQKckUA3AkwgAUHUAGpBACkCpJFANwIAIAFB3ABqQQApAqyRQDcCACABQeQAakEAKQK0kUA3AgAMBQsgASgCBCIBQgA3AwAgAUEANgIIIAFBACkCvJFANwJMIAFB1ABqQQApAsSRQDcCACABQdwAakEAKQLMkUA3AgAgAUHkAGpBACkC1JFANwIADAQLIAEoAgQiAUIANwMIIAFCADcDACABQQA2AlAgAUEAKQPgkUA3AxAgAUEYakEAKQPokUA3AwAgAUEgakEAKQPwkUA3AwAgAUEoakEAKQP4kUA3AwAgAUEwakEAKQOAkkA3AwAgAUE4akEAKQOIkkA3AwAgAUHAAGpBACkDkJJANwMAIAFByABqQQApA5iSQDcDAAwDCyABKAIEIgFCADcDCCABQgA3AwAgAUEANgJQIAFBACkDoJJANwMQIAFBGGpBACkDqJJANwMAIAFBIGpBACkDsJJANwMAIAFBKGpBACkDuJJANwMAIAFBMGpBACkDwJJANwMAIAFBOGpBACkDyJJANwMAIAFBwABqQQApA9CSQDcDACABQcgAakEAKQPYkkA3AwAMAgsgASgCBEEAQcwBEGYaDAELIAEoAgRBAEHMARBmGgsgAEEANgIADwsQgQEACxCCAQAL/AkCEH8EfiMAQZABayICJAACQAJAAkAgASgCkAEiA0UNAAJAAkACQAJAIAFB6QBqLQAAIgRBBnRBACABLQBoIgVrRw0AIANBfmohBiADQQFNDQYgAkEQaiABQfgAaikDADcDACACQRhqIAFBgAFqKQMANwMAIAJBIGogAUGIAWopAwA3AwAgAkEwaiABQZQBaiIHIAZBBXRqIgRBCGopAgA3AwAgAkE4aiAEQRBqKQIANwMAQcAAIQUgAkHAAGogBEEYaikCADcDACACIAEpA3A3AwggAiAEKQIANwMoIANBBXQgB2pBYGoiBCkCACESIAQpAgghEyAEKQIQIRQgAS0AaiEHIAJB4ABqIAQpAhg3AwAgAkHYAGogFDcDACACQdAAaiATNwMAIAJByABqIBI3AwBCACESIAJCADcDACACIAdBBHIiCDoAaSACQcAAOgBoIAZFDQIgAkEIaiEEIAghCQwBCyACQRBqIAFBEGopAwA3AwAgAkEYaiABQRhqKQMANwMAIAJBIGogAUEgaikDADcDACACQTBqIAFBMGopAwA3AwAgAkE4aiABQThqKQMANwMAIAJBwABqIAFBwABqKQMANwMAIAJByABqIAFByABqKQMANwMAIAJB0ABqIAFB0ABqKQMANwMAIAJB2ABqIAFB2ABqKQMANwMAIAJB4ABqIAFB4ABqKQMANwMAIAIgASkDCDcDCCACIAEpAyg3AyggAiABLQBqIgcgBEVyQQJyIgk6AGkgAiAFOgBoIAIgASkDACISNwMAIAdBBHIhCCACQQhqIQQgAyEGC0EBIAZrIQogAUHwAGohCyAGQQV0IAFqQfQAaiEBIAJBKGohByAGQX9qIANPIQwDQCAMDQIgAkHwAGpBGGoiBiAEQRhqIg0pAgA3AwAgAkHwAGpBEGoiDiAEQRBqIg8pAgA3AwAgAkHwAGpBCGoiECAEQQhqIhEpAgA3AwAgAiAEKQIANwNwIAJB8ABqIAcgBSASIAkQGiAQKQMAIRIgDikDACETIAYpAwAhFCACKQNwIRUgDSALQRhqKQMANwMAIA8gC0EQaikDADcDACARIAtBCGopAwA3AwAgBCALKQMANwMAIAcgASkCADcCACAHQQhqIAFBCGopAgA3AgAgB0EQaiABQRBqKQIANwIAIAdBGGogAUEYaikCADcCACACIBQ3A2AgAiATNwNYIAIgEjcDUCACIBU3A0ggAiAIOgBpQcAAIQUgAkHAADoAaEIAIRIgAkIANwMAIAFBYGohASAIIQkgCkEBaiIKQQFHDQALCyAAIAJB8AAQYRoMAgtBACAKayADQayHwAAQWQALIAAgASkDCDcDCCAAIAEpAyg3AyggAEEQaiABQRBqKQMANwMAIABBGGogAUEYaikDADcDACAAQSBqIAFBIGopAwA3AwAgAEEwaiABQTBqKQMANwMAIABBOGogAUE4aikDADcDACAAQcAAaiABQcAAaikDADcDACAAQcgAaiABQcgAaikDADcDACAAQdAAaiABQdAAaikDADcDACAAQdgAaiABQdgAaikDADcDACAAQeAAaiABQeAAaikDADcDACABQekAai0AACEEIAEtAGohByAAIAEtAGg6AGggACABKQMANwMAIAAgByAERXJBAnI6AGkLIABBADoAcCACQZABaiQADwsgBiADQZyHwAAQWQALpwgCAX8tfiAAKQPAASECIAApA5gBIQMgACkDcCEEIAApA0ghBSAAKQMgIQYgACkDuAEhByAAKQOQASEIIAApA2ghCSAAKQNAIQogACkDGCELIAApA7ABIQwgACkDiAEhDSAAKQNgIQ4gACkDOCEPIAApAxAhECAAKQOoASERIAApA4ABIRIgACkDWCETIAApAzAhFCAAKQMIIRUgACkDoAEhFiAAKQN4IRcgACkDUCEYIAApAyghGSAAKQMAIRpBwH4hAQNAIAwgDSAOIA8gEIWFhYUiG0IBiSAWIBcgGCAZIBqFhYWFIhyFIh0gFIUhHiACIAcgCCAJIAogC4WFhYUiHyAcQgGJhSIchSEgIAIgAyAEIAUgBoWFhYUiIUIBiSAbhSIbIAqFQjeJIiIgH0IBiSARIBIgEyAUIBWFhYWFIgqFIh8gEIVCPokiI0J/hYMgHSARhUICiSIkhSECICIgISAKQgGJhSIQIBeFQimJIiEgBCAchUIniSIlQn+Fg4UhESAbIAeFQjiJIiYgHyANhUIPiSInQn+FgyAdIBOFQgqJIiiFIQ0gKCAQIBmFQiSJIilCf4WDIAYgHIVCG4kiKoUhFyAQIBaFQhKJIhYgHyAPhUIGiSIrIB0gFYVCAYkiLEJ/hYOFIQQgAyAchUIIiSItIBsgCYVCGYkiLkJ/hYMgK4UhEyAFIByFQhSJIhwgGyALhUIciSILQn+FgyAfIAyFQj2JIg+FIQUgCyAPQn+FgyAdIBKFQi2JIh2FIQogECAYhUIDiSIVIA8gHUJ/hYOFIQ8gHSAVQn+FgyAchSEUIAsgFSAcQn+Fg4UhGSAbIAiFQhWJIh0gECAahSIcICBCDokiG0J/hYOFIQsgGyAdQn+FgyAfIA6FQiuJIh+FIRAgHSAfQn+FgyAeQiyJIh2FIRUgAUH4kMAAaikDACAcIB8gHUJ/hYOFhSEaICYgKSAqQn+Fg4UiHyEDIB0gHEJ/hYMgG4UiHSEGICEgIyAkQn+Fg4UiHCEHICogJkJ/hYMgJ4UiGyEIICwgFkJ/hYMgLYUiJiEJICQgIUJ/hYMgJYUiJCEMIC4gFiAtQn+Fg4UiISEOICkgJyAoQn+Fg4UiJyESICUgIkJ/hYMgI4UiIiEWIC4gK0J/hYMgLIUiIyEYIAFBCGoiAQ0ACyAAICI3A6ABIAAgFzcDeCAAICM3A1AgACAZNwMoIAAgGjcDACAAIBE3A6gBIAAgJzcDgAEgACATNwNYIAAgFDcDMCAAIBU3AwggACAkNwOwASAAIA03A4gBIAAgITcDYCAAIA83AzggACAQNwMQIAAgHDcDuAEgACAbNwOQASAAICY3A2ggACAKNwNAIAAgCzcDGCAAIAI3A8ABIAAgHzcDmAEgACAENwNwIAAgBTcDSCAAIB03AyALsQgBCn8gACgCECEDAkACQAJAAkAgACgCCCIEQQFGDQAgA0EBRg0BIAAoAhggASACIABBHGooAgAoAgwRCAAhAwwDCyADQQFHDQELIAEgAmohBQJAAkACQCAAQRRqKAIAIgYNAEEAIQcgASEDDAELQQAhByABIQMDQCADIgggBUYNAiAIQQFqIQMCQCAILAAAIglBf0oNACAJQf8BcSEJAkACQCADIAVHDQBBACEKIAUhAwwBCyAIQQJqIQMgCC0AAUE/cSEKCyAJQeABSQ0AAkACQCADIAVHDQBBACELIAUhDAwBCyADQQFqIQwgAy0AAEE/cSELCwJAIAlB8AFPDQAgDCEDDAELAkACQCAMIAVHDQBBACEMIAUhAwwBCyAMQQFqIQMgDC0AAEE/cSEMCyAKQQx0IAlBEnRBgIDwAHFyIAtBBnRyIAxyQYCAxABGDQMLIAcgCGsgA2ohByAGQX9qIgYNAAsLIAMgBUYNAAJAIAMsAAAiCEF/Sg0AAkACQCADQQFqIAVHDQBBACEDIAUhBgwBCyADQQJqIQYgAy0AAUE/cUEMdCEDCyAIQf8BcUHgAUkNAAJAAkAgBiAFRw0AQQAhBiAFIQkMAQsgBkEBaiEJIAYtAABBP3FBBnQhBgsgCEH/AXFB8AFJDQAgCEH/AXEhCAJAAkAgCSAFRw0AQQAhBQwBCyAJLQAAQT9xIQULIAMgCEESdEGAgPAAcXIgBnIgBXJBgIDEAEYNAQsCQAJAAkAgBw0AQQAhCAwBCwJAIAcgAkkNAEEAIQMgAiEIIAcgAkYNAQwCC0EAIQMgByEIIAEgB2osAABBQEgNAQsgCCEHIAEhAwsgByACIAMbIQIgAyABIAMbIQELIARBAUYNACAAKAIYIAEgAiAAQRxqKAIAKAIMEQgADwsCQAJAAkAgAkUNAEEAIQggAiEHIAEhAwNAIAggAy0AAEHAAXFBgAFHaiEIIANBAWohAyAHQX9qIgcNAAsgCCAAKAIMIgVPDQFBACEIIAIhByABIQMDQCAIIAMtAABBwAFxQYABR2ohCCADQQFqIQMgB0F/aiIHDQAMAwsLQQAhCCAAKAIMIgUNAQsgACgCGCABIAIgAEEcaigCACgCDBEIAA8LQQAhAyAFIAhrIgghBgJAAkACQEEAIAAtACAiByAHQQNGG0EDcQ4DAgABAgtBACEGIAghAwwBCyAIQQF2IQMgCEEBakEBdiEGCyADQQFqIQMgAEEcaigCACEHIAAoAgQhCCAAKAIYIQUCQANAIANBf2oiA0UNASAFIAggBygCEBEGAEUNAAtBAQ8LQQEhAyAIQYCAxABGDQAgBSABIAIgBygCDBEIAA0AQQAhAwNAAkAgBiADRw0AIAYgBkkPCyADQQFqIQMgBSAIIAcoAhARBgBFDQALIANBf2ogBkkPCyADC5oIAQp/QQAhAgJAIAFBzP97Sw0AQRAgAUELakF4cSABQQtJGyEDIABBfGoiBCgCACIFQXhxIQYCQAJAAkACQAJAAkACQCAFQQNxRQ0AIABBeGohByAGIANPDQFBACgCiJ5AIAcgBmoiCEYNAkEAKAKEnkAgCEYNAyAIKAIEIgVBAnENBiAFQXhxIgkgBmoiCiADTw0EDAYLIANBgAJJDQUgBiADQQRySQ0FIAYgA2tBgYAITw0FDAQLIAYgA2siAUEQSQ0DIAQgBUEBcSADckECcjYCACAHIANqIgIgAUEDcjYCBCACIAFqIgMgAygCBEEBcjYCBCACIAEQHgwDC0EAKAKAnkAgBmoiBiADTQ0DIAQgBUEBcSADckECcjYCACAHIANqIgEgBiADayICQQFyNgIEQQAgAjYCgJ5AQQAgATYCiJ5ADAILQQAoAvydQCAGaiIGIANJDQICQAJAIAYgA2siAUEPSw0AIAQgBUEBcSAGckECcjYCACAHIAZqIgEgASgCBEEBcjYCBEEAIQFBACECDAELIAQgBUEBcSADckECcjYCACAHIANqIgIgAUEBcjYCBCACIAFqIgMgATYCACADIAMoAgRBfnE2AgQLQQAgAjYChJ5AQQAgATYC/J1ADAELIAogA2shCwJAAkACQCAJQYACSQ0AIAgoAhghCQJAAkAgCCgCDCICIAhHDQAgCEEUQRAgCCgCFCICG2ooAgAiAQ0BQQAhAgwDCyAIKAIIIgEgAjYCDCACIAE2AggMAgsgCEEUaiAIQRBqIAIbIQYDQCAGIQUCQCABIgJBFGoiBigCACIBDQAgAkEQaiEGIAIoAhAhAQsgAQ0ACyAFQQA2AgAMAQsCQCAIQQxqKAIAIgEgCEEIaigCACICRg0AIAIgATYCDCABIAI2AggMAgtBAEEAKALsmkBBfiAFQQN2d3E2AuyaQAwBCyAJRQ0AAkACQCAIKAIcQQJ0QfycwABqIgEoAgAgCEYNACAJQRBBFCAJKAIQIAhGG2ogAjYCACACRQ0CDAELIAEgAjYCACACDQBBAEEAKALwmkBBfiAIKAIcd3E2AvCaQAwBCyACIAk2AhgCQCAIKAIQIgFFDQAgAiABNgIQIAEgAjYCGAsgCCgCFCIBRQ0AIAJBFGogATYCACABIAI2AhgLAkAgC0EQSQ0AIAQgBCgCAEEBcSADckECcjYCACAHIANqIgEgC0EDcjYCBCABIAtqIgIgAigCBEEBcjYCBCABIAsQHgwBCyAEIAQoAgBBAXEgCnJBAnI2AgAgByAKaiIBIAEoAgRBAXI2AgQLIAAhAgwBCyABEBYiA0UNACADIAAgAUF8QXggBCgCACICQQNxGyACQXhxaiICIAIgAUsbEGEhASAAEB0gAQ8LIAIL1gcCB38BfiMAQcAAayICJAAgABAsIAJBOGoiAyAAQcgAaikDADcDACACQTBqIgQgAEHAAGopAwA3AwAgAkEoaiIFIABBOGopAwA3AwAgAkEgaiIGIABBMGopAwA3AwAgAkEYaiIHIABBKGopAwA3AwAgAkEQaiIIIABBIGopAwA3AwAgAkEIaiAAQRhqKQMAIgk3AwAgASAJQjiGIAlCKIZCgICAgICAwP8Ag4QgCUIYhkKAgICAgOA/gyAJQgiGQoCAgIDwH4OEhCAJQgiIQoCAgPgPgyAJQhiIQoCA/AeDhCAJQiiIQoD+A4MgCUI4iISEhDcACCABIAApAxAiCUI4hiAJQiiGQoCAgICAgMD/AIOEIAlCGIZCgICAgIDgP4MgCUIIhkKAgICA8B+DhIQgCUIIiEKAgID4D4MgCUIYiEKAgPwHg4QgCUIoiEKA/gODIAlCOIiEhIQ3AAAgAiAJNwMAIAEgCCkDACIJQjiGIAlCKIZCgICAgICAwP8Ag4QgCUIYhkKAgICAgOA/gyAJQgiGQoCAgIDwH4OEhCAJQgiIQoCAgPgPgyAJQhiIQoCA/AeDhCAJQiiIQoD+A4MgCUI4iISEhDcAECABIAcpAwAiCUI4hiAJQiiGQoCAgICAgMD/AIOEIAlCGIZCgICAgIDgP4MgCUIIhkKAgICA8B+DhIQgCUIIiEKAgID4D4MgCUIYiEKAgPwHg4QgCUIoiEKA/gODIAlCOIiEhIQ3ABggASAGKQMAIglCOIYgCUIohkKAgICAgIDA/wCDhCAJQhiGQoCAgICA4D+DIAlCCIZCgICAgPAfg4SEIAlCCIhCgICA+A+DIAlCGIhCgID8B4OEIAlCKIhCgP4DgyAJQjiIhISENwAgIAEgBSkDACIJQjiGIAlCKIZCgICAgICAwP8Ag4QgCUIYhkKAgICAgOA/gyAJQgiGQoCAgIDwH4OEhCAJQgiIQoCAgPgPgyAJQhiIQoCA/AeDhCAJQiiIQoD+A4MgCUI4iISEhDcAKCABIAQpAwAiCUI4hiAJQiiGQoCAgICAgMD/AIOEIAlCGIZCgICAgIDgP4MgCUIIhkKAgICA8B+DhIQgCUIIiEKAgID4D4MgCUIYiEKAgPwHg4QgCUIoiEKA/gODIAlCOIiEhIQ3ADAgASADKQMAIglCOIYgCUIohkKAgICAgIDA/wCDhCAJQhiGQoCAgICA4D+DIAlCCIZCgICAgPAfg4SEIAlCCIhCgICA+A+DIAlCGIhCgID8B4OEIAlCKIhCgP4DgyAJQjiIhISENwA4IAJBwABqJAALtAYBFX8jAEGwAWsiAiQAAkACQAJAIAAoApABIgMgAXunIgRNDQAgA0F/aiEFIABB8ABqIQYgA0EFdCAAakHUAGohByACQShqIQggAkEIaiEJIAJB8ABqQSBqIQogA0F+akE3SSELA0AgACAFNgKQASAFRQ0CIAAgBUF/aiIMNgKQASAALQBqIQ0gAkHwAGpBGGoiAyAHQRhqIg4pAAA3AwAgAkHwAGpBEGoiDyAHQRBqIhApAAA3AwAgAkHwAGpBCGoiESAHQQhqIhIpAAA3AwAgCiAHQSBqKQAANwAAIApBCGogB0EoaikAADcAACAKQRBqIAdBMGopAAA3AAAgCkEYaiAHQThqKQAANwAAIAkgBikDADcDACAJQQhqIAZBCGoiEykDADcDACAJQRBqIAZBEGoiFCkDADcDACAJQRhqIAZBGGoiFSkDADcDACACIAcpAAA3A3AgCEE4aiACQfAAakE4aikDADcAACAIQTBqIAJB8ABqQTBqKQMANwAAIAhBKGogAkHwAGpBKGopAwA3AAAgCEEgaiAKKQMANwAAIAhBGGogAykDADcAACAIQRBqIA8pAwA3AAAgCEEIaiARKQMANwAAIAggAikDcDcAACACQcAAOgBoIAIgDUEEciINOgBpIAJCADcDACADIBUpAgA3AwAgDyAUKQIANwMAIBEgEykCADcDACACIAYpAgA3A3AgAkHwAGogCEHAAEIAIA0QGiADKAIAIQMgDygCACEPIBEoAgAhESACKAKMASENIAIoAoQBIRMgAigCfCEUIAIoAnQhFSACKAJwIRYgC0UNAyAHIBY2AgAgB0EcaiANNgIAIA4gAzYCACAHQRRqIBM2AgAgECAPNgIAIAdBDGogFDYCACASIBE2AgAgB0EEaiAVNgIAIAAgBTYCkAEgB0FgaiEHIAwhBSAMIARPDQALCyACQbABaiQADwtBmJnAAEErQYyHwAAQYAALIAIgDTYCjAEgAiADNgKIASACIBM2AoQBIAIgDzYCgAEgAiAUNgJ8IAIgETYCeCACIBU2AnQgAiAWNgJwQeCSwABBKyACQfAAakHUiMAAQdyHwAAQUgALoAUBCn8jAEEwayIDJAAgA0EkaiABNgIAIANBAzoAKCADQoCAgICABDcDCCADIAA2AiBBACEAIANBADYCGCADQQA2AhACQAJAAkACQCACKAIIIgENACACKAIAIQQgAigCBCIFIAJBFGooAgAiASABIAVLGyIGRQ0BIAIoAhAhB0EAIQAgBiEBA0ACQCAEIABqIghBBGooAgAiCUUNACADKAIgIAgoAgAgCSADKAIkKAIMEQgADQQLIAcgAGoiCCgCACADQQhqIAhBBGooAgARBgANAyAAQQhqIQAgAUF/aiIBDQALIAYhAAwBCyACKAIAIQQgAigCBCIFIAJBDGooAgAiCCAIIAVLGyIKRQ0AIAFBEGohACAKIQsgBCEBA0ACQCABQQRqKAIAIghFDQAgAygCICABKAIAIAggAygCJCgCDBEIAA0DCyADIABBDGotAAA6ACggAyAAQXRqKQIAQiCJNwMIIABBCGooAgAhCCACKAIQIQdBACEGQQAhCQJAAkACQCAAQQRqKAIADgMBAAIBCyAIQQN0IQxBACEJIAcgDGoiDCgCBEEFRw0BIAwo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akH//wNxQQF0QfKJwABqLwAAOwAAIANBfGohAyAAQv/B1y9WIQQgByEAIAQNAAsLAkAgB6ciBEHjAEwNACACQQlqIANBfmoiA2ogB6ciBUH//wNxQeQAbiIEQZx/bCAFakH//wNxQQF0QfKJwABqLwAAOwAACwJAAkAgBEEKSA0AIAJBCWogA0F+aiIDaiAEQQF0QfKJwABqLwAAOwAADAELIAJBCWogA0F/aiIDaiAEQTBqOgAACyABQZiZwABBACACQQlqIANqQScgA2sQJyEDIAJBMGokACADC70CAgV/An4jAEEQayIDJAAgACAAKQMAIgggAq1CA4Z8Igk3AwAgAEEIaiIEIAQpAwAgCSAIVK18NwMAAkACQAJAAkACQEGAASAAKAJQIgRrIgUgAksNACAAQRBqIQYCQCAERQ0AIARBgQFPDQUgAEHUAGoiByAEaiABIAUQYRogAEEANgJQIANBCGogBxB5IAYgAygCCCADKAIMEA0gAiAFayECIAEgBWohAQsgBiABIAJBB3YQDSAAQdQAaiABIAJBgH9xaiACQf8AcSICEGEaDAELIAQgAmoiBSAESQ0BIAVBgAFLDQIgAEHQAGogBGpBBGogASACEGEaIAAoAlAgAmohAgsgACACNgJQIANBEGokAA8LIAQgBUGMk8AAEFcACyAFQYABQYyTwAAQVQALIARBgAFBnJPAABBWAAu4AgEDfyMAQRBrIgIkAAJAIAAoAsgBIgNBxwBLDQAgACADakHMAWpBAToAAAJAIANBAWoiBEHIAEYNACAAIARqQcwBakEAQccAIANrEGYaC0EAIQMgAEEANgLIASAAQZMCaiIEIAQtAABBgAFyOgAAA0AgACADaiIEIAQtAAAgBEHMAWotAABzOgAAIANBAWoiA0HIAEcNAAsgABAhIAEgACkAADcAACABQThqIABBOGopAAA3AAAgAUEwaiAAQTBqKQAANwAAIAFBKGogAEEoaikAADcAACABQSBqIABBIGopAAA3AAAgAUEYaiAAQRhqKQAANwAAIAFBEGogAEEQaikAADcAACABQQhqIABBCGopAAA3AAAgAkEQaiQADwtBxZXAAEEXIAJBCGpB3JXAAEHUl8AAEFIAC7gCAQN/IwBBEGsiAiQAAkAgACgCyAEiA0HHAEsNACAAIANqQcwBakEGOgAAAkAgA0EBaiIEQcgARg0AIAAgBGpBzAFqQQBBxwAgA2sQZhoLQQAhAyAAQQA2AsgBIABBkwJqIgQgBC0AAEGAAXI6AAADQCAAIANqIgQgBC0AACAEQcwBai0AAHM6AAAgA0EBaiIDQcgARw0ACyAAECEgASAAKQAANwAAIAFBOGogAEE4aikAADcAACABQTBqIABBMGopAAA3AAAgAUEoaiAAQShqKQAANwAAIAFBIGogAEEgaikAADcAACABQRhqIABBGGopAAA3AAAgAUEQaiAAQRBqKQAANwAAIAFBCGogAEEIaikAADcAACACQRBqJAAPC0HFlcAAQRcgAkEIakHclcAAQZSYwAAQUgALsgIBBX8jAEGgAWsiAiQAIAJBADYCECACQQhqIAJBEGpBBHIgAkHUAGoQeCACKAIQIQMCQCACKAIMIAIoAggiBGsiBUHAACAFQcAASRsiBkUNACAGIQUDQCAEIAEtAAA6AAAgBEEBaiEEIAFBAWohASAFQX9qIgUNAAsgAiADIAZqIgM2AhALAkAgA0E/Sw0AIANBwAAQWgALIAJB2ABqIAJBEGpBxAAQYRogAEE4aiACQZQBaikCADcAACAAQTBqIAJBjAFqKQIANwAAIABBKGogAkGEAWopAgA3AAAgAEEgaiACQfwAaikCADcAACAAQRhqIAJB9ABqKQIANwAAIABBEGogAkHsAGopAgA3AAAgAEEIaiACQeQAaikCADcAACAAIAIpAlw3AAAgAkGgAWokAAudAgEFfyMAQRBrIgMkACAAIAApAwAgAq1CA4Z8NwMAAkACQAJAAkACQEHAACAAKAIIIgRrIgUgAksNACAAQcwAaiEGAkAgBEUNACAEQcEATw0FIABBDGoiByAEaiABIAUQYRogAEEANgIIIANBCGogBxB6IAYgAygCCCADKAIMEBAgAiAFayECIAEgBWohAQsgBiABIAJBBnYQECAAQQxqIAEgAkFAcWogAkE/cSICEGEaDAELIAQgAmoiBSAESQ0BIAVBwABLDQIgAEEIaiAEakEEaiABIAIQYRogACgCCCACaiECCyAAIAI2AgggA0EQaiQADwsgBCAFQYyTwAAQVwALIAVBwABBjJPAABBVAAsgBEHAAEGck8AAEFYAC60CAQN/AkACQAJAAkACQAJAAkAgACgCyAEiAyAAKALMASIEayIFIAJNDQAgBCACaiIDIARJDQEgA0HIAUsNAiABIAAgBGogAhBhGiAAIAM2AswBDwsgAyAESQ0CIANByAFLDQMgASAFaiEDIAEgACAEaiAFEGEaIAAQIQJAIAIgBWsiAiAAKALIASIESQ0AA0AgBEHJAU8NByADIAAgBBBhIQMgABAhIAMgBGohAyACIARrIgIgACgCyAEiBE8NAAsLIAAgAjYCzAEgAkHJAU8NBCADIAAgAhBhGg8LIAQgA0Hck8AAEFcACyADQcgBQdyTwAAQVQALIAQgA0Hsk8AAEFcACyADQcgBQeyTwAAQVQALIAJByAFB/JPAABBVAAsgBEHIAUGMlMAAEFUAC7UDAgJ/AX4jAEEwayICJAACQAJAIAFB/wFxIgNBf2pBP0sNACABrSIEQoD+A4NCgIABVg0BIABBAEGAARBmIgEgAzYCkAMgAUIANwPAASABQbgBakL5wvibkaOz8NsANwMAIAFBsAFqQuv6htq/tfbBHzcDACABQagBakKf2PnZwpHagpt/NwMAIAFBoAFqQtGFmu/6z5SH0QA3AwAgAUGYAWpC8e30+KWn/aelfzcDACABQZABakKr8NP0r+68tzw3AwAgAUGIAWpCu86qptjQ67O7fzcDACABIARCiJL3lf/M+YTqAIUiBDcDgAEgAUGAAmpC+cL4m5Gjs/DbADcDACABQfgBakLr+obav7X2wR83AwAgAUHwAWpCn9j52cKR2oKbfzcDACABQegBakLRhZrv+s+Uh9EANwMAIAFB4AFqQvHt9Pilp/2npX83AwAgAUHYAWpCq/DT9K/uvLc8NwMAIAFB0AFqQrvOqqbY0Ouzu383AwAgASAENwPIASABQYgCakEAQYgBEGYaIAJBMGokAA8LQcODwABBMkHMjcAAEGAAC0Gcg8AAQSdBzI3AABBgAAufAgIEfwF+IABBCGohAiAAKQMAIQYCQAJAAkACQCAAKAIcIgNBwABHDQAgAiAAQSBqEBNBACEDIABBADYCHAwBCyADQT9LDQELIABBIGoiBCADakGAAToAACAAIAAoAhwiBUEBaiIDNgIcAkAgA0HBAE8NACAAQRxqIANqQQRqQQBBPyAFaxBmGgJAQcAAIAAoAhxrQQhPDQAgAiAEEBMgACgCHCIDQcEATw0DIARBACADEGYaCyAAQdgAaiAGQgOGNwMAIAIgBBATIABBADYCHCABIAAoAgg2AAAgASAAQQxqKQIANwAEIAEgAEEUaikCADcADA8LIANBwABBrJPAABBWAAsgA0HAAEG8k8AAEFkACyADQcAAQcyTwAAQVQALmAIBA38jAEEQayICJAACQCAAKALIASIDQecASw0AIAAgA2pBzAFqQQE6AAACQCADQQFqIgRB6ABGDQAgACAEakHMAWpBAEHnACADaxBmGgtBACEDIABBADYCyAEgAEGzAmoiBCAELQAAQYABcjoAAANAIAAgA2oiBCAELQAAIARBzAFqLQAAczoAACADQQFqIgNB6ABHDQALIAAQISABIAApAAA3AAAgAUEoaiAAQShqKQAANwAAIAFBIGogAEEgaikAADcAACABQRhqIABBGGopAAA3AAAgAUEQaiAAQRBqKQAANwAAIAFBCGogAEEIaikAADcAACACQRBqJAAPC0HFlcAAQRcgAkEIakHclcAAQcSXwAAQUgALmAIBA38jAEEQayICJAACQCAAKALIASIDQecASw0AIAAgA2pBzAFqQQY6AAACQCADQQFqIgRB6ABGDQAgACAEakHMAWpBAEHnACADaxBmGgtBACEDIABBADYCyAEgAEGzAmoiBCAELQAAQYABcjoAAANAIAAgA2oiBCAELQAAIARBzAFqLQAAczoAACADQQFqIgNB6ABHDQALIAAQISABIAApAAA3AAAgAUEoaiAAQShqKQAANwAAIAFBIGogAEEgaikAADcAACABQRhqIABBGGopAAA3AAAgAUEQaiAAQRBqKQAANwAAIAFBCGogAEEIaikAADcAACACQRBqJAAPC0HFlcAAQRcgAkEIakHclcAAQYSYwAAQUgALmgICAX8CfiAAKQPAASIEp0H/AHEhAwJAAkACQAJAAkAgBFANACADRQ0BCyAAIANqIAEgAkGAASADayIDIAMgAksbIgMQYRogACkDwAEiBCADrXwiBSAEVA0BIAAgBTcDwAEgAiADayECIAEgA2ohAQsCQCACQYABSQ0AA0AgAEIAEBIgACABQYABEGEiAykDwAEiBEKAAXwiBSAEVA0DIAMgBTcDwAEgAUGAAWohASACQYB/aiICQYABTw0ACwsCQCACRQ0AIABCABASIAAgASACEGEiASkDwAEiBCACrXwiBSAEVA0DIAEgBTcDwAELDwtB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AAsgAiADIAZqIgM2AhALAkAgA0H/AEsNACADQYABEFoACyACQZgBaiACQRBqQYQBEGEaIAAgAkGYAWpBBHJBgAEQYRogAkGgAmokAAvDAQEFfyMAQfACayICJAAgAkEANgIQIAJBCGogAkEQakEEciACQbwBahB4IAIoAhAhAwJAIAIoAgwgAigCCCIEayIFQagBIAVBqAFJGyIGRQ0AIAYhBQNAIAQgAS0AADoAACAEQQFqIQQgAUEBaiEBIAVBf2oiBQ0ACyACIAMgBmoiAzYCEAsCQCADQacBSw0AIANBqAEQWgALIAJBwAFqIAJBEGpBrAEQYRogACACQcABakEEckGoARBhGiACQfACaiQAC84BAQN/IwBBEGsiAiQAAkAgASgCyAEiA0GnAUsNACABIANqQcwBakEfOgAAAkAgA0EBaiIEQagBRg0AIAEgBGpBzAFqQQBBpwEgA2sQZhoLQQAhAyABQQA2AsgBIAFB8wJqIgQgBC0AAEGAAXI6AAADQCABIANqIgQgBC0AACAEQcwBai0AAHM6AAAgA0EBaiIDQagBRw0ACyABECEgACABQcgBEGFCqAE3A8gBIAJBEGokAA8LQcWVwABBFyACQQhqQdyVwABBpJjAABBSAAvOAQEDfyMAQRBrIgIkAAJAIAEoAsgBIgNBhwFLDQAgASADakHMAWpBHzoAAAJAIANBAWoiBEGIAUYNACABIARqQcwBakEAQYcBIANrEGYaC0EAIQMgAUEANgLIASABQdMCaiIEIAQtAABBgAFyOgAAA0AgASADaiIEIAQtAAAgBEHMAWotAABzOgAAIANBAWoiA0GIAUcNAAsgARAhIAAgAUHIARBhQogBNwPIASACQRBqJAAPC0HFlcAAQRcgAkEIakHclcAAQbSYwAAQUgALygECAn8BfiMAQSBrIgQkAAJAAkACQCABRQ0AIAEoAgANASABQQA2AgAgASkCBCEGIAEQHSAEIAY3AwggBEEQaiAEQQhqIAJBAEcgAxAPIARBGGooAgAhAiAEKAIUIQECQCAEKAIQIgNBAUcNACABIAIQACEBCwJAIAQoAghBBEcNACAEKAIMIgUoApABRQ0AIAVBADYCkAELIAQoAgwQHSADDQIgACACNgIEIAAgATYCACAEQSBqJAAPCxCBAQALEIIBAAsgARCEAQALsgEBA38CQAJAAkACQCABEAYiAkEASA0AIAINAUEBIQMMAgsQfAALIAIQFiIDRQ0BIANBfGotAABBA3FFDQAgA0EAIAIQZhoLIAAgAjYCCCAAIAI2AgQgACADNgIAEAciABAIIgQQCSECAkAgBEEkSQ0AIAQQAQsgAiABIAMQCgJAIAJBJEkNACACEAELAkAgAEEkSQ0AIAAQAQsPCyACQQFBACgCvJ5AIgNBBCADGxEFAAALrgEBAX8jAEEQayIGJAACQAJAIAFFDQAgBiABIAMgBCAFIAIoAgwRCwAgBigCACEDAkACQCAGKAIEIgQgBigCCCIBSw0AIAMhAgwBCwJAIAFBAnQiBQ0AQQQhAiAEQQJ0RQ0BIAMQHQwBCyADIAUQIyICRQ0CCyAAIAE2AgQgACACNgIAIAZBEGokAA8LQYSPwABBMBCDAQALIAVBBEEAKAK8nkAiBkEEIAYbEQUAAAuiAQECfyMAQRBrIgQkAAJAAkACQCABRQ0AIAEoAgAiBUF/Rg0BIAEgBUEBajYCACAEIAFBBGogAkEARyADEA4gBEEIaigCACECIAQoAgQhAyAEKAIAQQFGDQIgASABKAIAQX9qNgIAIAAgAjYCBCAAIAM2AgAgBEEQaiQADwsQgQEACxCCAQALIAMgAhAAIQQgASABKAIAQX9qNgIAIAQQhAEAC44BAQF/IwBBEGsiBCQAAkACQAJAIAFFDQAgASgCAA0BIAFBfzYCACAEIAFBBGogAkEARyADEA8gBEEIaigCACECIAQoAgQhAyAEKAIAQQFGDQIgAUEANgIAIAAgAjYCBCAAIAM2AgAgBEEQaiQADwsQgQEACxCCAQALIAMgAhAAIQQgAUEANgIAIAQQhAEAC44BAQJ/IwBBIGsiAiQAIAIgATYCGCACIAE2AhQgAiAANgIQIAIgAkEQahAXIAIoAgQhAAJAAkAgAigCAEEBRg0AIAJBCGooAgAhA0EMEBYiAQ0BQQxBBEEAKAK8nkAiAkEEIAIbEQUAAAsgABCEAQALIAEgAzYCCCABIAA2AgQgAUEANgIAIAJBIGokACABC34BAX8jAEHAAGsiBSQAIAUgATYCDCAFIAA2AgggBSADNgIUIAUgAjYCECAFQSxqQQI2AgAgBUE8akECNgIAIAVCAjcCHCAFQeCMwAA2AhggBUEBNgI0IAUgBUEwajYCKCAFIAVBEGo2AjggBSAFQQhqNgIwIAVBGGogBBBkAAt+AQJ/IwBBMGsiAiQAIAJBFGpBATYCACACQeyIwAA2AhAgAkEBNgIMIAJB5IjAADYCCCABQRxqKAIAIQMgASgCGCEBIAJBLGpBAjYCACACQgI3AhwgAkHgjMAANgIYIAIgAkEIajYCKCABIAMgAkEYahAmIQEgAkEwaiQAIAELfgECfyMAQTBrIgIkACACQRRqQQE2AgAgAkHsiMAANgIQIAJBATYCDCACQeSIwAA2AgggAUEcaigCACEDIAEoAhghASACQSxqQQI2AgAgAkICNwIcIAJB4IzAADYCGCACIAJBCGo2AiggASADIAJBGGoQJiEBIAJBMGokACABC2wBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakEDNgIAIANCAjcCDCADQbyLwAA2AgggA0EDNgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhBkAAtsAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpBAzYCACADQgI3AgwgA0GAjMAANgIIIANBAzYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQZAALbAEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYCACADQSxqQQM2AgAgA0ICNwIMIANBpIzAADYCCCADQQM2AiQgAyADQSBqNgIYIAMgA0EEajYCKCADIAM2AiAgA0EIaiACEGQAC2wBAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakEDNgIAIANCAzcCDCADQfSMwAA2AgggA0EDNgIkIAMgA0EgajYCGCADIAM2AiggAyADQQRqNgIgIANBCGogAhBkAAtsAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpBAzYCACADQgI3AgwgA0GgicAANgIIIANBAzYCJCADIANBIGo2AhggAyADNgIoIAMgA0EEajYCICADQQhqIAIQZAALbwEBfyMAQTBrIgIkACACIAE2AgQgAiAANgIAIAJBHGpBAjYCACACQSxqQQM2AgAgAkICNwIMIAJBrI7AADYCCCACQQM2AiQg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ZCBhbGdvcml0aG1ub24tZGVmYXVsdCBsZW5ndGggc3BlY2lmaWVkIGZvciBub24tZXh0ZW5kYWJsZSBhbGdvcml0aG1jYXBhY2l0eSBvdmVyZmxvdwDwABAAHAAAADACAAAFAAAAbGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5yc0FycmF5VmVjOiBjYXBhY2l0eSBleGNlZWRlZCBpbiBleHRlbmQvZnJvbV9pdGVyAEwBEABQAAAA8AMAAAUAAAB+Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2FycmF5dmVjLTAuNy4xL3NyYy9hcnJheXZlYy5yc2Fzc2VydGlvbiBmYWlsZWQ6IGtrIDw9IFU2NDo6dG9fdXNpemUoKWFzc2VydGlvbiBmYWlsZWQ6IG5uID49IDEgJiYgbm4gPD0gVTY0Ojp0b191c2l6ZSgpAAAACAIQAE0AAAAEAAAAAQAAAH4vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvYmxha2UyLTAuOS4xL3NyYy9ibGFrZTJzLnJzaGFzaCBkYXRhIGxlbmd0aCBvdmVyZmxvd34vLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvYmxha2UzLTEuMC4wL3NyYy9saWIucnMAbgIQAEkAAAC7AQAACQAAAG4CEABJAAAAAwMAABkAAABuAhAASQAAAAUDAAAJAAAAbgIQAEkAAAAFAwAAOAAAAG4CEABJAAAAjwIAAAkAAABhc3NlcnRpb24gZmFpbGVkOiBtaWQgPD0gc2VsZi5sZW4oKQB4ChAATQAAAOMFAAAJAAAAbgIQAEkAAABhAgAACgAAAG4CEABJAAAA2AIAAAkAAABuAhAASQAAAN8CAAAKAAAAbgIQAEkAAACtBAAAFgAAAG4CEABJAAAAvwQAABYAAABuAhAASQAAAPsDAAAyAAAAbgIQAEkAAADwBAAAEgAAAG4CEABJAAAA+gQAABIAAABuAhAASQAAAGcFAAAhAAAAEQAAAAQAAAAEAAAAEgAAAOwDEABVAAAAJwAAACAAAAB+Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0x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dWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvc2hhMy0wLjkuMS9zcmMvbGliLnJzAGQLEABPAAAAGwAAAA0AAABkCxAATwAAACIAAAANAAAAfi8uY2FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9ibG9jay1idWZmZXItMC45LjAvc3JjL2xpYi5ycwD8ChAARwAAAEgAAAABAAAA/AoQAEcAAABPAAAAAQAAAPwKEABHAAAAVgAAAAEAAAD8ChAARwAAAGYAAAABAAAA/AoQAEcAAABtAAAAAQAAAPwKEABHAAAAdAAAAAEAAAD8ChAARwAAAHsAAAABAAAA/AoQAEcAAACDAAAAAQAAAPwKEABHAAAAiQAAAAEAAAB+Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2dlbmVyaWMtYXJyYXktMC4xNC40L3NyYy9saWIucnMAAABjYWxsZWQgYE9wdGlvbjo6dW53cmFwKClgIG9uIGEgYE5vbmVgIHZhbHVlANQMEAAcAAAAAgIAAB4AAABsaWJyYXJ5L3N0ZC9zcmMvcGFuaWNraW5nLnJzBAAAAAAAAABudWxsIHBvaW50ZXIgcGFzc2VkIHRvIHJ1c3RyZWN1cnNpdmUgdXNlIG9mIGFuIG9iamVjdCBkZXRlY3RlZCB3aGljaCB3b3VsZCBsZWFkIHRvIHVuc2FmZSBhbGlhc2luZyBpbiBydXN0AL3CgIAABG5hbWUBssKAgACJAQBFanNfc3lzOjpUeXBlRXJyb3I6Om5ldzo6X193YmdfbmV3X2Y4NWRiZGZiOWNkYmUyZWM6Omg3MDlkY2EyNzFmN2JhYTE2ATt3YXNtX2JpbmRnZW46Ol9fd2JpbmRnZW5fb2JqZWN0X2Ryb3BfcmVmOjpoYmQ5MmI3MDA0NDU4MDI2YQJVanNfc3lzOjpVaW50OEFycmF5OjpieXRlX2xlbmd0aDo6X193YmdfYnl0ZUxlbmd0aF9lMDUxNWJjOTRjZmM1ZGVlOjpoNjVhODc1ZDY3NDNkNWRhYwNVanNfc3lzOjpVaW50OEFycmF5OjpieXRlX29mZnNldDo6X193YmdfYnl0ZU9mZnNldF83N2VlYzg0NzE2YTJlNzM3OjpoMjY1Y2E5ODI5MTFjNzQ1YwRManNfc3lzOjpVaW50OEFycmF5OjpidWZmZXI6Ol9fd2JnX2J1ZmZlcl8xYzU5MThhNGFiNjU2ZmY3OjpoOWYzNzNkMWY1YWIxY2MzNwV5anNfc3lzOjpVaW50OEFycmF5OjpuZXdfd2l0aF9ieXRlX29mZnNldF9hbmRfbGVuZ3RoOjpfX3diZ19uZXd3aXRoYnl0ZW9mZnNldGFuZGxlbmd0aF9lNTdhZDFmMmNlODEyYzAzOjpoOTI4ODg0ZGNkMGQ4NGVkOQZManNfc3lzOjpVaW50OEFycmF5OjpsZW5ndGg6Ol9fd2JnX2xlbmd0aF8yZDU2Y2IzNzA3NWZjZmIxOjpoNjg1ZjJkMDRmZjU4MWI2Mgcyd2FzbV9iaW5kZ2VuOjpfX3diaW5kZ2VuX21lbW9yeTo6aDRmMDFkZTFlYzAwZTRjNDgIVWpzX3N5czo6V2ViQXNzZW1ibHk6Ok1lbW9yeTo6YnVmZmVyOjpfX3diZ19idWZmZXJfOWUxODRkNmY3ODVkZTVlZDo6aDM1ZTVhYmQyYTA4ZjQ4NzEJRmpzX3N5czo6VWludDhBcnJheTo6bmV3OjpfX3diZ19uZXdfZTgxMDEzMTllNGNmOTVmYzo6aGEyZWJkOWZjM2JmNmMwN2MKRmpzX3N5czo6VWludDhBcnJheTo6c2V0OjpfX3diZ19zZXRfZThhZTdiMjczMTRlOGI5ODo6aDNhZmEzODc1YTIxZWQxNDkLMXdhc21fYmluZGdlbjo6X193YmluZGdlbl90aHJvdzo6aGIzZjk1NGFjZWQxZmRjNDcMM3dhc21fYmluZGdlbjo6X193YmluZGdlbl9yZXRocm93OjpoN2RhMGI4MTY1NjEyN2VhYw0vc2hhMjo6c2hhNTEyOjpzb2Z0Ojpjb21wcmVzczo6aDNlNTYyZGI2NWI5NjJiOTQOQGRlbm9fc3RkX3dhc21fY3J5cHRvOjpkaWdlc3Q6OkNvbnRleHQ6OmRpZ2VzdDo6aGM4OGI2YzYyOGYyNTJmMGIPSmRlbm9fc3RkX3dhc21fY3J5cHRvOjpkaWdlc3Q6OkNvbnRleHQ6OmRpZ2VzdF9hbmRfcmVzZXQ6Omg2ODBhY2YyZWVmM2NlMzU4EC9zaGEyOjpzaGEyNTY6OnNvZnQ6OmNvbXByZXNzOjpoYWQzN2JjN2JhNjFhMzUxYRFAZGVub19zdGRfd2FzbV9jcnlwdG86OmRpZ2VzdDo6Q29udGV4dDo6dXBkYXRlOjpoMTQzODVjNTZkMzUyOTg4ORI4Ymxha2UyOjpibGFrZTJiOjpWYXJCbGFrZTJiOjpjb21wcmVzczo6aGIyMzliOTc5YTUyZjU2YTATNnJpcGVtZDE2MDo6YmxvY2s6OnByb2Nlc3NfbXNnX2Jsb2NrOjpoMDQyZDgzNDEwNWVlMjJhYRQ4Ymxha2UyOjpibGFrZTJzOjpWYXJCbGFrZTJzOjpjb21wcmVzczo6aGJkNGFhMjljMmY1ZWQ1N2EVK3NoYTE6OmNvbXByZXNzOjpjb21wcmVzczo6aDRmMDQ5MTJmYWNhOWFmMzcWOmRsbWFsbG9jOjpkbG1hbGxvYzo6RGxtYWxsb2M8QT46Om1hbGxvYzo6aDQ3Nzk3YTUxNjJmOWYwNjcXO2Rlbm9fc3RkX3dhc21fY3J5cHRvOjpEaWdlc3RDb250ZXh0OjpuZXc6Omg5MzBiOTFkZjNhMzQ5N2I0GBNkaWdlc3Rjb250ZXh0X2Nsb25lGS1ibGFrZTM6Ok91dHB1dFJlYWRlcjo6ZmlsbDo6aDkxZDAxM2RhMzU1ZWE3M2QaNmJsYWtlMzo6cG9ydGFibGU6OmNvbXByZXNzX2luX3BsYWNlOjpoZjUwZTMxZWQ1OTczMjA2MRsnbWQ1Ojp1dGlsczo6Y29tcHJlc3M6OmhjN2UyN2I1MGFjZTk0YWE0HDBibGFrZTM6OmNvbXByZXNzX3N1YnRyZWVfd2lkZTo6aGE1NWY0OWYzYjM2NWIyOGIdOGRsbWFsbG9jOjpkbG1hbGxvYzo6RGxtYWxsb2M8QT46OmZyZWU6OmhlMWIwZmJjYTNmZmQ0YjExHkFkbG1hbGxvYzo6ZGxtYWxsb2M6OkRsbWFsbG9jPEE+OjpkaXNwb3NlX2NodW5rOjpoYjQ4OGJkYzllMTQwM2I1ZB8TZGlnZXN0Y29udGV4dF9yZXNldCAvYmxha2UzOjpIYXNoZXI6OmZpbmFsaXplX3hvZjo6aGNlMTE5MmIxOTIxMmY4YzYhIGtlY2Nhazo6ZjE2MDA6Omg5MjVlNzU3MWUxMGIwOTdkIixjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6cGFkOjpoOTdkZjJiY2Y2YzIzNDBiMCMOX19ydXN0X3JlYWxsb2MkYTxzaGEyOjpzaGE1MTI6OlNoYTUxMiBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aGExNDE3YzRmYzRjNTdmN2ElMWJsYWtlMzo6SGFzaGVyOjptZXJnZV9jdl9zdGFjazo6aDk3NTcwNzdiNWM0Zjg5ZjgmI2NvcmU6OmZtdDo6d3JpdGU6OmhlNGIyY2QxOWQxMjFhMzk5JzVjb3JlOjpmbXQ6OkZvcm1hdHRlcjo6cGFkX2ludGVncmFsOjpoOTNkNDQxMTdlMGQwMzU3MihhPHNoYTI6OnNoYTUxMjo6U2hhMzg0IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoM2Y2NzBjMWJmMzEwMjU1ZilXPHNoYTE6OlNoYTEgYXMgZGlnZXN0OjpmaXhlZDo6Rml4ZWRPdXRwdXREaXJ0eT46OmZpbmFsaXplX2ludG9fZGlydHk6OmhiM2Y0MDQ0MWEwNjUxZThjKjRibGFrZTM6OmNvbXByZXNzX3BhcmVudHNfcGFyYWxsZWw6OmgwZGFmZTk2YjY5OGIwNjk2K0NkaWdlc3Q6OnZhcmlhYmxlOjpWYXJpYWJsZU91dHB1dDo6ZmluYWxpemVfYm94ZWQ6OmgzM2QxNzUyZmJjZTI1ZWNmLDJzaGEyOjpzaGE1MTI6OkVuZ2luZTUxMjo6ZmluaXNoOjpoNjRiMTllNjgzZDc1YWNlNC1hPHNoYTI6OnNoYTI1Njo6U2hhMjU2IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoN2RkMjZjNzFhN2FmNDZjYy4yc2hhMjo6c2hhMjU2OjpFbmdpbmUyNTY6OmZpbmlzaDo6aGFkNjE5NWQ0NTA2ZWQ0YmUvLWJsYWtlMzo6Q2h1bmtTdGF0ZTo6dXBkYXRlOjpoYWM4NGNjMWM3YjFkMGMzZDBhPHNoYTI6OnNoYTI1Njo6U2hhMjI0IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoYTY5YmU2YmUwYTA1OThhNTEvY29yZTo6Zm10OjpudW06OmltcDo6Zm10X3U2NDo6aDcxZTYyNGMyZDM5Yjc3MWUyODxEIGFzIGRpZ2VzdDo6ZGlnZXN0OjpEaWdlc3Q+Ojp1cGRhdGU6OmgyOTlhODc2YTZmYWM1ODc3M1w8c2hhMzo6S2VjY2FrNTEyIGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoYmE0ZjRkNzAxYWViOTAxYTRbPHNoYTM6OlNoYTNfNTEyIGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoNjZlNzAyNGQ4ZjE0OTZlNzVuZ2VuZXJpY19hcnJheTo6aW1wbHM6OjxpbXBsIGNvcmU6OmNsb25lOjpDbG9uZSBmb3IgZ2VuZXJpY19hcnJheTo6R2VuZXJpY0FycmF5PFQsTj4+OjpjbG9uZTo6aGJjZjUyZmI5ZDc2NTQyN2M2ODxEIGFzIGRpZ2VzdDo6ZGlnZXN0OjpEaWdlc3Q+Ojp1cGRhdGU6OmhjMjM2OTI5MmE1YjExMGRkN1A8c2hhMzo6cmVhZGVyOjpTaGEzWG9mUmVhZGVyIGFzIGRpZ2VzdDo6eG9mOjpYb2ZSZWFkZXI+OjpyZWFkOjpoOTUwZGVhMDUzOWQ1OTQyYTg7Ymxha2UyOjpibGFrZTJiOjpWYXJCbGFrZTJiOjp3aXRoX3BhcmFtczo6aGFjYjVjODIwMmY5NTI0OWY5YTxyaXBlbWQxNjA6OlJpcGVtZDE2MCBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aDcyYzIxZGU5YTJmYjA3OTI6XDxzaGEzOjpLZWNjYWszODQgYXMgZGlnZXN0OjpmaXhlZDo6Rml4ZWRPdXRwdXREaXJ0eT46OmZpbmFsaXplX2ludG9fZGlydHk6OmgyOTM5NzMyNGI1NjMzOTMwO1s8c2hhMzo6U2hhM18zODQgYXMgZGlnZXN0OjpmaXhlZDo6Rml4ZWRPdXRwdXREaXJ0eT46OmZpbmFsaXplX2ludG9fZGlydHk6OmhlMTBjNWZjZjE1NmQyNzU3PDZibGFrZTI6OmJsYWtlMmI6OlZhckJsYWtlMmI6OnVwZGF0ZTo6aDIyNTAyYzM1YjhiM2EyNmE9VTxtZDU6Ok1kNSBhcyBkaWdlc3Q6OmZpeGVkOjpGaXhlZE91dHB1dERpcnR5Pjo6ZmluYWxpemVfaW50b19kaXJ0eTo6aDI3Mzk0OTRiMmNmODFlMjU+XDxzaGEzOjpLZWNjYWsyMjQgYXMgZGlnZXN0OjpmaXhlZDo6Rml4ZWRPdXRwdXREaXJ0eT46OmZpbmFsaXplX2ludG9fZGlydHk6OmgwMDJmYzdlMzJkMTczN2U0P1w8c2hhMzo6S2VjY2FrMjU2IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoNjQzODI3OTBlYmE2MzUzMUBbPHNoYTM6OlNoYTNfMjI0IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoZWI2NzkzZWE1NjFkNDVlMEFbPHNoYTM6OlNoYTNfMjU2IGFzIGRpZ2VzdDo6Zml4ZWQ6OkZpeGVkT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV9pbnRvX2RpcnR5OjpoYmM5ZTdhOTg0ODNmZjg2YUIGZGlnZXN0Qz5kZW5vX3N0ZF93YXNtX2NyeXB0bzo6RGlnZXN0Q29udGV4dDo6dXBkYXRlOjpoYjdlYTNiN2NkMjE0OTNmYURuZ2VuZXJpY19hcnJheTo6aW1wbHM6OjxpbXBsIGNvcmU6OmNsb25lOjpDbG9uZSBmb3IgZ2VuZXJpY19hcnJheTo6R2VuZXJpY0FycmF5PFQsTj4+OjpjbG9uZTo6aDM5NTdhYzJmNzMyZWM4OTRFbmdlbmVyaWNfYXJyYXk6OmltcGxzOjo8aW1wbCBjb3JlOjpjbG9uZTo6Q2xvbmUgZm9yIGdlbmVyaWNfYXJyYXk6OkdlbmVyaWNBcnJheTxULE4+Pjo6Y2xvbmU6OmhkZWVjMGM1Nzg2M2Y4NDU0Rm5nZW5lcmljX2FycmF5OjppbXBsczo6PGltcGwgY29yZTo6Y2xvbmU6OkNsb25lIGZvciBnZW5lcmljX2FycmF5OjpHZW5lcmljQXJyYXk8VCxOPj46OmNsb25lOjpoNjNkYThlYjYyYTliOTcxM0duZ2VuZXJpY19hcnJheTo6aW1wbHM6OjxpbXBsIGNvcmU6OmNsb25lOjpDbG9uZSBmb3IgZ2VuZXJpY19hcnJheTo6R2VuZXJpY0FycmF5PFQsTj4+OjpjbG9uZTo6aDkwNDk2YWM3ZTI4NDc1NTJIbmdlbmVyaWNfYXJyYXk6OmltcGxzOjo8aW1wbCBjb3JlOjpjbG9uZTo6Q2xvbmUgZm9yIGdlbmVyaWNfYXJyYXk6OkdlbmVyaWNBcnJheTxULE4+Pjo6Y2xvbmU6Omg2MTEzOTkwZjljNThjYzMzSW5nZW5lcmljX2FycmF5OjppbXBsczo6PGltcGwgY29yZTo6Y2xvbmU6OkNsb25lIGZvciBnZW5lcmljX2FycmF5OjpHZW5lcmljQXJyYXk8VCxOPj46OmNsb25lOjpoZDYwODQ5NTllYjY0YjQ3OEpdPHNoYTM6OlNoYWtlMTI4IGFzIGRpZ2VzdDo6eG9mOjpFeHRlbmRhYmxlT3V0cHV0RGlydHk+OjpmaW5hbGl6ZV94b2ZfZGlydHk6Omg1MjMxNTEzODA5MzQ5ZjZjS108c2hhMzo6U2hha2UyNTYgYXMgZGlnZXN0Ojp4b2Y6OkV4dGVuZGFibGVPdXRwdXREaXJ0eT46OmZpbmFsaXplX3hvZl9kaXJ0eTo6aDk4MzliN2M5YzNjNDY5Y2VMG2RpZ2VzdGNvbnRleHRfZGlnZXN0QW5kRHJvcE0tanNfc3lzOjpVaW50OEFycmF5Ojp0b192ZWM6Omg1Y2U2YjY2NDY0MTIxMWMzTj93YXNtX2JpbmRnZW46OmNvbnZlcnQ6OmNsb3N1cmVzOjppbnZva2UzX211dDo6aGJjZWViODU0YzdiMThlYTZPFGRpZ2VzdGNvbnRleHRfZGlnZXN0UBxkaWdlc3Rjb250ZXh0X2RpZ2VzdEFuZFJlc2V0URFkaWdlc3Rjb250ZXh0X25ld1IuY29yZTo6cmVzdWx0Ojp1bndyYXBfZmFpbGVkOjpoZTg3YzRkYTQ4NzQ2ZTg5NlNQPGFycmF5dmVjOjplcnJvcnM6OkNhcGFjaXR5RXJyb3I8VD4gYXMgY29yZTo6Zm10OjpEZWJ1Zz46OmZtdDo6aDc4ZTEwNjA4MTVjMTkwOTVUUDxhcnJheXZlYzo6ZXJyb3JzOjpDYXBhY2l0eUVycm9yPFQ+IGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6Omg5YTdkOThjNTFmYzVmY2U1VT9jb3JlOjpzbGljZTo6aW5kZXg6OnNsaWNlX2VuZF9pbmRleF9sZW5fZmFpbDo6aDdlZmIwZjAwZmJjYzkyOGJWQWNvcmU6OnNsaWNlOjppbmRleDo6c2xpY2Vfc3RhcnRfaW5kZXhfbGVuX2ZhaWw6Omg3MDg2MDViYjhmZWJkMmY0Vz1jb3JlOjpzbGljZTo6aW5kZXg6OnNsaWNlX2luZGV4X29yZGVyX2ZhaWw6Omg5OThlNjA1YjRhZjk0YjdiWE5jb3JlOjpzbGljZTo6PGltcGwgW1RdPjo6Y29weV9mcm9tX3NsaWNlOjpsZW5fbWlzbWF0Y2hfZmFpbDo6aGMxZDE4ZmUxZDU4NWMzZTFZNmNvcmU6OnBhbmlja2luZzo6cGFuaWNfYm91bmRzX2NoZWNrOjpoYWFlYzg4OWJhMThkZDY4NVo3Z2VuZXJpY19hcnJheTo6ZnJvbV9pdGVyX2xlbmd0aF9mYWlsOjpoMjU2MTVmNzUzMjViMTgzZls3c3RkOjpwYW5pY2tpbmc6OnJ1c3RfcGFuaWNfd2l0aF9ob29rOjpoMmQ5MDc5NDI3YTJkOTk2YVwuY29yZTo6b3B0aW9uOjpleHBlY3RfZmFpbGVkOjpoNWE5NDhjNTQ5YWU1Mzc0YV0YX193YmdfZGlnZXN0Y29udGV4dF9mcmVlXgZtZW1jbXBfQ2NvcmU6OmZtdDo6Rm9ybWF0dGVyOjpwYWRfaW50ZWdyYWw6OndyaXRlX3ByZWZpeDo6aDQ3ZmE5MWE3YWZmOTRmNWJgKWNvcmU6OnBhbmlja2luZzo6cGFuaWM6OmgzOGNhYzcxMGI1MDQ4Y2EwYQZtZW1jcHliEXJ1c3RfYmVnaW5fdW53aW5kYxRkaWdlc3Rjb250ZXh0X3VwZGF0ZWQtY29yZTo6cGFuaWNraW5nOjpwYW5pY19mbXQ6OmgxZmVhNjIzNzU1ZmZmZWQ3ZUlzdGQ6OnN5c19jb21tb246OmJhY2t0cmFjZTo6X19ydXN0X2VuZF9zaG9ydF9iYWNrdHJhY2U6Omg5MWU3MTE2MDdkOTFiZTUyZgZtZW1zZXRnEV9fd2JpbmRnZW5fbWFsbG9jaD93YXNtX2JpbmRnZW46OmNvbnZlcnQ6OmNsb3N1cmVzOjppbnZva2U0X211dDo6aGY3ZGRhZDU4NmMzNWE2NDBpP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoNTQwYmUwOTk2MTZkNzI4MGo/d2FzbV9iaW5kZ2VuOjpjb252ZXJ0OjpjbG9zdXJlczo6aW52b2tlM19tdXQ6Omg0YTEzOTg3MzhhMGQ3NWJkaz93YXNtX2JpbmRnZW46OmNvbnZlcnQ6OmNsb3N1cmVzOjppbnZva2UzX211dDo6aDFmY2Y1ZjljZjA5Mzg1M2RsP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoMGZiMzM3NzZkYmI4NGFiYW0/d2FzbV9iaW5kZ2VuOjpjb252ZXJ0OjpjbG9zdXJlczo6aW52b2tlM19tdXQ6OmgyMzkwZjRhNTFkMDQ3MmE5bj93YXNtX2JpbmRnZW46OmNvbnZlcnQ6OmNsb3N1cmVzOjppbnZva2UzX211dDo6aDM1ZTYzNTIzNDE5ODU1MjdvP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTNfbXV0OjpoM2E2NmRkYTVjY2RkZjE4NnA/d2FzbV9iaW5kZ2VuOjpjb252ZXJ0OjpjbG9zdXJlczo6aW52b2tlMl9tdXQ6Omg5NGEwYjM1MTEwMThkNjI3cUNzdGQ6OnBhbmlja2luZzo6YmVnaW5fcGFuaWNfaGFuZGxlcjo6e3tjbG9zdXJlfX06Omg0ZTQ5ZjM1MGQ5ZjRkZTM2chJfX3diaW5kZ2VuX3JlYWxsb2NzP3dhc21fYmluZGdlbjo6Y29udmVydDo6Y2xvc3VyZXM6Omludm9rZTFfbXV0OjpoMmE0YWVhM2VhM2EyMjZhM3RFPGJsb2NrX3BhZGRpbmc6OlBhZEVycm9yIGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6Omg3MGZjZDBmNWVhZmM1MTRmdTJjb3JlOjpvcHRpb246Ok9wdGlvbjxUPjo6dW53cmFwOjpoNTg4NDZlYTljYjc2NjZmMXYwPCZUIGFzIGNvcmU6OmZtdDo6RGVidWc+OjpmbXQ6OmhkNjBjYTNmZTQ4MDBlM2NldzI8JlQgYXMgY29yZTo6Zm10OjpEaXNwbGF5Pjo6Zm10OjpoOGVjZDI2Mjc5MTBhMjE4OXhOPEkgYXMgY29yZTo6aXRlcjo6dHJhaXRzOjpjb2xsZWN0OjpJbnRvSXRlcmF0b3I+OjppbnRvX2l0ZXI6OmgzZTMwODVmZjc3OGI5ZTFleS1jb3JlOjpzbGljZTo6cmF3Ojpmcm9tX3JlZjo6aGZlNjZiNjMzZTBkMGM3N2R6LWNvcmU6OnNsaWNlOjpyYXc6OmZyb21fcmVmOjpoYTA5OGI4MGJkZTAyODBkM3sPX193YmluZGdlbl9mcmVlfDRhbGxvYzo6cmF3X3ZlYzo6Y2FwYWNpdHlfb3ZlcmZsb3c6OmhkNjEyZTdlZmExMmMzN2RmfTNhcnJheXZlYzo6YXJyYXl2ZWM6OmV4dGVuZF9wYW5pYzo6aDM1OTExZTY0NzIzZTlkOWR+OWNvcmU6Om9wczo6ZnVuY3Rpb246OkZuT25jZTo6Y2FsbF9vbmNlOjpoZGRlOTUzNDE1ODJlOGEyYX8fX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcoABTmNvcmU6OmZtdDo6bnVtOjppbXA6OjxpbXBsIGNvcmU6OmZtdDo6RGlzcGxheSBmb3IgdTMyPjo6Zm10OjpoZGM0MTczNmM1M2ZjNzk3NIEBMXdhc21fYmluZGdlbjo6X19ydDo6dGhyb3dfbnVsbDo6aDQzYTIwNDMzNTE3ZjdhYTGCATJ3YXNtX2JpbmRnZW46Ol9fcnQ6OmJvcnJvd19mYWlsOjpoZjM2YjBlNjMzMTdlY2Q5ZoMBKndhc21fYmluZGdlbjo6dGhyb3dfc3RyOjpoZjUxYjAyYmU3YzJjODgwY4QBKndhc21fYmluZGdlbjo6dGhyb3dfdmFsOjpoMjU1NTUyOGM3MzYxMTdiYYUBMTxUIGFzIGNvcmU6OmFueTo6QW55Pjo6dHlwZV9pZDo6aDJkNDcxYjk2YmM0Y2JjZmOGAQpydXN0X3BhbmljhwE3c3RkOjphbGxvYzo6ZGVmYXVsdF9hbGxvY19lcnJvcl9ob29rOjpoMGVjY2RhYzI0ZmRhMzc4ZogBb2NvcmU6OnB0cjo6ZHJvcF9pbl9wbGFjZTwmY29yZTo6aXRlcjo6YWRhcHRlcnM6OmNvcGllZDo6Q29waWVkPGNvcmU6OnNsaWNlOjppdGVyOjpJdGVyPHU4Pj4+OjpoZjdiZDA0MzdjM2U4ODYzOQDvgICAAAlwcm9kdWNlcnMCCGxhbmd1YWdlAQRSdXN0AAxwcm9jZXNzZWQtYnkDBXJ1c3RjHTEuNTQuMCAoYTE3OGQwMzIyIDIwMjEtMDctMjYpBndhbHJ1cwYwLjE5LjAMd2FzbS1iaW5kZ2VuBjAuMi43NA=="
);
var crypto_wasm_default = data;

// https://deno.land/std@0.106.0/_wasm_crypto/crypto.js
var heap = new Array(32).fill(void 0);
heap.push(void 0, null, true, false);
function getObject(idx) {
  return heap[idx];
}
var heap_next = heap.length;
function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
var cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true
});
cachedTextDecoder.decode();
var cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
var WASM_VECTOR_LEN = 0;
var cachedTextEncoder = new TextEncoder("utf-8");
var encodeString = function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length);
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code2 = arg.charCodeAt(offset);
    if (code2 > 127) break;
    mem[ptr + offset] = code2;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
var cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}
function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function digest(algorithm, data2, length) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    var ptr0 = passStringToWasm0(
      algorithm,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    var len0 = WASM_VECTOR_LEN;
    wasm.digest(
      retptr,
      ptr0,
      len0,
      addHeapObject(data2),
      !isLikeNone(length),
      isLikeNone(length) ? 0 : length
    );
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}
var DigestContextFinalization = new FinalizationRegistry(
  (ptr) => wasm.__wbg_digestcontext_free(ptr)
);
var DigestContext = class _DigestContext {
  static __wrap(ptr) {
    const obj = Object.create(_DigestContext.prototype);
    obj.ptr = ptr;
    DigestContextFinalization.register(obj, obj.ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DigestContextFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_digestcontext_free(ptr);
  }
  /**
    * Creates a new context incrementally computing a digest using the given
    * hash algorithm.
    *
    * An error will be thrown if `algorithm` is not a supported hash algorithm.
    * @param {string} algorithm
    */
  constructor(algorithm) {
    var ptr0 = passStringToWasm0(
      algorithm,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.digestcontext_new(ptr0, len0);
    return _DigestContext.__wrap(ret);
  }
  /**
    * Update the digest's internal state with the additional input `data`.
    *
    * If the `data` array view is large, it will be split into subarrays (via
    * JavaScript bindings) which will be processed sequentially in order to
    * limit the amount of memory that needs to be allocated in the WASM heap.
    * @param {Uint8Array} data
    */
  update(data2) {
    wasm.digestcontext_update(this.ptr, addHeapObject(data2));
  }
  /**
    * Returns the digest of the input data so far. This may be called repeatedly
    * without side effects.
    *
    * `length` will usually be left `undefined` to use the default length for
    * the algorithm. For algorithms with variable-length output, it can be used
    * to specify a non-negative integer number of bytes.
    *
    * An error will be thrown if `algorithm` is not a supported hash algorithm or
    * `length` is not a supported length for the algorithm.
    * @param {number | undefined} length
    * @returns {Uint8Array}
    */
  digest(length) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.digestcontext_digest(
        retptr,
        this.ptr,
        !isLikeNone(length),
        isLikeNone(length) ? 0 : length
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
    * Returns the digest of the input data so far, and resets this context to
    * its initial state, as though it has not yet been provided with any input
    * data. (It will still use the same algorithm.)
    *
    * `length` will usually be left `undefined` to use the default length for
    * the algorithm. For algorithms with variable-length output, it can be used
    * to specify a non-negative integer number of bytes.
    *
    * An error will be thrown if `algorithm` is not a supported hash algorithm or
    * `length` is not a supported length for the algorithm.
    * @param {number | undefined} length
    * @returns {Uint8Array}
    */
  digestAndReset(length) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.digestcontext_digestAndReset(
        retptr,
        this.ptr,
        !isLikeNone(length),
        isLikeNone(length) ? 0 : length
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
    * Returns the digest of the input data so far, and then drops the context
    * from memory on the WASM side. This context must no longer be used, and any
    * further method calls will result in null pointer errors being thrown.
    * https://github.com/rustwasm/wasm-bindgen/blob/bf39cfd8/crates/backend/src/codegen.rs#L186
    *
    * `length` will usually be left `undefined` to use the default length for
    * the algorithm. For algorithms with variable-length output, it can be used
    * to specify a non-negative integer number of bytes.
    *
    * An error will be thrown if `algorithm` is not a supported hash algorithm or
    * `length` is not a supported length for the algorithm.
    * @param {number | undefined} length
    * @returns {Uint8Array}
    */
  digestAndDrop(length) {
    try {
      const ptr = this.__destroy_into_raw();
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.digestcontext_digestAndDrop(
        retptr,
        ptr,
        !isLikeNone(length),
        isLikeNone(length) ? 0 : length
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
    * Resets this context to its initial state, as though it has not yet been
    * provided with any input data. (It will still use the same algorithm.)
    */
  reset() {
    wasm.digestcontext_reset(this.ptr);
  }
  /**
    * Returns a new `DigestContext` that is a copy of this one, i.e., using the
    * same algorithm and with a copy of the same internal state.
    *
    * This may be a more efficient option for computing multiple digests that
    * start with a common prefix.
    * @returns {DigestContext}
    */
  clone() {
    var ret = wasm.digestcontext_clone(this.ptr);
    return _DigestContext.__wrap(ret);
  }
};
var imports = {
  __wbindgen_placeholder__: {
    __wbg_new_f85dbdfb9cdbe2ec: function(arg0, arg1) {
      var ret = new TypeError(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbindgen_object_drop_ref: function(arg0) {
      takeObject(arg0);
    },
    __wbg_byteLength_e0515bc94cfc5dee: function(arg0) {
      var ret = getObject(arg0).byteLength;
      return ret;
    },
    __wbg_byteOffset_77eec84716a2e737: function(arg0) {
      var ret = getObject(arg0).byteOffset;
      return ret;
    },
    __wbg_buffer_1c5918a4ab656ff7: function(arg0) {
      var ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    },
    __wbg_newwithbyteoffsetandlength_e57ad1f2ce812c03: function(arg0, arg1, arg2) {
      var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_length_2d56cb37075fcfb1: function(arg0) {
      var ret = getObject(arg0).length;
      return ret;
    },
    __wbindgen_memory: function() {
      var ret = wasm.memory;
      return addHeapObject(ret);
    },
    __wbg_buffer_9e184d6f785de5ed: function(arg0) {
      var ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    },
    __wbg_new_e8101319e4cf95fc: function(arg0) {
      var ret = new Uint8Array(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_set_e8ae7b27314e8b98: function(arg0, arg1, arg2) {
      getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    },
    __wbindgen_throw: function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbindgen_rethrow: function(arg0) {
      throw takeObject(arg0);
    }
  }
};
var wasmModule = new WebAssembly.Module(crypto_wasm_default);
var wasmInstance = new WebAssembly.Instance(wasmModule, imports);
var wasm = wasmInstance.exports;
var _wasm = wasm;
var _wasmModule = wasmModule;
var _wasmInstance = wasmInstance;
var _wasmBytes = crypto_wasm_default;

// https://deno.land/std@0.106.0/_wasm_crypto/mod.ts
var digestAlgorithms = [
  "BLAKE2B-256",
  "BLAKE2B-384",
  "BLAKE2B",
  "BLAKE2S",
  "BLAKE3",
  "KECCAK-224",
  "KECCAK-256",
  "KECCAK-384",
  "KECCAK-512",
  "SHA-384",
  "SHA3-224",
  "SHA3-256",
  "SHA3-384",
  "SHA3-512",
  "SHAKE128",
  "SHAKE256",
  // insecure (length-extendable):
  "RIPEMD-160",
  "SHA-224",
  "SHA-256",
  "SHA-512",
  // insecure (collidable and length-extendable):
  "MD5",
  "SHA-1"
];

// https://deno.land/std@0.106.0/crypto/mod.ts
var webCrypto = ((crypto) => ({
  getRandomValues: crypto.getRandomValues?.bind(crypto),
  randomUUID: crypto.randomUUID?.bind(crypto),
  subtle: {
    decrypt: crypto.subtle?.decrypt?.bind(crypto.subtle),
    deriveBits: crypto.subtle?.deriveBits?.bind(crypto.subtle),
    deriveKey: crypto.subtle?.deriveKey?.bind(crypto.subtle),
    digest: crypto.subtle?.digest?.bind(crypto.subtle),
    encrypt: crypto.subtle?.encrypt?.bind(crypto.subtle),
    exportKey: crypto.subtle?.exportKey?.bind(crypto.subtle),
    generateKey: crypto.subtle?.generateKey?.bind(crypto.subtle),
    importKey: crypto.subtle?.importKey?.bind(crypto.subtle),
    sign: crypto.subtle?.sign?.bind(crypto.subtle),
    unwrapKey: crypto.subtle?.unwrapKey?.bind(crypto.subtle),
    verify: crypto.subtle?.verify?.bind(crypto.subtle),
    wrapKey: crypto.subtle?.wrapKey?.bind(crypto.subtle)
  }
}))(globalThis.crypto);
var bufferSourceBytes = (data2) => {
  let bytes;
  if (data2 instanceof Uint8Array) {
    bytes = data2;
  } else if (ArrayBuffer.isView(data2)) {
    bytes = new Uint8Array(
      data2.buffer,
      data2.byteOffset,
      data2.byteLength
    );
  } else if (data2 instanceof ArrayBuffer) {
    bytes = new Uint8Array(data2);
  }
  return bytes;
};
var stdCrypto = /* @__PURE__ */ ((x) => x)({
  ...webCrypto,
  subtle: {
    ...webCrypto.subtle,
    /**
     * Returns a new `Promise` object that will digest `data` using the specified
     * `AlgorithmIdentifier`.
     */
    async digest(algorithm, data2) {
      const { name, length } = normalizeAlgorithm(algorithm);
      const bytes = bufferSourceBytes(data2);
      if (
        // if the SubtleCrypto interface is available,
        webCrypto.subtle?.digest && // if the algorithm is supported by the WebCrypto standard,
        webCryptoDigestAlgorithms.includes(name) && // and the data is a single buffer,
        bytes
      ) {
        return webCrypto.subtle.digest(
          algorithm,
          bytes
        );
      } else if (digestAlgorithms.includes(name)) {
        if (bytes) {
          return stdCrypto.subtle.digestSync(algorithm, bytes);
        } else if (data2[Symbol.iterator]) {
          return stdCrypto.subtle.digestSync(
            algorithm,
            data2
          );
        } else if (data2[Symbol.asyncIterator]) {
          const context = new crypto_exports.DigestContext(name);
          for await (const chunk of data2) {
            const chunkBytes = bufferSourceBytes(chunk);
            if (!chunkBytes) {
              throw new TypeError("data contained chunk of the wrong type");
            }
            context.update(chunkBytes);
          }
          return context.digestAndDrop(length);
        } else {
          throw new TypeError(
            "data must be a BufferSource or [Async]Iterable<BufferSource>"
          );
        }
      } else if (webCrypto.subtle?.digest) {
        return await webCrypto.subtle.digest(
          algorithm,
          data2
        );
      } else {
        throw new TypeError(`unsupported digest algorithm: ${algorithm}`);
      }
    },
    /**
     * Returns a ArrayBuffer with the result of digesting `data` using the
     * specified `AlgorithmIdentifier`.
     */
    digestSync(algorithm, data2) {
      algorithm = normalizeAlgorithm(algorithm);
      const bytes = bufferSourceBytes(data2);
      if (bytes) {
        return crypto_exports.digest(algorithm.name, bytes, void 0);
      } else if (data2[Symbol.iterator]) {
        const context = new crypto_exports.DigestContext(algorithm.name);
        for (const chunk of data2) {
          const chunkBytes = bufferSourceBytes(chunk);
          if (!chunkBytes) {
            throw new TypeError("data contained chunk of the wrong type");
          }
          context.update(chunkBytes);
        }
        return context.digestAndDrop(algorithm.length);
      } else {
        throw new TypeError(
          "data must be a BufferSource or Iterable<BufferSource>"
        );
      }
    }
  }
});
var webCryptoDigestAlgorithms = [
  "SHA-384",
  "SHA-256",
  "SHA-512",
  // insecure (length-extendable and collidable):
  "SHA-1"
];
var normalizeAlgorithm = (algorithm) => typeof algorithm === "string" ? { name: algorithm.toUpperCase() } : {
  ...algorithm,
  name: algorithm.name.toUpperCase()
};

// https://deno.land/std@0.106.0/textproto/mod.ts
var CHAR_SPACE = " ".charCodeAt(0);
var CHAR_TAB = "	".charCodeAt(0);
var CHAR_COLON2 = ":".charCodeAt(0);
var WHITESPACES = [CHAR_SPACE, CHAR_TAB];
var decoder = new TextDecoder();
var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
function str(buf) {
  return !buf ? "" : decoder.decode(buf);
}
var TextProtoReader = class {
  constructor(r) {
    this.r = r;
  }
  /** readLine() reads a single line from the TextProtoReader,
   * eliding the final \n or \r\n from the returned string.
   */
  async readLine() {
    const s = await this.readLineSlice();
    return s === null ? null : str(s);
  }
  /** ReadMIMEHeader reads a MIME-style header from r.
   * The header is a sequence of possibly continued Key: Value lines
   * ending in a blank line.
   * The returned map m maps CanonicalMIMEHeaderKey(key) to a
   * sequence of values in the same order encountered in the input.
   *
   * For example, consider this input:
   *
   *	My-Key: Value 1
   *	Long-Key: Even
   *	       Longer Value
   *	My-Key: Value 2
   *
   * Given that input, ReadMIMEHeader returns the map:
   *
   *	map[string][]string{
   *		"My-Key": {"Value 1", "Value 2"},
   *		"Long-Key": {"Even Longer Value"},
   *	}
   */
  async readMIMEHeader() {
    const m3 = new Headers();
    let line;
    let buf = await this.r.peek(1);
    if (buf === null) {
      return null;
    } else if (WHITESPACES.includes(buf[0])) {
      line = await this.readLineSlice();
    }
    buf = await this.r.peek(1);
    if (buf === null) {
      throw new Deno.errors.UnexpectedEof();
    } else if (WHITESPACES.includes(buf[0])) {
      throw new Deno.errors.InvalidData(
        `malformed MIME header initial line: ${str(line)}`
      );
    }
    while (true) {
      const kv = await this.readLineSlice();
      if (kv === null) throw new Deno.errors.UnexpectedEof();
      if (kv.byteLength === 0) return m3;
      let i = kv.indexOf(CHAR_COLON2);
      if (i < 0) {
        throw new Deno.errors.InvalidData(
          `malformed MIME header line: ${str(kv)}`
        );
      }
      const key = str(kv.subarray(0, i));
      if (key == "") {
        continue;
      }
      i++;
      while (i < kv.byteLength && WHITESPACES.includes(kv[i])) {
        i++;
      }
      const value = str(kv.subarray(i)).replace(
        invalidHeaderCharRegex,
        encodeURI
      );
      try {
        m3.append(key, value);
      } catch {
      }
    }
  }
  async readLineSlice() {
    let line = new Uint8Array(0);
    let r = null;
    do {
      r = await this.r.readLine();
      if (r !== null && this.skipSpace(r.line) !== 0) {
        line = concat(line, r.line);
      }
    } while (r !== null && r.more);
    return r === null ? null : line;
  }
  skipSpace(l) {
    let n = 0;
    for (const val of l) {
      if (!WHITESPACES.includes(val)) {
        n++;
      }
    }
    return n;
  }
};

// https://deno.land/std@0.106.0/async/deferred.ts
function deferred() {
  let methods;
  let state = "pending";
  const promise = new Promise((resolve7, reject) => {
    methods = {
      async resolve(value) {
        await value;
        state = "fulfilled";
        resolve7(value);
      },
      // deno-lint-ignore no-explicit-any
      reject(reason) {
        state = "rejected";
        reject(reason);
      }
    };
  });
  Object.defineProperty(promise, "state", { get: () => state });
  return Object.assign(promise, methods);
}

// https://deno.land/std@0.106.0/async/mux_async_iterator.ts
var MuxAsyncIterator = class {
  iteratorCount = 0;
  yields = [];
  // deno-lint-ignore no-explicit-any
  throws = [];
  signal = deferred();
  add(iterable) {
    ++this.iteratorCount;
    this.callIteratorNext(iterable[Symbol.asyncIterator]());
  }
  async callIteratorNext(iterator) {
    try {
      const { value, done } = await iterator.next();
      if (done) {
        --this.iteratorCount;
      } else {
        this.yields.push({ iterator, value });
      }
    } catch (e) {
      this.throws.push(e);
    }
    this.signal.resolve();
  }
  async *iterate() {
    while (this.iteratorCount > 0) {
      await this.signal;
      for (let i = 0; i < this.yields.length; i++) {
        const { iterator, value } = this.yields[i];
        yield value;
        this.callIteratorNext(iterator);
      }
      if (this.throws.length) {
        for (const e of this.throws) {
          throw e;
        }
        this.throws.length = 0;
      }
      this.yields.length = 0;
      this.signal = deferred();
    }
  }
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
};

// https://deno.land/std@0.106.0/http/server.ts
var ServerRequest = class {
  url;
  method;
  proto;
  protoMinor;
  protoMajor;
  headers;
  conn;
  r;
  w;
  #done = deferred();
  #contentLength = void 0;
  #body = void 0;
  #finalized = false;
  get done() {
    return this.#done.then((e) => e);
  }
  /**
   * Value of Content-Length header.
   * If null, then content length is invalid or not given (e.g. chunked encoding).
   */
  get contentLength() {
    if (this.#contentLength === void 0) {
      const cl = this.headers.get("content-length");
      if (cl) {
        this.#contentLength = parseInt(cl);
        if (Number.isNaN(this.#contentLength)) {
          this.#contentLength = null;
        }
      } else {
        this.#contentLength = null;
      }
    }
    return this.#contentLength;
  }
  /**
   * Body of the request.  The easiest way to consume the body is:
   *
   *     const buf: Uint8Array = await readAll(req.body);
   */
  get body() {
    if (!this.#body) {
      if (this.contentLength != null) {
        this.#body = bodyReader(this.contentLength, this.r);
      } else {
        const transferEncoding = this.headers.get("transfer-encoding");
        if (transferEncoding != null) {
          const parts = transferEncoding.split(",").map((e) => e.trim().toLowerCase());
          assert2(
            parts.includes("chunked"),
            'transfer-encoding must include "chunked" if content-length is not set'
          );
          this.#body = chunkedBodyReader(this.headers, this.r);
        } else {
          this.#body = emptyReader();
        }
      }
    }
    return this.#body;
  }
  async respond(r) {
    let err;
    try {
      await writeResponse(this.w, r);
    } catch (e) {
      try {
        this.conn.close();
      } catch {
      }
      err = e;
    }
    this.#done.resolve(err);
    if (err) {
      throw err;
    }
  }
  async finalize() {
    if (this.#finalized) return;
    const body = this.body;
    const buf = new Uint8Array(1024);
    while (await body.read(buf) !== null) {
    }
    this.#finalized = true;
  }
};
var Server = class {
  constructor(listener) {
    this.listener = listener;
  }
  #closing = false;
  #connections = [];
  close() {
    this.#closing = true;
    this.listener.close();
    for (const conn of this.#connections) {
      try {
        conn.close();
      } catch (e) {
        if (!(e instanceof Deno.errors.BadResource)) {
          throw e;
        }
      }
    }
  }
  // Yields all HTTP requests on a single TCP connection.
  async *iterateHttpRequests(conn) {
    const reader = new BufReader(conn);
    const writer = new BufWriter(conn);
    while (!this.#closing) {
      let request;
      try {
        request = await readRequest(conn, reader);
      } catch (error) {
        if (error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof) {
          try {
            await writeResponse(writer, {
              status: 400,
              body: new TextEncoder().encode(`${error.message}\r
\r
`)
            });
          } catch {
          }
        }
        break;
      }
      if (request === null) {
        break;
      }
      request.w = writer;
      yield request;
      const responseError = await request.done;
      if (responseError) {
        this.untrackConnection(request.conn);
        return;
      }
      try {
        await request.finalize();
      } catch {
        break;
      }
    }
    this.untrackConnection(conn);
    try {
      conn.close();
    } catch {
    }
  }
  trackConnection(conn) {
    this.#connections.push(conn);
  }
  untrackConnection(conn) {
    const index = this.#connections.indexOf(conn);
    if (index !== -1) {
      this.#connections.splice(index, 1);
    }
  }
  // Accepts a new TCP connection and yields all HTTP requests that arrive on
  // it. When a connection is accepted, it also creates a new iterator of the
  // same kind and adds it to the request multiplexer so that another TCP
  // connection can be accepted.
  async *acceptConnAndIterateHttpRequests(mux) {
    if (this.#closing) return;
    let conn;
    try {
      conn = await this.listener.accept();
    } catch (error) {
      if (
        // The listener is closed:
        error instanceof Deno.errors.BadResource || // TLS handshake errors:
        error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof || error instanceof Deno.errors.ConnectionReset || error instanceof Deno.errors.NotConnected
      ) {
        return mux.add(this.acceptConnAndIterateHttpRequests(mux));
      }
      throw error;
    }
    this.trackConnection(conn);
    mux.add(this.acceptConnAndIterateHttpRequests(mux));
    yield* this.iterateHttpRequests(conn);
  }
  [Symbol.asyncIterator]() {
    const mux = new MuxAsyncIterator();
    mux.add(this.acceptConnAndIterateHttpRequests(mux));
    return mux.iterate();
  }
};
function _parseAddrFromStr(addr) {
  let url;
  try {
    const host = addr.startsWith(":") ? `0.0.0.0${addr}` : addr;
    url = new URL(`http://${host}`);
  } catch {
    throw new TypeError("Invalid address.");
  }
  if (url.username || url.password || url.pathname != "/" || url.search || url.hash) {
    throw new TypeError("Invalid address.");
  }
  return {
    hostname: url.hostname,
    port: url.port === "" ? 80 : Number(url.port)
  };
}
function serve(addr) {
  if (typeof addr === "string") {
    addr = _parseAddrFromStr(addr);
  }
  const listener = Deno.listen(addr);
  return new Server(listener);
}
function serveTLS(options) {
  const tlsOptions = {
    ...options,
    transport: "tcp"
  };
  const listener = Deno.listenTls(tlsOptions);
  return new Server(listener);
}

// https://deno.land/std@0.106.0/http/http_status.ts
var STATUS_TEXT = /* @__PURE__ */ new Map([
  [100 /* Continue */, "Continue"],
  [101 /* SwitchingProtocols */, "Switching Protocols"],
  [102 /* Processing */, "Processing"],
  [103 /* EarlyHints */, "Early Hints"],
  [200 /* OK */, "OK"],
  [201 /* Created */, "Created"],
  [202 /* Accepted */, "Accepted"],
  [203 /* NonAuthoritativeInfo */, "Non-Authoritative Information"],
  [204 /* NoContent */, "No Content"],
  [205 /* ResetContent */, "Reset Content"],
  [206 /* PartialContent */, "Partial Content"],
  [207 /* MultiStatus */, "Multi-Status"],
  [208 /* AlreadyReported */, "Already Reported"],
  [226 /* IMUsed */, "IM Used"],
  [300 /* MultipleChoices */, "Multiple Choices"],
  [301 /* MovedPermanently */, "Moved Permanently"],
  [302 /* Found */, "Found"],
  [303 /* SeeOther */, "See Other"],
  [304 /* NotModified */, "Not Modified"],
  [305 /* UseProxy */, "Use Proxy"],
  [307 /* TemporaryRedirect */, "Temporary Redirect"],
  [308 /* PermanentRedirect */, "Permanent Redirect"],
  [400 /* BadRequest */, "Bad Request"],
  [401 /* Unauthorized */, "Unauthorized"],
  [402 /* PaymentRequired */, "Payment Required"],
  [403 /* Forbidden */, "Forbidden"],
  [404 /* NotFound */, "Not Found"],
  [405 /* MethodNotAllowed */, "Method Not Allowed"],
  [406 /* NotAcceptable */, "Not Acceptable"],
  [407 /* ProxyAuthRequired */, "Proxy Authentication Required"],
  [408 /* RequestTimeout */, "Request Timeout"],
  [409 /* Conflict */, "Conflict"],
  [410 /* Gone */, "Gone"],
  [411 /* LengthRequired */, "Length Required"],
  [412 /* PreconditionFailed */, "Precondition Failed"],
  [413 /* RequestEntityTooLarge */, "Request Entity Too Large"],
  [414 /* RequestURITooLong */, "Request URI Too Long"],
  [415 /* UnsupportedMediaType */, "Unsupported Media Type"],
  [416 /* RequestedRangeNotSatisfiable */, "Requested Range Not Satisfiable"],
  [417 /* ExpectationFailed */, "Expectation Failed"],
  [418 /* Teapot */, "I'm a teapot"],
  [421 /* MisdirectedRequest */, "Misdirected Request"],
  [422 /* UnprocessableEntity */, "Unprocessable Entity"],
  [423 /* Locked */, "Locked"],
  [424 /* FailedDependency */, "Failed Dependency"],
  [425 /* TooEarly */, "Too Early"],
  [426 /* UpgradeRequired */, "Upgrade Required"],
  [428 /* PreconditionRequired */, "Precondition Required"],
  [429 /* TooManyRequests */, "Too Many Requests"],
  [431 /* RequestHeaderFieldsTooLarge */, "Request Header Fields Too Large"],
  [451 /* UnavailableForLegalReasons */, "Unavailable For Legal Reasons"],
  [500 /* InternalServerError */, "Internal Server Error"],
  [501 /* NotImplemented */, "Not Implemented"],
  [502 /* BadGateway */, "Bad Gateway"],
  [503 /* ServiceUnavailable */, "Service Unavailable"],
  [504 /* GatewayTimeout */, "Gateway Timeout"],
  [505 /* HTTPVersionNotSupported */, "HTTP Version Not Supported"],
  [506 /* VariantAlsoNegotiates */, "Variant Also Negotiates"],
  [507 /* InsufficientStorage */, "Insufficient Storage"],
  [508 /* LoopDetected */, "Loop Detected"],
  [510 /* NotExtended */, "Not Extended"],
  [511 /* NetworkAuthenticationRequired */, "Network Authentication Required"]
]);

// https://deno.land/std@0.106.0/http/_io.ts
var encoder = new TextEncoder();
function emptyReader() {
  return {
    read(_2) {
      return Promise.resolve(null);
    }
  };
}
function bodyReader(contentLength, r) {
  let totalRead = 0;
  let finished = false;
  async function read(buf) {
    if (finished) return null;
    let result;
    const remaining = contentLength - totalRead;
    if (remaining >= buf.byteLength) {
      result = await r.read(buf);
    } else {
      const readBuf = buf.subarray(0, remaining);
      result = await r.read(readBuf);
    }
    if (result !== null) {
      totalRead += result;
    }
    finished = totalRead === contentLength;
    return result;
  }
  return { read };
}
function chunkedBodyReader(h4, r) {
  const tp = new TextProtoReader(r);
  let finished = false;
  const chunks = [];
  async function read(buf) {
    if (finished) return null;
    const [chunk] = chunks;
    if (chunk) {
      const chunkRemaining = chunk.data.byteLength - chunk.offset;
      const readLength = Math.min(chunkRemaining, buf.byteLength);
      for (let i = 0; i < readLength; i++) {
        buf[i] = chunk.data[chunk.offset + i];
      }
      chunk.offset += readLength;
      if (chunk.offset === chunk.data.byteLength) {
        chunks.shift();
        if (await tp.readLine() === null) {
          throw new Deno.errors.UnexpectedEof();
        }
      }
      return readLength;
    }
    const line = await tp.readLine();
    if (line === null) throw new Deno.errors.UnexpectedEof();
    const [chunkSizeString] = line.split(";");
    const chunkSize = parseInt(chunkSizeString, 16);
    if (Number.isNaN(chunkSize) || chunkSize < 0) {
      throw new Deno.errors.InvalidData("Invalid chunk size");
    }
    if (chunkSize > 0) {
      if (chunkSize > buf.byteLength) {
        let eof = await r.readFull(buf);
        if (eof === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        const restChunk = new Uint8Array(chunkSize - buf.byteLength);
        eof = await r.readFull(restChunk);
        if (eof === null) {
          throw new Deno.errors.UnexpectedEof();
        } else {
          chunks.push({
            offset: 0,
            data: restChunk
          });
        }
        return buf.byteLength;
      } else {
        const bufToFill = buf.subarray(0, chunkSize);
        const eof = await r.readFull(bufToFill);
        if (eof === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        if (await tp.readLine() === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        return chunkSize;
      }
    } else {
      assert2(chunkSize === 0);
      if (await r.readLine() === null) {
        throw new Deno.errors.UnexpectedEof();
      }
      await readTrailers(h4, r);
      finished = true;
      return null;
    }
  }
  return { read };
}
function isProhibidedForTrailer(key) {
  const s = /* @__PURE__ */ new Set(["transfer-encoding", "content-length", "trailer"]);
  return s.has(key.toLowerCase());
}
async function readTrailers(headers, r) {
  const trailers = parseTrailer(headers.get("trailer"));
  if (trailers == null) return;
  const trailerNames = [...trailers.keys()];
  const tp = new TextProtoReader(r);
  const result = await tp.readMIMEHeader();
  if (result == null) {
    throw new Deno.errors.InvalidData("Missing trailer header.");
  }
  const undeclared = [...result.keys()].filter(
    (k2) => !trailerNames.includes(k2)
  );
  if (undeclared.length > 0) {
    throw new Deno.errors.InvalidData(
      `Undeclared trailers: ${Deno.inspect(undeclared)}.`
    );
  }
  for (const [k2, v2] of result) {
    headers.append(k2, v2);
  }
  const missingTrailers = trailerNames.filter((k2) => !result.has(k2));
  if (missingTrailers.length > 0) {
    throw new Deno.errors.InvalidData(
      `Missing trailers: ${Deno.inspect(missingTrailers)}.`
    );
  }
  headers.delete("trailer");
}
function parseTrailer(field) {
  if (field == null) {
    return void 0;
  }
  const trailerNames = field.split(",").map((v2) => v2.trim().toLowerCase());
  if (trailerNames.length === 0) {
    throw new Deno.errors.InvalidData("Empty trailer header.");
  }
  const prohibited = trailerNames.filter((k2) => isProhibidedForTrailer(k2));
  if (prohibited.length > 0) {
    throw new Deno.errors.InvalidData(
      `Prohibited trailer names: ${Deno.inspect(prohibited)}.`
    );
  }
  return new Headers(trailerNames.map((key) => [key, ""]));
}
async function writeChunkedBody(w2, r) {
  for await (const chunk of iter(r)) {
    if (chunk.byteLength <= 0) continue;
    const start = encoder.encode(`${chunk.byteLength.toString(16)}\r
`);
    const end = encoder.encode("\r\n");
    await w2.write(start);
    await w2.write(chunk);
    await w2.write(end);
    await w2.flush();
  }
  const endChunk = encoder.encode("0\r\n\r\n");
  await w2.write(endChunk);
}
async function writeTrailers(w2, headers, trailers) {
  const trailer = headers.get("trailer");
  if (trailer === null) {
    throw new TypeError("Missing trailer header.");
  }
  const transferEncoding = headers.get("transfer-encoding");
  if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
    throw new TypeError(
      `Trailers are only allowed for "transfer-encoding: chunked", got "transfer-encoding: ${transferEncoding}".`
    );
  }
  const writer = BufWriter.create(w2);
  const trailerNames = trailer.split(",").map((s) => s.trim().toLowerCase());
  const prohibitedTrailers = trailerNames.filter(
    (k2) => isProhibidedForTrailer(k2)
  );
  if (prohibitedTrailers.length > 0) {
    throw new TypeError(
      `Prohibited trailer names: ${Deno.inspect(prohibitedTrailers)}.`
    );
  }
  const undeclared = [...trailers.keys()].filter(
    (k2) => !trailerNames.includes(k2)
  );
  if (undeclared.length > 0) {
    throw new TypeError(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
  }
  for (const [key, value] of trailers) {
    await writer.write(encoder.encode(`${key}: ${value}\r
`));
  }
  await writer.write(encoder.encode("\r\n"));
  await writer.flush();
}
async function writeResponse(w2, r) {
  const protoMajor = 1;
  const protoMinor = 1;
  const statusCode = r.status || 200;
  const statusText = r.statusText ?? STATUS_TEXT.get(statusCode) ?? null;
  const writer = BufWriter.create(w2);
  if (statusText === null) {
    throw new Deno.errors.InvalidData(
      "Empty statusText (explicitely pass an empty string if this was intentional)"
    );
  }
  if (!r.body) {
    r.body = new Uint8Array();
  }
  if (typeof r.body === "string") {
    r.body = encoder.encode(r.body);
  }
  let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r
`;
  const headers = r.headers ?? new Headers();
  if (r.body && !headers.get("content-length")) {
    if (r.body instanceof Uint8Array) {
      out += `content-length: ${r.body.byteLength}\r
`;
    } else if (!headers.get("transfer-encoding")) {
      out += "transfer-encoding: chunked\r\n";
    }
  }
  for (const [key, value] of headers) {
    out += `${key}: ${value}\r
`;
  }
  out += `\r
`;
  const header = encoder.encode(out);
  const n = await writer.write(header);
  assert2(n === header.byteLength);
  if (r.body instanceof Uint8Array) {
    const n2 = await writer.write(r.body);
    assert2(n2 === r.body.byteLength);
  } else if (headers.has("content-length")) {
    const contentLength = headers.get("content-length");
    assert2(contentLength != null);
    const bodyLength = parseInt(contentLength);
    const n2 = await copy2(r.body, writer);
    assert2(n2 === bodyLength);
  } else {
    await writeChunkedBody(writer, r.body);
  }
  if (r.trailers) {
    const t2 = await r.trailers();
    await writeTrailers(writer, headers, t2);
  }
  await writer.flush();
}
function parseHTTPVersion(vers) {
  switch (vers) {
    case "HTTP/1.1":
      return [1, 1];
    case "HTTP/1.0":
      return [1, 0];
    default: {
      const Big = 1e6;
      if (!vers.startsWith("HTTP/")) {
        break;
      }
      const dot = vers.indexOf(".");
      if (dot < 0) {
        break;
      }
      const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
      const major = Number(majorStr);
      if (!Number.isInteger(major) || major < 0 || major > Big) {
        break;
      }
      const minorStr = vers.substring(dot + 1);
      const minor = Number(minorStr);
      if (!Number.isInteger(minor) || minor < 0 || minor > Big) {
        break;
      }
      return [major, minor];
    }
  }
  throw new Error(`malformed HTTP version ${vers}`);
}
async function readRequest(conn, bufr) {
  const tp = new TextProtoReader(bufr);
  const firstLine = await tp.readLine();
  if (firstLine === null) return null;
  const headers = await tp.readMIMEHeader();
  if (headers === null) throw new Deno.errors.UnexpectedEof();
  const req = new ServerRequest();
  req.conn = conn;
  req.r = bufr;
  [req.method, req.url, req.proto] = firstLine.split(" ", 3);
  [req.protoMajor, req.protoMinor] = parseHTTPVersion(req.proto);
  req.headers = headers;
  fixLength(req);
  return req;
}
function fixLength(req) {
  const contentLength = req.headers.get("Content-Length");
  if (contentLength) {
    const arrClen = contentLength.split(",");
    if (arrClen.length > 1) {
      const distinct = [...new Set(arrClen.map((e) => e.trim()))];
      if (distinct.length > 1) {
        throw Error("cannot contain multiple Content-Length headers");
      } else {
        req.headers.set("Content-Length", distinct[0]);
      }
    }
    const c2 = req.headers.get("Content-Length");
    if (req.method === "HEAD" && c2 && c2 !== "0") {
      throw Error("http: method cannot contain a Content-Length");
    }
    if (c2 && req.headers.has("transfer-encoding")) {
      throw new Error(
        "http: Transfer-Encoding and Content-Length cannot be send together"
      );
    }
  }
}

// https://deno.land/std@0.106.0/ws/mod.ts
function unmask(payload, mask) {
  if (mask) {
    for (let i = 0, len = payload.length; i < len; i++) {
      payload[i] ^= mask[i & 3];
    }
  }
}
async function writeFrame(frame, writer) {
  const payloadLength = frame.payload.byteLength;
  let header;
  const hasMask = frame.mask ? 128 : 0;
  if (frame.mask && frame.mask.byteLength !== 4) {
    throw new Error(
      "invalid mask. mask must be 4 bytes: length=" + frame.mask.byteLength
    );
  }
  if (payloadLength < 126) {
    header = new Uint8Array([128 | frame.opcode, hasMask | payloadLength]);
  } else if (payloadLength < 65535) {
    header = new Uint8Array([
      128 | frame.opcode,
      hasMask | 126,
      payloadLength >>> 8,
      payloadLength & 255
    ]);
  } else {
    header = new Uint8Array([
      128 | frame.opcode,
      hasMask | 127,
      ...sliceLongToBytes(payloadLength)
    ]);
  }
  if (frame.mask) {
    header = concat(header, frame.mask);
  }
  unmask(frame.payload, frame.mask);
  header = concat(header, frame.payload);
  const w2 = BufWriter.create(writer);
  await w2.write(header);
  await w2.flush();
}
async function readFrame(buf) {
  let b3 = await buf.readByte();
  assert2(b3 !== null);
  let isLastFrame = false;
  switch (b3 >>> 4) {
    case 8:
      isLastFrame = true;
      break;
    case 0:
      isLastFrame = false;
      break;
    default:
      throw new Error("invalid signature");
  }
  const opcode = b3 & 15;
  b3 = await buf.readByte();
  assert2(b3 !== null);
  const hasMask = b3 >>> 7;
  let payloadLength = b3 & 127;
  if (payloadLength === 126) {
    const l = await readShort(buf);
    assert2(l !== null);
    payloadLength = l;
  } else if (payloadLength === 127) {
    const l = await readLong(buf);
    assert2(l !== null);
    payloadLength = Number(l);
  }
  let mask;
  if (hasMask) {
    mask = new Uint8Array(4);
    assert2(await buf.readFull(mask) !== null);
  }
  const payload = new Uint8Array(payloadLength);
  assert2(await buf.readFull(payload) !== null);
  return {
    isLastFrame,
    opcode,
    mask,
    payload
  };
}
var WebSocketImpl = class {
  conn;
  mask;
  bufReader;
  bufWriter;
  sendQueue = [];
  constructor({
    conn,
    bufReader,
    bufWriter,
    mask
  }) {
    this.conn = conn;
    this.mask = mask;
    this.bufReader = bufReader || new BufReader(conn);
    this.bufWriter = bufWriter || new BufWriter(conn);
  }
  async *[Symbol.asyncIterator]() {
    const decoder2 = new TextDecoder();
    let frames = [];
    let payloadsLength = 0;
    while (!this._isClosed) {
      let frame;
      try {
        frame = await readFrame(this.bufReader);
      } catch {
        this.ensureSocketClosed();
        break;
      }
      unmask(frame.payload, frame.mask);
      switch (frame.opcode) {
        case 1 /* TextFrame */:
        case 2 /* BinaryFrame */:
        case 0 /* Continue */:
          frames.push(frame);
          payloadsLength += frame.payload.length;
          if (frame.isLastFrame) {
            const concat2 = new Uint8Array(payloadsLength);
            let offs = 0;
            for (const frame2 of frames) {
              concat2.set(frame2.payload, offs);
              offs += frame2.payload.length;
            }
            if (frames[0].opcode === 1 /* TextFrame */) {
              yield decoder2.decode(concat2);
            } else {
              yield concat2;
            }
            frames = [];
            payloadsLength = 0;
          }
          break;
        case 8 /* Close */: {
          const code2 = frame.payload[0] << 8 | frame.payload[1];
          const reason = decoder2.decode(
            frame.payload.subarray(2, frame.payload.length)
          );
          await this.close(code2, reason);
          yield { code: code2, reason };
          return;
        }
        case 9 /* Ping */:
          await this.enqueue({
            opcode: 10 /* Pong */,
            payload: frame.payload,
            isLastFrame: true
          });
          yield ["ping", frame.payload];
          break;
        case 10 /* Pong */:
          yield ["pong", frame.payload];
          break;
        default:
      }
    }
  }
  dequeue() {
    const [entry] = this.sendQueue;
    if (!entry) return;
    if (this._isClosed) return;
    const { d: d3, frame } = entry;
    writeFrame(frame, this.bufWriter).then(() => d3.resolve()).catch((e) => d3.reject(e)).finally(() => {
      this.sendQueue.shift();
      this.dequeue();
    });
  }
  enqueue(frame) {
    if (this._isClosed) {
      throw new Deno.errors.ConnectionReset("Socket has already been closed");
    }
    const d3 = deferred();
    this.sendQueue.push({ d: d3, frame });
    if (this.sendQueue.length === 1) {
      this.dequeue();
    }
    return d3;
  }
  send(data2) {
    const opcode = typeof data2 === "string" ? 1 /* TextFrame */ : 2 /* BinaryFrame */;
    const payload = typeof data2 === "string" ? new TextEncoder().encode(data2) : data2;
    const isLastFrame = true;
    const frame = {
      isLastFrame,
      opcode,
      payload,
      mask: this.mask
    };
    return this.enqueue(frame);
  }
  ping(data2 = "") {
    const payload = typeof data2 === "string" ? new TextEncoder().encode(data2) : data2;
    const frame = {
      isLastFrame: true,
      opcode: 9 /* Ping */,
      mask: this.mask,
      payload
    };
    return this.enqueue(frame);
  }
  _isClosed = false;
  get isClosed() {
    return this._isClosed;
  }
  async close(code2 = 1e3, reason) {
    try {
      const header = [code2 >>> 8, code2 & 255];
      let payload;
      if (reason) {
        const reasonBytes = new TextEncoder().encode(reason);
        payload = new Uint8Array(2 + reasonBytes.byteLength);
        payload.set(header);
        payload.set(reasonBytes, 2);
      } else {
        payload = new Uint8Array(header);
      }
      await this.enqueue({
        isLastFrame: true,
        opcode: 8 /* Close */,
        mask: this.mask,
        payload
      });
    } catch (e) {
      throw e;
    } finally {
      this.ensureSocketClosed();
    }
  }
  closeForce() {
    this.ensureSocketClosed();
  }
  ensureSocketClosed() {
    if (this.isClosed) return;
    try {
      this.conn.close();
    } catch (e) {
      console.error(e);
    } finally {
      this._isClosed = true;
      const rest = this.sendQueue;
      this.sendQueue = [];
      rest.forEach(
        (e) => e.d.reject(
          new Deno.errors.ConnectionReset("Socket has already been closed")
        )
      );
    }
  }
};
function acceptable(req) {
  const upgrade = req.headers.get("upgrade");
  if (!upgrade || upgrade.toLowerCase() !== "websocket") {
    return false;
  }
  const secKey = req.headers.get("sec-websocket-key");
  return req.headers.has("sec-websocket-key") && typeof secKey === "string" && secKey.length > 0;
}
var kGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
function createSecAccept(nonce) {
  return encode(
    stdCrypto.subtle.digestSync("SHA-1", new TextEncoder().encode(nonce + kGUID))
  );
}
async function acceptWebSocket(req) {
  const { conn, headers, bufReader, bufWriter } = req;
  if (acceptable(req)) {
    const sock = new WebSocketImpl({ conn, bufReader, bufWriter });
    const secKey = headers.get("sec-websocket-key");
    if (typeof secKey !== "string") {
      throw new Error("sec-websocket-key is not provided");
    }
    const secAccept = createSecAccept(secKey);
    const newHeaders = new Headers({
      Upgrade: "websocket",
      Connection: "Upgrade",
      "Sec-WebSocket-Accept": secAccept
    });
    const secProtocol = headers.get("sec-websocket-protocol");
    if (typeof secProtocol === "string") {
      newHeaders.set("Sec-WebSocket-Protocol", secProtocol);
    }
    const secVersion = headers.get("sec-websocket-version");
    if (typeof secVersion === "string") {
      newHeaders.set("Sec-WebSocket-Version", secVersion);
    }
    await writeResponse(bufWriter, {
      status: 101,
      headers: newHeaders
    });
    return sock;
  }
  throw new Error("request is not acceptable");
}

// https://deno.land/std@0.106.0/_util/os.ts
var osType2 = (() => {
  const { Deno: Deno3 } = globalThis;
  if (typeof Deno3?.build?.os === "string") {
    return Deno3.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows2 = osType2 === "windows";

// https://deno.land/std@0.106.0/path/win32.ts
var win32_exports2 = {};
__export(win32_exports2, {
  basename: () => basename4,
  delimiter: () => delimiter4,
  dirname: () => dirname4,
  extname: () => extname4,
  format: () => format4,
  fromFileUrl: () => fromFileUrl4,
  isAbsolute: () => isAbsolute4,
  join: () => join5,
  normalize: () => normalize5,
  parse: () => parse4,
  relative: () => relative4,
  resolve: () => resolve4,
  sep: () => sep4,
  toFileUrl: () => toFileUrl4,
  toNamespacedPath: () => toNamespacedPath4
});

// https://deno.land/std@0.106.0/path/_constants.ts
var CHAR_UPPERCASE_A2 = 65;
var CHAR_LOWERCASE_A2 = 97;
var CHAR_UPPERCASE_Z2 = 90;
var CHAR_LOWERCASE_Z2 = 122;
var CHAR_DOT2 = 46;
var CHAR_FORWARD_SLASH2 = 47;
var CHAR_BACKWARD_SLASH2 = 92;
var CHAR_COLON3 = 58;
var CHAR_QUESTION_MARK2 = 63;

// https://deno.land/std@0.106.0/path/_util.ts
function assertPath2(path5) {
  if (typeof path5 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path5)}`
    );
  }
}
function isPosixPathSeparator2(code2) {
  return code2 === CHAR_FORWARD_SLASH2;
}
function isPathSeparator2(code2) {
  return isPosixPathSeparator2(code2) || code2 === CHAR_BACKWARD_SLASH2;
}
function isWindowsDeviceRoot2(code2) {
  return code2 >= CHAR_LOWERCASE_A2 && code2 <= CHAR_LOWERCASE_Z2 || code2 >= CHAR_UPPERCASE_A2 && code2 <= CHAR_UPPERCASE_Z2;
}
function normalizeString2(path5, allowAboveRoot, separator, isPathSeparator3) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code2;
  for (let i = 0, len = path5.length; i <= len; ++i) {
    if (i < len) code2 = path5.charCodeAt(i);
    else if (isPathSeparator3(code2)) break;
    else code2 = CHAR_FORWARD_SLASH2;
    if (isPathSeparator3(code2)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT2 || res.charCodeAt(res.length - 2) !== CHAR_DOT2) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path5.slice(lastSlash + 1, i);
        else res = path5.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code2 === CHAR_DOT2 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format2(sep7, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) return base;
  if (dir === pathObject.root) return dir + base;
  return dir + sep7 + base;
}
var WHITESPACE_ENCODINGS2 = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace2(string) {
  return string.replaceAll(/[\s]/g, (c2) => {
    return WHITESPACE_ENCODINGS2[c2] ?? c2;
  });
}

// https://deno.land/std@0.106.0/path/win32.ts
var sep4 = "\\";
var delimiter4 = ";";
function resolve4(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path5;
    const { Deno: Deno3 } = globalThis;
    if (i >= 0) {
      path5 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path5 = Deno3.cwd();
    } else {
      if (typeof Deno3?.env?.get !== "function" || typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path5 = Deno3.env.get(`=${resolvedDevice}`) || Deno3.cwd();
      if (path5 === void 0 || path5.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path5 = `${resolvedDevice}\\`;
      }
    }
    assertPath2(path5);
    const len = path5.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute7 = false;
    const code2 = path5.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator2(code2)) {
        isAbsolute7 = true;
        if (isPathSeparator2(path5.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator2(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            const firstPart = path5.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator2(path5.charCodeAt(j))) break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator2(path5.charCodeAt(j))) break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path5.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot2(code2)) {
        if (path5.charCodeAt(1) === CHAR_COLON3) {
          device = path5.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator2(path5.charCodeAt(2))) {
              isAbsolute7 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator2(code2)) {
      rootEnd = 1;
      isAbsolute7 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path5.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute7;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString2(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator2
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize5(path5) {
  assertPath2(path5);
  const len = path5.length;
  if (len === 0) return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute7 = false;
  const code2 = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code2)) {
      isAbsolute7 = true;
      if (isPathSeparator2(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          const firstPart = path5.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path5.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot2(code2)) {
      if (path5.charCodeAt(1) === CHAR_COLON3) {
        device = path5.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path5.charCodeAt(2))) {
            isAbsolute7 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator2(code2)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString2(
      path5.slice(rootEnd),
      !isAbsolute7,
      "\\",
      isPathSeparator2
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute7) tail = ".";
  if (tail.length > 0 && isPathSeparator2(path5.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute7) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute7) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute4(path5) {
  assertPath2(path5);
  const len = path5.length;
  if (len === 0) return false;
  const code2 = path5.charCodeAt(0);
  if (isPathSeparator2(code2)) {
    return true;
  } else if (isWindowsDeviceRoot2(code2)) {
    if (len > 2 && path5.charCodeAt(1) === CHAR_COLON3) {
      if (isPathSeparator2(path5.charCodeAt(2))) return true;
    }
  }
  return false;
}
function join5(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0) return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < pathsCount; ++i) {
    const path5 = paths[i];
    assertPath2(path5);
    if (path5.length > 0) {
      if (joined === void 0) joined = firstPart = path5;
      else joined += `\\${path5}`;
    }
  }
  if (joined === void 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert2(firstPart != null);
  if (isPathSeparator2(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator2(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator2(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator2(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize5(joined);
}
function relative4(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to) return "";
  const fromOrig = resolve4(from);
  const toOrig = resolve4(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH2) break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH2) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH2) break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH2) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH2) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH2) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_BACKWARD_SLASH2) lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH2) {
      if (out.length === 0) out += "..";
      else out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH2) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath4(path5) {
  if (typeof path5 !== "string") return path5;
  if (path5.length === 0) return "";
  const resolvedPath = resolve4(path5);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH2) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH2) {
        const code2 = resolvedPath.charCodeAt(2);
        if (code2 !== CHAR_QUESTION_MARK2 && code2 !== CHAR_DOT2) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot2(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON3 && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH2) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path5;
}
function dirname4(path5) {
  assertPath2(path5);
  const len = path5.length;
  if (len === 0) return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code2 = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code2)) {
      rootEnd = offset = 1;
      if (isPathSeparator2(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              return path5;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code2)) {
      if (path5.charCodeAt(1) === CHAR_COLON3) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator2(path5.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator2(code2)) {
    return path5;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator2(path5.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  }
  return path5.slice(0, end);
}
function basename4(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (path5.length >= 2) {
    const drive = path5.charCodeAt(0);
    if (isWindowsDeviceRoot2(drive)) {
      if (path5.charCodeAt(1) === CHAR_COLON3) start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path5.length - 1; i >= start; --i) {
      const code2 = path5.charCodeAt(i);
      if (isPathSeparator2(code2)) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code2 === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i = path5.length - 1; i >= start; --i) {
      if (isPathSeparator2(path5.charCodeAt(i))) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}
function extname4(path5) {
  assertPath2(path5);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path5.length >= 2 && path5.charCodeAt(1) === CHAR_COLON3 && isWindowsDeviceRoot2(path5.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path5.length - 1; i >= start; --i) {
    const code2 = path5.charCodeAt(i);
    if (isPathSeparator2(code2)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT2) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path5.slice(startDot, end);
}
function format4(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format2("\\", pathObject);
}
function parse4(path5) {
  assertPath2(path5);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path5.length;
  if (len === 0) return ret;
  let rootEnd = 0;
  let code2 = path5.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code2)) {
      rootEnd = 1;
      if (isPathSeparator2(path5.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path5.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path5.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path5.charCodeAt(j))) break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code2)) {
      if (path5.charCodeAt(1) === CHAR_COLON3) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path5.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path5;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path5;
          return ret;
        }
      }
    }
  } else if (isPathSeparator2(code2)) {
    ret.root = ret.dir = path5;
    return ret;
  }
  if (rootEnd > 0) ret.root = path5.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path5.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code2 = path5.charCodeAt(i);
    if (isPathSeparator2(code2)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT2) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path5.slice(startPart, end);
    }
  } else {
    ret.name = path5.slice(startPart, startDot);
    ret.base = path5.slice(startPart, end);
    ret.ext = path5.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path5.slice(0, startPart - 1);
  } else ret.dir = ret.root;
  return ret;
}
function fromFileUrl4(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path5 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path5 = `\\\\${url.hostname}${path5}`;
  }
  return path5;
}
function toFileUrl4(path5) {
  if (!isAbsolute4(path5)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname, pathname] = path5.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(pathname.replace(/%/g, "%25"));
  if (hostname != null && hostname != "localhost") {
    url.hostname = hostname;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.106.0/path/posix.ts
var posix_exports2 = {};
__export(posix_exports2, {
  basename: () => basename5,
  delimiter: () => delimiter5,
  dirname: () => dirname5,
  extname: () => extname5,
  format: () => format5,
  fromFileUrl: () => fromFileUrl5,
  isAbsolute: () => isAbsolute5,
  join: () => join6,
  normalize: () => normalize6,
  parse: () => parse5,
  relative: () => relative5,
  resolve: () => resolve5,
  sep: () => sep5,
  toFileUrl: () => toFileUrl5,
  toNamespacedPath: () => toNamespacedPath5
});
var sep5 = "/";
var delimiter5 = ":";
function resolve5(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path5;
    if (i >= 0) path5 = pathSegments[i];
    else {
      const { Deno: Deno3 } = globalThis;
      if (typeof Deno3?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path5 = Deno3.cwd();
    }
    assertPath2(path5);
    if (path5.length === 0) {
      continue;
    }
    resolvedPath = `${path5}/${resolvedPath}`;
    resolvedAbsolute = path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  }
  resolvedPath = normalizeString2(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator2
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  } else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}
function normalize6(path5) {
  assertPath2(path5);
  if (path5.length === 0) return ".";
  const isAbsolute7 = path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  const trailingSeparator = path5.charCodeAt(path5.length - 1) === CHAR_FORWARD_SLASH2;
  path5 = normalizeString2(path5, !isAbsolute7, "/", isPosixPathSeparator2);
  if (path5.length === 0 && !isAbsolute7) path5 = ".";
  if (path5.length > 0 && trailingSeparator) path5 += "/";
  if (isAbsolute7) return `/${path5}`;
  return path5;
}
function isAbsolute5(path5) {
  assertPath2(path5);
  return path5.length > 0 && path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
}
function join6(...paths) {
  if (paths.length === 0) return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path5 = paths[i];
    assertPath2(path5);
    if (path5.length > 0) {
      if (!joined) joined = path5;
      else joined += `/${path5}`;
    }
  }
  if (!joined) return ".";
  return normalize6(joined);
}
function relative5(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to) return "";
  from = resolve5(from);
  to = resolve5(to);
  if (from === to) return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH2) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH2) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH2) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH2) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_FORWARD_SLASH2) lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH2) {
      if (out.length === 0) out += "..";
      else out += "/..";
    }
  }
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH2) ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath5(path5) {
  return path5;
}
function dirname5(path5) {
  assertPath2(path5);
  if (path5.length === 0) return ".";
  const hasRoot = path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  let end = -1;
  let matchedSlash = true;
  for (let i = path5.length - 1; i >= 1; --i) {
    if (path5.charCodeAt(i) === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) return hasRoot ? "/" : ".";
  if (hasRoot && end === 1) return "//";
  return path5.slice(0, end);
}
function basename5(path5, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path5);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path5.length) {
    if (ext.length === path5.length && ext === path5) return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path5.length - 1; i >= 0; --i) {
      const code2 = path5.charCodeAt(i);
      if (code2 === CHAR_FORWARD_SLASH2) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code2 === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end) end = firstNonSlashEnd;
    else if (end === -1) end = path5.length;
    return path5.slice(start, end);
  } else {
    for (i = path5.length - 1; i >= 0; --i) {
      if (path5.charCodeAt(i) === CHAR_FORWARD_SLASH2) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1) return "";
    return path5.slice(start, end);
  }
}
function extname5(path5) {
  assertPath2(path5);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path5.length - 1; i >= 0; --i) {
    const code2 = path5.charCodeAt(i);
    if (code2 === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT2) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path5.slice(startDot, end);
}
function format5(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format2("/", pathObject);
}
function parse5(path5) {
  assertPath2(path5);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path5.length === 0) return ret;
  const isAbsolute7 = path5.charCodeAt(0) === CHAR_FORWARD_SLASH2;
  let start;
  if (isAbsolute7) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path5.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code2 = path5.charCodeAt(i);
    if (code2 === CHAR_FORWARD_SLASH2) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === CHAR_DOT2) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute7) {
        ret.base = ret.name = path5.slice(1, end);
      } else {
        ret.base = ret.name = path5.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute7) {
      ret.name = path5.slice(1, startDot);
      ret.base = path5.slice(1, end);
    } else {
      ret.name = path5.slice(startPart, startDot);
      ret.base = path5.slice(startPart, end);
    }
    ret.ext = path5.slice(startDot, end);
  }
  if (startPart > 0) ret.dir = path5.slice(0, startPart - 1);
  else if (isAbsolute7) ret.dir = "/";
  return ret;
}
function fromFileUrl5(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl5(path5) {
  if (!isAbsolute5(path5)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace2(
    path5.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.106.0/path/glob.ts
var path3 = isWindows2 ? win32_exports2 : posix_exports2;
var { join: join7, normalize: normalize7 } = path3;

// https://deno.land/std@0.106.0/path/mod.ts
var path4 = isWindows2 ? win32_exports2 : posix_exports2;
var posix = posix_exports2;
var {
  basename: basename6,
  delimiter: delimiter6,
  dirname: dirname6,
  extname: extname6,
  format: format6,
  fromFileUrl: fromFileUrl6,
  isAbsolute: isAbsolute6,
  join: join8,
  normalize: normalize8,
  parse: parse6,
  relative: relative6,
  resolve: resolve6,
  sep: sep6,
  toFileUrl: toFileUrl6,
  toNamespacedPath: toNamespacedPath6
} = path4;

// https://deno.land/std@0.168.0/_util/asserts.ts
var DenoStdInternalError3 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert4(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError3(msg);
  }
}

// https://deno.land/std@0.168.0/flags/mod.ts
var { hasOwn } = Object;
function get(obj, key) {
  if (hasOwn(obj, key)) {
    return obj[key];
  }
}
function getForce(obj, key) {
  const v2 = get(obj, key);
  assert4(v2 != null);
  return v2;
}
function isNumber(x) {
  if (typeof x === "number") return true;
  if (/^0x[0-9a-f]+$/i.test(String(x))) return true;
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
}
function hasKey(obj, keys) {
  let o = obj;
  keys.slice(0, -1).forEach((key2) => {
    o = get(o, key2) ?? {};
  });
  const key = keys[keys.length - 1];
  return hasOwn(o, key);
}
function parse7(args, {
  "--": doubleDash = false,
  alias = {},
  boolean = false,
  default: defaults = {},
  stopEarly = false,
  string = [],
  collect = [],
  negatable = [],
  unknown = (i) => i
} = {}) {
  const aliases = {};
  const flags = {
    bools: {},
    strings: {},
    unknownFn: unknown,
    allBools: false,
    collect: {},
    negatable: {}
  };
  if (alias !== void 0) {
    for (const key in alias) {
      const val = getForce(alias, key);
      if (typeof val === "string") {
        aliases[key] = [val];
      } else {
        aliases[key] = val;
      }
      for (const alias2 of getForce(aliases, key)) {
        aliases[alias2] = [key].concat(aliases[key].filter((y) => alias2 !== y));
      }
    }
  }
  if (boolean !== void 0) {
    if (typeof boolean === "boolean") {
      flags.allBools = !!boolean;
    } else {
      const booleanArgs = typeof boolean === "string" ? [boolean] : boolean;
      for (const key of booleanArgs.filter(Boolean)) {
        flags.bools[key] = true;
        const alias2 = get(aliases, key);
        if (alias2) {
          for (const al of alias2) {
            flags.bools[al] = true;
          }
        }
      }
    }
  }
  if (string !== void 0) {
    const stringArgs = typeof string === "string" ? [string] : string;
    for (const key of stringArgs.filter(Boolean)) {
      flags.strings[key] = true;
      const alias2 = get(aliases, key);
      if (alias2) {
        for (const al of alias2) {
          flags.strings[al] = true;
        }
      }
    }
  }
  if (collect !== void 0) {
    const collectArgs = typeof collect === "string" ? [collect] : collect;
    for (const key of collectArgs.filter(Boolean)) {
      flags.collect[key] = true;
      const alias2 = get(aliases, key);
      if (alias2) {
        for (const al of alias2) {
          flags.collect[al] = true;
        }
      }
    }
  }
  if (negatable !== void 0) {
    const negatableArgs = typeof negatable === "string" ? [negatable] : negatable;
    for (const key of negatableArgs.filter(Boolean)) {
      flags.negatable[key] = true;
      const alias2 = get(aliases, key);
      if (alias2) {
        for (const al of alias2) {
          flags.negatable[al] = true;
        }
      }
    }
  }
  const argv = { _: [] };
  function argDefined(key, arg) {
    return flags.allBools && /^--[^=]+$/.test(arg) || get(flags.bools, key) || !!get(flags.strings, key) || !!get(aliases, key);
  }
  function setKey(obj, name, value, collect2 = true) {
    let o = obj;
    const keys = name.split(".");
    keys.slice(0, -1).forEach(function(key2) {
      if (get(o, key2) === void 0) {
        o[key2] = {};
      }
      o = get(o, key2);
    });
    const key = keys[keys.length - 1];
    const collectable = collect2 && !!get(flags.collect, name);
    if (!collectable) {
      o[key] = value;
    } else if (get(o, key) === void 0) {
      o[key] = [value];
    } else if (Array.isArray(get(o, key))) {
      o[key].push(value);
    } else {
      o[key] = [get(o, key), value];
    }
  }
  function setArg(key, val, arg = void 0, collect2) {
    if (arg && flags.unknownFn && !argDefined(key, arg)) {
      if (flags.unknownFn(arg, key, val) === false) return;
    }
    const value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
    setKey(argv, key, value, collect2);
    const alias2 = get(aliases, key);
    if (alias2) {
      for (const x of alias2) {
        setKey(argv, x, value, collect2);
      }
    }
  }
  function aliasIsBoolean(key) {
    return getForce(aliases, key).some(
      (x) => typeof get(flags.bools, x) === "boolean"
    );
  }
  let notFlags = [];
  if (args.includes("--")) {
    notFlags = args.slice(args.indexOf("--") + 1);
    args = args.slice(0, args.indexOf("--"));
  }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (/^--.+=/.test(arg)) {
      const m3 = arg.match(/^--([^=]+)=(.*)$/s);
      assert4(m3 != null);
      const [, key, value] = m3;
      if (flags.bools[key]) {
        const booleanValue = value !== "false";
        setArg(key, booleanValue, arg);
      } else {
        setArg(key, value, arg);
      }
    } else if (/^--no-.+/.test(arg) && get(flags.negatable, arg.replace(/^--no-/, ""))) {
      const m3 = arg.match(/^--no-(.+)/);
      assert4(m3 != null);
      setArg(m3[1], false, arg, false);
    } else if (/^--.+/.test(arg)) {
      const m3 = arg.match(/^--(.+)/);
      assert4(m3 != null);
      const [, key] = m3;
      const next = args[i + 1];
      if (next !== void 0 && !/^-/.test(next) && !get(flags.bools, key) && !flags.allBools && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
        setArg(key, next, arg);
        i++;
      } else if (/^(true|false)$/.test(next)) {
        setArg(key, next === "true", arg);
        i++;
      } else {
        setArg(key, get(flags.strings, key) ? "" : true, arg);
      }
    } else if (/^-[^-]+/.test(arg)) {
      const letters = arg.slice(1, -1).split("");
      let broken = false;
      for (let j = 0; j < letters.length; j++) {
        const next = arg.slice(j + 2);
        if (next === "-") {
          setArg(letters[j], next, arg);
          continue;
        }
        if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
          setArg(letters[j], next.split(/=(.+)/)[1], arg);
          broken = true;
          break;
        }
        if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
          setArg(letters[j], next, arg);
          broken = true;
          break;
        }
        if (letters[j + 1] && letters[j + 1].match(/\W/)) {
          setArg(letters[j], arg.slice(j + 2), arg);
          broken = true;
          break;
        } else {
          setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
        }
      }
      const [key] = arg.slice(-1);
      if (!broken && key !== "-") {
        if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !get(flags.bools, key) && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
          setArg(key, args[i + 1], arg);
          i++;
        } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
          setArg(key, args[i + 1] === "true", arg);
          i++;
        } else {
          setArg(key, get(flags.strings, key) ? "" : true, arg);
        }
      }
    } else {
      if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
        argv._.push(flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg));
      }
      if (stopEarly) {
        argv._.push(...args.slice(i + 1));
        break;
      }
    }
  }
  for (const [key, value] of Object.entries(defaults)) {
    if (!hasKey(argv, key.split("."))) {
      setKey(argv, key, value);
      if (aliases[key]) {
        for (const x of aliases[key]) {
          setKey(argv, x, value);
        }
      }
    }
  }
  for (const key of Object.keys(flags.bools)) {
    if (!hasKey(argv, key.split("."))) {
      const value = get(flags.collect, key) ? [] : false;
      setKey(
        argv,
        key,
        value,
        false
      );
    }
  }
  for (const key of Object.keys(flags.strings)) {
    if (!hasKey(argv, key.split(".")) && get(flags.collect, key)) {
      setKey(
        argv,
        key,
        [],
        false
      );
    }
  }
  if (doubleDash) {
    argv["--"] = [];
    for (const key of notFlags) {
      argv["--"].push(key);
    }
  } else {
    for (const key of notFlags) {
      argv._.push(key);
    }
  }
  return argv;
}

// https://deno.land/x/good@1.6.0.0/value.js
var typedArrayClasses = [
  Uint16Array,
  Uint32Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Int32Array,
  Int8Array,
  Float32Array,
  Float64Array,
  globalThis.BigInt64Array,
  globalThis.BigUint64Array
].filter((each) => each);
var copyableClasses = /* @__PURE__ */ new Set([RegExp, Date, URL, ...typedArrayClasses, globalThis.ArrayBuffer, globalThis.DataView]);
var IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
var ArrayIterator = Object.getPrototypeOf([][Symbol.iterator]);
var MapIterator = Object.getPrototypeOf((/* @__PURE__ */ new Map())[Symbol.iterator]);
var SetIterator = Object.getPrototypeOf((/* @__PURE__ */ new Set())[Symbol.iterator]);
var AsyncFunction = class {
};
var GeneratorFunction = class {
};
var AsyncGeneratorFunction = class {
};
var SyncGenerator = class {
};
var AsyncGenerator = class {
};
try {
  AsyncFunction = eval("(async function(){}).constructor");
  GeneratorFunction = eval("(function*(){}).constructor");
  AsyncGeneratorFunction = eval("(async function*(){}).constructor");
  SyncGenerator = eval("((function*(){})()).constructor");
  AsyncGenerator = eval("((async function*(){})()).constructor");
} catch (error) {
}
var isPrimitive = (value) => !(value instanceof Object);
var isPureObject = (value) => value instanceof Object && Object.getPrototypeOf(value).constructor == Object;
var isPracticallyPrimitive = (value) => isPrimitive(value) || value instanceof Date || value instanceof RegExp || value instanceof URL;
var isBuiltInIterator = (value) => IteratorPrototype.isPrototypeOf(value);
var isGeneratorType = (value) => {
  if (value instanceof Object) {
    if (isBuiltInIterator(value)) {
      return true;
    }
    const constructor = value.constructor;
    return constructor == SyncGenerator || constructor == AsyncGenerator;
  }
  return false;
};
var isAsyncIterable = function(value) {
  return value && typeof value[Symbol.asyncIterator] === "function";
};
var isSyncIterable = function(value) {
  return value && typeof value[Symbol.iterator] === "function";
};
var isIterableObjectOrContainer = function(value) {
  return value instanceof Object && (typeof value[Symbol.iterator] == "function" || typeof value[Symbol.asyncIterator] === "function");
};
var isTechnicallyIterable = function(value) {
  return value instanceof Object || typeof value == "string";
};
var isSyncIterableObjectOrContainer = function(value) {
  return value instanceof Object && typeof value[Symbol.iterator] == "function";
};
var deepCopySymbol = Symbol.for("deepCopy");
var clonedFromSymbol = Symbol();
var getThis = Symbol();
Object.getPrototypeOf(function() {
})[getThis] = function() {
  return this;
};
function deepCopyInner(value, valueChain = [], originalToCopyMap = /* @__PURE__ */ new Map()) {
  valueChain.push(value);
  if (value == null) {
    return value;
  }
  if (!(value instanceof Object)) {
    return value;
  }
  if (originalToCopyMap.has(value)) {
    return originalToCopyMap.get(value);
  }
  if (value[deepCopySymbol] instanceof Function) {
    const clonedValue = value[deepCopySymbol](originalToCopyMap);
    originalToCopyMap.set(value, clonedValue);
    return clonedValue;
  }
  if (isGeneratorType(value)) {
    throw Error(`Sadly built-in generators cannot be deep copied.
And I found a generator along this path:
${valueChain.reverse().map((each) => `${each},
`)}`);
  }
  let object, theThis, thisCopy;
  if (value instanceof Date) {
    object = new Date(value.getTime());
  } else if (value instanceof RegExp) {
    object = new RegExp(value);
  } else if (value instanceof URL) {
    object = new URL(value);
  } else if (value instanceof Function) {
    theThis = value[getThis]();
    object = value.bind(theThis);
  } else if (copyableClasses.has(value.constructor)) {
    object = new value.constructor(value);
  } else if (value instanceof Array) {
    object = [];
  } else if (value instanceof Set) {
    object = /* @__PURE__ */ new Set();
  } else if (value instanceof Map) {
    object = /* @__PURE__ */ new Map();
  }
  originalToCopyMap.set(value, object);
  if (object instanceof Function) {
    thisCopy = deepCopyInner(theThis, valueChain, originalToCopyMap);
    object = object.bind(thisCopy);
  }
  const output2 = object;
  try {
    output2.constructor = value.constructor;
  } catch (error) {
  }
  Object.setPrototypeOf(output2, Object.getPrototypeOf(value));
  const propertyDefinitions = {};
  for (const [key, description] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    const { value: value2, get: get2, set, ...options } = description;
    const getIsFunc = get2 instanceof Function;
    const setIsFunc = set instanceof Function;
    if (getIsFunc || setIsFunc) {
      propertyDefinitions[key] = {
        ...options,
        get: get2 ? function(...args) {
          return get2.apply(output2, args);
        } : void 0,
        set: set ? function(...args) {
          return set.apply(output2, args);
        } : void 0
      };
    } else {
      if (key == "length" && output2 instanceof Array) {
        continue;
      }
      propertyDefinitions[key] = {
        ...options,
        value: deepCopyInner(value2, valueChain, originalToCopyMap)
      };
    }
  }
  Object.defineProperties(output2, propertyDefinitions);
  return output2;
}
var deepCopy = (value) => deepCopyInner(value);
var shallowSortObject = (obj) => {
  return Object.keys(obj).sort().reduce(
    (newObj, key) => {
      newObj[key] = obj[key];
      return newObj;
    },
    {}
  );
};
var deepSortObject = (obj, seen = /* @__PURE__ */ new Map()) => {
  if (!(obj instanceof Object)) {
    return obj;
  } else if (seen.has(obj)) {
    return seen.get(obj);
  } else {
    if (obj instanceof Array) {
      const sortedChildren = [];
      seen.set(obj, sortedChildren);
      for (const each of obj) {
        sortedChildren.push(deepSortObject(each, seen));
      }
      return sortedChildren;
    } else {
      const sorted = {};
      seen.set(obj, sorted);
      for (const eachKey of Object.keys(obj).sort()) {
        sorted[eachKey] = deepSortObject(obj[eachKey], seen);
      }
      return sorted;
    }
  }
};
var stableStringify = (value, ...args) => {
  return JSON.stringify(deepSortObject(value), ...args);
};
var allKeys = function(obj) {
  let keys = [];
  if (obj == null) {
    return [];
  }
  if (!(obj instanceof Object)) {
    obj = Object.getPrototypeOf(obj);
  }
  while (obj) {
    keys = keys.concat(Reflect.ownKeys(obj));
    obj = Object.getPrototypeOf(obj);
  }
  return keys;
};
var ownKeyDescriptions = Object.getOwnPropertyDescriptors;
var allKeyDescriptions = function(value, options = { includingBuiltin: false }) {
  var { includingBuiltin } = { ...options };
  let descriptions = [];
  if (value == null) {
    return {};
  }
  if (!(value instanceof Object)) {
    value = Object.getPrototypeOf(value);
  }
  const rootPrototype = Object.getPrototypeOf({});
  let prevObj;
  while (value && value != prevObj) {
    if (!includingBuiltin && value == rootPrototype) {
      break;
    }
    descriptions = descriptions.concat(Object.entries(Object.getOwnPropertyDescriptors(value)));
    prevObj = value;
    value = Object.getPrototypeOf(value);
  }
  descriptions.reverse();
  return Object.fromEntries(descriptions);
};

// https://deno.land/x/good@1.6.0.0/async.js
var objectPrototype = Object.getPrototypeOf({});

// https://deno.land/x/good@1.6.0.0/iterable.js
var emptyIterator = function* () {
}();
var makeIterable = (object) => {
  if (object == null) {
    return emptyIterator;
  }
  if (object[Symbol.iterator] instanceof Function || object[Symbol.asyncIterator] instanceof Function) {
    return object;
  }
  if (Object.getPrototypeOf(object).constructor == Object) {
    return Object.entries(object);
  }
  return emptyIterator;
};
var Stop = Symbol("iterationStop");
var iter2 = (object) => {
  const iterable = makeIterable(object);
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]();
  } else {
    return iterable[Symbol.iterator]();
  }
};
async function asyncIteratorToList(asyncIterator) {
  const results = [];
  for await (const each of asyncIterator) {
    results.push(each);
  }
  return results;
}
var zip = function* (...iterables) {
  iterables = iterables.map((each) => iter2(each));
  while (true) {
    const nexts = iterables.map((each) => each.next());
    if (nexts.every((each) => each.done)) {
      break;
    }
    yield nexts.map((each) => each.value);
  }
};
var ERROR_WHILE_MAPPING_MESSAGE = "Threw while mapping.";
function concurrentlyTransform({ iterator, transformFunction, poolLimit = null, awaitAll = false }) {
  poolLimit = poolLimit || concurrentlyTransform.defaultPoolLimit;
  const res = new TransformStream({
    async transform(p2, controller) {
      try {
        const s = await p2;
        controller.enqueue(s);
      } catch (e) {
        if (e instanceof AggregateError && e.message == ERROR_WHILE_MAPPING_MESSAGE) {
          controller.error(e);
        }
      }
    }
  });
  const mainPromise = (async () => {
    const writer = res.writable.getWriter();
    const executing = [];
    try {
      let index = 0;
      for await (const item of iterator) {
        const p2 = Promise.resolve().then(() => transformFunction(item, index));
        index++;
        writer.write(p2);
        const e = p2.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= poolLimit) {
          await Promise.race(executing);
        }
      }
      await Promise.all(executing);
      writer.close();
    } catch {
      const errors = [];
      for (const result of await Promise.allSettled(executing)) {
        if (result.status == "rejected") {
          errors.push(result.reason);
        }
      }
      writer.write(Promise.reject(
        new AggregateError(errors, ERROR_WHILE_MAPPING_MESSAGE)
      )).catch(() => {
      });
    }
  })();
  const asyncIterator = res.readable[Symbol.asyncIterator]();
  if (!awaitAll) {
    return asyncIterator;
  } else {
    return mainPromise.then(() => asyncIteratorToList(asyncIterator));
  }
}
concurrentlyTransform.defaultPoolLimit = 40;

// https://deno.land/x/good@1.6.0.0/string.js
var indent = ({ string, by = "    ", noLead = false }) => (noLead ? "" : by) + string.replace(/\n/g, "\n" + by);
var toString = (value) => {
  if (typeof value == "symbol") {
    return toRepresentation(value);
  } else if (!(value instanceof Object)) {
    return value != null ? value.toString() : `${value}`;
  } else {
    return toRepresentation(value);
  }
};
var reprSymbol = Symbol.for("representation");
var denoInspectSymbol = Symbol.for("Deno.customInspect");
var toRepresentation = (item) => {
  const alreadySeen = /* @__PURE__ */ new Set();
  const recursionWrapper = (item2) => {
    if (item2 instanceof Object) {
      if (alreadySeen.has(item2)) {
        return `[Self Reference]`;
      } else {
        alreadySeen.add(item2);
      }
    }
    let output2;
    if (item2 === void 0) {
      output2 = "undefined";
    } else if (item2 === null) {
      output2 = "null";
    } else if (typeof item2 == "string") {
      output2 = JSON.stringify(item2);
    } else if (typeof item2 == "symbol") {
      if (!item2.description) {
        output2 = "Symbol()";
      } else {
        const globalVersion = Symbol.for(item2.description);
        if (globalVersion == item2) {
          output2 = `Symbol.for(${JSON.stringify(item2.description)})`;
        } else {
          output2 = `Symbol(${JSON.stringify(item2.description)})`;
        }
      }
    } else if (item2 instanceof Date) {
      output2 = `new Date(${item2.getTime()})`;
    } else if (item2 instanceof Array) {
      output2 = `[${item2.map((each) => recursionWrapper(each)).join(",")}]`;
    } else if (item2 instanceof Set) {
      output2 = `new Set(${[...item2].map((each) => recursionWrapper(each)).join(",")})`;
    } else if (item2 instanceof Object && item2.constructor == Object) {
      output2 = pureObjectRepr(item2);
    } else if (item2 instanceof Map) {
      let string = "new Map(";
      for (const [key, value] of item2.entries()) {
        const stringKey = recursionWrapper(key);
        const stringValue = recursionWrapper(value);
        if (!stringKey.match(/\n/g)) {
          string += `
  [${stringKey}, ${indent({ string: stringValue, by: "  ", noLead: true })}],`;
        } else {
          string += `
  [${indent({ string: stringKey, by: "  ", noLead: true })},
  ${indent({ string: stringValue, by: "    ", noLead: true })}],`;
        }
      }
      string += "\n)";
      output2 = string;
    } else {
      if (item2[reprSymbol] instanceof Function) {
        try {
          output2 = item2[reprSymbol]();
          return output2;
        } catch (error) {
        }
      }
      if (item2[denoInspectSymbol] instanceof Function) {
        try {
          output2 = item2[denoInspectSymbol]();
          return output2;
        } catch (error) {
        }
      }
      try {
        output2 = item2.toString();
        if (output2 !== "[object Object]") {
          return output2;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && item2.prototype && typeof item2.name == "string") {
          output2 = `class ${item2.name} { /*...*/ }`;
          return output2;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && typeof item2.constructor.name == "string") {
          output2 = `new ${item2.constructor.name}(${pureObjectRepr(item2)})`;
          return output2;
        }
      } catch (error) {
      }
      return pureObjectRepr(item2);
    }
    return output2;
  };
  const pureObjectRepr = (item2) => {
    let string = "{";
    for (const [key, value] of Object.entries(item2)) {
      const stringKey = recursionWrapper(key);
      const stringValue = recursionWrapper(value);
      string += `
  ${stringKey}: ${indent({ string: stringValue, by: "  ", noLead: true })},`;
    }
    string += "\n}";
    return string;
  };
  return recursionWrapper(item);
};
var reservedCharMap = {
  "&": "\\x26",
  "!": "\\x21",
  "#": "\\x23",
  "$": "\\$",
  "%": "\\x25",
  "*": "\\*",
  "+": "\\+",
  ",": "\\x2c",
  ".": "\\.",
  ":": "\\x3a",
  ";": "\\x3b",
  "<": "\\x3c",
  "=": "\\x3d",
  ">": "\\x3e",
  "?": "\\?",
  "@": "\\x40",
  "^": "\\^",
  "`": "\\x60",
  "~": "\\x7e",
  "(": "\\(",
  ")": "\\)",
  "[": "\\[",
  "]": "\\]",
  "{": "\\{",
  "}": "\\}",
  "/": "\\/",
  "-": "\\x2d",
  "\\": "\\\\",
  "|": "\\|"
};
var RX_REGEXP_ESCAPE = new RegExp(
  `[${Object.values(reservedCharMap).join("")}]`,
  "gu"
);
function escapeRegexMatch(str2) {
  return str2.replaceAll(
    RX_REGEXP_ESCAPE,
    (m3) => reservedCharMap[m3]
  );
}
var regexpProxy = Symbol("regexpProxy");
var realExec = RegExp.prototype.exec;
RegExp.prototype.exec = function(...args) {
  if (this[regexpProxy]) {
    return realExec.apply(this[regexpProxy], args);
  }
  return realExec.apply(this, args);
};
var proxyRegExp;
var regexProxyOptions = Object.freeze({
  get(original, key) {
    if (typeof key == "string" && key.match(/^[igmusyv]+$/)) {
      return proxyRegExp(original, key);
    }
    if (key == regexpProxy) {
      return original;
    }
    return original[key];
  },
  set(original, key, value) {
    original[key] = value;
    return true;
  }
});
proxyRegExp = (parent, flags) => {
  const regex2 = new RegExp(parent, flags);
  const output2 = new Proxy(regex2, regexProxyOptions);
  Object.setPrototypeOf(output2, Object.getPrototypeOf(regex2));
  return output2;
};
function regexWithStripWarning(shouldStrip) {
  return (strings, ...values) => {
    let newRegexString = "";
    for (const [string, value] of zip(strings, values)) {
      newRegexString += string;
      if (value instanceof RegExp) {
        if (!shouldStrip && value.flags.replace(/g/, "").length > 0) {
          console.warn(`Warning: flags inside of regex:
    The RegExp trigging this warning is: ${value}
    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)
    one of the \${} values (the one above) was a RegExp with a flag enabled
    e.g. /stuff/i  <- i = ignoreCase flag enabled
    When the /stuff/i gets interpolated, its going to loose its flags
    (thats what I'm warning you about)
    
    To disable/ignore this warning do:
        regex.stripFlags\`something\${/stuff/i}\`
    If you want to add flags to the output of regex\`something\${stuff}\` do:
        regex\`something\${stuff}\`.i   // ignoreCase
        regex\`something\${stuff}\`.ig  // ignoreCase and global
        regex\`something\${stuff}\`.gi  // functionally equivlent
`);
        }
        newRegexString += `(?:${value.source})`;
      } else if (value != null) {
        newRegexString += escapeRegexMatch(toString(value));
      }
    }
    return proxyRegExp(newRegexString, "");
  };
}
var regex = regexWithStripWarning(false);
regex.stripFlags = regexWithStripWarning(true);
function levenshteinDistanceBetween(str1, str2) {
  if (str1.length > str2.length) {
    ;
    [str1, str2] = [str2, str1];
  }
  let distances = Array.from({ length: str1.length + 1 }, (_2, i) => +i);
  for (let str2Index = 0; str2Index < str2.length; str2Index++) {
    const tempDistances = [str2Index + 1];
    for (let str1Index = 0; str1Index < str1.length; str1Index++) {
      let char1 = str1[str1Index];
      let char2 = str2[str2Index];
      if (char1 === char2) {
        tempDistances.push(distances[str1Index]);
      } else {
        tempDistances.push(1 + Math.min(distances[str1Index], distances[str1Index + 1], tempDistances[tempDistances.length - 1]));
      }
    }
    distances = tempDistances;
  }
  return distances[distances.length - 1];
}
function didYouMean({ givenWord, possibleWords, caseSensitive = false, autoThrow = false, suggestionLimit = Infinity }) {
  if (!caseSensitive) {
    possibleWords = possibleWords.map((each) => each.toLowerCase());
    givenWord = givenWord.toLowerCase();
  }
  if (!possibleWords.includes(givenWord) && autoThrow) {
    let suggestions = didYouMean({
      givenWord,
      possibleWords,
      caseSensitive,
      suggestionLimit
    });
    if (suggestionLimit == 1 && suggestions.length > 0) {
      throw new Error(`For ${JSON.stringify(givenWord)}, did you mean ${JSON.stringify(suggestions[0])}?`);
    } else {
      throw new Error(`For ${JSON.stringify(givenWord)}, did you mean one of ${JSON.stringify(suggestions)}?`);
    }
  }
  return [...possibleWords].sort((a3, b3) => levenshteinDistanceBetween(givenWord, a3) - levenshteinDistanceBetween(givenWord, b3)).slice(0, suggestionLimit);
}
var textDecoder = new TextDecoder("utf-8");
var textEncoder = new TextEncoder("utf-8");
var utf8BytesToString = textDecoder.decode.bind(textDecoder);
var stringToUtf8Bytes = textEncoder.encode.bind(textEncoder);

// https://esm.sh/gh/jeff-hykin/good-js@40797ac/denonext/source/support/posix.mjs
var h = 46;
var a = 47;
function d(e) {
  if (typeof e != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function m(e) {
  return e === a;
}
function b(e, t2, i, l) {
  let n = "", r = 0, f = -1, c2 = 0, u;
  for (let o = 0, s = e.length; o <= s; ++o) {
    if (o < s) u = e.charCodeAt(o);
    else {
      if (l(u)) break;
      u = a;
    }
    if (l(u)) {
      if (!(f === o - 1 || c2 === 1)) if (f !== o - 1 && c2 === 2) {
        if (n.length < 2 || r !== 2 || n.charCodeAt(n.length - 1) !== h || n.charCodeAt(n.length - 2) !== h) {
          if (n.length > 2) {
            let g2 = n.lastIndexOf(i);
            g2 === -1 ? (n = "", r = 0) : (n = n.slice(0, g2), r = n.length - 1 - n.lastIndexOf(i)), f = o, c2 = 0;
            continue;
          } else if (n.length === 2 || n.length === 1) {
            n = "", r = 0, f = o, c2 = 0;
            continue;
          }
        }
        t2 && (n.length > 0 ? n += `${i}..` : n = "..", r = 2);
      } else n.length > 0 ? n += i + e.slice(f + 1, o) : n = e.slice(f + 1, o), r = o - f - 1;
      f = o, c2 = 0;
    } else u === h && c2 !== -1 ? ++c2 : c2 = -1;
  }
  return n;
}
function R(e) {
  if (d(e), e.length === 0) return ".";
  let t2 = e.charCodeAt(0) === a, i = e.charCodeAt(e.length - 1) === a;
  return e = b(e, !t2, "/", m), e.length === 0 && !t2 && (e = "."), e.length > 0 && i && (e += "/"), t2 ? `/${e}` : e;
}
function T(...e) {
  if (e.length === 0) return ".";
  let t2;
  for (let i = 0, l = e.length; i < l; ++i) {
    let n = e[i];
    d(n), n.length > 0 && (t2 ? t2 += `/${n}` : t2 = n);
  }
  return t2 ? R(t2) : ".";
}

// https://esm.sh/gh/jeff-hykin/good-js@40797ac/denonext/source/flattened/path_pieces_posix.mjs
var C = 46;
var c = 47;
function d2(e) {
  if (typeof e != "string") throw new TypeError(`Path must be a string. Received ${JSON.stringify(e)}`);
}
function h2(e) {
  if (d2(e), e.length === 0) return ".";
  let t2 = e.charCodeAt(0) === c, i = -1, n = true;
  for (let l = e.length - 1; l >= 1; --l) if (e.charCodeAt(l) === c) {
    if (!n) {
      i = l;
      break;
    }
  } else n = false;
  return i === -1 ? t2 ? "/" : "." : t2 && i === 1 ? "//" : e.slice(0, i);
}
function A(e, t2 = "") {
  if (t2 !== void 0 && typeof t2 != "string") throw new TypeError('"ext" argument must be a string');
  d2(e);
  let i = 0, n = -1, l = true, r;
  if (t2 !== void 0 && t2.length > 0 && t2.length <= e.length) {
    if (t2.length === e.length && t2 === e) return "";
    let s = t2.length - 1, f = -1;
    for (r = e.length - 1; r >= 0; --r) {
      let o = e.charCodeAt(r);
      if (o === c) {
        if (!l) {
          i = r + 1;
          break;
        }
      } else f === -1 && (l = false, f = r + 1), s >= 0 && (o === t2.charCodeAt(s) ? --s === -1 && (n = r) : (s = -1, n = f));
    }
    return i === n ? n = f : n === -1 && (n = e.length), e.slice(i, n);
  } else {
    for (r = e.length - 1; r >= 0; --r) if (e.charCodeAt(r) === c) {
      if (!l) {
        i = r + 1;
        break;
      }
    } else n === -1 && (l = false, n = r + 1);
    return n === -1 ? "" : e.slice(i, n);
  }
}
function m2(e) {
  d2(e);
  let t2 = { root: "", dir: "", base: "", ext: "", name: "" };
  if (e.length === 0) return t2;
  let i = e.charCodeAt(0) === c, n;
  i ? (t2.root = "/", n = 1) : n = 0;
  let l = -1, r = 0, s = -1, f = true, o = e.length - 1, u = 0;
  for (; o >= n; --o) {
    let g2 = e.charCodeAt(o);
    if (g2 === c) {
      if (!f) {
        r = o + 1;
        break;
      }
      continue;
    }
    s === -1 && (f = false, s = o + 1), g2 === C ? l === -1 ? l = o : u !== 1 && (u = 1) : l !== -1 && (u = -1);
  }
  return l === -1 || s === -1 || u === 0 || u === 1 && l === s - 1 && l === r + 1 ? s !== -1 && (r === 0 && i ? t2.base = t2.name = e.slice(1, s) : t2.base = t2.name = e.slice(r, s)) : (r === 0 && i ? (t2.name = e.slice(1, l), t2.base = e.slice(1, s)) : (t2.name = e.slice(r, l), t2.base = e.slice(r, s)), t2.ext = e.slice(l, s)), r > 0 ? t2.dir = e.slice(0, r - 1) : i && (t2.dir = "/"), t2;
}
var a2 = { parse: m2, basename: A, dirname: h2 };
function w(e) {
  e = e.path || e;
  let t2 = a2.parse(e), i = [], n = t2.dir;
  for (; i.push(a2.basename(n)), n != a2.dirname(n); ) n = a2.dirname(n);
  return i.reverse(), [i, t2.name, t2.ext];
}

// https://esm.sh/gh/jeff-hykin/archaeopteryx@1.0.11/denonext/mod.ts.mjs
var oe = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpg", ".gif": "image/gif", ".svg": "image/svg+xml", ".wav": "audio/wav", ".mp4": "video/mp4", ".woff": "application/font-woff", ".ttf": "application/font-ttf", ".eot": "application/vnd.ms-fontobject", ".otf": "application/font-otf", ".wasm": "application/wasm" };
var H = oe;
var I = (e) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="utf-8" />
      <title>404</title>
    </head>
    <style>
      html,
      body {
        height: 100vh;
        width: 100vw;
        font-family: Helvetica, Arial, sans-serif;
        box-sizing: border-box;
        background-color: #fff;
        margin: 0;
        padding: 0;
      }
  
      #archaeopteryx {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
  
      #archaeopteryx > h1 {
        font-size: 48px;
        margin-bottom: 16px;
        color: #726f7b;
      }
  
      #archaeopteryx > p {
        color: #c4c4c4;
        text-align: center;
      }
  
      #archaeopteryx > div {
        display: flex;
      }
  
      strong {
        opacity: 0.2;
        font-weight: 200;
      }
  
      svg {
        margin-bottom: 16px;
      }
    </style>
    <body>
      <div id="archaeopteryx">
        <h1>404</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 619.77 283.96"
          width="200"
        >
          <defs>
            <style>
              .cls-1 {
                fill: #ff825e;
              }
              .cls-2 {
                fill: #333;
              }
              .cls-3 {
                fill: #ffc59f;
              }
            </style>
          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <path
                class="cls-1"
                d="M345,201.1s191.78,26.23,149-23C494,178.12,360.34,110.8,345,201.1Z"
              />
              <path
                class="cls-2"
                d="M436.9,215.66c-35.62,0-75-4.75-92.88-7.19l-7.61-1.05,1.28-7.57c3.71-21.86,14.14-37.27,31-45.8C415.1,130.59,494,169.8,497.36,171.48l1.31.65.95,1.11c10.08,11.58,8.88,20.15,6.1,25.3C498.59,211.73,469.3,215.66,436.9,215.66ZM354,194.78c63.32,8,132.16,8.6,138.59-3.31.55-1-.3-3.63-3.29-7.35-10.28-4.91-77.17-35.39-114-16.78C364.75,172.72,357.73,181.73,354,194.78Z"
              />
              <path
                class="cls-1"
                d="M146.3,201.68c55,35.06,104.09-15.5,104.09-15.5S235.51,132.73,181,152.57,146.3,201.68,146.3,201.68Z"
              />
              <path
                class="cls-2"
                d="M186.56,221.43c-13.8,0-28.83-3.65-44.26-13.48l-1.29-.83-.87-1.27a32.18,32.18,0,0,1-3.27-26.55c4.52-14,18.51-25.34,41.56-33.72,18.54-6.74,35.06-6.5,49.11.74,22.47,11.56,29.71,36.8,30,37.87l1.15,4.11-3,3.06C255.33,191.77,225.92,221.43,186.56,221.43Zm-34.69-25.05c20,12.16,41.45,13.52,63.72,4.06a103.11,103.11,0,0,0,26.12-16.38c-2.66-6.34-9.07-18.44-21.08-24.57-10.19-5.21-22.68-5.18-37.11.07-18.27,6.64-29.5,15.05-32.5,24.32A17.27,17.27,0,0,0,151.87,196.38Z"
              />
              <path
                class="cls-3"
                d="M436.75,77.36l-53-44.84S299.91-44.93,200.62,72.4l-60.85,71.91s-42.22,42.22-23.3,58.23,82.4-66.67,150.53-9,101.32-50.65,202.64-16.88c36.11,11.07,57.94-22.41,27.67-48Z"
              />
              <path
                class="cls-2"
                d="M307.47,218.29c-14,0-28.77-5.13-45.27-19.09-40.79-34.51-79.86-13.95-108.39,1.06-17.75,9.35-31.78,16.73-42.14,8a21,21,0,0,1-7.49-15.6c-.89-21.25,26-49.21,30.1-53.34L194.94,67.6c35.8-42.3,73.85-65,113.12-67.38,47.89-3,79.42,25.62,80.75,26.84l113.3,95.87c16,13.53,21.21,31.64,13.3,46.13-6.85,12.53-24.34,21.94-47.95,14.69-46.94-15.64-77.25.47-106.57,16C343.2,209.19,326.08,218.29,307.47,218.29Zm-92.86-53c18.07,0,37.43,5.87,57.19,22.6,30.82,26.07,52.33,14.64,82.11-1.19C383,171.21,419.17,152,472,169.59c15.43,4.73,26.4-.43,30.35-7.66,4.45-8.15.67-18.74-9.85-27.65L379,38.2c-.52-.46-28.68-25.74-70.23-23.12-35,2.24-69.44,23.14-102.43,62.12l-72.83,86.07-.23-.19C125.58,173,118.72,184.48,119,192a6.15,6.15,0,0,0,2.23,4.86c2.72,2.28,16.49-5,25.61-9.77C164.91,177.61,188.4,165.25,214.61,165.25Z"
              />
              <circle class="cls-2" cx="421" cy="134.08" r="7.44" />
              <circle class="cls-2" cx="460.41" cy="129.55" r="7.44" />
              <path
                class="cls-2"
                d="M369.2,76.35a7.4,7.4,0,0,1-4.8-1.76c-58.49-49.49-106.76-3-108.79-1A7.44,7.44,0,0,1,245.16,63c.59-.59,60.1-57.92,128.84.25a7.43,7.43,0,0,1-4.8,13.11Z"
              />
              <path
                class="cls-3"
                d="M313.83,111.79S209.88,104,168,78.87,80.72,98.11,307.17,165.93"
              />
              <path
                class="cls-2"
                d="M307.17,173.37a7.54,7.54,0,0,1-2.13-.32C195.32,140.2,130.22,106.9,126.43,81.7a13.81,13.81,0,0,1,6.12-14c8.71-5.82,24.86-3.83,39.29,4.83,39.89,24,141.52,31.8,142.54,31.88a7.44,7.44,0,0,1-1.11,14.83c-4.32-.32-106.2-8.21-149.09-34-11.16-6.69-20.35-6.67-22.93-5.47,1.39,4,17,33.78,168.05,79a7.44,7.44,0,0,1-2.13,14.57Z"
              />
              <line
                class="cls-3"
                x1="314.84"
                y1="246.77"
                x2="379.3"
                y2="246.77"
              />
              <path
                class="cls-2"
                d="M379.3,254.21H314.85a7.44,7.44,0,1,1,0-14.87H379.3a7.44,7.44,0,1,1,0,14.87Z"
              />
              <line
                class="cls-3"
                x1="433.84"
                y1="246.77"
                x2="547.88"
                y2="246.77"
              />
              <path
                class="cls-2"
                d="M547.88,254.21h-114a7.44,7.44,0,1,1,0-14.87h114a7.44,7.44,0,1,1,0,14.87Z"
              />
              <line
                class="cls-3"
                x1="404.09"
                y1="246.77"
                x2="409.05"
                y2="246.77"
              />
              <path
                class="cls-2"
                d="M409.05,254.21h-5a7.44,7.44,0,0,1,0-14.87h5a7.44,7.44,0,1,1,0,14.87Z"
              />
              <line
                class="cls-3"
                x1="146.27"
                y1="246.77"
                x2="166.1"
                y2="246.77"
              />
              <path
                class="cls-2"
                d="M166.1,254.21H146.27a7.44,7.44,0,1,1,0-14.87H166.1a7.44,7.44,0,1,1,0,14.87Z"
              />
              <line
                class="cls-3"
                x1="195.85"
                y1="246.77"
                x2="290.05"
                y2="246.77"
              />
              <path
                class="cls-2"
                d="M290.05,254.21h-94.2a7.44,7.44,0,1,1,0-14.87h94.2a7.44,7.44,0,1,1,0,14.87Z"
              />
              <line
                class="cls-3"
                x1="270.22"
                y1="276.52"
                x2="463.59"
                y2="276.52"
              />
              <path
                class="cls-2"
                d="M463.59,284H270.22a7.44,7.44,0,0,1,0-14.88H463.59a7.44,7.44,0,0,1,0,14.88Z"
              />
              <line
                class="cls-3"
                x1="156.18"
                y1="276.52"
                x2="200.81"
                y2="276.52"
              />
              <path
                class="cls-2"
                d="M200.81,284H156.18a7.44,7.44,0,0,1,0-14.88h44.63a7.44,7.44,0,0,1,0,14.88Z"
              />
              <line class="cls-3" x1="7.44" y1="276.52" x2="131.39" y2="276.52" />
              <path
                class="cls-2"
                d="M131.39,284H7.44a7.44,7.44,0,0,1,0-14.88h124a7.44,7.44,0,1,1,0,14.88Z"
              />
              <line
                class="cls-3"
                x1="488.38"
                y1="276.52"
                x2="612.34"
                y2="276.52"
              />
              <path
                class="cls-2"
                d="M612.34,284h-124a7.44,7.44,0,0,1,0-14.88h124a7.44,7.44,0,0,1,0,14.88Z"
              />
              <line
                class="cls-3"
                x1="225.6"
                y1="276.52"
                x2="245.43"
                y2="276.52"
              />
              <path
                class="cls-2"
                d="M245.43,284H225.6a7.44,7.44,0,0,1,0-14.88h19.83a7.44,7.44,0,0,1,0,14.88Z"
              />
              <line
                class="cls-3"
                x1="71.89"
                y1="246.77"
                x2="116.52"
                y2="246.77"
              />
              <path
                class="cls-2"
                d="M116.52,254.21H71.89a7.44,7.44,0,0,1,0-14.87h44.63a7.44,7.44,0,0,1,0,14.87Z"
              />
            </g>
          </g>
        </svg>
        <p>Requested resource: ${e} does not exist.</p>
      </div>
    </body>
  </html>
  

`;
var T2 = (e) => e >= 1 && e <= 65535 && Number.isInteger(e);
var L = async (e = "") => {
  let o = new Uint8Array(1024);
  await Deno.stdout.write(h3(`${bold(green(`
${e}`))}`));
  let r = await Deno.stdin.read(o);
  return $(o.subarray(0, r)).trim();
};
var se = new TextEncoder();
var ae = new TextDecoder();
var h3 = (e) => se.encode(e);
var $ = (e) => ae.decode(e);
var R2 = T;
var ne = (e) => {
  let o = String(extname6(e)).toLowerCase();
  return console.log("ext is:", o), H[o] || "application/octet-stream";
};
var O = async (e) => new TextDecoder().decode(await Deno.readFile(e));
var N = (e) => e.headers.get("upgrade") === "websocket";
var g = (e, o) => {
  let r = new Headers();
  return o ? r.set("content-type", ne(o)) : r.set("content-type", "text/html"), e && r.set("Access-Control-Allow-Origin", "*"), r.set("Cross-Origin-Opener-Policy", "same-origin"), r.set("Cross-Origin-Embedder-Policy", "require-corp"), r;
};
var q = (e, o, r, s) => e + `<script>
  const socket = new WebSocket('${s ? "wss" : "ws"}://${r}:${o}');
  socket.onopen = () => {
    console.log('Socket connection open. Listening for events.');
  };
  socket.onmessage = (msg) => {
    if (msg.data === 'reload') location.reload(true);
  };
<\/script>`;
var W = (e) => I(e);
var z = (...e) => (o) => {
  if (e.length === 0) throw new Error("Expected at least one argument function");
  return e.reduce((r, s) => r.then(s), Promise.resolve(o));
};
var U = (e) => {
  console.log(`${bold(green(e.method))} ${e.url}`);
};
var k = () => {
  console.log(`

  ${bold(green("🦕  🚚 Archaeopteryx - Help"))}

  OPTIONS    
  -h          # Help
  -p          # Port | ${bold(blue("8080"))}
  -n          # Disable Live Reload | ${bold(blue("false"))}
  -s          # Silent | ${bold(blue("false"))}
  -d          # Debug | ${bold(blue("false"))}
  -t          # Use HTTPS - Requires trusted self signed certificate | ${bold(blue("false"))}
  -c          # Allow CORS | ${bold(blue("false"))}
  -l          # Use Directory Listings (Disables SPA routing) | ${bold(blue("false"))}
  --allowAbsolute # If a path doesnt exist, try it as an absolute path (not recommended) | ${bold(blue("false"))}
  --certFile      # Specify certificate file - ${bold(blue("archaeopteryx.crt"))}
  --keyFile       # Specify certificate file - ${bold(blue("archaeopteryx.key"))}
  --entry         # Specify entrypoint | ${bold(blue("index.html"))}
  `);
};
var B = (e, o, r, s) => {
  let a3 = s ? "https" : "http", n = "";
  n == "" && (n = `      ${bold("Network:")}    Could not resolve network address
`), console.log(`

  ${bold(green("🦕  🚚 Archaeopteryx"))}

  Now serving ${bold(JSON.stringify(e))}:
    ${green(`${a3}://${r}:${o}
`)}
  `);
};
var p = (e) => {
  e.stack && console.error("err.stack is:", e.stack), console.error(`${bold(red(`
ERROR: ${e?.message || e}`))}`);
};
var V = (e) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charset="utf-8" />
      <link rel="stylesheet" type="text/css" href="/index.css">
      <link rel="icon" href="data:,">
      <title>${e}</title>
    </head>
    <body>
      <div id="archaeopteryx">
        <img src="/logo.svg" width="200" />
        <h1>I'm alive!</h1>
      </div>
    </body>
    <script type="text/javascript" src="/app.js"><\/script>
  </html>

`;
var Y = () => `
html,
body {
  height: 100%;
  width: 100%;
  font-family: Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  background-color: #fff;
  margin: 0;
  padding: 0;
}

#archaeopteryx {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#archaeopteryx > h1 {
  font-size: 20px;
  margin-bottom: 0;
  color: #333;
}

#archaeopteryx > p {
  color: #c4c4c4;
  text-align: center;
}

#archaeopteryx > div {
  display: flex;
}

strong {
  opacity: 0.2;
  font-weight: 200;
}`;
var _ = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 918 455.15">
  <defs>
    <style>
      .cls-1 {
        font-size: 104.71px;
        fill: #4d4d4d;
        font-family: Futura-Bold, Futura;
        font-weight: 700;
        letter-spacing: 0.29em;
      }
      .cls-2 {
        letter-spacing: 0.3em;
      }
      .cls-3 {
        fill: #ff825e;
      }
      .cls-4 {
        fill: #333;
      }
      .cls-5 {
        fill: #ffc59f;
      }
    </style>
  </defs>
  <g>
    <g>
      <text class="cls-1" transform="translate(0 419.13)">
        DE
        <tspan class="cls-2" x="202.72" y="0">N</tspan>
        <tspan x="329.42" y="0">OLIVER</tspan>
      </text>
      <path
        class="cls-3"
        d="M494.14,201.1s191.78,26.23,149-23C643.12,178.12,509.45,110.8,494.14,201.1Z"
      />
      <path
        class="cls-4"
        d="M586,215.66c-35.62,0-75-4.75-92.88-7.19l-7.61-1.05,1.29-7.57c3.71-21.86,14.13-37.27,31-45.8,46.41-23.46,125.34,15.75,128.67,17.43l1.31.65,1,1.11c10.07,11.58,8.87,20.15,6.09,25.3C647.7,211.73,618.41,215.66,586,215.66Zm-82.85-20.88c63.31,8,132.15,8.6,138.59-3.31.54-1-.3-3.63-3.3-7.35-10.28-4.91-77.17-35.39-114-16.78C513.86,172.72,506.84,181.73,503.16,194.78Z"
      />
      <path
        class="cls-3"
        d="M295.41,201.68c55,35.06,104.09-15.5,104.09-15.5s-14.87-53.45-69.41-33.61S295.41,201.68,295.41,201.68Z"
      />
      <path
        class="cls-4"
        d="M335.67,221.43c-13.8,0-28.83-3.65-44.26-13.48l-1.29-.83-.86-1.27A32.16,32.16,0,0,1,286,179.3c4.53-14,18.51-25.34,41.56-33.72,18.54-6.74,35.06-6.5,49.11.74,22.47,11.56,29.72,36.8,30,37.87l1.14,4.11-3,3.06C404.44,191.77,375,221.43,335.67,221.43ZM301,196.38c20,12.16,41.45,13.52,63.72,4.06a102.73,102.73,0,0,0,26.12-16.38c-2.66-6.34-9.06-18.44-21.08-24.57-10.19-5.21-22.68-5.18-37.11.07-18.26,6.64-29.5,15.05-32.5,24.32A17.32,17.32,0,0,0,301,196.38Z"
      />
      <path
        class="cls-5"
        d="M585.86,77.36l-53-44.84S449-44.93,349.73,72.4l-60.85,71.91s-42.22,42.22-23.3,58.23,82.4-66.67,150.53-9,101.33-50.65,202.65-16.88c36.1,11.07,57.94-22.41,27.66-48Z"
      />
      <path
        class="cls-4"
        d="M456.58,218.29c-14,0-28.77-5.13-45.27-19.09-40.79-34.51-79.85-13.95-108.39,1.06-17.75,9.35-31.78,16.73-42.14,8a21,21,0,0,1-7.49-15.6c-.88-21.25,26-49.21,30.11-53.34L344.06,67.6c35.79-42.3,73.85-65,113.11-67.38,47.89-3,79.43,25.62,80.75,26.84l113.3,95.87c16,13.53,21.21,31.64,13.3,46.13-6.84,12.53-24.33,21.94-47.94,14.69-47-15.64-77.26.47-106.58,16C492.32,209.19,475.19,218.29,456.58,218.29Zm-92.85-53c18.06,0,37.42,5.87,57.19,22.6,30.81,26.07,52.32,14.64,82.1-1.19,29.08-15.45,65.26-34.69,118.09-17.07,15.44,4.73,26.41-.43,30.35-7.66,4.45-8.15.68-18.74-9.84-27.65L528.07,38.2c-.51-.46-28.68-25.74-70.23-23.12-35,2.24-69.44,23.14-102.43,62.12l-72.83,86.07-.23-.19c-7.66,9.92-14.51,21.4-14.2,28.93a6.13,6.13,0,0,0,2.24,4.86c2.71,2.28,16.49-5,25.61-9.77C314,177.61,337.51,165.25,363.73,165.25Z"
      />
      <circle class="cls-4" cx="570.11" cy="134.08" r="7.44" />
      <circle class="cls-4" cx="609.52" cy="129.55" r="7.44" />
      <path
        class="cls-4"
        d="M518.31,76.35a7.42,7.42,0,0,1-4.8-1.76c-58.49-49.49-106.76-3-108.78-1A7.44,7.44,0,1,1,394.27,63c.6-.59,60.11-57.92,128.85.25a7.44,7.44,0,0,1-4.81,13.11Z"
      />
      <path
        class="cls-5"
        d="M462.94,111.79S359,104,317.12,78.87s-87.29,19.24,139.16,87.06"
      />
      <path
        class="cls-4"
        d="M456.29,173.37a7.55,7.55,0,0,1-2.14-.32C344.44,140.2,279.34,106.9,275.54,81.7a13.82,13.82,0,0,1,6.13-14c8.7-5.82,24.86-3.83,39.28,4.83,39.9,24,141.52,31.8,142.55,31.88a7.44,7.44,0,0,1-1.12,14.83c-4.31-.32-106.2-8.21-149.09-34-11.15-6.69-20.35-6.67-22.93-5.47,1.39,4,17,33.78,168.06,79a7.44,7.44,0,0,1-2.13,14.57Z"
      />
      <line class="cls-5" x1="463.96" y1="246.77" x2="528.41" y2="246.77" />
      <path
        class="cls-4"
        d="M528.41,254.21H464a7.44,7.44,0,1,1,0-14.87h64.45a7.44,7.44,0,1,1,0,14.87Z"
      />
      <line class="cls-5" x1="582.95" y1="246.77" x2="696.99" y2="246.77" />
      <path
        class="cls-4"
        d="M697,254.21H583a7.44,7.44,0,0,1,0-14.87H697a7.44,7.44,0,1,1,0,14.87Z"
      />
      <line class="cls-5" x1="553.2" y1="246.77" x2="558.16" y2="246.77" />
      <path
        class="cls-4"
        d="M558.16,254.21h-4.95a7.44,7.44,0,1,1,0-14.87h4.95a7.44,7.44,0,1,1,0,14.87Z"
      />
      <line class="cls-5" x1="295.38" y1="246.77" x2="315.21" y2="246.77" />
      <path
        class="cls-4"
        d="M315.21,254.21H295.38a7.44,7.44,0,1,1,0-14.87h19.83a7.44,7.44,0,1,1,0,14.87Z"
      />
      <line class="cls-5" x1="344.96" y1="246.77" x2="439.17" y2="246.77" />
      <path
        class="cls-4"
        d="M439.17,254.21H345a7.44,7.44,0,1,1,0-14.87h94.21a7.44,7.44,0,0,1,0,14.87Z"
      />
      <line class="cls-5" x1="419.33" y1="276.52" x2="612.7" y2="276.52" />
      <path
        class="cls-4"
        d="M612.7,284H419.33a7.44,7.44,0,0,1,0-14.88H612.7a7.44,7.44,0,0,1,0,14.88Z"
      />
      <line class="cls-5" x1="305.3" y1="276.52" x2="349.92" y2="276.52" />
      <path
        class="cls-4"
        d="M349.92,284H305.3a7.44,7.44,0,0,1,0-14.88h44.62a7.44,7.44,0,0,1,0,14.88Z"
      />
      <line class="cls-5" x1="156.55" y1="276.52" x2="280.5" y2="276.52" />
      <path
        class="cls-4"
        d="M280.51,284h-124a7.44,7.44,0,0,1,0-14.88h124a7.44,7.44,0,0,1,0,14.88Z"
      />
      <line class="cls-5" x1="637.49" y1="276.52" x2="761.45" y2="276.52" />
      <path
        class="cls-4"
        d="M761.45,284h-124a7.44,7.44,0,0,1,0-14.88h124a7.44,7.44,0,0,1,0,14.88Z"
      />
      <line class="cls-5" x1="374.71" y1="276.52" x2="394.54" y2="276.52" />
      <path
        class="cls-4"
        d="M394.54,284H374.71a7.44,7.44,0,0,1,0-14.88h19.83a7.44,7.44,0,0,1,0,14.88Z"
      />
      <line class="cls-5" x1="221.01" y1="246.77" x2="265.63" y2="246.77" />
      <path
        class="cls-4"
        d="M265.63,254.21H221a7.44,7.44,0,1,1,0-14.87h44.62a7.44,7.44,0,1,1,0,14.87Z"
      />
    </g>
  </g>
</svg>
`;
var b2 = class extends Error {
  constructor() {
    super(), this.message = "Argument is not type of ServerRequest. Did you forget to return the request object in your interceptor?";
  }
};
var J = (e, o) => {
  e.map((a3) => a3.name.split(".").slice(0, -1).join());
  let r = e.sort((a3) => a3.isDirectory ? -1 : 1);
  r = r.sort((a3, n) => {
    let d3 = a3.name.split(".").slice(0, -1).join("."), i = n.name.split(".").slice(0, -1).join(".");
    return d3.localeCompare(i);
  }), r = r.sort((a3, n) => {
    let d3 = a3.name.split(".").slice(-1)[0], i = n.name.split(".").slice(-1)[0];
    return d3.localeCompare(i);
  }), r = r.sort((a3) => a3.name.startsWith(".") ? -1 : 1);
  let s = ({ isForFiles: a3 = false }) => r.filter((n) => a3 ? n.isFile : !n.isFile).map((n) => `
                    <a
                        class="entry"
                        href="${n.url}" 
                        class="${a3 ? "file" : "directory"}" 
                        >
                            <span class="entry-name">${n.name}${a3 ? "" : "/"}</span>
                            <span class="entry-extension">${n.name.match(/\./) ? n.name.split(".").slice(-1)[0] : ""}</span>
                    </a>
                `).join("");
  return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charset="utf-8" />
                <title>archaeopteryx - ${o}</title>
            </head>
            <style>
                :root {
                        --text: #424242;
                        --background: #fff;
                        --background-highlight: whitesmoke;
                        --text-highlight: #a8a6b3;
                        --title: #4a5560;
                }

                @media (prefers-color-scheme: dark) {
                    :root {
                        --background: #2b333b;
                        --background-highlight: #3f4b57;
                        --text: #c1c3c4;
                        --text-highlight: #fff;
                        --title: #4a5560;
                    }
                }

                html,
                    body {
                        height: 100%;
                        width: 100%;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                        -webkit-font-smoothing: antialiased;
                        box-sizing: border-box;
                        background: var(--background);
                        margin: 0;
                    }
                    
                    #archaeopteryx {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: start;
                        margin: 0 auto;
                                max-width:1280px;
                        padding: 4rem;
                        padding-top: 1rem;
                        padding-bottom: 1rem;

                    }
                    
                    #archaeopteryx > h1 {
                        font-size: 36px;
                        margin-bottom: 0;
                        color: var(--title);
                        align-self: flex-start;
                    }
                    
                    strong {
                        opacity: 0.2;
                        font-weight: 200;
                    }

                    a {
                        text-decoration: none;
                        position: relative;
                        color: var(--text);
                        font-size: 14px;
                        font-style: bold;
                        font-family:
                        "SFMono-Regular",
                        Consolas,
                        "Liberation Mono",
                        Menlo,
                        Courier,
                        monospace;
                    }

                .contents {
                    display: flex;
                    flex-direction: row;
                    gap: 2rem;
                    margin-top: 1.5rem;
                    align-content: space-evenly;
                    justify-content: space-evenly;
                }

                .folder-contents, .file-contents {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                
                .entry {
                    display: flex;
                    flex-direction: row;
                    min-width: 10rem;
                    padding: 0.7rem;
                    background: var(--background);
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s ease-in-out 0s;
                }
                .entry:hover {
                    background: var(--background-highlight);
                }
                .entry:hover a {
                    color: var(--text-highlight);
                }
                .entry::before {
                    content: "";
                    width: 4px;
                    height: 0%;
                    background: #f27a3a;
                    display: block;
                    position: absolute;
                    top: 0;
                    left: -8px;
                    transition: 0.3s cubic-bezier(0.17, 0.67, 0.16, 0.99);
                }
                .entry:hover::before {
                    height: 100%;
                    transition: 0.3s cubic-bezier(0.17, 0.67, 0.16, 0.99);
                }
                
                .entry-name {
                    word-wrap: anywhere;
                }
                
                .entry-extension {
                    padding: 0.2rem;
                    opacity: 0.3;
                    border-radius: 0.1rem;
                    color: var(--background);
                    background: var(--text);
                    margin-left: 10px;
                }
            </style>
            <body>
                <div id="archaeopteryx">
                    <h1>${o}</h1>
                    <div class="contents">
                        <div class="folder-contents">
                            ${s({ isForFiles: false })}
                        </div>
                        <div class="file-contents">
                            ${s({ isForFiles: true })}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;
};
var ie = async (e, o, r) => {
  e.debug && (console.log("start of handleFileRequest()"), console.log("    path is:", r));
  try {
    let s = await Deno.open(r);
    return o.done.then(() => {
      s.close();
    }), await o.respond({ status: 200, headers: g(e.cors, r), body: s }).catch((a3) => {
      if (`${a3}` == "BrokenPipe: Broken pipe (os error 32)") {
        e.cors || console.warn("There may have been a CORS issue. Try setting the --cors flag if you're having problems.");
        return;
      }
      throw a3;
    });
  } catch (s) {
    !e.silent && e.debug ? console.error(s) : p(s), await D(e, o);
  }
};
var K = async (e, o, r) => {
  let s = `/${posix.relative(e.root, r)}`, a3 = [];
  for await (let n of Deno.readDir(r.replace(/\/$/, ""))) {
    let d3 = posix.join(s, "/", n.name);
    a3.push({ ...n, url: decodeURIComponent(d3) });
  }
  await o.respond({ status: 200, body: h3(J(a3, s)), headers: g(e.cors) });
};
var G = async (e, o) => {
  let r = new URL(o.headers.get("referer")).pathname.slice(1), [s, a3, n] = w(r), d3 = s.join("/"), i = R2(e.root, unescape(d3), unescape(o.url));
  e.debug && (console.debug("handleFileOrFolderRequest()"), console.debug("    path is:", i));
  let f = false, u;
  try {
    u = await Deno.stat(i), f = true;
  } catch (x) {
    if (!(x instanceof Deno.errors.NotFound)) throw x;
  }
  if (e.allowAbsolute && !f) try {
    i = `/${unescape(o.url)}`, u = await Deno.stat(i), f = true;
  } catch (x) {
    if (!(x instanceof Deno.errors.NotFound)) throw x;
  }
  let M;
  if (!f) e.silent || console.warn(`not found: ${o.url}`), M = await D(e, o);
  else return u?.isDirectory ? e.dontList ? await D(e, o) : await K(e, o, i) : await ie(e, o, i);
  return M;
};
var Q = async (e, o) => {
  e.debug && console.log("start of handleRouteRequest()");
  try {
    let r = `${e.root}/${e.entryPoint}`, s = await O(r), { hostname: a3, port: n } = o.conn.localAddr;
    await o.respond({ status: 200, headers: g(e.cors, r), body: e.disableReload ? s : q(s, n, a3, e.secure) });
  } catch (r) {
    `${r?.message}`.startsWith("No such file or directory (os error 2): readfile './index.html'") || (!e.silent && e.debug ? console.error(r) : p(r));
    let a3 = R2(e.root, unescape(o.url));
    await K(e, o, a3);
  }
};
var S = null;
var X = async (e, o) => {
  S || (S = Deno.watchFs(e.root, { recursive: true }));
  try {
    let { conn: r, r: s, w: a3, headers: n } = o, d3 = await acceptWebSocket({ conn: r, bufReader: s, bufWriter: a3, headers: n });
    for await (let i of S) i.kind === "modify" && await d3.send("reload");
  } catch (r) {
    !e.silent && p(r);
  }
};
var D = async (e, o) => o.respond({ status: 404, headers: g(e.cors), body: W(o.url) });
ensure({ denoVersion: "1.28.0" });
var t = { root: ".", port: 8080, hostname: null, debug: false, silent: false, disableReload: false, secure: false, help: false, cors: false, dontList: false, allowAbsolute: false, certFile: "archaeopteryx.crt", keyFile: "archaeopteryx.key", entryPoint: "index.html", before: [], after: [] };
var fe = async (e) => {
  t.debug && console.log("req is:", e);
  try {
    if (!(e instanceof ServerRequest)) throw new b2();
    if (U(e), !t.disableReload && N(e)) return await X(t, e);
    if (e.method === "GET" && e.url === "/") return await Q(t, e);
    await G(t, e);
  } catch (o) {
    !t.silent && t.debug ? console.log(o) : p(o), o instanceof b2 && Deno.exit();
  }
};
var ee = (e, o) => {
  let r = Array.isArray(o) ? o : [o];
  return z(...r)(e);
};
var ye = async (e, o) => {
  try {
    for await (let r of e) t.before.length > 0 ? o(await ee(r, t.before)) : o(r), t.after.length > 0 && ee(r, t.after);
  } catch (r) {
    !t.silent && t.debug ? console.error(r) : p(r);
  }
};
var F = async (e) => {
  if (t.root = e.root ?? ".", t.hostname = e.hostname, t.help = e.help ?? false, t.debug = e.debug ?? false, t.silent = e.silent ?? false, t.disableReload = e.disableReload ?? false, t.port = e.port ?? 8080, t.secure = e.secure ?? false, t.cors = e.cors ?? false, t.dontList = e.dontList ?? false, t.allowAbsolute = e.allowAbsolute ?? false, t.certFile = e.certFile ?? "archaeopteryx.crt", t.keyFile = e.keyFile ?? "archaeopteryx.key", t.entryPoint = e.entryPoint ?? "index.html", e.before) if (typeof e.before == "function") t.before = e.before;
  else try {
    let r = await import(posix.resolve(`${t.root}/${e.before}`));
    t.before = r.default;
  } catch (o) {
    !t.silent && t.debug ? console.error(o) : p(o);
  }
  if (e.after) if (typeof e.after == "function") t.before = e.after;
  else try {
    let r = await import(posix.resolve(`${t.root}/${e.after}`));
    t.after = r.default;
  } catch (o) {
    !t.silent && t.debug ? console.error(o) : p(o);
  }
};
var me = async (e, o) => {
  await Deno.mkdir(`${e}/${o}`, { recursive: true });
  let r = h3(V(o)), s = h3(Y()), a3 = h3(_());
  await Deno.writeFile(`${e}/${o}/index.html`, r), await Deno.writeFile(`${e}/${o}/index.css`, s), await Deno.writeFile(`${e}/${o}/logo.svg`, a3), await Deno.writeFile(`${e}/${o}/app.js`, h3(""));
};
var te = async (e) => {
  if (e && F(e), t.help && (k(), Deno.exit()), t.port && !T2(t.port) && (p(`${t.port} is not a valid port.`), Deno.exit()), t.secure) {
    let n = isAbsolute3(t.certFile) ? t.certFile : `${t.root}/${t.certFile}`, d3 = isAbsolute3(t.keyFile) ? t.keyFile : `${t.root}/${t.keyFile}`, i = await Deno.stat(n).catch((u) => null), f = await Deno.stat(d3).catch((u) => null);
    (!i || !f) && (i || console.error(`I was unable to find a cert file at ${JSON.stringify(n)}`), f || console.error(`I was unable to find a key file at ${JSON.stringify(n)}`), Deno.exit(1));
  }
  let o = isAbsolute3(t.certFile) ? t.certFile : `${t.root}/${t.certFile}`, r = isAbsolute3(t.keyFile) ? t.keyFile : `${t.root}/${t.keyFile}`, s = Deno.networkInterfaces().filter((n) => n.family == "IPv4").map((n) => n.address);
  !t.hostname && t.secure && s.some((n) => n != "127.0.0.1") ? t.hostname = s.filter((n) => n != "127.0.0.1")[0] : t.hostname || (t.hostname = s[0]), B(t.root, t.port, t.hostname, t.secure);
  let a3 = t.secure ? serveTLS({ port: t.port, certFile: o, keyFile: r, hostname: t.hostname }) : serve({ port: t.port, hostname: t.hostname });
  return ye(a3, fe), a3;
};
if (import.meta.main) {
  v = { boolean: ["h", "help", "d", "debug", "n", "noReload", "t", "secure", "f", "filesOnly", "c", "cors", "s", "silent", "allowAbsolute"], default: { p: void 0, port: void 0, certFile: "archaeopteryx.crt", keyFile: "archaeopteryx.key", entry: "index.html" } };
  let e = parse7(Deno.args, v);
  e.h = e.h || e.help, e.d = e.d || e.debug, e.n = e.n || e.noReload, e.t = e.t || e.secure, e.f = e.f || e.filesOnly, e.c = e.c || e.cors, e.s = e.s || e.silent, e.p = e.p ?? e.port;
  let o = v.boolean.concat(Object.keys(v.default));
  for (let s of Object.keys(e)) if (s != "_") try {
    didYouMean({ givenWord: s, possibleWords: o, autoThrow: true });
  } catch {
    k(), Deno.exit(1);
  }
  await F({ root: e._.length > 0 ? String(e._[0]) : ".", debug: e.d, silent: e.s, disableReload: e.n, port: e.p, secure: e.t, help: e.h, cors: e.c, dontList: e.f, allowAbsolute: e.allowAbsolute, certFile: e.certFile, keyFile: e.keyFile, entryPoint: e.entry, before: e.before, after: e.after });
  try {
    let s = await Deno.readFile(`${t.root}/archaeopteryx.json`);
    F(JSON.parse($(s)));
  } catch {
  }
  let r = Deno.cwd();
  try {
    Deno.readDirSync(`${r}/${t.root}`);
  } catch (s) {
    if (s instanceof Deno.errors.NotFound) {
      let a3 = await L(`The directory ${t.root} does not exist. Do you wish to create it? [y/n]`);
      await me(r, t.root);
    }
  }
  te();
}
var v;
var Pt = te;
export {
  Pt as default
};
