var config = {
  url: '127.0.0.1:9090',
  projectName: 'webeye',
  appId: 'sss',
  useId: '2222',
  isImageUpload: false,
  batchSize: 4
};

// 合并config对象
function setConfig(options) {
  for (var key in config) {
    if (options[key]) {
      config[key] = options[key];
    }
  }
}

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function deepClone(obj) {
  if (_typeof(obj) !== 'object' || obj === null) {
    return obj;
  }
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}

var cache = [];
function getCache() {
  return deepClone(cache);
}
function setCache(data) {
  cache.push(data);
}
function clearCache() {
  cache.length = 0;
}

var originProto = XMLHttpRequest.prototype;
var originOpen = originProto.open;
var originSend = originProto.send;
function generateUniqueId() {
  return 'id-' + Date.now() + Math.random().toString(36).substring(2, 9);
}
function report(data) {
  if (!config.url) {
    console.error('请上传url地址');
  }
  var reportData = JSON.stringify({
    id: generateUniqueId(),
    data: data
  });
  if (config.isImageUpload) {
    imgRequest(reportData);
  } else {
    // 发送数据优先使用sendBeacon
    if (window.navigator.sendBeacon) {
      beaconRequest(reportData);
    } else {
      xhrRequest(reportData);
    }
  }
}
function lazyBatchUpload(data) {
  setCache(data);
  var cacheData = getCache();
  console.error("🚀 ~ lazyBatchUpload ~ cacheData:", cacheData);
  if (cacheData.length && cacheData.length > config.batchSize) {
    report(cacheData);
    clearCache();
  }
}

// 图片请求上报数据
function imgRequest(data) {
  var img = new Image();
  img.src = "".concat(config.url, "?data=").concat(encodeURIComponent(JSON.stringify(data)));
}

// xhr请求上报数据
function xhrRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      var xhr = new XMLHttpRequest();
      originOpen.call(xhr, 'post', config.url);
      originSend.call(xhr, JSON.stringify(data));
    }, {
      timeout: 3000
    }); //没有空闲时间就延迟三秒
  } else {
    setTimeout(function () {
      var xhr = new XMLHttpRequest();
      originOpen.call(xhr, 'post', config.url);
      originSend.call(xhr, JSON.stringify(data));
    });
  }
}

// const sendBeacon = isSupportSendBeacon() ? navigator.sendBeacon : beaconRequest

function beaconRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      navigator.sendBeacon(config.url, data);
    }, {
      timeout: 3000
    }); //没有空闲时间就延迟三秒
  } else {
    setTimeout(function () {
      navigator.sendBeacon(config.url, data);
    });
  }
}

function pageChange() {
  var oldUrl = '';
  window.addEventListener('hashchange', function (event) {
    var newUrl = event.newURL;
    if (oldUrl !== newUrl) {
      var reportData = {
        from: oldUrl,
        to: newUrl,
        type: 'behavior',
        subType: 'hashChange',
        startTime: performance.now(),
        uuid: generateUniqueId()
      };
      lazyBatchUpload(reportData);
      oldUrl = newUrl;
    }
  }, true);
  var from = '';
  window.addEventListener('popstate', function (event) {
    var to = window.location.href;
    if (from !== to) {
      var reportData = {
        from: from,
        to: to,
        type: 'behavior',
        subType: 'popState',
        startTime: performance.now(),
        uuid: generateUniqueId()
      };
      lazyBatchUpload(reportData);
      from = to;
    }
  }, true);
}

function click() {
  ['onmousedown', 'ontouchstart'].forEach(function (eventType) {
    window.addEventListener(eventType, function (event) {
      var target = event.target;
      if (target.tagName) {
        var reportData = {
          type: 'behavior',
          subType: 'click',
          target: target.tagName,
          startTime: event.timeStamp,
          innerHTML: target.innerHTML,
          outerHTML: target.outerHTML,
          width: target.offsetWidth,
          height: target.offsetHeight,
          eventType: eventType,
          path: event.path
          // scrollTop: 
        };
        lazyBatchUpload(reportData);
      }
    });
  });
}

