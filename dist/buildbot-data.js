(function(){ var _global = (0, eval)('this');
if (typeof _global.BOWERDEPS === 'undefined') { _global.BOWERDEPS = {}; }
})();
// Register new module
class BBData {
    constructor() {
        return [];
    }
}

angular.module('bbData', new BBData());

class Api {
    constructor() { return new String('api/v2/'); }
}

class Endpoints {
    constructor() {
        // Rootlinks
        return [
            'builders',
            'builds',
            'buildrequests',
            'workers',
            'buildsets',
            'changes',
            'changesources',
            'masters',
            'sourcestamps',
            'schedulers',
            'forceschedulers'
        ];
    }
}


angular.module('bbData')
.constant('API', new Api())
.constant('ENDPOINTS', new Endpoints());

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Base {
    constructor(dataService, socketService, dataUtilsService) {
        let BaseInstance;
        return (BaseInstance = class BaseInstance {
            constructor(object, _endpoint, childEndpoints) {
                this._endpoint = _endpoint;
                if (childEndpoints == null) { childEndpoints = []; }
                if (!angular.isString(this._endpoint)) {
                    throw new TypeError(`Parameter 'endpoint' must be a string, not ${typeof this.endpoint}`);
                }

                this.$accessor = null;
                // add object fields to the instance
                this.update(object);

                // generate loadXXX functions
                this.constructor.generateFunctions(childEndpoints);

                // get the id of the class type
                const classId = dataUtilsService.classId(this._endpoint);
                this._id = this[classId];

                // reset endpoint to base
                if (this._id != null) {
                    this._endpoint = dataUtilsService.type(this._endpoint);
                }
            }

            setAccessor(a) {
                return this.$accessor = a;
            }

            update(o) {
                return angular.extend(this, o);
            }

            get(...args) {
                return dataService.get(this._endpoint, this._id, ...Array.from(args));
            }

            control(method, params) {
                return dataService.control(this._endpoint, this._id, method, params);
            }

            // generate endpoint functions for the class
            static generateFunctions(endpoints) {
                return endpoints.forEach(e => {
                    // capitalize endpoint names
                    const E = dataUtilsService.capitalize(e);
                    // adds loadXXX functions to the prototype
                    this.prototype[`load${E}`] = function(...args) {
                        return this[e] = this.get(e, ...Array.from(args));
                    };

                    // adds getXXX functions to the prototype
                    return this.prototype[`get${E}`] = function(...args) {
                        let query;
                        [args, query] = Array.from(dataUtilsService.splitOptions(args));
                        if (this.$accessor) {
                            if (query.subscribe == null) { query.subscribe = true; }
                            query.accessor = this.$accessor;
                        }
                        return this.get(e, ...Array.from(args), query);
                    };
                });
            }
        });
    }
}


angular.module('bbData')
.factory('Base', ['dataService', 'socketService', 'dataUtilsService', Base]);
class Build {
    constructor(Base, dataService) {
        let BuildInstance;
        return (BuildInstance = class BuildInstance extends Base {
            constructor(object, endpoint) {
                const endpoints = [
                    'changes',           // /changes
                    'properties',        // /properties
                    'steps'             // /steps/:name
                                        // /steps/:stepid
                ];

                super(object, endpoint, endpoints);
            }
        });
    }
}


angular.module('bbData')
.factory('Build', ['Base', 'dataService', Build]);

class Builder {
    constructor(Base, dataService) {
        let BuilderInstance;
        return (BuilderInstance = class BuilderInstance extends Base {
            constructor(object, endpoint) {
                const endpoints = [
                    'builds',            // /builds/:buildid
                    'buildrequests',     // /buildrequests/:buildrequestid
                    'forceschedulers',   // /forceschedulers
                    'workers',           // /workers/:workerid
                                        // /workers/:name
                    'masters'           // /masters/:masterid
                ];

                super(object, endpoint, endpoints);
            }
        });
    }
}


angular.module('bbData')
.factory('Builder', ['Base', 'dataService', Builder]);

class Buildrequest {
    constructor(Base, dataService) {
        let BuildrequestInstance;
        return (BuildrequestInstance = class BuildrequestInstance extends Base {
            constructor(object, endpoint) {
                const endpoints = [
                    'builds'            // /builds
                ];

                super(object, endpoint, endpoints);
            }
        });
    }
}


angular.module('bbData')
.factory('Buildrequest', ['Base', 'dataService', Buildrequest]);

class Buildset {
    constructor(Base, dataService) {
        let BuildsetInstance;
        return (BuildsetInstance = class BuildsetInstance extends Base {
            constructor(object, endpoint) {
                const endpoints = [
                    'properties'        // /properties
                ];

                super(object, endpoint, endpoints);
            }
        });
    }
}


