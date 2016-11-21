# Redux-Jian (Redux-簡)

[![GitHub version](https://img.shields.io/github/tag/xareelee/redux-jian.svg)](https://github.com/xareelee/redux-jian)
[![npm version](https://img.shields.io/npm/v/redux-jian.svg?maxAge=86400)](https://www.npmjs.com/package/redux-jian)


Redux-Jian is a library aiming to simplify how to use Redux. **Jian (chinese: 簡)** means **'simple'** or **'simplify'**.


* Declare mutators (action creators) in one singleton, and you can get a mutator by its name anywhere. It's highly decoupling and easy to use.
* Bind mutators to Redux store once, and you'll no longer need to use `mapDispatchToProps` in the `connect()`.

## How to use

### Make an action

`createAction()` is a Redux action synthesizer. It simply wrap data in the key `payload`. If the data is an `Error` type, the value of `isError` will be `true`.

```js
const updateUsernameAction = createAction(UPDATE_USERNAME, { username: name })
// same as
const updateUsernameAction = {
  type: UPDATE_USERNAME,
  payload: {
    username: name
  },
  isError: false
}
```

### Mutators (action creators)

Mutators are just [action creators](http://redux.js.org/docs/basics/Actions.html#action-creators) in [Redux](https://github.com/reactjs/redux). A mutator usually is also a [thunk](https://en.wikipedia.org/wiki/Thunk) which allow you decide when and what action you want to dispatch (you need to use the middleware ['redux-thunk'](https://github.com/gaearon/redux-thunk) to achieve this). Futhermore, you may want to introduce some side-effects before dispatching the action to reducers (pure functions), and the mutators are the places where you can handle them. 

Register a mutator:

```js
// user.redux.js
import { registerMutator, createAction } from 'redux-jian';

const UPDATE_USERNAME = 'UPDATE_USERNAME';

// simple mutator
registerMutator(UPDATE_USERNAME, (name) => {
  if (name.length > 0) {
    return createAction(UPDATE_USERNAME, { username: name });
  }
  return createAction(INPUT_INVALID_USERNAME);
})

// thunk mutator
```

Get a mutator by a name:

```js
// Signup.js (a React component)
import { getMutator } from 'redux-jian';

const updateUsernameMutator = getMutator('UPDATE_USERNAME');
const updateUsernameAction = updateUsernameMutator('John');
// or use currying
const updateUsernameAction = getMutator('UPDATE_USERNAME')('John');

// dispatch the action to Redux store
store.dispatch(updateUsernameAction);
```

* You can get the mutator by its name (a string key) without importing the file where you implement it. 
* Redux-Jian allow to register each name only once. If registering a duplicated mutator name, it will throw an error.


### Bound mutators

Redux-Jian provides a way to bind mutators to a store:

```js
// App.js
import { bindMutatorsToStore } from 'redux-jian';

const store = createStore(...);
bindMutatorsToStore(store);
```

Now you can use bound mutators directly:

```js
// Signup.js (a React component)
import { getBoundMutators } from 'redux-jian'

getBoundMutators('UPDATE_USERNAME')('John');
```

Why using bound mutators? In the standard Redux way, you need to use `mapDispatcherToProps()` and `connect()` to bind mutators to a dispatcher. This is redundant because there is only a store, and only a dispatcher, for the app states. All actions will only be sent to this store. This means that we could bind all mutators to the store only once and use them anywhere.

You can choose to use `getMutator()` and dispatch it manually or just use `getBoundMutators()` to dispatch actions (or invoke the thunk) directly. 



## Installation

```
npm install --save redux-jian
```  

