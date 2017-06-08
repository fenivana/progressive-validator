export default class {
  /*
    Arguments:
      opts = {
        input: RegExp | function(value),
        blur: RegExp | function(value),
        onValidityChange(valid)
      }

      input: RegExp or function. Optional. Rule for checking on input.
        It can return immediately or return a promise that resolves with value:
          true: valid
          false: invalid
          null | undefined: initial state
          other types: your custom state, e.g. invalid message, password strength, etc.

      blur: Rule for checking on blur. Optional. Similar to input.

      onValidityChange(valid): callback function.
        arguments:
          valid: the result given by input and blur
  */
  constructor(opts) {
    Object.assign(this, opts)
    this.valid = null
    this._promise = null
    this._oldValue = null

    this.oninput = value => {
      if (!this.input || value === this._oldValue) return

      this._oldValue = null

      Promise.resolve(
        this.input.constructor === Function ? this.input(value) : this.input.test(value)
      ).then((valid = null) => {
        if (this.valid !== valid) {
          this.valid = valid
          this.onValidityChange(valid)
        }

        return valid
      })
    }

    this.onblur = value => {
      this.check(value, false)
    }
  }

  /*
    Validate manually.

    Arguments:
      value: the value to validate
      force: force to call onValidityChange callback.

    Returns promise.
  */
  check(value, force = true) {
    if (!this.blur || value === this._oldValue) {
      if (force) this.onValidityChange(this.valid)
      return this._promise
    }

    this._oldValue = value
    this._promise = Promise.resolve(
      this.blur.constructor === Function ? this.blur(value) : this.blur.test(value)
    ).then((valid = null) => {
      if (force || this.valid !== valid) {
        this.valid = valid
        this.onValidityChange(valid)
      }

      return valid
    })
    return this._promise
  }

  /*
    Set new rules for input and blur
    arguments:
      rules = {
        input,
        blur
      }
  */
  setRules(rules) {
    Object.assign(this, rules)
    this._oldValue = null
  }

  /*
    Set validity of the input control.

    Arguments:
      valid: same as input and blur option of constructor

    If valid is not equal to current state, onValidityChange callback will be called.
  */
  setValidity(valid = null) {
    if (this.valid === valid) return

    this.valid = valid
    this._promise = Promise.resolve(valid)
    this.onValidityChange(valid)
  }
}
