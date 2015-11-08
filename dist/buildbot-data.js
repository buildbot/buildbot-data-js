(function() {
  var App;

  App = (function() {
    function App() {
      return [];
    }

    return App;

  })();

  angular.module('bbData', new App());

}).call(this);

(function() {
  var Api, Endpoints;

  Api = (function() {
    function Api() {
      return 'api/v2/';
    }

    return Api;

  })();

  Endpoints = (function() {
    function Endpoints() {
      return ['builders', 'builds', 'buildrequests', 'buildslaves', 'buildsets', 'changes', 'changesources', 'masters', 'sourcestamps', 'schedulers', 'forceschedulers'];
    }

    return Endpoints;

  })();

  angular.module('bbData').constant('API', Api()).constant('ENDPOINTS', Endpoints());

}).call(this);

(function() {
  var Base,
    slice = [].slice;

  Base = (function() {
    function Base(dataService, socketService, dataUtilsService) {
      var BaseInstance;
      return BaseInstance = (function() {
        function BaseInstance(object, _endpoint, childEndpoints) {
          var classId;
          this._endpoint = _endpoint;
          if (childEndpoints == null) {
            childEndpoints = [];
          }
          if (!angular.isString(this._endpoint)) {
            throw new TypeError("Parameter 'endpoint' must be a string, not " + (typeof this.endpoint));
          }
          this.update(object);
          this.constructor.generateFunctions(childEndpoints);
          classId = dataUtilsService.classId(this._endpoint);
          this._id = this[classId];
          if (this._id != null) {
            this._endpoint = dataUtilsService.type(this._endpoint);
          }
          this.subscribe();
        }

        BaseInstance.prototype.update = function(o) {
          return angular.merge(this, o);
        };

        BaseInstance.prototype.get = function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return dataService.get.apply(dataService, [this._endpoint, this._id].concat(slice.call(args)));
        };

        BaseInstance.prototype.subscribe = function() {
          var listener;
          listener = (function(_this) {
            return function(data) {
              var key, message, streamRegex;
              key = data.k;
              message = data.m;
              streamRegex = RegExp("^" + _this._endpoint + "\\/" + _this._id + "\\/\\w+$", "g");
              if (streamRegex.test(key)) {
                return _this.update(message);
              }
            };
          })(this);
          this._unsubscribeEventListener = socketService.eventStream.subscribe(listener);
          return this._listenerId = listener.id;
        };

        BaseInstance.prototype.unsubscribe = function() {
          var k, v;
          for (k in this) {
            v = this[k];
            if (angular.isArray(v)) {
              v.forEach(function(e) {
                if (e instanceof BaseInstance) {
                  return e.unsubscribe();
                }
              });
            }
          }
          return this._unsubscribeEventListener();
        };

        BaseInstance.generateFunctions = function(endpoints) {
          return endpoints.forEach((function(_this) {
            return function(e) {
              var E;
              E = dataUtilsService.capitalize(e);
              _this.prototype["load" + E] = function() {
                var args, p;
                args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                p = this.get.apply(this, [e].concat(slice.call(args)));
                this[e] = p.getArray();
                return p;
              };
              return _this.prototype["get" + E] = function() {
                var args;
                args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                return this.get.apply(this, [e].concat(slice.call(args)));
              };
            };
          })(this));
        };

        return BaseInstance;

      })();
    }

    return Base;

  })();

  angular.module('bbData').factory('Base', ['dataService', 'socketService', 'dataUtilsService', Base]);

}).call(this);

(function() {
  var Build,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Build = (function() {
    function Build(Base, dataService) {
      var BuildInstance;
      return BuildInstance = (function(superClass) {
        extend(BuildInstance, superClass);

        function BuildInstance(object, endpoint) {
          var endpoints;
          endpoints = ['changes', 'properties', 'steps'];
          BuildInstance.__super__.constructor.call(this, object, endpoint, endpoints);
        }

        return BuildInstance;

      })(Base);
    }

    return Build;

  })();

  angular.module('bbData').factory('Build', ['Base', 'dataService', Build]);

}).call(this);