function pv() {
  var reportData = {
    type: 'behavior',
    subType: 'pv',
    startTime: performance.now(),
    pageUrl: window.location.href,
    referrer: document.referrer,
    uuid: generateUniqueId()
  };
  lazyBatchUpload(reportData);
}

function behavior() {
  pageChange();
  click();
  pv();
}

var originalFetch = window.fetch;
function overWriteFetch() {
  window.fetch = function newFetch(url, config) {
    // console.log('newFetch', args)
    var startTime = Date.now();
    var reportData = {
      type: 'performance',
      subType: 'fetch',
      url: url,
      startTime: startTime,
      method: config.method
    };
    return originalFetch(url, config).then(function (res) {
      var endTime = Date.now();
      reportData.endTime = endTime;
      reportData.duration = endTime - startTime;
      var data = res.clone();
      reportData.status = data.status;
      reportData.success = data.ok;
      // todo 上报数据
      lazyBatchUpload(reportData);
      return res;
    }).catch(function (err) {
      var endTime = Date.now();
      reportData.endTime = endTime;
      reportData.duration = endTime - startTime;
      reportData.status = 0;
      reportData.success = false;
      // todo 上报数据
      lazyBatchUpload(reportData);
    });
  };
}
function fetch() {
  overWriteFetch();
}

var originalProto = XMLHttpRequest.prototype;
var originalSend = originalProto.send;
var originalOpen = originalProto.open;
function overwriteOpenAndSend() {
  originalProto.open = function newOpen() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this.url = args[1];
    this.method = args[0];
    originalOpen.apply(this, args);
  };
  originalProto.send = function newSend() {
    this.startTime = Date.now();
    var _onLoaded = function onLoaded(params) {
      this.endTime = Date.now();
      this.duration = this.endTime - this.startTime;
      this.method;
        this.url;
        this.startTime;
        this.endTime;
        this.duration;
        this.status;
      this.removeEventListener('loadend', _onLoaded);
    };
    this.addEventListener('loadend', _onLoaded);
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    originalSend.apply(this, args);
  };
}
function xhr() {
  overwriteOpenAndSend();
}

function observerEntries() {
  if (document.readyState === 'compolete') {
    observeEvent();
  } else {
    var _onLoad = function onLoad() {
      observeEvent();
      window.removeEventListener('load', _onLoad, true);
    };
    window.addEventListener('load', _onLoad, true);
  }
}
function observeEvent() {
  var eventHandler = function eventHandler(list) {
    var data = list.getEntries();
    var _iterator = _createForOfIteratorHelper(data),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (observer) {
          observer.disconnect();
        }
        var reportData = {
          name: entry.name,
          type: 'performance',
          subType: entry.entryType,
          sourceType: entry.initiatorType,
          // 资源类型
          duration: entry.duration,
          dns: entry.domainLookupEnd - entry.domainLookupStart,
          // dns解析时间
          tcp: entry.connectEnd - entry.connectStart,
          // tcp连接时间
          redircet: entry.redirectEnd - entry.redirectStart,
          // 重定向时间
          ttfb: entry.responseStart,
          // 首字节时间
          protocol: entry.nextHopProtocol,
          // 请求协议
          responseBodySize: entry.encoddedBodySize,
          // 请求大小
          transferSize: entry.transferSize,
          // 传输大小
          responseHeadersSize: entry.transferSize - entry.encoddedBodySize,
          // 响应头大小
          resourceSize: entry.decodedBodySize,
          // 资源解压缩之后的大小
          startTime: performance.now()
        };
        lazyBatchUpload(reportData);
        console.log("🚀 ~ eventHandler ~ entry:", entry);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observer = new PerformanceObserver(eventHandler);
  observer.observe({
    type: ['resource'],
    buffered: true
  });
}

function observerLCP() {
  var entryHandler = function entryHandler(list) {
    if (observer) {
      observer.disconnect();
    }
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        console.log(entry);
        if (entry.name === 'largest-contentful-paint') {
          var json = entry.toJSON();
          console.log(json);
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: "performance",
            subType: entry.name,
            pageUrl: window.location.href
          });
          // 发送数据
          lazyBatchUpload(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: 'largest-contentful-paint',
    buffered: true // 确保能观察到所有paint事件
  });
}