angular.module('bbData')
.factory('Buildset', ['Base', 'dataService', Buildset]);
/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Change {
    constructor(Base, dataService, dataUtilsService) {
        let ChangeInstance;
        return (ChangeInstance = class ChangeInstance extends Base {
            constructor(object, endpoint) {
                super(object, endpoint);
                let { author } = this;
                if ((this.author == null)) {
                    author = "unknown";
                }

                const email = dataUtilsService.emailInString(author);
                // Remove email from author string
                if (email) {
                    if  (author.split(' ').length > 1) {
                        this.author_name = author.replace(new RegExp(`\\s<${email}>`), '');
                        this.author_email = email;
                    } else {
                        this.author_name = email.split("@")[0];
                        this.author_email = email;
                    }
                } else {
                    this.author_name = author;
                }
            }
        });
    }
}


angular.module('bbData')
.factory('Change', ['Base', 'dataService', 'dataUtilsService', Change]);
class Changesource {
    constructor(dataService, Base) {
        let ChangesourceInstance;
        return (ChangesourceInstance = class ChangesourceInstance extends Base {
            constructor(object, endpoint) {
                super(object, endpoint);
            }
        });
    }
}


angular.module('bbData')
.factory('Changesource', ['dataService', 'Base', Changesource]);
class Forcescheduler {
    constructor(Base, dataService) {
        let ForceschedulerInstance;
        return (ForceschedulerInstance = class ForceschedulerInstance extends Base {
            constructor(object, endpoint) {
                super(object, endpoint);
            }
        });
    }
}


angular.module('bbData')
.factory('Forcescheduler', ['Base', 'dataService', Forcescheduler]);
class Log {
    constructor(Base, dataService) {
        let BuildInstance;
        return (BuildInstance = class BuildInstance extends Base {
            constructor(object, endpoint) {
                const endpoints = [
                    'chunks',           // /chunks
                    'contents'
                ];
                super(object, endpoint, endpoints);
            }
        });
    }
}


angular.module('bbData')
.factory('Log', ['Base', 'dataService', Log]);
class Master {
    constructor(Base, dataService) {
        let MasterInstance;
        return (MasterInstance = class MasterInstance extends Base {
            constructor(object, endpoint) {
                const endpoints = [
                    'builders',          // /builders/:builderid
                    'workers',           // /workers/:workerid
                                        // /workers/:name
                    'changesources',     // /changesources/:changesourceid
                    'schedulers'        // /schedulers/:schedulerid
                ];

                super(object, endpoint, endpoints);
            }
        });
    }
}


angular.module('bbData')
.factory('Master', ['Base', 'dataService', Master]);
// damn grammar. I claim that properties singular is propertie
class Propertie {
    constructor(Base, dataService) {
        let BuildInstance;
        return (BuildInstance = class BuildInstance extends Base {
            constructor(object, endpoint) {
                super(object, endpoint, []);
            }
        });
    }
}


angular.module('bbData')
.factory('Propertie', ['Base', 'dataService', Propertie]);
class Scheduler {
    constructor(Base, dataService) {
        let SchedulerInstance;
        return (SchedulerInstance = class SchedulerInstance extends Base {
            constructor(object, endpoint) {
                super(object, endpoint);
            }
        });
    }
}


angular.module('bbData')
.factory('Scheduler', ['Base', 'dataService', Scheduler]);
class Sourcestamp {
    constructor(Base, dataService) {
        let SourcestampInstance;
        return (SourcestampInstance = class SourcestampInstance extends Base {
            constructor(object, endpoint) {
                const endpoints = [
                    'changes'           // /changes
                ];

                super(object, endpoint, endpoints);
            }
        });
    }
}


angular.module('bbData')
.factory('Sourcestamp', ['Base', 'dataService', Sourcestamp]);
class Step {
    constructor(Base, dataService) {
        let BuildInstance;
        return (BuildInstance = class BuildInstance extends Base {
            constructor(object, endpoint) {
                const endpoints = [
                    'logs'           // /logs
                ];

                super(object, endpoint, endpoints);
            }
        });
    }
}


angular.module('bbData')
.factory('Step', ['Base', 'dataService', Step]);
class Worker {
    constructor(Base, dataService) {
        let WorkerInstance;
        return (WorkerInstance = class WorkerInstance extends Base {
            constructor(object, endpoint) {
                super(object, endpoint);
            }
        });
    }
}


