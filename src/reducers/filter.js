import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { useHttp } from '../hooks/http.hook';

const filterAdapter = createEntityAdapter();

// const initialState = {
//   filters: [],
//   filtersLoadingStatus: 'idle',
//   activeFilter: 'all',
// }

const initialState = filterAdapter.getInitialState({
  filtersLoadingStatus: 'idle',
  activeFilter: 'all'
})

export const fetchFilters = createAsyncThunk(
  'filter/fetchFilters',
  () => {
    const { request } = useHttp();
    return request("http://localhost:3001/filters")
  }
)

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    activeFilterChanged: (state, action) => {
      state.activeFilter = action.payload
    }
  },

  extraReducers: {
    [fetchFilters.pending]: (state) => {
      state.filtersLoadingStatus = 'loading'
    },
    [fetchFilters.fulfilled]: (state, action) => {
      filterAdapter.setAll(state, action.payload)
      state.filters = action.payload;
      state.filtersLoadingStatus = 'idle'
    },
    [fetchFilters.rejected]: (state) => {
      state.filtersLoadingStatus = 'error'
    }
  }
})

export default filterSlice.reducer;

export const { selectAll } = filterAdapter.getSelectors(state => state.filters)

export const { activeFilterChanged } = filterSlice.actions;
