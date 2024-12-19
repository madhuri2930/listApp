import {
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  MOVE_ITEM,
  CREATE_LIST,
  UPDATE_LISTS
} from './actions';

const initialState = {
  lists: [],
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_DATA_SUCCESS: {
      const half = Math.ceil(action.payload.lists.length / 2);
      const firstHalf = action.payload.lists.slice(0, half);
      const secondHalf = action.payload.lists.slice(half);

      return {
        ...state,
        loading: false,
        lists: [
          { id: 1, name: 'List 1', items: firstHalf },
          { id: 2, name: 'List 2', items: secondHalf },
        ],
      };
    }

    case FETCH_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_LIST: {
      const { name, items } = action.payload;
      const newList = {
        id: Date.now(),
        name: name || `List ${state.lists.length + 1}`,
        items: items || [],
      };

      return {
        ...state,
        lists: [...state.lists, newList],
      };
    }

    case MOVE_ITEM: {
      const { itemId, fromListId, toListId, temporaryList } = action.payload;
    
      let movedItem = state.lists
        .find((list) => list.id === fromListId)
        ?.items.find((item) => item.id === itemId);
    
      if (!movedItem) {
        const itemToMove = temporaryList.items.find((item)=> item.id === itemId)
        console.log(itemToMove)
        movedItem = itemToMove
      }
      console.log("Lists", state.lists)
    
      const updatedLists = state.lists.map((list) => {
        if (list.id === fromListId) {
          return { ...list, items: list.items.filter((item) => item.id !== itemId) };
        }
        if (list.id === toListId) {
          return { ...list, items: [...list.items, movedItem] };
        }
        return list;
      });
      console.log("updatedLists", updatedLists)
    
      return { ...state, lists: updatedLists };
    }    
    case UPDATE_LISTS: {
      return { ...state, lists: action.payload };
    }
    

    default:
      return state;
  }
};

export default reducer;