angular.module('bbData')
.factory('Worker', ['Base', 'dataService', Worker]);
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Data {
    static initClass() {
        // TODO caching
        this.prototype.cache = false;
    }
    constructor($log, $injector, $q, restService, socketService, dataUtilsService, Collection,
                ENDPOINTS) {
        let DataService;
        return new ((DataService = (function() {
            let self = undefined;
            DataService = class DataService {
                static initClass() {
                    self = null;
    
                //############# utils for testing
                // register return values for the mocked get function
                    this.prototype.mocks = {};
                    this.prototype.spied = false;
                }
                constructor() {
                    self = this;
                    // setup socket listeners
                    //socketService.eventStream.onUnsubscribe = @unsubscribeListener
                    socketService.onclose = this.socketCloseListener;
                    // generate loadXXX functions for root endpoints
                    this.constructor.generateEndpoints();
                }

                // the arguments are in this order: endpoint, id, child, id of child, query
                get(...args) {

                    // get the query parameters
                    let accessor, query, subscribePromise;
                    [args, query] = Array.from(dataUtilsService.splitOptions(args));
                    let subscribe = (accessor = undefined);

                    // subscribe for changes if 'subscribe' is true
                    subscribe = query.subscribe === true;
                    ({ accessor } = query);
                    if (subscribe && !accessor) {
                        $log.warn("subscribe call should be done after DataService.open()");
                        $log.warn("for maintaining trace of observers");
                        subscribe = false;
                    }

                    // 'subscribe' is not part of the query
                    delete query.subscribe;
                    delete query.accessor;

                    const restPath = dataUtilsService.restPath(args);
                    // up to date array, this will be returned
                    const collection = new Collection(restPath, query, accessor);

                    if (subscribe) {
                        subscribePromise = collection.subscribe();
                    } else {
                        subscribePromise = $q.resolve();
                    }

                    subscribePromise.then(() =>
                        // get the data from the rest api
                        restService.get(restPath, query).then(function(response) {

                            const type = dataUtilsService.type(restPath);
                            const datalist = response[type];
                            // the response should always be an array
                            if (!angular.isArray(datalist)) {
                                const e = `${datalist} is not an array`;
                                $log.error(e);
                                return;
                            }

                            // fill up the collection with initial data
                            return collection.initial(datalist);
                        })
                    );

                    return collection;
                }


                control(ep, id, method, params) {
                    if (params == null) { params = {}; }
                    const restPath = dataUtilsService.restPath([ep, id]);
                    return restService.post(restPath, {
                        id: this.getNextId(),
                        jsonrpc: '2.0',
                        method,
                        params
                    }
                    );
                }

                // returns next id for jsonrpc2 control messages
                getNextId() {
                    if (this.jsonrpc == null) { this.jsonrpc = 1; }
                    return this.jsonrpc++;
                }

                // generate functions for root endpoints
                static generateEndpoints() {
                    return ENDPOINTS.forEach(e => {
                        // capitalize endpoint names
                        const E = dataUtilsService.capitalize(e);
                        return this.prototype[`get${E}`] = (...args) => self.get(e, ...Array.from(args));
                    });
                }

                // opens a new accessor
                open() {
                    let DataAccessor;
                    return new ((DataAccessor = (function() {
                        let collectionRefs = undefined;
                        DataAccessor = class DataAccessor {
                            static initClass() {
                                collectionRefs = [];
                            }
                            constructor() {
                                this.constructor.generateEndpoints();
                            }

                            registerCollection(c) {
                                return collectionRefs.push(c);
                            }

                            close() {
                                return collectionRefs.forEach(c => c.close());
                            }

                            // Closes the group when the scope is destroyed
                            closeOnDestroy(scope) {
                                if (!angular.isFunction(scope.$on)) {
                                    throw new TypeError("Parameter 'scope' doesn't have an $on function");
                                }
                                scope.$on('$destroy', () => this.close());
                                return this;
                            }

                            // Generate functions for root endpoints
                            static generateEndpoints() {
                                return ENDPOINTS.forEach(e => {
                                    // capitalize endpoint names
                                    const E = dataUtilsService.capitalize(e);
                                    return this.prototype[`get${E}`] = function(...args) {
                                        let query;
                                        [args, query] = Array.from(dataUtilsService.splitOptions(args));
                                        if (query.subscribe == null) { query.subscribe = true; }
                                        query.accessor = this;
                                        return self.get(e, ...Array.from(args), query);
                                    };
                                });
                            }
                        };
                        DataAccessor.initClass();
                        return DataAccessor;
                    })()));
                }
                when(url, query, returnValue) {
                    if ((returnValue == null)) {
                        [query, returnValue] = Array.from([{}, query]);
                    }
                    if ((typeof jasmine !== 'undefined' && jasmine !== null) && !this.spied) {
                        spyOn(this, 'get').and.callFake(this._mockGet);
                        this.spied = true;
                    }

                    if (this.mocks[url] == null) { this.mocks[url] = {}; }
                    return this.mocks[url][query] = returnValue;
                }

                expect(url, query, returnValue) {
                    if ((returnValue == null)) {
                        [query, returnValue] = Array.from([{}, query]);
                    }
                    if (this._expects == null) { this._expects = []; }
                    this._expects.push([url, query]);
                    return this.when(url, query, returnValue);
                }

                verifyNoOutstandingExpectation() {
                    if ((this._expects != null) && this._expects.length) {
                        return fail(`expecting ${this._expects.length} more data requests ` +
                            `(${angular.toJson(this._expects)})`);
                    }
                }

                // register return values with the .when function
                // when testing get will return the given values
                _mockGet(...args) {
                    const [url, query] = Array.from(this.processArguments(args));
                    const queryWithoutSubscribe = {};
                    for (let k in query) {
                        const v = query[k];
                        if ((k !== "subscribe") && (k !== "accessor")) {
                            queryWithoutSubscribe[k] = v;
                        }
                    }
                    if (this._expects) {
                        const [exp_url, exp_query] = Array.from(this._expects.shift());
                        expect(exp_url).toEqual(url);
                        expect(exp_query).toEqual(queryWithoutSubscribe);
                    }
                    const returnValue = (this.mocks[url] != null ? this.mocks[url][query] : undefined) || (this.mocks[url] != null ? this.mocks[url][queryWithoutSubscribe] : undefined);
                    if ((returnValue == null)) { throw new Error(`No return value for: ${url} ` +
                        `(${angular.toJson(queryWithoutSubscribe)})`); }
                    const collection = this.createCollection(url, queryWithoutSubscribe, returnValue);
                    return collection;
                }

                processArguments(args) {
                    let query;
                    [args, query] = Array.from(dataUtilsService.splitOptions(args));
                    const restPath = dataUtilsService.restPath(args);
                    return [restPath, query || {}];
                }


                // for easier testing
                createCollection(url, query, response) {
                    const restPath = url;
                    const type = dataUtilsService.type(restPath);
                    const collection = new Collection(restPath, query);

                    // populate the response with default ids
                    // for convenience
                    const { id } = collection;
                    let idCounter = 1;
                    response.forEach(function(d) {
                        if (!d.hasOwnProperty(id)) {
                            return d[id] = idCounter++;
                        }
                    });

                    collection.initial(response);
                    return collection;
                }
            };
            DataService.initClass();
            return DataService;
        })()));
    }
}
Data.initClass();