(function() {
  var Builder,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Builder = (function() {
    function Builder(Base, dataService) {
      var BuilderInstance;
      return BuilderInstance = (function(superClass) {
        extend(BuilderInstance, superClass);

        function BuilderInstance(object, endpoint) {
          var endpoints;
          endpoints = ['builds', 'buildrequests', 'forceschedulers', 'buildslaves', 'masters'];
          BuilderInstance.__super__.constructor.call(this, object, endpoint, endpoints);
        }

        return BuilderInstance;

      })(Base);
    }

    return Builder;

  })();

  angular.module('bbData').factory('Builder', ['Base', 'dataService', Builder]);

}).call(this);

(function() {
  var Buildrequest,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Buildrequest = (function() {
    function Buildrequest(Base, dataService) {
      var BuildrequestInstance;
      return BuildrequestInstance = (function(superClass) {
        extend(BuildrequestInstance, superClass);

        function BuildrequestInstance(object, endpoint) {
          var endpoints;
          endpoints = ['builds'];
          BuildrequestInstance.__super__.constructor.call(this, object, endpoint, endpoints);
        }

        return BuildrequestInstance;

      })(Base);
    }

    return Buildrequest;

  })();

  angular.module('bbData').factory('Buildrequest', ['Base', 'dataService', Buildrequest]);

}).call(this);

(function() {
  var Buildset,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Buildset = (function() {
    function Buildset(Base, dataService) {
      var BuildsetInstance;
      return BuildsetInstance = (function(superClass) {
        extend(BuildsetInstance, superClass);

        function BuildsetInstance(object, endpoint) {
          var endpoints;
          endpoints = ['properties'];
          BuildsetInstance.__super__.constructor.call(this, object, endpoint, endpoints);
        }

        return BuildsetInstance;

      })(Base);
    }

    return Buildset;

  })();

  angular.module('bbData').factory('Buildset', ['Base', 'dataService', Buildset]);

}).call(this);

(function() {
  var Buildslave,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Buildslave = (function() {
    function Buildslave(Base, dataService) {
      var BuildslaveInstance;
      return BuildslaveInstance = (function(superClass) {
        extend(BuildslaveInstance, superClass);

        function BuildslaveInstance(object, endpoint) {
          BuildslaveInstance.__super__.constructor.call(this, object, endpoint);
        }

        return BuildslaveInstance;

      })(Base);
    }

    return Buildslave;

  })();

  angular.module('bbData').factory('Buildslave', ['Base', 'dataService', Buildslave]);

}).call(this);

(function() {
  var Change,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Change = (function() {
    function Change(Base, dataService) {
      var ChangeInstance;
      return ChangeInstance = (function(superClass) {
        extend(ChangeInstance, superClass);

        function ChangeInstance(object, endpoint) {
          ChangeInstance.__super__.constructor.call(this, object, endpoint);
        }

        return ChangeInstance;

      })(Base);
    }

    return Change;

  })();

  angular.module('bbData').factory('Change', ['Base', 'dataService', Change]);

}).call(this);

(function() {
  var Changesource,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Changesource = (function() {
    function Changesource(dataService, Base) {
      var ChangesourceInstance;
      return ChangesourceInstance = (function(superClass) {
        extend(ChangesourceInstance, superClass);

        function ChangesourceInstance(object, endpoint) {
          ChangesourceInstance.__super__.constructor.call(this, object, endpoint);
        }

        return ChangesourceInstance;

      })(Base);
    }

    return Changesource;

  })();

  angular.module('bbData').factory('Changesource', ['dataService', 'Base', Changesource]);

}).call(this);

(function() {
  var Forcescheduler,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Forcescheduler = (function() {
    function Forcescheduler(Base, dataService) {
      var ForceschedulerInstance;
      return ForceschedulerInstance = (function(superClass) {
        extend(ForceschedulerInstance, superClass);

        function ForceschedulerInstance(object, endpoint) {
          ForceschedulerInstance.__super__.constructor.call(this, object, endpoint);
        }

        return ForceschedulerInstance;

      })(Base);
    }

    return Forcescheduler;

  })();

  angular.module('bbData').factory('Forcescheduler', ['Base', 'dataService', Forcescheduler]);

}).call(this);

