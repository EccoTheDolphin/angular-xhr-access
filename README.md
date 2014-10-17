#angularXhrAccess

---

## Motivation

[AngularJS](http://angularjs.org/) framework provides
[**$htpp**](https://docs.angularjs.org/api/ng/service/$http) service for
accessing HTTP servers. As for now, this service does not support **progress**
notifications, nor does it provide access to underlying
[**XHR**](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
object. This module provides services that allow you to get access
to underling **XHR** and thus grants you ability to receive
**progress** notification or, for example, **cancel** already running request.

    NOTE: Although the XHR object is a standard, there are variations in its
    behavior on different browsers - so use it with caution.


## About

**angularXhrAccess** is a module for the [AngularJS](http://angularjs.org/)
framework. This module provides the following services:

* **XhrAccessService** - gives you ability to access **XHR** instance that was
created by **$http** service.
* **XhrProgressService** - provides you with "quick and dirty" way to recieve
**progress** notification of **XHR**.

##How it works

TBDN

##Usage

TBDN