function observerLoad() {
  window.addEventListener('load', function (event) {
    requestAnimationFrame(function () {
      ['load'].forEach(function (type) {
        var reportData = {
          type: 'performance',
          subType: type,
          pageUrl: window.location.href,
          startTime: performance.now() - event.timeStamp
        };
        lazyBatchUpload(reportData);
      });
    });
  });
}

function observerPaint() {
  var entryHandler = function entryHandler(list) {
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        console.log(entry);
        if (entry.name === 'first-paint') {
          observe.disconnect();
          var json = entry.toJSON();
          console.log(json);
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: "performance",
            subType: entry.name,
            pageUrl: window.location.href
          });
          // 发送数据
          lazyBatchUpload(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observe = new PerformanceObserver(entryHandler);
  observe.observe({
    type: 'paint',
    buffered: true
  });
}

function observeFCP() {
  var entryHandler = function entryHandler(list) {
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        console.log(entry);
        if (entry.name === 'first-contentful-paint') {
          observe.disconnect();
          var json = entry.toJSON();
          console.log(json);
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: "performance",
            subType: entry.name,
            pageUrl: window.location.href
          });
          // 发送数据
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observe = new PerformanceObserver(entryHandler);
  observe.observe({
    type: 'paint',
    buffered: true
  });
}

function performance$1() {
  fetch();
  xhr();
  observerLCP();
  observerLoad();
  observerPaint();
  observeFCP();
  observerEntries();
}

function error() {
  // 捕获资源的加载错误 js css img
  window.addEventListener('error', function (e) {
    var target = e.target;
    console.log("🚀 ~ window.addEventListener ~ target:", target);
    if (!target) {
      return;
    }
    if (target.src || target.href) {
      var url = target.src || target.href;
      var reportData = {
        type: 'error',
        subType: 'resource',
        url: url,
        html: target.outerHTML,
        pageUrl: window.location.href,
        path: e.path
      };
      lazyBatchUpload(reportData);
    }
  }, true);
  window.onerror = function (msg, url, line, col, error) {
    var reportData = {
      type: 'error',
      subType: 'js',
      msg: msg,
      url: url,
      line: line,
      col: col,
      error: error && error.stack,
      pageUrl: window.location.href,
      path: error.path,
      startTime: performance.now()
    };
    // 上报
    lazyBatchUpload(reportData);
  };
  // 监听promise错误
  window.addEventListener('unhandledrejection', function (e) {
    var reportData = {
      type: 'error',
      subType: 'promise',
      reason: e.reason,
      pageUrl: window.location.href,
      startTime: e.timeStamp
    };
    // 上报
    lazyBatchUpload(reportData);
  }, true);
}

window.__webEyeSDK__ = {
  version: '1.0.0'
};
function install(Vue, options) {
  console.log("🚀 ~ install ~ options:", options);
  setConfig(options);
  if (__webEyeSDK__.vue) return;
  __webEyeSDK__.vue = true;
  var handler = Vue.config.errorHandler;
  Vue.config.errorHandler = function (err, vm, info) {
    var reportData = {
      info: info,
      error: err,
      type: 'error',
      subType: 'vue',
      startTime: window.performance.now(),
      pageURL: window.location.href
    };
    lazyBatchUpload(reportData);
    if (handler) {
      handler.call(this, err, vm, info);
    }
  };
}
function errorBoundary(err, info) {
  if (__webEyeSDK__.react) return;
  __webEyeSDK__.react = true;
  var reportData = {
    error: err.stack,
    info: info,
    type: 'error',
    subType: 'react',
    startTime: window.performance.now(),
    pageURL: window.location.href
  };
  lazyBatchUpload(reportData);
}
function init(options) {
  setConfig(options);
  // error()
  performance$1();
}
var webEyeSDK = {
  install: install,
  errorBoundary: errorBoundary,
  behavior: behavior,
  performance: performance$1,
  error: error,
  init: init
};

export { webEyeSDK as default, init, install };
//# sourceMappingURL=monitor.esm.js.map