(function() {
  var Log,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Log = (function() {
    function Log(Base, dataService) {
      var BuildInstance;
      return BuildInstance = (function(superClass) {
        extend(BuildInstance, superClass);

        function BuildInstance(object, endpoint) {
          var endpoints;
          endpoints = ['chunks', 'contents'];
          BuildInstance.__super__.constructor.call(this, object, endpoint, endpoints);
        }

        return BuildInstance;

      })(Base);
    }

    return Log;

  })();

  angular.module('bbData').factory('Log', ['Base', 'dataService', Log]);

}).call(this);

(function() {
  var Master,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Master = (function() {
    function Master(Base, dataService) {
      var MasterInstance;
      return MasterInstance = (function(superClass) {
        extend(MasterInstance, superClass);

        function MasterInstance(object, endpoint) {
          var endpoints;
          endpoints = ['builders', 'buildslaves', 'changesources', 'schedulers'];
          MasterInstance.__super__.constructor.call(this, object, endpoint, endpoints);
        }

        return MasterInstance;

      })(Base);
    }

    return Master;

  })();

  angular.module('bbData').factory('Master', ['Base', 'dataService', Master]);

}).call(this);

(function() {
  var Propertie,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Propertie = (function() {
    function Propertie(Base, dataService) {
      var BuildInstance;
      return BuildInstance = (function(superClass) {
        extend(BuildInstance, superClass);

        function BuildInstance(object, endpoint) {
          BuildInstance.__super__.constructor.call(this, object, endpoint, []);
        }

        return BuildInstance;

      })(Base);
    }

    return Propertie;

  })();

  angular.module('bbData').factory('Propertie', ['Base', 'dataService', Propertie]);

}).call(this);

(function() {
  var Scheduler,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Scheduler = (function() {
    function Scheduler(Base, dataService) {
      var SchedulerInstance;
      return SchedulerInstance = (function(superClass) {
        extend(SchedulerInstance, superClass);

        function SchedulerInstance(object, endpoint) {
          SchedulerInstance.__super__.constructor.call(this, object, endpoint);
        }

        return SchedulerInstance;

      })(Base);
    }

    return Scheduler;

  })();

  angular.module('bbData').factory('Scheduler', ['Base', 'dataService', Scheduler]);

}).call(this);

(function() {
  var Sourcestamp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Sourcestamp = (function() {
    function Sourcestamp(Base, dataService) {
      var SourcestampInstance;
      return SourcestampInstance = (function(superClass) {
        extend(SourcestampInstance, superClass);

        function SourcestampInstance(object, endpoint) {
          var endpoints;
          endpoints = ['changes'];
          SourcestampInstance.__super__.constructor.call(this, object, endpoint, endpoints);
        }

        return SourcestampInstance;

      })(Base);
    }

    return Sourcestamp;

  })();

  angular.module('bbData').factory('Sourcestamp', ['Base', 'dataService', Sourcestamp]);

}).call(this);

(function() {
  var Step,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Step = (function() {
    function Step(Base, dataService) {
      var BuildInstance;
      return BuildInstance = (function(superClass) {
        extend(BuildInstance, superClass);

        function BuildInstance(object, endpoint) {
          var endpoints;
          endpoints = ['logs'];
          BuildInstance.__super__.constructor.call(this, object, endpoint, endpoints);
        }

        return BuildInstance;

      })(Base);
    }

    return Step;

  })();

  angular.module('bbData').factory('Step', ['Base', 'dataService', Step]);

}).call(this);

