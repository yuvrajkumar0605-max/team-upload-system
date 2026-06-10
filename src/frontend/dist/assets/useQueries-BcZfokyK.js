var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { S as Subscribable, p as pendingThenable, h as resolveEnabled, s as shallowEqualObjects, i as resolveStaleTime, n as noop, k as environmentManager, l as isValidTimeout, t as timeUntilStale, m as timeoutManager, o as focusManager, q as fetchState, v as replaceData, w as notifyManager, x as hashKey, y as getDefaultState, r as reactExports, z as shouldThrowError, c as useQueryClient, b as useInternetIdentity, A as createActorWithConfig, B as Record, T as Text, O as Opt, N as Nat, C as Bool, V as Variant, D as Null, E as Vec, F as Nat8, I as Int, P as Principal, G as Service, H as Func, J as Tuple, K as HttpAgent, L as Actor } from "./index-B1BWNsRw.js";
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actor = await createActorWithConfig(createActor2, {
        agentOptions: { identity }
      });
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const _ImmutableObjectStorageCreateCertificateResult = Record({
  "method": Text,
  "blob_hash": Text
});
const _ImmutableObjectStorageRefillInformation = Record({
  "proposed_top_up_amount": Opt(Nat)
});
const _ImmutableObjectStorageRefillResult = Record({
  "success": Opt(Bool),
  "topped_up_amount": Opt(Nat)
});
const Error$1 = Variant({
  "FrontendOriginsNotConfigured": Null,
  "MixedSsoSources": Record({
    "otherKeys": Vec(Text),
    "ssoKeys": Vec(Text)
  }),
  "Stale": Record({ "ageNs": Nat }),
  "MalformedCandid": Null,
  "AmbiguousAttribute": Record({
    "field": Text,
    "sources": Vec(Text)
  }),
  "NoAttributes": Null,
  "UnknownNonce": Null,
  "UntrustedSsoSource": Record({ "domain": Text }),
  "MissingField": Text,
  "FrontendOriginMismatch": Record({
    "got": Text,
    "expected": Vec(Text)
  })
});
const Result__1 = Variant({ "ok": Null, "err": Error$1 });
const UserRole = Variant({
  "admin": Null,
  "user": Null,
  "guest": Null
});
const ExternalBlob$1 = Vec(Nat8);
const Time = Int;
const Announcement = Record({
  "id": Text,
  "title": Text,
  "link": Opt(Text),
  "createdAt": Time,
  "description": Text,
  "image": ExternalBlob$1
});
const IdPassGroupLink = Record({
  "id": Text,
  "creator": Principal,
  "groupNumber": Nat,
  "createdAt": Time,
  "groupId": Nat,
  "groupLink": Text
});
const TeamMember = Record({
  "playerId": Opt(Text),
  "name": Text
});
const CaptainInfo = Record({
  "name": Text,
  "phone": Text
});
const TeamRegistration = Record({
  "id": Text,
  "creator": Opt(Principal),
  "teamName": Text,
  "members": Vec(TeamMember),
  "groupNumber": Nat,
  "logo": ExternalBlob$1,
  "idPassAssigned": Bool,
  "captain": CaptainInfo,
  "teamId": Nat,
  "groupLink": Opt(Text)
});
const ReportMetadata = Record({
  "created": Time,
  "blob": ExternalBlob$1,
  "size": Nat,
  "filename": Text
});
const Result = Record({
  "id": Text,
  "title": Text,
  "link": Opt(Text),
  "createdAt": Time,
  "description": Text,
  "image": ExternalBlob$1
});
const LogoUpload = Record({
  "teamName": Text,
  "logo": ExternalBlob$1,
  "fileSize": Nat,
  "uploadTime": Time
});
const Banner = Record({
  "id": Text,
  "createdAt": Int,
  "image": ExternalBlob$1
});
const UserProfile = Record({ "name": Text });
const DuplicateReason$1 = Variant({
  "captainPhone": Null,
  "teamName": Null
});
const DuplicateEntry = Record({
  "originalId": Text,
  "duplicatedAt": Time,
  "duplicateId": Text,
  "reason": DuplicateReason$1
});
const RegistrationSummary = Record({
  "totalTeams": Nat,
  "confirmedTeams": Nat,
  "maxTeams": Opt(Nat)
});
const SocialMediaLinks = Record({
  "instagram": Opt(Text),
  "whatsapp": Opt(Text),
  "discord": Opt(Text),
  "youtube": Opt(Text)
});
const ApprovalStatus = Variant({
  "pending": Null,
  "approved": Null,
  "rejected": Null
});
const UserApprovalInfo = Record({
  "status": ApprovalStatus,
  "principal": Principal
});
Service({
  "_immutableObjectStorageBlobsAreLive": Func(
    [Vec(Vec(Nat8))],
    [Vec(Bool)],
    ["query"]
  ),
  "_immutableObjectStorageBlobsToDelete": Func(
    [],
    [Vec(Vec(Nat8))],
    ["query"]
  ),
  "_immutableObjectStorageConfirmBlobDeletion": Func(
    [Vec(Vec(Nat8))],
    [],
    []
  ),
  "_immutableObjectStorageCreateCertificate": Func(
    [Text],
    [_ImmutableObjectStorageCreateCertificateResult],
    []
  ),
  "_immutableObjectStorageRefillCashier": Func(
    [Opt(_ImmutableObjectStorageRefillInformation)],
    [_ImmutableObjectStorageRefillResult],
    []
  ),
  "_immutableObjectStorageUpdateGatewayPrincipals": Func([], [], []),
  "_initialize_access_control": Func([], [], []),
  "_internet_identity_sign_in_finish": Func([], [Result__1], []),
  "_internet_identity_sign_in_start": Func([], [Vec(Nat8)], []),
  "addGroupLink": Func([Nat, Text], [], []),
  "assignCallerUserRole": Func([Principal, UserRole], [], []),
  "bulkUpdateIdPassStatus": Func([Bool], [], []),
  "checkTeamLogoExists": Func([Text], [Bool], ["query"]),
  "closeRegistration": Func([Bool], [], []),
  "createAnnouncement": Func(
    [Text, Text, ExternalBlob$1, Opt(Text)],
    [Text],
    []
  ),
  "createGroupLink": Func([Nat, Nat, Text], [], []),
  "createResult": Func(
    [Text, ExternalBlob$1, Text, Opt(Text)],
    [Text],
    []
  ),
  "deleteAnnouncement": Func([Text], [], []),
  "deleteBanner": Func(
    [],
    [Variant({ "ok": Text, "err": Text })],
    []
  ),
  "deleteDuplicateEntry": Func([Text], [], []),
  "deleteGroupLink": Func([Nat], [], []),
  "deleteRegistration": Func([Text], [], []),
  "deleteReport": Func([Text], [], []),
  "deleteResult": Func([Text], [], []),
  "getAllAnnouncements": Func([], [Vec(Announcement)], ["query"]),
  "getAllGroupLinks": Func(
    [],
    [Vec(Tuple(Nat, Text))],
    ["query"]
  ),
  "getAllGroupLinksWithInfo": Func(
    [],
    [Vec(IdPassGroupLink)],
    ["query"]
  ),
  "getAllRegistrations": Func([], [Vec(TeamRegistration)], ["query"]),
  "getAllReports": Func([], [Vec(ReportMetadata)], ["query"]),
  "getAllResults": Func([], [Vec(Result)], ["query"]),
  "getAllTeamLogosPaginated": Func(
    [Nat, Nat],
    [Vec(LogoUpload)],
    ["query"]
  ),
  "getAllTeamsWithGroupInfo": Func(
    [],
    [Vec(TeamRegistration)],
    ["query"]
  ),
  "getAllTeamsWithIdPassStatus": Func(
    [],
    [Vec(TeamRegistration)],
    ["query"]
  ),
  "getAnnouncement": Func([Text], [Announcement], ["query"]),
  "getAnnouncementsCount": Func([], [Nat], ["query"]),
  "getBanner": Func([], [Opt(Banner)], ["query"]),
  "getCallerUserProfile": Func([], [Opt(UserProfile)], ["query"]),
  "getCallerUserRole": Func([], [UserRole], ["query"]),
  "getDuplicateRegistrations": Func(
    [],
    [Vec(DuplicateEntry)],
    ["query"]
  ),
  "getGroupLink": Func([Nat], [Opt(Text)], ["query"]),
  "getGroupLinkById": Func([Nat], [IdPassGroupLink], ["query"]),
  "getIdPassStatus": Func([Nat], [Bool], ["query"]),
  "getLogoByTeamName": Func([Text], [LogoUpload], ["query"]),
  "getMaxTeamRegistrations": Func([], [Opt(Nat)], ["query"]),
  "getRegistrationStatus": Func([], [Bool], ["query"]),
  "getRegistrationSummary": Func([], [RegistrationSummary], ["query"]),
  "getReport": Func([Text], [ReportMetadata], ["query"]),
  "getResult": Func([Text], [Result], ["query"]),
  "getResultsCount": Func([], [Nat], ["query"]),
  "getSocialMediaLinks": Func([], [SocialMediaLinks], ["query"]),
  "getTeamById": Func([Nat], [TeamRegistration], ["query"]),
  "getTeamDetailsViewer": Func([], [Vec(TeamRegistration)], ["query"]),
  "getTeamRegistration": Func([Text], [TeamRegistration], ["query"]),
  "getTeamsByIdPassStatus": Func(
    [Bool],
    [Vec(TeamRegistration)],
    ["query"]
  ),
  "getUserProfile": Func(
    [Principal],
    [Opt(UserProfile)],
    ["query"]
  ),
  "initializeAccessControl": Func([], [], []),
  "isCallerAdmin": Func([], [Bool], ["query"]),
  "isCallerApproved": Func([], [Bool], ["query"]),
  "listApprovals": Func([], [Vec(UserApprovalInfo)], ["query"]),
  "requestApproval": Func([], [], []),
  "saveCallerUserProfile": Func([UserProfile], [], []),
  "searchGroupLinkByTeam": Func(
    [Text, Text],
    [Opt(IdPassGroupLink)],
    ["query"]
  ),
  "searchGroupLinks": Func(
    [Text],
    [Vec(IdPassGroupLink)],
    ["query"]
  ),
  "searchTeamsByIdPassStatus": Func(
    [Text],
    [Vec(TeamRegistration)],
    ["query"]
  ),
  "searchTeamsByName": Func(
    [Text],
    [Vec(TeamRegistration)],
    ["query"]
  ),
  "searchTeamsByNameOrPhone": Func(
    [Text],
    [Vec(TeamRegistration)],
    ["query"]
  ),
  "setApproval": Func([Principal, ApprovalStatus], [], []),
  "setBanner": Func(
    [ExternalBlob$1],
    [Variant({ "ok": Text, "err": Text })],
    []
  ),
  "setMaxTeamRegistrations": Func([Opt(Nat)], [], []),
  "storeReport": Func([Text, ExternalBlob$1, Nat], [], []),
  "submitRegistration": Func(
    [Text, ExternalBlob$1, CaptainInfo, Vec(TeamMember)],
    [Text],
    []
  ),
  "updateAnnouncement": Func(
    [Text, Text, Text, ExternalBlob$1, Opt(Text)],
    [],
    []
  ),
  "updateGroupLink": Func([Nat, Text], [], []),
  "updateIdPassStatus": Func([Nat, Bool], [], []),
  "updateLogo": Func([Text, ExternalBlob$1], [], []),
  "updateResult": Func(
    [Text, Text, ExternalBlob$1, Text, Opt(Text)],
    [],
    []
  ),
  "updateSocialMediaLinks": Func([SocialMediaLinks], [], []),
  "uploadTeamLogo": Func([Text, ExternalBlob$1, Nat], [], [])
});
const idlFactory = ({ IDL }) => {
  const _ImmutableObjectStorageCreateCertificateResult2 = IDL.Record({
    "method": IDL.Text,
    "blob_hash": IDL.Text
  });
  const _ImmutableObjectStorageRefillInformation2 = IDL.Record({
    "proposed_top_up_amount": IDL.Opt(IDL.Nat)
  });
  const _ImmutableObjectStorageRefillResult2 = IDL.Record({
    "success": IDL.Opt(IDL.Bool),
    "topped_up_amount": IDL.Opt(IDL.Nat)
  });
  const Error2 = IDL.Variant({
    "FrontendOriginsNotConfigured": IDL.Null,
    "MixedSsoSources": IDL.Record({
      "otherKeys": IDL.Vec(IDL.Text),
      "ssoKeys": IDL.Vec(IDL.Text)
    }),
    "Stale": IDL.Record({ "ageNs": IDL.Nat }),
    "MalformedCandid": IDL.Null,
    "AmbiguousAttribute": IDL.Record({
      "field": IDL.Text,
      "sources": IDL.Vec(IDL.Text)
    }),
    "NoAttributes": IDL.Null,
    "UnknownNonce": IDL.Null,
    "UntrustedSsoSource": IDL.Record({ "domain": IDL.Text }),
    "MissingField": IDL.Text,
    "FrontendOriginMismatch": IDL.Record({
      "got": IDL.Text,
      "expected": IDL.Vec(IDL.Text)
    })
  });
  const Result__12 = IDL.Variant({ "ok": IDL.Null, "err": Error2 });
  const UserRole2 = IDL.Variant({
    "admin": IDL.Null,
    "user": IDL.Null,
    "guest": IDL.Null
  });
  const ExternalBlob2 = IDL.Vec(IDL.Nat8);
  const Time2 = IDL.Int;
  const Announcement2 = IDL.Record({
    "id": IDL.Text,
    "title": IDL.Text,
    "link": IDL.Opt(IDL.Text),
    "createdAt": Time2,
    "description": IDL.Text,
    "image": ExternalBlob2
  });
  const IdPassGroupLink2 = IDL.Record({
    "id": IDL.Text,
    "creator": IDL.Principal,
    "groupNumber": IDL.Nat,
    "createdAt": Time2,
    "groupId": IDL.Nat,
    "groupLink": IDL.Text
  });
  const TeamMember2 = IDL.Record({
    "playerId": IDL.Opt(IDL.Text),
    "name": IDL.Text
  });
  const CaptainInfo2 = IDL.Record({ "name": IDL.Text, "phone": IDL.Text });
  const TeamRegistration2 = IDL.Record({
    "id": IDL.Text,
    "creator": IDL.Opt(IDL.Principal),
    "teamName": IDL.Text,
    "members": IDL.Vec(TeamMember2),
    "groupNumber": IDL.Nat,
    "logo": ExternalBlob2,
    "idPassAssigned": IDL.Bool,
    "captain": CaptainInfo2,
    "teamId": IDL.Nat,
    "groupLink": IDL.Opt(IDL.Text)
  });
  const ReportMetadata2 = IDL.Record({
    "created": Time2,
    "blob": ExternalBlob2,
    "size": IDL.Nat,
    "filename": IDL.Text
  });
  const Result2 = IDL.Record({
    "id": IDL.Text,
    "title": IDL.Text,
    "link": IDL.Opt(IDL.Text),
    "createdAt": Time2,
    "description": IDL.Text,
    "image": ExternalBlob2
  });
  const LogoUpload2 = IDL.Record({
    "teamName": IDL.Text,
    "logo": ExternalBlob2,
    "fileSize": IDL.Nat,
    "uploadTime": Time2
  });
  const Banner2 = IDL.Record({
    "id": IDL.Text,
    "createdAt": IDL.Int,
    "image": ExternalBlob2
  });
  const UserProfile2 = IDL.Record({ "name": IDL.Text });
  const DuplicateReason2 = IDL.Variant({
    "captainPhone": IDL.Null,
    "teamName": IDL.Null
  });
  const DuplicateEntry2 = IDL.Record({
    "originalId": IDL.Text,
    "duplicatedAt": Time2,
    "duplicateId": IDL.Text,
    "reason": DuplicateReason2
  });
  const RegistrationSummary2 = IDL.Record({
    "totalTeams": IDL.Nat,
    "confirmedTeams": IDL.Nat,
    "maxTeams": IDL.Opt(IDL.Nat)
  });
  const SocialMediaLinks2 = IDL.Record({
    "instagram": IDL.Opt(IDL.Text),
    "whatsapp": IDL.Opt(IDL.Text),
    "discord": IDL.Opt(IDL.Text),
    "youtube": IDL.Opt(IDL.Text)
  });
  const ApprovalStatus2 = IDL.Variant({
    "pending": IDL.Null,
    "approved": IDL.Null,
    "rejected": IDL.Null
  });
  const UserApprovalInfo2 = IDL.Record({
    "status": ApprovalStatus2,
    "principal": IDL.Principal
  });
  return IDL.Service({
    "_immutableObjectStorageBlobsAreLive": IDL.Func(
      [IDL.Vec(IDL.Vec(IDL.Nat8))],
      [IDL.Vec(IDL.Bool)],
      ["query"]
    ),
    "_immutableObjectStorageBlobsToDelete": IDL.Func(
      [],
      [IDL.Vec(IDL.Vec(IDL.Nat8))],
      ["query"]
    ),
    "_immutableObjectStorageConfirmBlobDeletion": IDL.Func(
      [IDL.Vec(IDL.Vec(IDL.Nat8))],
      [],
      []
    ),
    "_immutableObjectStorageCreateCertificate": IDL.Func(
      [IDL.Text],
      [_ImmutableObjectStorageCreateCertificateResult2],
      []
    ),
    "_immutableObjectStorageRefillCashier": IDL.Func(
      [IDL.Opt(_ImmutableObjectStorageRefillInformation2)],
      [_ImmutableObjectStorageRefillResult2],
      []
    ),
    "_immutableObjectStorageUpdateGatewayPrincipals": IDL.Func([], [], []),
    "_initialize_access_control": IDL.Func([], [], []),
    "_internet_identity_sign_in_finish": IDL.Func([], [Result__12], []),
    "_internet_identity_sign_in_start": IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    "addGroupLink": IDL.Func([IDL.Nat, IDL.Text], [], []),
    "assignCallerUserRole": IDL.Func([IDL.Principal, UserRole2], [], []),
    "bulkUpdateIdPassStatus": IDL.Func([IDL.Bool], [], []),
    "checkTeamLogoExists": IDL.Func([IDL.Text], [IDL.Bool], ["query"]),
    "closeRegistration": IDL.Func([IDL.Bool], [], []),
    "createAnnouncement": IDL.Func(
      [IDL.Text, IDL.Text, ExternalBlob2, IDL.Opt(IDL.Text)],
      [IDL.Text],
      []
    ),
    "createGroupLink": IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [], []),
    "createResult": IDL.Func(
      [IDL.Text, ExternalBlob2, IDL.Text, IDL.Opt(IDL.Text)],
      [IDL.Text],
      []
    ),
    "deleteAnnouncement": IDL.Func([IDL.Text], [], []),
    "deleteBanner": IDL.Func(
      [],
      [IDL.Variant({ "ok": IDL.Text, "err": IDL.Text })],
      []
    ),
    "deleteDuplicateEntry": IDL.Func([IDL.Text], [], []),
    "deleteGroupLink": IDL.Func([IDL.Nat], [], []),
    "deleteRegistration": IDL.Func([IDL.Text], [], []),
    "deleteReport": IDL.Func([IDL.Text], [], []),
    "deleteResult": IDL.Func([IDL.Text], [], []),
    "getAllAnnouncements": IDL.Func([], [IDL.Vec(Announcement2)], ["query"]),
    "getAllGroupLinks": IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Text))],
      ["query"]
    ),
    "getAllGroupLinksWithInfo": IDL.Func(
      [],
      [IDL.Vec(IdPassGroupLink2)],
      ["query"]
    ),
    "getAllRegistrations": IDL.Func(
      [],
      [IDL.Vec(TeamRegistration2)],
      ["query"]
    ),
    "getAllReports": IDL.Func([], [IDL.Vec(ReportMetadata2)], ["query"]),
    "getAllResults": IDL.Func([], [IDL.Vec(Result2)], ["query"]),
    "getAllTeamLogosPaginated": IDL.Func(
      [IDL.Nat, IDL.Nat],
      [IDL.Vec(LogoUpload2)],
      ["query"]
    ),
    "getAllTeamsWithGroupInfo": IDL.Func(
      [],
      [IDL.Vec(TeamRegistration2)],
      ["query"]
    ),
    "getAllTeamsWithIdPassStatus": IDL.Func(
      [],
      [IDL.Vec(TeamRegistration2)],
      ["query"]
    ),
    "getAnnouncement": IDL.Func([IDL.Text], [Announcement2], ["query"]),
    "getAnnouncementsCount": IDL.Func([], [IDL.Nat], ["query"]),
    "getBanner": IDL.Func([], [IDL.Opt(Banner2)], ["query"]),
    "getCallerUserProfile": IDL.Func([], [IDL.Opt(UserProfile2)], ["query"]),
    "getCallerUserRole": IDL.Func([], [UserRole2], ["query"]),
    "getDuplicateRegistrations": IDL.Func(
      [],
      [IDL.Vec(DuplicateEntry2)],
      ["query"]
    ),
    "getGroupLink": IDL.Func([IDL.Nat], [IDL.Opt(IDL.Text)], ["query"]),
    "getGroupLinkById": IDL.Func([IDL.Nat], [IdPassGroupLink2], ["query"]),
    "getIdPassStatus": IDL.Func([IDL.Nat], [IDL.Bool], ["query"]),
    "getLogoByTeamName": IDL.Func([IDL.Text], [LogoUpload2], ["query"]),
    "getMaxTeamRegistrations": IDL.Func([], [IDL.Opt(IDL.Nat)], ["query"]),
    "getRegistrationStatus": IDL.Func([], [IDL.Bool], ["query"]),
    "getRegistrationSummary": IDL.Func([], [RegistrationSummary2], ["query"]),
    "getReport": IDL.Func([IDL.Text], [ReportMetadata2], ["query"]),
    "getResult": IDL.Func([IDL.Text], [Result2], ["query"]),
    "getResultsCount": IDL.Func([], [IDL.Nat], ["query"]),
    "getSocialMediaLinks": IDL.Func([], [SocialMediaLinks2], ["query"]),
    "getTeamById": IDL.Func([IDL.Nat], [TeamRegistration2], ["query"]),
    "getTeamDetailsViewer": IDL.Func(
      [],
      [IDL.Vec(TeamRegistration2)],
      ["query"]
    ),
    "getTeamRegistration": IDL.Func([IDL.Text], [TeamRegistration2], ["query"]),
    "getTeamsByIdPassStatus": IDL.Func(
      [IDL.Bool],
      [IDL.Vec(TeamRegistration2)],
      ["query"]
    ),
    "getUserProfile": IDL.Func(
      [IDL.Principal],
      [IDL.Opt(UserProfile2)],
      ["query"]
    ),
    "initializeAccessControl": IDL.Func([], [], []),
    "isCallerAdmin": IDL.Func([], [IDL.Bool], ["query"]),
    "isCallerApproved": IDL.Func([], [IDL.Bool], ["query"]),
    "listApprovals": IDL.Func([], [IDL.Vec(UserApprovalInfo2)], ["query"]),
    "requestApproval": IDL.Func([], [], []),
    "saveCallerUserProfile": IDL.Func([UserProfile2], [], []),
    "searchGroupLinkByTeam": IDL.Func(
      [IDL.Text, IDL.Text],
      [IDL.Opt(IdPassGroupLink2)],
      ["query"]
    ),
    "searchGroupLinks": IDL.Func(
      [IDL.Text],
      [IDL.Vec(IdPassGroupLink2)],
      ["query"]
    ),
    "searchTeamsByIdPassStatus": IDL.Func(
      [IDL.Text],
      [IDL.Vec(TeamRegistration2)],
      ["query"]
    ),
    "searchTeamsByName": IDL.Func(
      [IDL.Text],
      [IDL.Vec(TeamRegistration2)],
      ["query"]
    ),
    "searchTeamsByNameOrPhone": IDL.Func(
      [IDL.Text],
      [IDL.Vec(TeamRegistration2)],
      ["query"]
    ),
    "setApproval": IDL.Func([IDL.Principal, ApprovalStatus2], [], []),
    "setBanner": IDL.Func(
      [ExternalBlob2],
      [IDL.Variant({ "ok": IDL.Text, "err": IDL.Text })],
      []
    ),
    "setMaxTeamRegistrations": IDL.Func([IDL.Opt(IDL.Nat)], [], []),
    "storeReport": IDL.Func([IDL.Text, ExternalBlob2, IDL.Nat], [], []),
    "submitRegistration": IDL.Func(
      [IDL.Text, ExternalBlob2, CaptainInfo2, IDL.Vec(TeamMember2)],
      [IDL.Text],
      []
    ),
    "updateAnnouncement": IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, ExternalBlob2, IDL.Opt(IDL.Text)],
      [],
      []
    ),
    "updateGroupLink": IDL.Func([IDL.Nat, IDL.Text], [], []),
    "updateIdPassStatus": IDL.Func([IDL.Nat, IDL.Bool], [], []),
    "updateLogo": IDL.Func([IDL.Text, ExternalBlob2], [], []),
    "updateResult": IDL.Func(
      [IDL.Text, IDL.Text, ExternalBlob2, IDL.Text, IDL.Opt(IDL.Text)],
      [],
      []
    ),
    "updateSocialMediaLinks": IDL.Func([SocialMediaLinks2], [], []),
    "uploadTeamLogo": IDL.Func([IDL.Text, ExternalBlob2, IDL.Nat], [], [])
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class ExternalBlob {
  constructor(directURL, blob) {
    __publicField(this, "_blob");
    __publicField(this, "directURL");
    __publicField(this, "onProgress");
    if (blob) {
      this._blob = blob;
    }
    this.directURL = directURL;
  }
  static fromURL(url) {
    return new ExternalBlob(url, null);
  }
  static fromBytes(blob) {
    const url = URL.createObjectURL(new Blob([
      new Uint8Array(blob)
    ], {
      type: "application/octet-stream"
    }));
    return new ExternalBlob(url, blob);
  }
  async getBytes() {
    if (this._blob) {
      return this._blob;
    }
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }
  getDirectURL() {
    return this.directURL;
  }
  withUploadProgress(onProgress) {
    this.onProgress = onProgress;
    return this;
  }
}
var DuplicateReason = /* @__PURE__ */ ((DuplicateReason2) => {
  DuplicateReason2["captainPhone"] = "captainPhone";
  DuplicateReason2["teamName"] = "teamName";
  return DuplicateReason2;
})(DuplicateReason || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _immutableObjectStorageBlobsAreLive(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
      return result;
    }
  }
  async _immutableObjectStorageBlobsToDelete() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsToDelete();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsToDelete();
      return result;
    }
  }
  async _immutableObjectStorageConfirmBlobDeletion(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
      return result;
    }
  }
  async _immutableObjectStorageCreateCertificate(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
      return result;
    }
  }
  async _immutableObjectStorageRefillCashier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async _immutableObjectStorageUpdateGatewayPrincipals() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
      return result;
    }
  }
  async _initialize_access_control() {
    if (this.processError) {
      try {
        const result = await this.actor._initialize_access_control();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._initialize_access_control();
      return result;
    }
  }
  async _internet_identity_sign_in_finish() {
    if (this.processError) {
      try {
        const result = await this.actor._internet_identity_sign_in_finish();
        return from_candid_Result__1_n8(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._internet_identity_sign_in_finish();
      return from_candid_Result__1_n8(this._uploadFile, this._downloadFile, result);
    }
  }
  async _internet_identity_sign_in_start() {
    if (this.processError) {
      try {
        const result = await this.actor._internet_identity_sign_in_start();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._internet_identity_sign_in_start();
      return result;
    }
  }
  async addGroupLink(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addGroupLink(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addGroupLink(arg0, arg1);
      return result;
    }
  }
  async assignCallerUserRole(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n12(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n12(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async bulkUpdateIdPassStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.bulkUpdateIdPassStatus(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.bulkUpdateIdPassStatus(arg0);
      return result;
    }
  }
  async checkTeamLogoExists(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.checkTeamLogoExists(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.checkTeamLogoExists(arg0);
      return result;
    }
  }
  async closeRegistration(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.closeRegistration(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.closeRegistration(arg0);
      return result;
    }
  }
  async createAnnouncement(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.createAnnouncement(arg0, arg1, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg3));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createAnnouncement(arg0, arg1, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg3));
      return result;
    }
  }
  async createGroupLink(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.createGroupLink(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createGroupLink(arg0, arg1, arg2);
      return result;
    }
  }
  async createResult(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.createResult(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_opt_n15(this._uploadFile, this._downloadFile, arg3));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createResult(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_opt_n15(this._uploadFile, this._downloadFile, arg3));
      return result;
    }
  }
  async deleteAnnouncement(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteAnnouncement(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteAnnouncement(arg0);
      return result;
    }
  }
  async deleteBanner() {
    if (this.processError) {
      try {
        const result = await this.actor.deleteBanner();
        return from_candid_variant_n16(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteBanner();
      return from_candid_variant_n16(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteDuplicateEntry(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteDuplicateEntry(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteDuplicateEntry(arg0);
      return result;
    }
  }
  async deleteGroupLink(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteGroupLink(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteGroupLink(arg0);
      return result;
    }
  }
  async deleteRegistration(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteRegistration(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteRegistration(arg0);
      return result;
    }
  }
  async deleteReport(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteReport(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteReport(arg0);
      return result;
    }
  }
  async deleteResult(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteResult(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteResult(arg0);
      return result;
    }
  }
  async getAllAnnouncements() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllAnnouncements();
        return from_candid_vec_n17(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllAnnouncements();
      return from_candid_vec_n17(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllGroupLinks() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllGroupLinks();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllGroupLinks();
      return result;
    }
  }
  async getAllGroupLinksWithInfo() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllGroupLinksWithInfo();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllGroupLinksWithInfo();
      return result;
    }
  }
  async getAllRegistrations() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllRegistrations();
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllRegistrations();
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllReports() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllReports();
        return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllReports();
      return from_candid_vec_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllResults() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllResults();
        return from_candid_vec_n32(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllResults();
      return from_candid_vec_n32(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllTeamLogosPaginated(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getAllTeamLogosPaginated(arg0, arg1);
        return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllTeamLogosPaginated(arg0, arg1);
      return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllTeamsWithGroupInfo() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllTeamsWithGroupInfo();
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllTeamsWithGroupInfo();
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAllTeamsWithIdPassStatus() {
    if (this.processError) {
      try {
        const result = await this.actor.getAllTeamsWithIdPassStatus();
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAllTeamsWithIdPassStatus();
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAnnouncement(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getAnnouncement(arg0);
        return from_candid_Announcement_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAnnouncement(arg0);
      return from_candid_Announcement_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async getAnnouncementsCount() {
    if (this.processError) {
      try {
        const result = await this.actor.getAnnouncementsCount();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getAnnouncementsCount();
      return result;
    }
  }
  async getBanner() {
    if (this.processError) {
      try {
        const result = await this.actor.getBanner();
        return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getBanner();
      return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCallerUserProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserProfile();
        return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserProfile();
      return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCallerUserRole() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserRole();
        return from_candid_UserRole_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserRole();
      return from_candid_UserRole_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async getDuplicateRegistrations() {
    if (this.processError) {
      try {
        const result = await this.actor.getDuplicateRegistrations();
        return from_candid_vec_n43(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDuplicateRegistrations();
      return from_candid_vec_n43(this._uploadFile, this._downloadFile, result);
    }
  }
  async getGroupLink(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getGroupLink(arg0);
        return from_candid_opt_n20(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getGroupLink(arg0);
      return from_candid_opt_n20(this._uploadFile, this._downloadFile, result);
    }
  }
  async getGroupLinkById(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getGroupLinkById(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getGroupLinkById(arg0);
      return result;
    }
  }
  async getIdPassStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getIdPassStatus(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getIdPassStatus(arg0);
      return result;
    }
  }
  async getLogoByTeamName(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getLogoByTeamName(arg0);
        return from_candid_LogoUpload_n35(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getLogoByTeamName(arg0);
      return from_candid_LogoUpload_n35(this._uploadFile, this._downloadFile, result);
    }
  }
  async getMaxTeamRegistrations() {
    if (this.processError) {
      try {
        const result = await this.actor.getMaxTeamRegistrations();
        return from_candid_opt_n7(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getMaxTeamRegistrations();
      return from_candid_opt_n7(this._uploadFile, this._downloadFile, result);
    }
  }
  async getRegistrationStatus() {
    if (this.processError) {
      try {
        const result = await this.actor.getRegistrationStatus();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getRegistrationStatus();
      return result;
    }
  }
  async getRegistrationSummary() {
    if (this.processError) {
      try {
        const result = await this.actor.getRegistrationSummary();
        return from_candid_RegistrationSummary_n48(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getRegistrationSummary();
      return from_candid_RegistrationSummary_n48(this._uploadFile, this._downloadFile, result);
    }
  }
  async getReport(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReport(arg0);
        return from_candid_ReportMetadata_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReport(arg0);
      return from_candid_ReportMetadata_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async getResult(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getResult(arg0);
        return from_candid_Result_n33(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getResult(arg0);
      return from_candid_Result_n33(this._uploadFile, this._downloadFile, result);
    }
  }
  async getResultsCount() {
    if (this.processError) {
      try {
        const result = await this.actor.getResultsCount();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getResultsCount();
      return result;
    }
  }
  async getSocialMediaLinks() {
    if (this.processError) {
      try {
        const result = await this.actor.getSocialMediaLinks();
        return from_candid_SocialMediaLinks_n50(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSocialMediaLinks();
      return from_candid_SocialMediaLinks_n50(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTeamById(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getTeamById(arg0);
        return from_candid_TeamRegistration_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTeamById(arg0);
      return from_candid_TeamRegistration_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTeamDetailsViewer() {
    if (this.processError) {
      try {
        const result = await this.actor.getTeamDetailsViewer();
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTeamDetailsViewer();
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTeamRegistration(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getTeamRegistration(arg0);
        return from_candid_TeamRegistration_n23(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTeamRegistration(arg0);
      return from_candid_TeamRegistration_n23(this._uploadFile, this._downloadFile, result);
    }
  }
  async getTeamsByIdPassStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getTeamsByIdPassStatus(arg0);
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTeamsByIdPassStatus(arg0);
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getUserProfile(arg0);
        return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserProfile(arg0);
      return from_candid_opt_n40(this._uploadFile, this._downloadFile, result);
    }
  }
  async initializeAccessControl() {
    if (this.processError) {
      try {
        const result = await this.actor.initializeAccessControl();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.initializeAccessControl();
      return result;
    }
  }
  async isCallerAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerAdmin();
      return result;
    }
  }
  async isCallerApproved() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerApproved();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerApproved();
      return result;
    }
  }
  async listApprovals() {
    if (this.processError) {
      try {
        const result = await this.actor.listApprovals();
        return from_candid_vec_n52(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listApprovals();
      return from_candid_vec_n52(this._uploadFile, this._downloadFile, result);
    }
  }
  async requestApproval() {
    if (this.processError) {
      try {
        const result = await this.actor.requestApproval();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.requestApproval();
      return result;
    }
  }
  async saveCallerUserProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.saveCallerUserProfile(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveCallerUserProfile(arg0);
      return result;
    }
  }
  async searchGroupLinkByTeam(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.searchGroupLinkByTeam(arg0, arg1);
        return from_candid_opt_n57(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchGroupLinkByTeam(arg0, arg1);
      return from_candid_opt_n57(this._uploadFile, this._downloadFile, result);
    }
  }
  async searchGroupLinks(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchGroupLinks(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchGroupLinks(arg0);
      return result;
    }
  }
  async searchTeamsByIdPassStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchTeamsByIdPassStatus(arg0);
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchTeamsByIdPassStatus(arg0);
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async searchTeamsByName(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchTeamsByName(arg0);
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchTeamsByName(arg0);
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async searchTeamsByNameOrPhone(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.searchTeamsByNameOrPhone(arg0);
        return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.searchTeamsByNameOrPhone(arg0);
      return from_candid_vec_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async setApproval(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.setApproval(arg0, to_candid_ApprovalStatus_n58(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setApproval(arg0, to_candid_ApprovalStatus_n58(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async setBanner(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setBanner(await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg0));
        return from_candid_variant_n16(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setBanner(await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg0));
      return from_candid_variant_n16(this._uploadFile, this._downloadFile, result);
    }
  }
  async setMaxTeamRegistrations(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setMaxTeamRegistrations(to_candid_opt_n60(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setMaxTeamRegistrations(to_candid_opt_n60(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async storeReport(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.storeReport(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1), arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.storeReport(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1), arg2);
      return result;
    }
  }
  async submitRegistration(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.submitRegistration(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_vec_n61(this._uploadFile, this._downloadFile, arg3));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitRegistration(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1), arg2, to_candid_vec_n61(this._uploadFile, this._downloadFile, arg3));
      return result;
    }
  }
  async updateAnnouncement(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.updateAnnouncement(arg0, arg1, arg2, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg4));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateAnnouncement(arg0, arg1, arg2, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n15(this._uploadFile, this._downloadFile, arg4));
      return result;
    }
  }
  async updateGroupLink(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateGroupLink(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateGroupLink(arg0, arg1);
      return result;
    }
  }
  async updateIdPassStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateIdPassStatus(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateIdPassStatus(arg0, arg1);
      return result;
    }
  }
  async updateLogo(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateLogo(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateLogo(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async updateResult(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.updateResult(arg0, arg1, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg2), arg3, to_candid_opt_n15(this._uploadFile, this._downloadFile, arg4));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateResult(arg0, arg1, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg2), arg3, to_candid_opt_n15(this._uploadFile, this._downloadFile, arg4));
      return result;
    }
  }
  async updateSocialMediaLinks(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.updateSocialMediaLinks(to_candid_SocialMediaLinks_n64(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateSocialMediaLinks(to_candid_SocialMediaLinks_n64(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async uploadTeamLogo(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.uploadTeamLogo(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1), arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.uploadTeamLogo(arg0, await to_candid_ExternalBlob_n14(this._uploadFile, this._downloadFile, arg1), arg2);
      return result;
    }
  }
}
async function from_candid_Announcement_n18(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n19(_uploadFile, _downloadFile, value);
}
function from_candid_ApprovalStatus_n55(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n56(_uploadFile, _downloadFile, value);
}
async function from_candid_Banner_n38(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n39(_uploadFile, _downloadFile, value);
}
function from_candid_DuplicateEntry_n44(_uploadFile, _downloadFile, value) {
  return from_candid_record_n45(_uploadFile, _downloadFile, value);
}
function from_candid_DuplicateReason_n46(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n47(_uploadFile, _downloadFile, value);
}
function from_candid_Error_n10(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n11(_uploadFile, _downloadFile, value);
}
async function from_candid_ExternalBlob_n21(_uploadFile, _downloadFile, value) {
  return await _downloadFile(value);
}
async function from_candid_LogoUpload_n35(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n36(_uploadFile, _downloadFile, value);
}
function from_candid_RegistrationSummary_n48(_uploadFile, _downloadFile, value) {
  return from_candid_record_n49(_uploadFile, _downloadFile, value);
}
async function from_candid_ReportMetadata_n30(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n31(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_n8(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n9(_uploadFile, _downloadFile, value);
}
async function from_candid_Result_n33(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n19(_uploadFile, _downloadFile, value);
}
function from_candid_SocialMediaLinks_n50(_uploadFile, _downloadFile, value) {
  return from_candid_record_n51(_uploadFile, _downloadFile, value);
}
function from_candid_TeamMember_n27(_uploadFile, _downloadFile, value) {
  return from_candid_record_n28(_uploadFile, _downloadFile, value);
}
async function from_candid_TeamRegistration_n23(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n24(_uploadFile, _downloadFile, value);
}
function from_candid_UserApprovalInfo_n53(_uploadFile, _downloadFile, value) {
  return from_candid_record_n54(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n41(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n42(_uploadFile, _downloadFile, value);
}
function from_candid__ImmutableObjectStorageRefillResult_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n20(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n25(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
async function from_candid_opt_n37(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : await from_candid_Banner_n38(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n57(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
async function from_candid_record_n19(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    title: value.title,
    link: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.link)),
    createdAt: value.createdAt,
    description: value.description,
    image: await from_candid_ExternalBlob_n21(_uploadFile, _downloadFile, value.image)
  };
}
async function from_candid_record_n24(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    creator: record_opt_to_undefined(from_candid_opt_n25(_uploadFile, _downloadFile, value.creator)),
    teamName: value.teamName,
    members: from_candid_vec_n26(_uploadFile, _downloadFile, value.members),
    groupNumber: value.groupNumber,
    logo: await from_candid_ExternalBlob_n21(_uploadFile, _downloadFile, value.logo),
    idPassAssigned: value.idPassAssigned,
    captain: value.captain,
    teamId: value.teamId,
    groupLink: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.groupLink))
  };
}
function from_candid_record_n28(_uploadFile, _downloadFile, value) {
  return {
    playerId: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.playerId)),
    name: value.name
  };
}
async function from_candid_record_n31(_uploadFile, _downloadFile, value) {
  return {
    created: value.created,
    blob: await from_candid_ExternalBlob_n21(_uploadFile, _downloadFile, value.blob),
    size: value.size,
    filename: value.filename
  };
}
async function from_candid_record_n36(_uploadFile, _downloadFile, value) {
  return {
    teamName: value.teamName,
    logo: await from_candid_ExternalBlob_n21(_uploadFile, _downloadFile, value.logo),
    fileSize: value.fileSize,
    uploadTime: value.uploadTime
  };
}
async function from_candid_record_n39(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    createdAt: value.createdAt,
    image: await from_candid_ExternalBlob_n21(_uploadFile, _downloadFile, value.image)
  };
}
function from_candid_record_n45(_uploadFile, _downloadFile, value) {
  return {
    originalId: value.originalId,
    duplicatedAt: value.duplicatedAt,
    duplicateId: value.duplicateId,
    reason: from_candid_DuplicateReason_n46(_uploadFile, _downloadFile, value.reason)
  };
}
function from_candid_record_n49(_uploadFile, _downloadFile, value) {
  return {
    totalTeams: value.totalTeams,
    confirmedTeams: value.confirmedTeams,
    maxTeams: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.maxTeams))
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    success: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.success)),
    topped_up_amount: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.topped_up_amount))
  };
}
function from_candid_record_n51(_uploadFile, _downloadFile, value) {
  return {
    instagram: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.instagram)),
    whatsapp: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.whatsapp)),
    discord: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.discord)),
    youtube: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.youtube))
  };
}
function from_candid_record_n54(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_ApprovalStatus_n55(_uploadFile, _downloadFile, value.status),
    principal: value.principal
  };
}
function from_candid_variant_n11(_uploadFile, _downloadFile, value) {
  return "FrontendOriginsNotConfigured" in value ? {
    __kind__: "FrontendOriginsNotConfigured",
    FrontendOriginsNotConfigured: value.FrontendOriginsNotConfigured
  } : "MixedSsoSources" in value ? {
    __kind__: "MixedSsoSources",
    MixedSsoSources: value.MixedSsoSources
  } : "Stale" in value ? {
    __kind__: "Stale",
    Stale: value.Stale
  } : "MalformedCandid" in value ? {
    __kind__: "MalformedCandid",
    MalformedCandid: value.MalformedCandid
  } : "AmbiguousAttribute" in value ? {
    __kind__: "AmbiguousAttribute",
    AmbiguousAttribute: value.AmbiguousAttribute
  } : "NoAttributes" in value ? {
    __kind__: "NoAttributes",
    NoAttributes: value.NoAttributes
  } : "UnknownNonce" in value ? {
    __kind__: "UnknownNonce",
    UnknownNonce: value.UnknownNonce
  } : "UntrustedSsoSource" in value ? {
    __kind__: "UntrustedSsoSource",
    UntrustedSsoSource: value.UntrustedSsoSource
  } : "MissingField" in value ? {
    __kind__: "MissingField",
    MissingField: value.MissingField
  } : "FrontendOriginMismatch" in value ? {
    __kind__: "FrontendOriginMismatch",
    FrontendOriginMismatch: value.FrontendOriginMismatch
  } : value;
}
function from_candid_variant_n16(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function from_candid_variant_n42(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_variant_n47(_uploadFile, _downloadFile, value) {
  return "captainPhone" in value ? "captainPhone" : "teamName" in value ? "teamName" : value;
}
function from_candid_variant_n56(_uploadFile, _downloadFile, value) {
  return "pending" in value ? "pending" : "approved" in value ? "approved" : "rejected" in value ? "rejected" : value;
}
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_Error_n10(_uploadFile, _downloadFile, value.err)
  } : value;
}
async function from_candid_vec_n17(_uploadFile, _downloadFile, value) {
  return await Promise.all(value.map(async (x) => await from_candid_Announcement_n18(_uploadFile, _downloadFile, x)));
}
async function from_candid_vec_n22(_uploadFile, _downloadFile, value) {
  return await Promise.all(value.map(async (x) => await from_candid_TeamRegistration_n23(_uploadFile, _downloadFile, x)));
}
function from_candid_vec_n26(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_TeamMember_n27(_uploadFile, _downloadFile, x));
}
async function from_candid_vec_n29(_uploadFile, _downloadFile, value) {
  return await Promise.all(value.map(async (x) => await from_candid_ReportMetadata_n30(_uploadFile, _downloadFile, x)));
}
async function from_candid_vec_n32(_uploadFile, _downloadFile, value) {
  return await Promise.all(value.map(async (x) => await from_candid_Result_n33(_uploadFile, _downloadFile, x)));
}
async function from_candid_vec_n34(_uploadFile, _downloadFile, value) {
  return await Promise.all(value.map(async (x) => await from_candid_LogoUpload_n35(_uploadFile, _downloadFile, x)));
}
function from_candid_vec_n43(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_DuplicateEntry_n44(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n52(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_UserApprovalInfo_n53(_uploadFile, _downloadFile, x));
}
function to_candid_ApprovalStatus_n58(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n59(_uploadFile, _downloadFile, value);
}
async function to_candid_ExternalBlob_n14(_uploadFile, _downloadFile, value) {
  return await _uploadFile(value);
}
function to_candid_SocialMediaLinks_n64(_uploadFile, _downloadFile, value) {
  return to_candid_record_n65(_uploadFile, _downloadFile, value);
}
function to_candid_TeamMember_n62(_uploadFile, _downloadFile, value) {
  return to_candid_record_n63(_uploadFile, _downloadFile, value);
}
function to_candid_UserRole_n12(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n13(_uploadFile, _downloadFile, value);
}
function to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value) {
  return to_candid_record_n3(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n15(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n60(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n3(_uploadFile, _downloadFile, value) {
  return {
    proposed_top_up_amount: value.proposed_top_up_amount ? candid_some(value.proposed_top_up_amount) : candid_none()
  };
}
function to_candid_record_n63(_uploadFile, _downloadFile, value) {
  return {
    playerId: value.playerId ? candid_some(value.playerId) : candid_none(),
    name: value.name
  };
}
function to_candid_record_n65(_uploadFile, _downloadFile, value) {
  return {
    instagram: value.instagram ? candid_some(value.instagram) : candid_none(),
    whatsapp: value.whatsapp ? candid_some(value.whatsapp) : candid_none(),
    discord: value.discord ? candid_some(value.discord) : candid_none(),
    youtube: value.youtube ? candid_some(value.youtube) : candid_none()
  };
}
function to_candid_variant_n13(_uploadFile, _downloadFile, value) {
  return value == "admin" ? {
    admin: null
  } : value == "user" ? {
    user: null
  } : value == "guest" ? {
    guest: null
  } : value;
}
function to_candid_variant_n59(_uploadFile, _downloadFile, value) {
  return value == "pending" ? {
    pending: null
  } : value == "approved" ? {
    approved: null
  } : value == "rejected" ? {
    rejected: null
  } : value;
}
function to_candid_vec_n61(_uploadFile, _downloadFile, value) {
  return value.map((x) => to_candid_TeamMember_n62(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
const CACHE_TIMES = {
  SHORT: 1e4,
  // 10 seconds
  MEDIUM: 3e4,
  // 30 seconds
  LONG: 12e4,
  // 2 minutes
  VERY_LONG: 3e5
  // 5 minutes
};
function safeQueryFn(fn, fallback) {
  return async () => {
    try {
      return await fn();
    } catch (_error) {
      return fallback;
    }
  };
}
function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: safeQueryFn(async () => {
      if (!actor || !identity) return null;
      return actor.getCallerUserProfile();
    }, null),
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}
function useSaveCallerUserProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    }
  });
}
function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const query = useQuery({
    queryKey: ["isAdmin"],
    queryFn: safeQueryFn(async () => {
      if (!actor || !identity) return false;
      return actor.isCallerAdmin();
    }, false),
    enabled: !!actor && !!identity && !actorFetching,
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
  return {
    ...query,
    isFetched: !!actor && query.isFetched
  };
}
function useGetRegistrationStatus() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["registrationStatus"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return true;
      return actor.getRegistrationStatus();
    }, true),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchInterval: 6e4,
    // Refetch every 60 seconds
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useCloseRegistration() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status) => {
      if (!actor) throw new Error("Actor not available");
      return actor.closeRegistration(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrationStatus"] });
    }
  });
}
function useSetMaxTeamRegistrations() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (limit) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setMaxTeamRegistrations(limit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maxTeamRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationSummary"] });
    }
  });
}
function useGetRegistrationSummary() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["registrationSummary"],
    queryFn: safeQueryFn(
      async () => {
        if (!actor) {
          return {
            totalTeams: BigInt(0),
            confirmedTeams: BigInt(0),
            maxTeams: void 0
          };
        }
        return actor.getRegistrationSummary();
      },
      { totalTeams: BigInt(0), confirmedTeams: BigInt(0), maxTeams: void 0 }
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    refetchInterval: 3e4,
    // Refetch every 30 seconds
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useSubmitRegistration() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      teamName,
      logo,
      captain,
      members
    }) => {
      var _a2, _b2;
      if (!actor) throw new Error("Actor not available");
      if (!(teamName == null ? void 0 : teamName.trim())) throw new Error("Team name is required");
      if (!((_a2 = captain == null ? void 0 : captain.name) == null ? void 0 : _a2.trim())) throw new Error("Captain name is required");
      if (!((_b2 = captain == null ? void 0 : captain.phone) == null ? void 0 : _b2.trim())) throw new Error("Captain phone is required");
      if (!members || members.length === 0)
        throw new Error("At least one team member is required");
      return actor.submitRegistration(teamName, logo, captain, members);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["publicRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["teamDetailsViewer"] });
      queryClient.invalidateQueries({ queryKey: ["registrationSummary"] });
      queryClient.invalidateQueries({ queryKey: ["duplicateRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithGroupInfo"] });
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithIdPassStatus"] });
    },
    retry: 1,
    retryDelay: 1e3
  });
}
function useGetAllRegistrations() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["registrations"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getAllRegistrations();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useSearchTeamsByName() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (searchTerm) => {
      if (!actor) throw new Error("Actor not available");
      return actor.searchTeamsByName(searchTerm);
    }
  });
}
function useGetPublicRegistrations() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["publicRegistrations"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      const teams = await actor.getAllTeamsWithGroupInfo();
      return teams.map((team) => ({
        teamName: team.teamName,
        logo: team.logo
      }));
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useGetTeamDetailsViewer() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["teamDetailsViewer"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getTeamDetailsViewer();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useDeleteRegistration() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteRegistration(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["publicRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["teamDetailsViewer"] });
      queryClient.invalidateQueries({ queryKey: ["registrationSummary"] });
      queryClient.invalidateQueries({ queryKey: ["duplicateRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithGroupInfo"] });
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithIdPassStatus"] });
    }
  });
}
function useSearchTeamsByNameOrPhone() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (searchTerm) => {
      if (!actor) throw new Error("Actor not available");
      return actor.searchTeamsByNameOrPhone(searchTerm);
    }
  });
}
function useAddGroupLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupNumber,
      link
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addGroupLink(groupNumber, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGroupLinks"] });
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithGroupInfo"] });
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithIdPassStatus"] });
    }
  });
}
function useGetAllGroupLinks() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["allGroupLinks"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getAllGroupLinks();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useGetAllTeamsWithIdPassStatus() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["allTeamsWithIdPassStatus"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getAllTeamsWithIdPassStatus();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useUpdateIdPassStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      teamId,
      status
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateIdPassStatus(teamId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithIdPassStatus"] });
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithGroupInfo"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["teamDetailsViewer"] });
    }
  });
}
function useBulkUpdateIdPassStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status) => {
      if (!actor) throw new Error("Actor not available");
      return actor.bulkUpdateIdPassStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithIdPassStatus"] });
      queryClient.invalidateQueries({ queryKey: ["allTeamsWithGroupInfo"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["teamDetailsViewer"] });
    }
  });
}
function useGetDuplicateRegistrations() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["duplicateRegistrations"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getDuplicateRegistrations();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useDeleteDuplicateEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteDuplicateEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["duplicateRegistrations"] });
    }
  });
}
function useGetAllAnnouncements() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["announcements"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getAllAnnouncements();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useGetAnnouncementsCount() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["announcementsCount"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return BigInt(0);
      return actor.getAnnouncementsCount();
    }, BigInt(0)),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useCreateAnnouncement() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      image,
      link
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createAnnouncement(title, description, image, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcementsCount"] });
    }
  });
}
function useUpdateAnnouncement() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      image,
      link
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAnnouncement(id, title, description, image, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    }
  });
}
function useDeleteAnnouncement() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcementsCount"] });
    }
  });
}
function useGetAllResults() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["results"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getAllResults();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useGetResultsCount() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["resultsCount"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return BigInt(0);
      return actor.getResultsCount();
    }, BigInt(0)),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useCreateResult() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      image,
      description,
      link
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createResult(title, image, description, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      queryClient.invalidateQueries({ queryKey: ["resultsCount"] });
    }
  });
}
function useUpdateResult() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      image,
      description,
      link
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateResult(id, title, image, description, link);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
    }
  });
}
function useDeleteResult() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteResult(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      queryClient.invalidateQueries({ queryKey: ["resultsCount"] });
    }
  });
}
function useGetSocialMediaLinks() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["socialMediaLinks"],
    queryFn: safeQueryFn(
      async () => {
        if (!actor)
          return {
            instagram: void 0,
            discord: void 0,
            youtube: void 0,
            whatsapp: void 0
          };
        return actor.getSocialMediaLinks();
      },
      {
        instagram: void 0,
        discord: void 0,
        youtube: void 0,
        whatsapp: void 0
      }
    ),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useUpdateSocialMediaLinks() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (links) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSocialMediaLinks(links);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialMediaLinks"] });
    }
  });
}
function useGetAllReports() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reports"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getAllReports();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: CACHE_TIMES.LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useStoreReport() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      filename,
      blob,
      size
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.storeReport(filename, blob, size);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
}
function useDeleteReport() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (filename) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteReport(filename);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  });
}
function useDownloadReport() {
  return useMutation({
    mutationFn: async (report) => {
      const bytes = await report.blob.getBytes();
      const blob = new Blob([bytes], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = report.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  });
}
function useSearchGroupLinkByTeam() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      teamName,
      phoneNumber
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.searchGroupLinkByTeam(teamName, phoneNumber);
      if (!result) {
        throw new Error("Team not found or not registered");
      }
      return result;
    }
  });
}
function useGetAllGroupLinksWithInfo() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["allGroupLinksWithInfo"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getAllGroupLinksWithInfo();
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useCreateGroupLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      groupId,
      groupNumber,
      groupLink
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createGroupLink(groupId, groupNumber, groupLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGroupLinksWithInfo"] });
    }
  });
}
function useDeleteGroupLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteGroupLink(groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGroupLinksWithInfo"] });
    }
  });
}
function useUploadTeamLogo() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      teamName,
      logo,
      fileSize
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.uploadTeamLogo(teamName, logo, fileSize);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamLogos"] });
      queryClient.invalidateQueries({ queryKey: ["registrationSummary"] });
    }
  });
}
function useCheckTeamLogoExists() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (teamName) => {
      if (!actor) throw new Error("Actor not available");
      return actor.checkTeamLogoExists(teamName);
    }
  });
}
function useGetAllTeamLogos() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["teamLogos"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return [];
      return actor.getAllTeamLogosPaginated(BigInt(1), BigInt(100));
    }, []),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.LONG,
    gcTime: CACHE_TIMES.VERY_LONG,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useDeleteTeamLogo() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_teamName) => {
      if (!actor) throw new Error("Actor not available");
      throw new Error("Delete functionality not yet implemented in backend");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamLogos"] });
      queryClient.invalidateQueries({ queryKey: ["registrationSummary"] });
    }
  });
}
function useBanner() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["banner"],
    queryFn: safeQueryFn(async () => {
      if (!actor) return null;
      return actor.getBanner();
    }, null),
    enabled: !!actor && !actorFetching,
    staleTime: CACHE_TIMES.SHORT,
    gcTime: CACHE_TIMES.MEDIUM,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
}
function useSetBanner() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setBanner(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    }
  });
}
function useDeleteBanner() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteBanner();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banner"] });
    }
  });
}
export {
  useDownloadReport as A,
  useGetAllResults as B,
  useCreateResult as C,
  DuplicateReason as D,
  ExternalBlob as E,
  useUpdateResult as F,
  useDeleteResult as G,
  useUpdateSocialMediaLinks as H,
  useGetTeamDetailsViewer as I,
  useGetAllTeamLogos as J,
  useDeleteTeamLogo as K,
  useGetAnnouncementsCount as L,
  useGetResultsCount as M,
  useDeleteRegistration as N,
  useCloseRegistration as O,
  useSetMaxTeamRegistrations as P,
  useStoreReport as Q,
  useSearchTeamsByName as R,
  useSaveCallerUserProfile as S,
  useGetPublicRegistrations as T,
  useSearchTeamsByNameOrPhone as U,
  useSearchGroupLinkByTeam as V,
  useUploadTeamLogo as W,
  useCheckTeamLogoExists as X,
  useGetAllAnnouncements as a,
  useBanner as b,
  useSubmitRegistration as c,
  useGetRegistrationStatus as d,
  useGetRegistrationSummary as e,
  useGetCallerUserProfile as f,
  useGetSocialMediaLinks as g,
  useCreateAnnouncement as h,
  useUpdateAnnouncement as i,
  useDeleteAnnouncement as j,
  useSetBanner as k,
  useDeleteBanner as l,
  useGetDuplicateRegistrations as m,
  useGetAllRegistrations as n,
  useDeleteDuplicateEntry as o,
  useGetAllGroupLinksWithInfo as p,
  useCreateGroupLink as q,
  useDeleteGroupLink as r,
  useGetAllTeamsWithIdPassStatus as s,
  useGetAllGroupLinks as t,
  useIsCallerAdmin as u,
  useAddGroupLink as v,
  useUpdateIdPassStatus as w,
  useBulkUpdateIdPassStatus as x,
  useGetAllReports as y,
  useDeleteReport as z
};
