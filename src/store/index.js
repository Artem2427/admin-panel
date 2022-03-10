import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import ReduxThunk from 'redux-thunk';

import filters from '../reducers/filter';
import heroes from '../reducers/herous';

const stringMiddleware = () => (next) => (action) => {
  if (typeof action === 'string') {
    return next({
      type: action
    })
  }
  return next(action);
}

// const enhancer = (createStore) => (...args) => {
//   const store = createStore(...args);

//   const oldDispatch = store.dispatch;

//   store.dispatch = (action) => {
//     if (typeof action === 'string') {
//       return oldDispatch({
//         type: action
//       })
//     }
//     return oldDispatch;
//   }

//   return store;
// }



// const store = createStore(combineReducers({ heroes, filters }), applyMiddleware(ReduxThunk, stringMiddleware));

const store = configureStore({
  reducer: { heroes, filters },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== 'production',

})

export default store;

// compose(enhancer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// 
