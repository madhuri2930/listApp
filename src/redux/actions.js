import { LIST_CREATION_API_URL } from '../constants/apiUrls';

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';
export const MOVE_ITEM = 'MOVE_ITEM';
export const CREATE_LIST = 'CREATE_LIST';
export const UPDATE_LISTS = 'UPDATE_LISTS';

export const fetchDataRequest = () => ({ type: FETCH_DATA_REQUEST });
export const fetchDataSuccess = (data) => ({ type: FETCH_DATA_SUCCESS, payload: data });
export const fetchDataFailure = (error) => ({ type: FETCH_DATA_FAILURE, payload: error });

export const moveItem = (itemId, fromListId, toListId) => ({
  type: MOVE_ITEM,
  payload: { itemId, fromListId, toListId },
});

export const createList = (newList) => ({
  type: CREATE_LIST,
  payload: newList,
});

export const fetchInitialData = () => async (dispatch) => {
  dispatch(fetchDataRequest());
  try {
    const response = await fetch(LIST_CREATION_API_URL);
    const data = await response.json();
    dispatch(fetchDataSuccess(data));
  } catch (error) {
    dispatch(fetchDataFailure('Failed to load data.'));
  }
};