(function() {
  var Data,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  Data = (function() {
    function Data() {}

    Data.prototype.cache = false;


    /* @ngInject */

    Data.prototype.$get = function($log, $injector, $q, restService, socketService, dataUtilsService, ENDPOINTS) {
      var DataService;
      return new (DataService = (function() {
        var self;

        self = null;

        function DataService() {
          this.socketCloseListener = bind(this.socketCloseListener, this);
          this.unsubscribeListener = bind(this.unsubscribeListener, this);
          self = this;
          socketService.onclose = this.socketCloseListener;
          this.constructor.generateEndpoints();
        }

        DataService.prototype.get = function() {
          var args, last, promise, query, subscribe, updating;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          args = args.filter(function(e) {
            return e != null;
          });
          last = args[args.length - 1];
          subscribe = last.subscribe || (last.subscribe == null);
          if (angular.isObject(last)) {
            query = args.pop();
            delete query.subscribe;
          }
          updating = [];
          promise = $q((function(_this) {
            return function(resolve, reject) {
              var messages, socketPath, socketPromise, unsubscribe;
              if (subscribe) {
                messages = [];
                unsubscribe = socketService.eventStream.subscribe(function(data) {
                  return messages.push(data);
                });
                socketPath = dataUtilsService.socketPath(args);
                socketPromise = _this.startConsuming(socketPath);
              } else {
                socketPromise = $q.resolve();
              }
              return socketPromise.then(function() {
                var restPath, restPromise;
                restPath = dataUtilsService.restPath(args);
                restPromise = restService.get(restPath, query);
                return restPromise.then(function(response) {
                  var WrapperClass, base, className, e, endpoint, error, type;
                  type = dataUtilsService.type(restPath);
                  response = response[type];
                  try {
                    className = dataUtilsService.className(restPath);
                    WrapperClass = $injector.get(className);
                  } catch (error) {
                    e = error;
                    console.log("unknown wrapper for", className);
                    WrapperClass = $injector.get('Base');
                  }
                  if (angular.isArray(response)) {
                    endpoint = dataUtilsService.endpointPath(args);
                    response = response.map(function(i) {
                      return new WrapperClass(i, endpoint);
                    });
                    if (_this.listeners == null) {
                      _this.listeners = {};
                    }
                    if ((base = _this.listeners)[socketPath] == null) {
                      base[socketPath] = [];
                    }
                    response.forEach(function(r) {
                      return _this.listeners[socketPath].push(r._listenerId);
                    });
                    socketService.eventStream.subscribe(function(data) {
                      var key, message, newInstance, streamRegex;
                      key = data.k;
                      message = data.m;
                      streamRegex = RegExp("^" + endpoint + "\\/(\\w+|\\d+)\\/new$", "g");
                      if (streamRegex.test(key)) {
                        newInstance = new WrapperClass(message, endpoint);
                        updating.push(newInstance);
                        return _this.listeners[socketPath].push(newInstance._listenerId);
                      }
                    });
                    if (subscribe) {
                      messages.forEach(function(m) {
                        return socketService.eventStream.push(m);
                      });
                      unsubscribe();
                    }
                    angular.copy(response, updating);
                    return resolve(updating);
                  } else {
                    e = response + " is not an array";
                    $log.error(e);
                    return reject(e);
                  }
                }, function(e) {
                  return reject(e);
                });
              }, function(e) {
                return reject(e);
              });
            };
          })(this));
          promise.getArray = function() {
            return updating;
          };
          return promise;
        };

        DataService.prototype.startConsuming = function(path) {
          return socketService.send({
            cmd: 'startConsuming',
            path: path
          });
        };

        DataService.prototype.stopConsuming = function(path) {
          return socketService.send({
            cmd: 'stopConsuming',
            path: path
          });
        };

        DataService.prototype.unsubscribeListener = function(removed) {
          var i, ids, path, ref, results;
          ref = this.listeners;
          results = [];
          for (path in ref) {
            ids = ref[path];
            i = ids.indexOf(removed.id);
            if (i > -1) {
              ids.splice(i, 1);
              if (ids.length === 0) {
                results.push(this.stopConsuming(path));
              } else {
                results.push(void 0);
              }
            } else {
              results.push(void 0);
            }
          }
          return results;
        };

        DataService.prototype.socketCloseListener = function() {
          var ids, path, ref;
          if (this.listeners == null) {
            return;
          }
          ref = this.listeners;
          for (path in ref) {
            ids = ref[path];
            if (ids.length > 0) {
              this.startConsuming(path);
            }
          }
          return null;
        };

        DataService.prototype.control = function(method, params) {
          return restService.post({
            id: this.getNextId(),
            jsonrpc: '2.0',
            method: method,
            params: params
          });
        };

        DataService.prototype.getNextId = function() {
          if (this.jsonrpc == null) {
            this.jsonrpc = 1;
          }
          return this.jsonrpc++;
        };

        DataService.generateEndpoints = function() {
          return ENDPOINTS.forEach((function(_this) {
            return function(e) {
              var E;
              E = dataUtilsService.capitalize(e);
              return _this.prototype["get" + E] = function() {
                var args;
                args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                return self.get.apply(self, [e].concat(slice.call(args)));
              };
            };
          })(this));
        };

        DataService.prototype.open = function() {
          var DataAccessor;
          return new (DataAccessor = (function() {
            var rootClasses;

            rootClasses = [];

            function DataAccessor() {
              this.rootClasses = rootClasses;
              this.constructor.generateEndpoints();
            }

            DataAccessor.prototype.close = function() {
              return this.rootClasses.forEach(function(c) {
                return c.unsubscribe();
              });
            };

            DataAccessor.prototype.closeOnDestroy = function(scope) {
              if (!angular.isFunction(scope.$on)) {
                throw new TypeError("Parameter 'scope' doesn't have an $on function");
              }
              return scope.$on('$destroy', (function(_this) {
                return function() {
                  return _this.close();
                };
              })(this));
            };

            DataAccessor.generateEndpoints = function() {
              return ENDPOINTS.forEach((function(_this) {
                return function(e) {
                  var E;
                  E = dataUtilsService.capitalize(e);
                  return _this.prototype["get" + E] = function() {
                    var args, p;
                    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                    p = self["get" + E].apply(self, args);
                    p.then(function(classes) {
                      return classes.forEach(function(c) {
                        return rootClasses.push(c);
                      });
                    });
                    return p;
                  };
                };
              })(this));
            };

            return DataAccessor;

          })());
        };

        DataService.prototype.mocks = {};

        DataService.prototype.spied = false;

        DataService.prototype.when = function() {
          var args, base, query, ref, returnValue, url;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          url = args[0], query = args[1], returnValue = args[2];
          if (returnValue == null) {
            ref = [{}, query], query = ref[0], returnValue = ref[1];
          }
          if ((typeof jasmine !== "undefined" && jasmine !== null) && !this.spied) {
            spyOn(this, 'get').and.callFake(this._mockGet);
            this.spied = true;
          }
          if ((base = this.mocks)[url] == null) {
            base[url] = {};
          }
          return this.mocks[url][query] = returnValue;
        };

        DataService.prototype._mockGet = function() {
          var args, collection, p, query, queryWithoutSubscribe, ref, ref1, ref2, returnValue, url;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          ref = this.processArguments(args), url = ref[0], query = ref[1];
          queryWithoutSubscribe = angular.copy(query);
          delete queryWithoutSubscribe.subscribe;
          returnValue = ((ref1 = this.mocks[url]) != null ? ref1[query] : void 0) || ((ref2 = this.mocks[url]) != null ? ref2[queryWithoutSubscribe] : void 0);
          if (returnValue == null) {
            throw new Error("No return value for: " + url + " (" + (angular.toJson(query)) + ")");
          }
          collection = this.createCollection(url, query, returnValue);
          p = $q.resolve(collection);
          p.getArray = function() {
            return collection;
          };
          return p;
        };

        DataService.prototype.processArguments = function(args) {
          var last, query, restPath;
          args.filter(function(e) {
            return e != null;
          });
          last = args[args.length - 1];
          if (angular.isObject(last)) {
            query = args.pop();
          }
          restPath = dataUtilsService.restPath(args);
          return [restPath, query || {}];
        };

        DataService.prototype.createCollection = function(url, query, response) {
          var WrapperClass, className, e, endpoint, error, restPath, type;
          restPath = url;
          type = dataUtilsService.type(restPath);
          try {
            className = dataUtilsService.className(restPath);
            WrapperClass = $injector.get(className);
          } catch (error) {
            e = error;
            console.log("unknown wrapper for", className);
            WrapperClass = $injector.get('Base');
          }
          endpoint = dataUtilsService.endpointPath([restPath]);
          return response = response.map(function(i) {
            return new WrapperClass(i, endpoint);
          });
        };

        return DataService;

      })());
    };

    return Data;

  })();

  angular.module('bbData').provider('dataService', [Data]);

}).call(this);