angular.module('bbData')
.service('dataService', ['$log', '$injector', '$q', 'restService', 'socketService',
                         'dataUtilsService', 'Collection', 'ENDPOINTS', Data]);

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class DataUtils {
    constructor() {
        let dataUtilsService;
        return new (dataUtilsService = class dataUtilsService {
            // capitalize first word
            capitalize(string) {
                return string[0].toUpperCase() + string.slice(1).toLowerCase();
            }

            // returns the type of the endpoint
            type(arg) {
                let a = this.copyOrSplit(arg);
                a = a.filter(e => e !== '*');
                // if the argument count is even, the last argument is an id
                if ((a.length % 2) === 0) { a.pop(); }
                let type = a.pop();
                if (type === "contents") {
                    type = "logchunks";
                }
                return type;
            }
            // singularize the type name
            singularType(arg) {
                return this.type(arg).replace(/s$/, '');
            }

            className(arg) {
                return this.capitalize(this.singularType(arg));
            }

            classId(arg) {
                if (this.singularType(arg) === "forcescheduler") {
                    return "name";
                }
                if (this.singularType(arg) === "buildset") {
                    return "bsid";
                }
                return this.singularType(arg) + "id";
            }

            socketPath(arg) {
                const a = this.copyOrSplit(arg);
                // if the argument count is even, the last argument is an id
                // Format of properties endpoint is an exception
                // and needs to be properties/*, not properties/*/*
                const stars = ['*'];
                // is it odd?
                if (((a.length % 2) === 1) && !arg.endsWith("/properties")) { stars.push('*'); }
                return a.concat(stars).join('/');
            }

            socketPathRE(socketPath) {
                return new RegExp(`^${socketPath.replace(/\*/g, "[^/]+")}$`);
            }

            restPath(arg) {
                let a = this.copyOrSplit(arg);
                a = a.filter(e => e !== '*');
                return a.join('/');
            }

            endpointPath(arg) {
                // if the argument count is even, the last argument is an id
                let a = this.copyOrSplit(arg);
                a = a.filter(e => e !== '*');
                // is it even?
                if ((a.length % 2) === 0) { a.pop(); }
                return a.join('/');
            }

            copyOrSplit(arrayOrString) {
                if (angular.isArray(arrayOrString)) {
                    // return a copy
                    return arrayOrString.slice();
                } else if (angular.isString(arrayOrString)) {
                    // split the string to get an array
                    return arrayOrString.split('/');
                } else {
                    throw new TypeError(`Parameter 'arrayOrString' must be a array or a string, not ${typeof arrayOrString}`);
                }
            }

            unWrap(object, path) {
                return object[this.type(path)];
            }

            splitOptions(args) {
                // keep defined arguments only
                let accessor;
                args = args.filter(e => e != null);

                let query = {}; // default
                // get the query parameters
                const last = args[args.length - 1];
                const subscribe = (accessor = null);

                if (angular.isObject(last)) {
                    query = args.pop();
                }

                return [args, query];
            }

            parse(object) {
                for (let k in object) {
                    const v = object[k];
                    try {
                        object[k] = angular.fromJson(v);
                    } catch (error) {}
                } // ignore
                return object;
            }

            numberOrString(str = null) {
                // if already a number
                if (angular.isNumber(str)) { return str; }
                // else parse string to integer
                const number = parseInt(str, 10);
                if (!isNaN(number)) { return number; } else { return str; }
            }

            emailInString(string) {
                if (!angular.isString(string)) {
                    throw new TypeError(`Parameter 'string' must be a string, not ${typeof string}`);
                }
                const emailRegex = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/;
                try {
                    return emailRegex.exec(string).pop() || '';
                } catch (error) {
                    return '';
                }
            }
        });
    }
}


