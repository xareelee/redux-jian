/**
 * Copyright (c) 2016-present, Kang-Yu Lee (a.k.a. Xaree Lee)
 * All rights reserved.
 *
 * This source code is licensed under the MIT license.
 */

const { bindActionCreators } = require('redux');
const Immutable = require('immutable');


// Should use env variable to detemine this value (true for Development mode)
const shouldAsset = true;


// -----------------------------------------------------------------------------
// Action
// -----------------------------------------------------------------------------
/**
 * An easy way to create Redux action. All values are wrapped in the key `payload`.
 */
const _action = (type, payload) => {
  const isError = payload instanceof Error;
  return { type, payload, isError };  
}

const createAction = (!shouldAsset) ? _action : (type, payload) => {
  if (!(type instanceof String || typeof type === 'string')) {
    throw new Error(`'type' should be a String type. Which is '${type}'`);
  }
  return _action(type, payload);  
}

// -----------------------------------------------------------------------------
// Mutators
// -----------------------------------------------------------------------------
/**
 * A mutator is just an 'action creator' in Redux. A mutator usually is also a
 * thunk which allow you decide when and what action you want to dispatch (you
 * need to use the middleware 'redux-thunk'' to achieve this). Futhermore, you
 * may want to introduce some side-effects before dispatching the action to
 * reducers (pure functions), and the mutators are the places where you can
 * handle them.
 * 
 * The functions `registerMutator` and `getMutator` allow you to decouple calling  
 * and implementation by passing a name string `mutatorName`.
 */

const _Mutators = {};

const _registerMutator = (mutatorName, block) => {
  return _Mutators[mutatorName] = block;
};

const _getMutator = (mutatorName) => (...params) => {
  return _Mutators[mutatorName](...params);
};

const _cloneMutators = (mutators) => Object.assign({}, mutators);

const registerMutator = (!shouldAsset) ? _registerMutator : (mutatorName, block) => {
  if (!(mutatorName instanceof String || typeof mutatorName === 'string')) {
    throw new Error(`'mutatorName' should be a String type. Which is '${mutatorName}'`);
  }
  if (!(block instanceof Function || typeof block === 'function')) {
    throw new Error(`block should be a function.`);
  }
  if (_Mutators[mutatorName]) {
    throw new Error(`Mutator name '${mutatorName}' has been used. It should be unique.`);
  }
  return _registerMutator(mutatorName, block);
}

const getMutator = (!shouldAsset) ? _getMutator : (mutatorName) => {
  if (!_Mutators[mutatorName]) {
    throw new Error(`Mutator name '${mutatorName}' doesn't exist. It should be registed by 'registerMutator()' before using.`);
  }
  return _getMutator(mutatorName);
}

const currentMutators = () => _cloneMutators(_Mutators);


// -----------------------------------------------------------------------------
// Bound Mutators
// -----------------------------------------------------------------------------

// The mutators which are bound to store's dispatch by `bindActionCreators`.
let _boundMutators;

const bindMutatorsToStore = (store) => {
  const dispatch = store.dispatch;
  if (!(dispatch instanceof Function || typeof dispatch === 'function')) {
    throw new Error(`'store' should hava a function 'dispatch'.`);
  }
  if (_boundMutators) {
    throw new Error(`Mutators have been bound. You can only bind mutators once.`);
  }
  _boundMutators = Immutable.fromJS(bindActionCreators(_Mutators, dispatch));
  return _boundMutators;
}

const getBoundMutators = (mutatorName) => _boundMutators.get(mutatorName);



// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

module.exports = {
  createAction,
  registerMutator,
  getMutator,
  currentMutators,
  bindMutatorsToStore,
  getBoundMutators
};


