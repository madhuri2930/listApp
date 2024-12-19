import React from "react";
import ListItem from "./ListItem";
import "../styles/ListContainer.css";

const ListContainer = ({ list, moveItem, buttonDirection, temp }) => {
  return (
    <div className="list-container">
      <h3>
        {list.name} ({list.items.length})
      </h3>
      {list.items.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          moveItem={(direction) => moveItem(item, direction)}
          buttonDirection={buttonDirection}
          temp = {temp}
        />
      ))}
    </div>
  );
};

export default ListContainer;
