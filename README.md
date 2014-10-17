#Angular XHR Access

---

## Motivation

[AngularJS](http://angularjs.org/) framework provides
[**$http**](https://docs.angularjs.org/api/ng/service/$http) service for
accessing HTTP servers. As for now, this service neither supports **progress**
notifications, nor provides access to the underlying
[**XHR**](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
object. This module provides services that allow you to get access
to underling **XHR** and thus enables you to receive
**progress** notification or, for example, to
[**abort**](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#abort%28%29)
already running request.

    NOTE: Although the XHR object is a standard, there are variations in its
    behavior on different browsers - so use it with caution.


## About

**angularXhrAccess** is a module for the [AngularJS](http://angularjs.org/)
framework. It provides the following services:

* **XhrAccessService** - gives you the ability to access **XHR** instance that
was created by **$http** service.
* **XhrProgressService** - provides you with "quick and dirty" way to receive
**progress** notification for your ajax requests.

##How this module works

**Its a hack** - but it helps to get the job done :). That being said, you
should use this module only if you know what you are doing.

1. Current AngularJS implementation uses **window.XMLHttpRequest** to create
**XHR** for **$http** service. This module overrides this global object with a
tiny wrapper. When angular tries to create **xhr** it creates this wrapper
instead, and upon creation this wrapper monkey-patches **open** method of
original **xhr** to inject some custom logic.

2. When **http** service tries to call **open** method of its **xhr** object,
it actually calls our monkey-patched version of this method, which in turn
(after our custom logic is executed) calls original.

3. This custom logic mentioned above does the following:
  1. It searches for a specific pattern in a url.
  2. If url contains this specific pattern it removes this pattern from a url
  and then calls callbacks corresponding  to this pattern.

4. To provide callbacks and modify original url you must use services that
this module provides.


##Usage

**XHR access:**

```js
angular.module('app', [
  'angularXhrAccess'
]).run([
  '$http',
  '$log',
  'XhrAccessService',
  function ($http, $log, xhra) {
    'use strict';
    var url = 'https://api.github.com/';
    //modify url and provide callback
    //NOTE: URL WILL BE RESTORED TO ORIGINAL STATE BEFORE ACTUAL AJAX CALL
    url = xhra.hookupUrl(url, function (xhr) {
      //here we have access to xhr object
      $log.log('your XHR object:', xhr);
    });
    //make AJAX request
    $http.get(url).then(function (result) {
      $log.log(result.data);
    });
  }
});
```

**Progress event:**

```js
angular.module('app', [
  'angularXhrAccess'
]).run([
  '$http',
  '$log',
  'XhrProgressService',
  function ($http, $log, xhrp) {
    'use strict';
    var url = 'https://api.github.com/';
    var form = new FormData();
    form.append('example_field', 'example_field');
    //modify url and provide callback
    //NOTE: URL WILL BE RESTORED TO ORIGINAL STATE BEFORE ACTUAL AJAX CALL
    url = xhrp.hookupUrl(url, function (evt) {
      //here we have access to *progress* event
      $log.log('your *progress* event:', evt);
    });
    var headers = { 'Content-Type' : undefined };
    //this request will end up with 404, but you will receive *progress* event
    $http.post(url, form, {headers : headers}).then(function (result) {
      $log.log(result.data);
    });
  }
]);
```

##Install

####Bower

```sh
bower install angular-xhr-access
```

