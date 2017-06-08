(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.TextInputValidator = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _class = function () {
    /*
      Arguments:
        opts = {
          element: DOM Element,
          input: RegExp | function(value),
          blur: RegExp | function(value),
          onValidityChange(valid)
        }
         element: the input element
         input: RegExp or function. Optional. Rule for checking on input.
          It can return immediately or return a promise that resolves with value:
            true: valid
            false: invalid
            null | undefined: initial state
            other types: your custom state, e.g. invalid message, password strength, etc.
         blur: Rule for checking on blur. Optional. Similar to input. Will also check the standard HTML5 validating attributes (such as "required" and "pattern") via HTMLInputElement.checkValidity()
         onValidityChange(valid): callback function.
          arguments:
            valid: the result given by input and blur
    */
    function _class(opts) {
      var _this = this;

      _classCallCheck(this, _class);

      Object.assign(this, opts);
      this.valid = null;
      this._promise = null;
      this._oldValue = null;

      var composing = void 0;

      this._oninput = function () {
        if (!_this.input || composing || _this.element.value === _this._oldValue) return;

        _this._oldValue = null;

        Promise.resolve(_this.input.constructor === Function ? _this.input(_this.element.value) : _this.input.test(_this.element.value)).then(function () {
          var valid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

          if (_this.valid !== valid) {
            _this.valid = valid;
            _this.onValidityChange(valid);
          }

          return valid;
        });
      };

      this._onblur = function () {
        _this.check(false);
      };

      this._compositionstart = function () {
        return composing = true;
      };
      this._compositionend = function () {
        return composing = false;
      };

      this.on();
    }

    /*
      Validate manually.
       Arguments:
        force: force to call onValidityChange callback.
       Returns promise.
    */


    _class.prototype.check = function check() {
      var _this2 = this;

      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.element.value === this._oldValue) {
        if (force) this.onValidityChange(this.valid);
        return this._promise;
      }

      this._oldValue = this.element.value;
      this._promise = Promise.resolve(this.element.checkValidity() && (!this.blur || (this.blur.constructor === Function ? this.blur(this.element.value) : this.blur.test(this.element.value)))).then(function () {
        var valid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (force || _this2.valid !== valid) {
          _this2.valid = valid;
          _this2.onValidityChange(valid);
        }

        return valid;
      });
      return this._promise;
    };

    _class.prototype.setRules = function setRules(rules) {
      Object.assign(this, rules);
      if (rules.blur && this._oldValue !== null && document.activeElement !== this.element) {
        this._oldValue = null;
        this._onblur();
      } else if (rules.input && document.activeElement === this.element) {
        this._oninput();
      }
    };

    _class.prototype.setValidity = function setValidity() {
      var valid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (this.valid !== valid) {
        this.valid = valid;
        this._promise = Promise.resolve(valid);
        this.onValidityChange(valid);
      }
    };

    _class.prototype.on = function on() {
      this.element.addEventListener('input', this._oninput);
      this.element.addEventListener('blur', this._onblur);
      this.element.addEventListener('compositionstart', this._compositionstart);
      this.element.addEventListener('compositionend', this._compositionend);
    };

    _class.prototype.off = function off() {
      this.element.removeEventListener('input', this._oninput);
      this.element.removeEventListener('change', this._onblur);
      this.element.removeEventListener('compositionstart', this._compositionstart);
      this.element.removeEventListener('compositionend', this._compositionend);
    };

    return _class;
  }();

  exports.default = _class;
  module.exports = exports['default'];
});