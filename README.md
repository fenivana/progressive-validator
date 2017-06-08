# text-input-validator
Progressive text input control validator.

Most validate-while-typing validators are annoying, they will flash red warning at you when you type first letter. Well of course, I havn't finished typing yet!

This validator is not the same. It can use different checking rules on typing and finished.

## Usage
See file `examples/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="../dist/TextInputValidator.js"></script>
</head>

<body>
<p>Email: <input type="text" id="foo"> <span id="error-foo"></span></p>
<p><button onclick="forceSetError()">force set error</button></p>

<script>
function isRegistered(email) {
  // emulate a remote API call
  return new Promise(resolve => {
    setTimeout(() => {
      const registeredEmail = [
        'foo@example.com',
        'bar@example.com'
      ]

      resolve(registeredEmail.includes(email))
    }, 300)
  })
}

const validator = new TextInputValidator({
  element: document.getElementById('foo'),

  input: /(?!.*[-_.+@]{2,})(?!^[-_.+@])^[-_.+a-z0-9]+(@([-.a-z0-9]+)?)?$/i,

  blur: function(email) {
    return /(?!.*[-_.+@]{2,})(?!^[-_.+@])^[-_.+a-z0-9]+@[-.a-z0-9]+\.[a-z]+$/i.test(email) && isRegistered(email).then(reged => !reged || 'this email has been taken')
  },

  onValidityChange(valid) {
    document.getElementById('error-foo').textContent = valid === true || valid === null ? '' : valid || 'invalid'
  }
})

function forceSetError() {
  validator.setValidity('force error')
}
</script>
</body>
</html>
```

## APIs

### new TextInputValidate({ element, input, blur, onValidityChange })

`element`: the input element

`input`: RegExp or function. Optional. Rule for checking on input. It can return immediately or return a promise that resolves with value:

```
true: valid
false: invalid
null | undefined: initial state
other types: your custom state, e.g. invalid message, password strength, etc.
```

`blur`: Rule for checking on blur. Optional. Similar to input. Will also check the standard HTML5 validating attributes (such as "required" and "pattern") via HTMLInputElement.checkValidity()

`onValidityChange(valid)`: callback function. called when validity changes.

`valid`: the result given by input and blur.


### textInputValidate.check(force = true)

Validate manually.

`force`: force to call onValidityChange callback.

Returns promise.


### textInputValidate.setRules({ input, blur })

Set new rules for input and blur


### textInputValidate.setValidity(valid)

Set validity of the input control.

`valid`: same as input and blur option of constructor.

If validity is not equal to current state, onValidityChange callback will be called.


### textInputValidate.on()

Turn on validator


### textInputValidate.off()

Turn off validator


## Build

```
npm run build
```


## License
MIT
