/*global window, angular
 */

angular.module('angularXhrAccess', [])
  .provider('XhrAccessService', function () {
    'use strict';

    function XhrAccessService(prefix_str) {

      if (!prefix_str) {
        prefix_str = 'access_service_id_postfix';
      }
      var callbacks = {
      };
      var XMLHttpRequest = window.XMLHttpRequest;
      var expr_progress_id = new RegExp('\\?' + prefix_str + '=[0-9]+$');

      window.XMLHttpRequest = function () {

        var xhr = new XMLHttpRequest();
        var open = xhr.open;
        xhr.open = function () {
          var args   = Array.prototype.slice.call(arguments);
          var url    = args[1];
          var result = expr_progress_id.exec(url);
          if (result) {
            var callback_id = url.substring(result.index);
            var prefix      = '?' + prefix_str + '=';
            callback_id     = callback_id.substring(prefix.length);
            url = url.substring(0, result.index);

            if (callbacks[callback_id]) {
              callbacks[callback_id](xhr);
              delete callbacks[callback_id];
            }
          }
          args[1]  = url;
          open.apply(xhr, args);
        };
        return xhr;
      };
      return {
        hookupUrl : function (url, callback, xhr_decorator) {
          xhr_decorator = xhr_decorator || angular.identity;
          var id = Math.random().toString().substring(2);
          url = url + '?' + prefix_str + '=' + id;
          //100% fault-tolerance ^-^
          if (callbacks[id]) {
            return this.hookupUrl(url, callback, xhr_decorator);
          }
          callbacks[id] = function (xhr) {
            callback(xhr_decorator(xhr));
          };
          return url;
        }
      };
    }
    var postfix_str = '';
    this.setUrlPostfix = function (name) {
      //TODO: add checks for invalid symbols
      postfix_str = name;
      return;
    };
    this.$get = function () {
      return new XhrAccessService(postfix_str);
    };
  })
  .service('XhrProgressService', [
    'XhrAccessService',
    function (xhr_access) {
      'use strict';
      this.hookupUrl = function (url, callback) {
        return xhr_access.hookupUrl(url, function (xhr) {
          var progress_event  = 'progress';
          var fini_events     = ['load', 'error', 'abort'];

          var progress = function (evt) {
            if (callback) {
              callback(evt);
            }
          };
          var finalize = function () {
            xhr.upload.removeEventListener(progress_event, progress);
            fini_events.forEach(function (event_name) {
              xhr.upload.removeEventListener(event_name, finalize);
            });
          };
          if (xhr.upload &&
                xhr.upload.addEventListener && xhr.upload.removeEventListener) {
            xhr.upload.addEventListener(progress_event, progress);
            fini_events.forEach(function (event_name) {
              xhr.upload.addEventListener(event_name, finalize);
            });
          }
        });
      };
    }]);
