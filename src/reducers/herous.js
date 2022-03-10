import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { useHttp } from '../hooks/http.hook';

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
  heroesLoadingStatus: 'idle',
})
console.log(initialState);

// const initialState = {
//   heroes: [],
// }

export const fetchHeroes = createAsyncThunk(
  'heroes/fetchHeroes',
  () => {
    const { request } = useHttp();
    return request("http://localhost:3001/heroes")
    // должна вернуть промис
  }
)

const heroesSlice = createSlice({
  name: 'heroes',
  initialState,
  reducers: {
    heroCreated: (state, action) => {
      heroesAdapter.addOne(state, action.payload)
    },
    deleteUserFromStore: (state, action) => {
      // state.heroes = state.heroes.filter(item => item.id !== action.payload)
      heroesAdapter.removeOne(state, action.payload)
    }
  },

  extraReducers: {
    [fetchHeroes.pending]: (state) => { state.heroesLoadingStatus = 'loading' },
    [fetchHeroes.fulfilled]: (state, action) => {
      state.heroesLoadingStatus = 'idle';
      heroesAdapter.setAll(state, action.payload)
    },
    [fetchHeroes.rejected]: state => { state.heroesLoadingStatus = 'error' }

  }
});


export default heroesSlice.reducer;

export const { selectAll } = heroesAdapter.getSelectors(state => state.heroes)

export const filteredHeroesSelector = createSelector(
  [state => state.filters.activeFilter, selectAll],
  (filter, heroes) => {
    if (filter === "all") {
      return heroes;
    } else {
      return heroes.filter(item => item.element === filter)
    }
  }
)


export const {
  heroCreated,
  deleteUserFromStore
} = heroesSlice.actions