(function() {
  var DataUtils;

  DataUtils = (function() {
    function DataUtils() {
      var dataUtilsService;
      return new (dataUtilsService = (function() {
        function dataUtilsService() {}

        dataUtilsService.prototype.capitalize = function(string) {
          return string[0].toUpperCase() + string.slice(1).toLowerCase();
        };

        dataUtilsService.prototype.type = function(arg) {
          var a;
          a = this.copyOrSplit(arg);
          a = a.filter(function(e) {
            return e !== '*';
          });
          if (a.length % 2 === 0) {
            a.pop();
          }
          return a.pop();
        };

        dataUtilsService.prototype.singularType = function(arg) {
          return this.type(arg).replace(/s$/, '');
        };

        dataUtilsService.prototype.className = function(arg) {
          return this.capitalize(this.singularType(arg));
        };

        dataUtilsService.prototype.classId = function(arg) {
          return this.singularType(arg) + "id";
        };

        dataUtilsService.prototype.socketPath = function(arg) {
          var a, stars;
          a = this.copyOrSplit(arg);
          stars = ['*'];
          if (a.length % 2 === 1) {
            stars.push('*');
          }
          return a.concat(stars).join('/');
        };

        dataUtilsService.prototype.restPath = function(arg) {
          var a;
          a = this.copyOrSplit(arg);
          a = a.filter(function(e) {
            return e !== '*';
          });
          return a.join('/');
        };

        dataUtilsService.prototype.endpointPath = function(arg) {
          var a;
          a = this.copyOrSplit(arg);
          a = a.filter(function(e) {
            return e !== '*';
          });
          if (a.length % 2 === 0) {
            a.pop();
          }
          return a.join('/');
        };

        dataUtilsService.prototype.copyOrSplit = function(arrayOrString) {
          if (angular.isArray(arrayOrString)) {
            return arrayOrString.slice(0);
          } else if (angular.isString(arrayOrString)) {
            return arrayOrString.split('/');
          } else {
            throw new TypeError("Parameter 'arrayOrString' must be a array or a string, not " + (typeof arrayOrString));
          }
        };

        dataUtilsService.prototype.unWrap = function(object, path) {
          return object[this.type(path)];
        };

        dataUtilsService.prototype.parse = function(object) {
          var error, error1, k, v;
          for (k in object) {
            v = object[k];
            try {
              object[k] = angular.fromJson(v);
            } catch (error1) {
              error = error1;
            }
          }
          return object;
        };

        dataUtilsService.prototype.numberOrString = function(str) {
          var number;
          if (str == null) {
            str = null;
          }
          if (angular.isNumber(str)) {
            return str;
          }
          number = parseInt(str, 10);
          if (!isNaN(number)) {
            return number;
          } else {
            return str;
          }
        };

        dataUtilsService.prototype.emailInString = function(string) {
          var emailRegex, error1;
          if (!angular.isString(string)) {
            throw new TypeError("Parameter 'string' must be a string, not " + (typeof string));
          }
          emailRegex = /[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/;
          try {
            return emailRegex.exec(string).pop() || '';
          } catch (error1) {
            return '';
          }
        };

        return dataUtilsService;

      })());
    }

    return DataUtils;

  })();

  angular.module('bbData').service('dataUtilsService', [DataUtils]);

}).call(this);

(function() {
  var Rest,
    slice = [].slice;

  Rest = (function() {
    function Rest($http, $q, API) {
      var RestService;
      return new (RestService = (function() {
        function RestService() {}

        RestService.prototype.execute = function(config) {
          return $q((function(_this) {
            return function(resolve, reject) {
              return $http(config).success(function(response) {
                var data, e, error;
                try {
                  data = angular.fromJson(response);
                  return resolve(data);
                } catch (error) {
                  e = error;
                  return reject(e);
                }
              }).error(function(reason) {
                return reject(reason);
              });
            };
          })(this));
        };

        RestService.prototype.get = function(url, params) {
          var config;
          if (params == null) {
            params = {};
          }
          config = {
            method: 'GET',
            url: this.parse(API, url),
            params: params,
            headers: {
              'Accept': 'application/json'
            }
          };
          return this.execute(config);
        };

        RestService.prototype.post = function(url, data) {
          var config;
          if (data == null) {
            data = {};
          }
          config = {
            method: 'POST',
            url: this.parse(API, url),
            data: data,
            headers: {
              'Content-Type': 'application/json'
            }
          };
          return this.execute(config);
        };

        RestService.prototype.parse = function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return args.join('/').replace(/\/\//, '/');
        };

        return RestService;

      })());
    }

    return Rest;

  })();

  angular.module('bbData').service('restService', ['$http', '$q', 'API', Rest]);

}).call(this);

(function() {
  var Socket;

  Socket = (function() {
    function Socket($log, $q, $rootScope, $location, Stream, webSocketService) {
      var SocketService;
      return new (SocketService = (function() {
        SocketService.prototype.eventStream = null;

        function SocketService() {
          this.queue = [];
          this.deferred = {};
          this.open();
        }

        SocketService.prototype.open = function() {
          if (this.socket == null) {
            this.socket = webSocketService.getWebSocket(this.getUrl());
          }
          this.socket.onopen = (function(_this) {
            return function() {
              return _this.flush();
            };
          })(this);
          return this.setupEventStream();
        };

        SocketService.prototype.setupEventStream = function() {
          if (this.eventStream == null) {
            this.eventStream = new Stream();
          }
          return this.socket.onmessage = (function(_this) {
            return function(message) {
              var data, e, error, id, ref, ref1, ref2;
              try {
                data = angular.fromJson(message.data);
                if (data.code != null) {
                  id = data._id;
                  if (data.code === 200) {
                    return (ref = _this.deferred[id]) != null ? ref.resolve(true) : void 0;
                  } else {
                    return (ref1 = _this.deferred[id]) != null ? ref1.reject(data) : void 0;
                  }
                } else {
                  return $rootScope.$applyAsync(function() {
                    return _this.eventStream.push(data);
                  });
                }
              } catch (error) {
                e = error;
                return (ref2 = _this.deferred[id]) != null ? ref2.reject(e) : void 0;
              }
            };
          })(this);
        };

        SocketService.prototype.close = function() {
          return this.socket.close();
        };

        SocketService.prototype.send = function(data) {
          var base, id;
          id = this.nextId();
          data._id = id;
          if ((base = this.deferred)[id] == null) {
            base[id] = $q.defer();
          }
          data = angular.toJson(data);
          if (this.socket.readyState === (this.socket.OPEN || 1)) {
            this.socket.send(data);
          } else {
            this.queue.push(data);
          }
          return this.deferred[id].promise;
        };

        SocketService.prototype.flush = function() {
          var data, results;
          results = [];
          while (data = this.queue.pop()) {
            results.push(this.socket.send(data));
          }
          return results;
        };

        SocketService.prototype.nextId = function() {
          if (this.id == null) {
            this.id = 0;
          }
          this.id = this.id < 1000 ? this.id + 1 : 0;
          return this.id;
        };

        SocketService.prototype.getRootPath = function() {
          return location.pathname;
        };

        SocketService.prototype.getUrl = function() {
          var defaultport, host, path, port, protocol;
          host = $location.host();
          protocol = $location.protocol() === 'https' ? 'wss' : 'ws';
          defaultport = $location.protocol() === 'https' ? 443 : 80;
          path = this.getRootPath();
          port = $location.port() === defaultport ? '' : ':' + $location.port();
          return protocol + "://" + host + port + path + "ws";
        };

        return SocketService;

      })());
    }

    return Socket;

  })();

  angular.module('bbData').service('socketService', ['$log', '$q', '$rootScope', '$location', 'Stream', 'webSocketService', Socket]);

}).call(this);

(function() {
  var WebSocketBackend;

  WebSocketBackend = (function() {
    var MockWebSocket, self;

    self = null;

    function WebSocketBackend() {
      self = this;
      this.webSocket = new MockWebSocket();
    }

    WebSocketBackend.prototype.sendQueue = [];

    WebSocketBackend.prototype.receiveQueue = [];

    WebSocketBackend.prototype.send = function(message) {
      var data;
      data = {
        data: message
      };
      return this.sendQueue.push(data);
    };

    WebSocketBackend.prototype.flush = function() {
      var message, results;
      results = [];
      while (message = this.sendQueue.shift()) {
        results.push(this.webSocket.onmessage(message));
      }
      return results;
    };

    WebSocketBackend.prototype.getWebSocket = function() {
      return this.webSocket;
    };

    MockWebSocket = (function() {
      function MockWebSocket() {}

      MockWebSocket.prototype.OPEN = 1;

      MockWebSocket.prototype.send = function(message) {
        return self.receiveQueue.push(message);
      };

      MockWebSocket.prototype.close = function() {
        return typeof this.onclose === "function" ? this.onclose() : void 0;
      };

      return MockWebSocket;

    })();

    return WebSocketBackend;

  })();

  angular.module('bbData').service('webSocketBackendService', [WebSocketBackend]);

}).call(this);

(function() {
  var WebSocket;

  WebSocket = (function() {
    function WebSocket($window) {
      var WebSocketProvider;
      return new (WebSocketProvider = (function() {
        function WebSocketProvider() {}

        WebSocketProvider.prototype.getWebSocket = function(url) {
          var match;
          match = /wss?:\/\//.exec(url);
          if (!match) {
            throw new Error('Invalid url provided');
          }
          if ($window.ReconnectingWebSocket != null) {
            return new $window.ReconnectingWebSocket(url);
          } else {
            return new $window.WebSocket(url);
          }
        };

        return WebSocketProvider;

      })());
    }

    return WebSocket;

  })();

  angular.module('bbData').service('webSocketService', ['$window', WebSocket]);

}).call(this);

(function() {
  var Stream;

  Stream = (function() {
    function Stream() {
      var StreamInstance;
      return StreamInstance = (function() {
        function StreamInstance() {}

        StreamInstance.prototype.onUnsubscribe = null;

        StreamInstance.prototype.listeners = [];

        StreamInstance.prototype.subscribe = function(listener) {
          if (!angular.isFunction(listener)) {
            throw new TypeError("Parameter 'listener' must be a function, not " + (typeof listener));
          }
          listener.id = this.generateId();
          this.listeners.push(listener);
          return (function(_this) {
            return function() {
              var i, removed;
              i = _this.listeners.indexOf(listener);
              removed = _this.listeners.splice(i, 1);
              if (angular.isFunction(_this.onUnsubscribe)) {
                return _this.onUnsubscribe(listener);
              }
            };
          })(this);
        };

        StreamInstance.prototype.push = function(data) {
          var j, len, listener, ref, results;
          ref = this.listeners;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            listener = ref[j];
            results.push(listener(data));
          }
          return results;
        };

        StreamInstance.prototype.destroy = function() {
          var results;
          results = [];
          while (this.listeners.length > 0) {
            results.push(this.listeners.pop());
          }
          return results;
        };

        StreamInstance.prototype.generateId = function() {
          if (this.lastId == null) {
            this.lastId = 0;
          }
          return this.lastId++;
        };

        return StreamInstance;

      })();
    }

    return Stream;

  })();

  angular.module('bbData').factory('Stream', [Stream]);

}).call(this);

//# sourceMappingURL=buildbot-data.js.map