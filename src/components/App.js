import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialData, MOVE_ITEM } from "../redux/actions";
import ListContainer from "./ListContainer";
import LoadingView from "./LoadingView";
import FailureView from "./FailureView";
import "../styles/App.css";

const ListViewPage = ({
  lists,
  selectedLists,
  handleToggleSelection,
  handleCreateList,
  errorMessage,
}) => (
  <div>
    <button onClick={handleCreateList} className="create-list-button">
      Create a new list
    </button>
    {errorMessage && <p className="error-message">{errorMessage}</p>}
    <div className="lists-container">
      {lists.map((list) => (
        <div key={list.id} className="list-checkbox">
          <input
            type="checkbox"
            checked={selectedLists.includes(list.id)}
            onChange={() => handleToggleSelection(list.id)}
          />
          <ListContainer list={list} />
        </div>
      ))}
    </div>
  </div>
);

const NewListCreationPage = ({
  lists,
  selectedLists,
  setCreationMode,
  temporaryList,
  handleMoveItem,
  handleUpdate,
  handleCancel,
}) => {
  const filteredLists = lists.filter((list) => selectedLists.includes(list.id));

  return (
    <div className="creation-container">
      <div className="lists-container">
        <ListContainer
          key={filteredLists[0].id}
          list={filteredLists[0]}
          moveItem={(item) =>
            handleMoveItem(item, filteredLists[0], temporaryList, temporaryList)
          }
          buttonDirection="→"
        />

        <ListContainer
          list={temporaryList}
          moveItem={(item, direction) => {
            const targetList =
              direction === "→"
                ? filteredLists[1]
                : lists.find((l) => selectedLists.includes(l.id));
            handleMoveItem(item, temporaryList, targetList, temporaryList);
          }}
          buttonDirection="←"
          temp="→"
        />

        <ListContainer
          key={filteredLists[1].id}
          list={filteredLists[1]}
          moveItem={(item) =>
            handleMoveItem(item, filteredLists[1], temporaryList, temporaryList)
          }
          buttonDirection="←"
        />
      </div>
      <div className="button-group">
        <button className="update-button" onClick={handleUpdate}>
          Update
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};
const App = () => {
  const dispatch = useDispatch();
  const { lists, loading, error } = useSelector((state) => state);

  const [selectedLists, setSelectedLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [creationMode, setCreationMode] = useState(false);
  const [temporaryList, setTemporaryList] = useState({
    id: lists.length + 1,
    name: "List " + String(lists.length + 1),
    items: [],
  });
  const [originalLists, setOriginalLists] = useState([]);

  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  const handleCreateList = () => {
    if (selectedLists.length !== 2) {
      setErrorMessage(
        "*You should select exactly 2 lists to create a new list"
      );
      return;
    }
    setErrorMessage("");
    setCreationMode(true);
    setTemporaryList({
      id: lists.length + 1,
      name: "List " + String(lists.length + 1),
      items: [],
    });
    setOriginalLists([...lists]);
  };

  const handleToggleSelection = (id) => {
    setSelectedLists((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((listId) => listId !== id)
        : [...prevSelected, id]
    );
  };

  const handleUpdate = () => {
    if (selectedLists.length !== 2) return;
    const updatedLists = [...lists, temporaryList];
    dispatch({ type: "UPDATE_LISTS", payload: updatedLists });
    setCreationMode(false);
    setSelectedLists([]);
    setTemporaryList({
      id: lists.length + 1,
      name: "List " + String(lists.length + 1),
      items: [],
    });
  };

  const handleCancel = () => {
    setCreationMode(false);
    setSelectedLists([]);
    setTemporaryList({
      id: lists.length + 1,
      name: "List " + String(lists.length + 1),
      items: [],
    });
  };

  const handleMoveItem = (item, fromList, toList, tempList) => {
    if (fromList.id && toList.id) {
      dispatch({
        type: MOVE_ITEM,
        payload: {
          itemId: item.id,
          fromListId: fromList.id,
          toListId: toList.id,
          temporaryList: tempList,
        },
      });
    }

    if (toList.id === tempList.id) {
      setTemporaryList((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }));
    }

    if (fromList.id === tempList.id) {
      setTemporaryList((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== item.id),
      }));
    }
  };

  if (loading) return <LoadingView />;
  if (error) return <FailureView message={error} />;

  return (
    <div className="app">
      <h1 className="listText">List Creation</h1>
      {creationMode ? (
        <NewListCreationPage
          lists={lists}
          selectedLists={selectedLists}
          setCreationMode={setCreationMode}
          temporaryList={temporaryList}
          handleMoveItem={handleMoveItem}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
        />
      ) : (
        <ListViewPage
          lists={lists}
          selectedLists={selectedLists}
          handleToggleSelection={handleToggleSelection}
          handleCreateList={handleCreateList}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default App;