angular.module('bbData')
.service('dataUtilsService', [DataUtils]);
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Rest {
    constructor($http, $q, API) {
        let RestService;
        return new (RestService = class RestService {
            execute(config) {
                return $q((resolve, reject) =>
                    $http(config)
                    .success(function(response) {
                        try {
                            const data = angular.fromJson(response);
                            return resolve(data);
                        } catch (e) {
                            return reject(e);
                        }}).error(reason => reject(reason))
                );
            }

            get(url, params) {
                if (params == null) { params = {}; }
                const canceller = $q.defer();
                const config = {
                    method: 'GET',
                    url: this.parse(API, url),
                    params,
                    headers: {
                        'Accept': 'application/json'
                    },
                    timeout: canceller.promise
                };

                const promise = this.execute(config);
                promise.cancel = canceller.resolve;
                return promise;
            }

            post(url, data) {
                if (data == null) { data = {}; }
                const canceller = $q.defer();
                const config = {
                    method: 'POST',
                    url: this.parse(API, url),
                    data,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: canceller.promise
                };

                const promise = this.execute(config);
                promise.cancel = canceller.resolve;
                return promise;
            }

            parse(...args) {
                return args.join('/').replace(/\/\//, '/');
            }
        });
    }
}


angular.module('bbData')
.service('restService', ['$http', '$q', 'API', Rest]);
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Socket {
    constructor($log, $q, $rootScope, $location, Stream, webSocketService) {
        let SocketService;
        return new ((SocketService = (function() {
            SocketService = class SocketService {
                static initClass() {
                    // subscribe to event stream to get WebSocket messages
                    this.prototype.eventStream = null;
                }

                constructor() {
                    // waiting queue
                    this.queue = [];
                    // deferred object for resolving response promises
                    // map of id: promise
                    this.deferred = {};
                    this.subscribers = {};
                    // open socket
                    this.open();
                }

                open() {
                    if (this.socket == null) { this.socket = webSocketService.getWebSocket(this.getUrl()); }

                    // flush queue on open
                    this.socket.onopen = () => this.flush();

                    return this.setupEventStream();
                }

                setupEventStream() {
                    if (this.eventStream == null) { this.eventStream = new Stream(); }

                    return this.socket.onmessage = message => {
                        let id;
                        try {
                            const data = angular.fromJson(message.data);

                            // response message
                            if (data.code != null) {
                                id = data._id;
                                if (data.code === 200) { return (this.deferred[id] != null ? this.deferred[id].resolve(true) : undefined);
                                } else { return (this.deferred[id] != null ? this.deferred[id].reject(data) : undefined); }
                            // status update message
                            } else {
                                return $rootScope.$applyAsync(() => {
                                    return this.eventStream.push(data);
                                });
                            }
                        } catch (e) {
                            return (this.deferred[id] != null ? this.deferred[id].reject(e) : undefined);
                        }
                    };
                }

                close() {
                    return this.socket.close();
                }

                send(data) {
                    // add _id to each message
                    const id = this.nextId();
                    data._id = id;
                    if (this.deferred[id] == null) { this.deferred[id] = $q.defer(); }

                    data = angular.toJson(data);
                    // ReconnectingWebSocket does not put status constants on instance
                    if (this.socket.readyState === (this.socket.OPEN || 1)) {
                        this.socket.send(data);
                    } else {
                        // if the WebSocket is not open yet, add the data to the queue
                        this.queue.push(data);
                    }

                    // return promise, which will be resolved once a response message has the same id
                    return this.deferred[id].promise;
                }

                flush() {
                    // send all the data waiting in the queue
                    return (() => {
                        let data;
                        const result = [];
                        while ((data = this.queue.pop())) {
                            result.push(this.socket.send(data));
                        }
                        return result;
                    })();
                }

                nextId() {
                    if (this.id == null) { this.id = 0; }
                    this.id = this.id < 1000 ? this.id + 1 : 0;
                    return this.id;
                }

                getRootPath() {
                    return location.pathname;
                }

                getUrl() {
                    const host = $location.host();
                    const protocol = $location.protocol() === 'https' ? 'wss' : 'ws';
                    const defaultport = $location.protocol() === 'https' ? 443 : 80;
                    const path = this.getRootPath();
                    const port = $location.port() === defaultport ? '' : `:${$location.port()}`;
                    return `${protocol}://${host}${port}${path}ws`;
                }

                // High level api. Maintain a list of subscribers for one event path
                subscribe(eventPath, collection) {
                    const l = this.subscribers[eventPath] != null ? this.subscribers[eventPath] : (this.subscribers[eventPath] = []);
                    l.push(collection);
                    if (l.length === 1) {
                        return this.send({
                            cmd: "startConsuming",
                            path: eventPath
                        });
                    }
                    return $q.resolve();
                }

                unsubscribe(eventPath, collection) {
                    const l = this.subscribers[eventPath] != null ? this.subscribers[eventPath] : (this.subscribers[eventPath] = []);
                    const pos = l.indexOf(collection);
                    if (pos >= 0) {
                        l.splice(pos, 1);
                        if (l.length === 0) {
                            return this.send({
                                cmd: "stopConsuming",
                                path: eventPath
                            });
                        }
                    }
                    return $q.resolve();
                }
            };
            SocketService.initClass();
            return SocketService;
        })()));
    }
}


angular.module('bbData')
.service('socketService', ['$log', '$q', '$rootScope', '$location', 'Stream', 'webSocketService', Socket]);
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
var WebSocketBackend = (function() {
    let self = undefined;
    let MockWebSocket = undefined;
    WebSocketBackend = class WebSocketBackend {
        static initClass() {
            self = null;

            this.prototype.sendQueue = [];
            this.prototype.receiveQueue = [];

            // mocked WebSocket
            MockWebSocket = (function() {
                MockWebSocket = class MockWebSocket {
                    static initClass() {
                        this.prototype.OPEN = 1;
                    }
                    send(message) {
                        return self.receiveQueue.push(message);
                    }
                    close() { return (typeof this.onclose === 'function' ? this.onclose() : undefined); }
                };
                MockWebSocket.initClass();
                return MockWebSocket;
            })();
        }
        constructor() {
            self = this;
            this.webSocket = new MockWebSocket();
        }
        send(message) {
            const data = {data: message};
            return this.sendQueue.push(data);
        }

        flush() {
            return (() => {
                let message;
                const result = [];
                while ((message = this.sendQueue.shift())) {
                    result.push(this.webSocket.onmessage(message));
                }
                return result;
            })();
        }

        getWebSocket() {
            return this.webSocket;
        }
    };
    WebSocketBackend.initClass();
    return WebSocketBackend;
})();


angular.module('bbData')
.service('webSocketBackendService', [WebSocketBackend]);
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class WebSocket {
    constructor($window) {
        let WebSocketProvider;
        return new (WebSocketProvider = class WebSocketProvider {
            constructor() {}

            // this function will be mocked in the tests
            getWebSocket(url) {
                const match = /wss?:\/\//.exec(url);

                if (!match) {
                    throw new Error('Invalid url provided');
                }

                // use ReconnectingWebSocket if available
                // TODO write own implementation?
                if ($window.ReconnectingWebSocket != null) {
                    return new $window.ReconnectingWebSocket(url);
                } else {
                    return new $window.WebSocket(url);
                }
            }
        });
    }
}


angular.module('bbData')
.service('webSocketService', ['$window', WebSocket]);
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Stream {
    constructor() {
        let StreamInstance;
        return StreamInstance = (function() {
            StreamInstance = class StreamInstance {
                static initClass() {
                    // the unsubscribe listener will be called on each unsubscribe call
                    this.prototype.onUnsubscribe = null;
                    this.prototype.listeners = [];
                }

                subscribe(listener) {
                    if (!angular.isFunction(listener)) {
                        throw new TypeError(`Parameter 'listener' must be a function, not ${typeof listener}`);
                    }

                    listener.id = this.generateId();
                    this.listeners.push(listener);

                    // unsubscribe
                    return () => {
                        const i = this.listeners.indexOf(listener);
                        const removed = this.listeners.splice(i, 1);
                        // call the unsubscribe listener if it's a function
                        if (angular.isFunction(this.onUnsubscribe)) {
                            return this.onUnsubscribe(listener);
                        }
                    };
                }

                push(data) {
                    // call each listener
                    return Array.from(this.listeners).map((listener) => listener(data));
                }

                destroy() {
                    // @listeners = [], but keep the reference
                    return (() => {
                        const result = [];
                        while (this.listeners.length > 0) {
                            result.push(this.listeners.pop());
                        }
                        return result;
                    })();
                }

                generateId() {
                    if (this.lastId == null) { this.lastId = 0; }
                    return this.lastId++;
                }
            };
            StreamInstance.initClass();
            return StreamInstance;
        })();
    }
}


angular.module('bbData')
.factory('Stream', [Stream]);
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Collection {
    constructor($q, $injector, $log, dataUtilsService, socketService, DataQuery, $timeout) {
        let CollectionInstance;

        angular.isArray = (Array.isArray = arg => arg instanceof Array);
        CollectionInstance = class CollectionInstance extends Array {
            constructor(restPath, query, accessor) {
                // this contructor is used to construct completely new instances only.
                // We override constructor property for existing instances so that
                // Array.prototype.filter() passes the restPath, query and accessor properties
                // to the new instance.
                super();
                this.constructorImpl(restPath, query, accessor);
            }

            constructorImpl(restPath, query, accessor) {
                let className;
                this.listener = this.listener.bind(this);
                this.restPath = restPath;
                if (query == null) { query = {}; }
                this.query = query;
                this.accessor = accessor;
                this.socketPath = dataUtilsService.socketPath(this.restPath);
                this.type = dataUtilsService.type(this.restPath);
                this.id = dataUtilsService.classId(this.restPath);
                this.endpoint = dataUtilsService.endpointPath(this.restPath);
                this.socketPathRE = dataUtilsService.socketPathRE(this.socketPath);
                this.queryExecutor = new DataQuery(this.query);
                // default event handlers
                this.onUpdate = angular.noop;
                this.onNew = angular.noop;
                this.onChange = angular.noop;
                this._new = [];
                this._updated = [];
                this._byId = {};
                this.$resolved = false;
                try {
                    // try to get the wrapper class
                    className = dataUtilsService.className(this.restPath);
                    // the classes have the dataService as a dependency
                    // $injector.get doesn't throw circular dependency exception
                    this.WrapperClass = $injector.get(className);
                } catch (e) {
                    // use the Base class otherwise
                    console.log("unknown wrapper for", className);
                    this.WrapperClass = $injector.get('Base');
                }
                socketService.eventStream.subscribe(this.listener);
                if (this.accessor != null) {
                    this.accessor.registerCollection(this);
                }
            }

            then(callback) {
                console.log("Should not use collection as a promise. Callback will be called several times!");
                return this.onChange = callback;
            }

            getArray() {
                console.log("getArray() is deprecated. dataService.get() directly returns the collection!");
                return this;
            }

            get(id) {
                return this._byId[id];
            }

            hasOwnProperty(id) {
                return this._byId.hasOwnProperty(id);
            }

            listener(data) {
                const key = data.k;
                const message = data.m;
                // Test if the message is for me
                if (this.socketPathRE.test(key)) {
                    this.put(message);
                    this.recomputeQuery();
                    return this.sendEvents();
                }
            }

            subscribe() {
                return socketService.subscribe(this.socketPath, this);
            }

            close() {
                return socketService.unsubscribe(this.socketPath, this);
            }

            initial(data) {
                this.$resolved = true;
                // put items one by one if not already in the array
                // if they are that means they come from an update event
                // the event is always considered the latest data
                // so we don't overwrite it with REST data
                for (let i of Array.from(data)) {
                    if (!this.hasOwnProperty(i[this.id])) {
                        this.put(i);
                    }
                }
                this.recomputeQuery();
                return this.sendEvents({initial:true});
            }

            from(data) {
                // put items one by one
                for (let i of Array.from(data)) { this.put(i); }
                this.recomputeQuery();
                return this.sendEvents();
            }

            item(i) {
                return this[i];
            }

            add(element) {
                // don't create wrapper if element is filtered
                if (this.queryExecutor.filter([element]).length === 0) {
                    return;
                }
                const instance = new this.WrapperClass(element, this.endpoint);
                instance.setAccessor(this.accessor);
                instance.$collection = this;
                this._new.push(instance);
                this._byId[instance[this.id]] = instance;
                return this.push(instance);
            }

            put(element) {
                for (let old of Array.from(this)) {
                    if (old[this.id] === element[this.id]) {
                        old.update(element);
                        this._updated.push(old);
                        return;
                    }
                }
                // if not found, add it.
                return this.add(element);
            }

            clear() {
                return (() => {
                    const result = [];
                    while (this.length > 0) {
                        result.push(this.pop());
                    }
                    return result;
                })();
            }

            delete(element) {
                const index = this.indexOf(element);
                if (index > -1) { return this.splice(index, 1); }
            }

            recomputeQuery() {
                return this.queryExecutor.computeQuery(this);
            }

            sendEvents(opts){
                // send the events asynchronously
                const { _new } = this;
                const { _updated } = this;
                this._updated = [];
                this._new = [];
                return $timeout(() => {
                    let i;
                    let changed = false;
                    for (i of Array.from(_new)) {
                        // is it still in the array?
                        if (Array.from(this).includes(i)) {
                            this.onNew(i);
                            changed = true;
                        }
                    }

                    for (i of Array.from(_updated)) {
                        // is it still in the array?
                        if (Array.from(this).includes(i)) {
                            this.onUpdate(i);
                            changed = true;
                        }
                    }

                    if (changed || (opts != null ? opts.initial : undefined)) {
                        return this.onChange(this);
                    }
                }
                , 0);
            }
        };
        // see explanation in CollectionInstance.constructor() above
        Object.defineProperty(CollectionInstance.prototype, 'constructor', {
            get: function() {
                let copyFrom = this;
                return function(length) {
                    return copyFrom.constructorImpl(copyFrom.restPath, copyFrom.query,
                                                    copyfrom.accessor);
                };
            }
        });
        return CollectionInstance;
    }
}


angular.module('bbData')
.factory('Collection', ['$q', '$injector', '$log', 'dataUtilsService', 'socketService', 'DataQuery', '$timeout', Collection]);
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class DataQuery {
    constructor($http, $q, API) {
        let DataQueryClass;
        return (DataQueryClass = class DataQueryClass {
            constructor(query) {
                if (query == null) { query = {}; }
                this.query = query;
                this.filters = {};
                for (let fieldAndOperator in query) {
                    let value = query[fieldAndOperator];
                    if (['field', 'limit', 'offset', 'order', 'property'].indexOf(fieldAndOperator) < 0) {
                        if (['on', 'true', 'yes'].indexOf(value) > -1) { value = true;
                        } else if (['off', 'false', 'no'].indexOf(value) > -1) { value = false; }
                        this.filters[fieldAndOperator] = value;
                    }
                }
            }

            computeQuery(array) {
                // 1. filtering
                this.filter(array);

                // 2. sorting
                const order = this.query != null ? this.query.order : undefined;
                this.sort(array, order);

                // 3. limit
                const limit = this.query != null ? this.query.limit : undefined;
                return this.limit(array, limit);
            }


            isFiltered(v) {
                const cmpByOp = {};
                for (let fieldAndOperator in this.filters) {
                    const value = this.filters[fieldAndOperator];
                    const [field, operator] = Array.from(fieldAndOperator.split('__'));
                    let cmp = false;
                    switch (operator) {
                        case 'ne': cmp = v[field] !== value; break;
                        case 'lt': cmp = v[field] <  value; break;
                        case 'le': cmp = v[field] <= value; break;
                        case 'gt': cmp = v[field] >  value; break;
                        case 'ge': cmp = v[field] >= value; break;
                        default: cmp = (v[field] === value) ||
                            (angular.isArray(v[field]) && Array.from(v[field]).includes(value)) ||
                            (angular.isArray(value) && (value.length === 0)) ||
                            (angular.isArray(value) && Array.from(value).includes(v[field])) ||
                            // private fields added by the data service
                            (v[`_${field}`] === value) ||
                            (angular.isArray(v[`_${field}`]) && Array.from(v[`_${field}`]).includes(value)) ||
                            (angular.isArray(value) && Array.from(value).includes(v[`_${field}`]));
                    }
                    cmpByOp[fieldAndOperator] = cmpByOp[fieldAndOperator] || cmp;
                }
                for (let op of Object.keys(cmpByOp || {})) {
                    v = cmpByOp[op];
                    if (!v) { return false; }
                }
                return true;
            }

            filter(array) {
                let i = 0;
                return (() => {
                    const result = [];
                    while (i < array.length) {
                        const v = array[i];
                        if (this.isFiltered(v)) {
                            result.push(i += 1);
                        } else {
                            result.push(array.splice(i, 1));
                        }
                    }
                    return result;
                })();
            }

            sort(array, order) {
                const compare = function(property) {
                    let reverse = false;
                    if (property[0] === '-') {
                        property = property.slice(1);
                        reverse = true;
                    }

                    return function(a, b) {
                        if (reverse) { [a, b] = Array.from([b, a]); }

                        if (a[property] < b[property]) { return -1;
                        } else if (a[property] > b[property]) { return 1;
                        } else { return 0; }
                    };
                };
                if (angular.isString(order)) {
                    return array.sort(compare(order));
                } else if (angular.isArray(order)) {
                    return array.sort(function(a, b) {
                        for (let o of Array.from(order)) {
                            const f = compare(o)(a, b);
                            if (f) { return f; }
                        }
                        return 0;
                    });
                }
            }

            limit(array, limit) {
                return (() => {
                    const result = [];
                    while (array.length > limit) {
                        result.push(array.pop());
                    }
                    return result;
                })();
            }
        });
    }
}


angular.module('bbData')
.factory('DataQuery', ['$http', '$q', 'API', DataQuery]);
//# sourceMappingURL=buildbot-data.js.map
