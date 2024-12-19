import React from "react";
import "../styles/ListItem.css";

const ListItem = ({ item, moveItem, buttonDirection, temp }) => {
  return (
    <div className="list-item">
      <div>
        <strong>{item.name}</strong>
        <p>{item.description}</p>
      </div>
      <div className="button-container">
        {buttonDirection && (
          <button className="move-button" onClick={()=> moveItem(buttonDirection)}>
            {buttonDirection}
          </button>
        )}
        {
        temp && (
            <button className="move-button" onClick={()=>moveItem(temp)}>
            {temp}
          </button>
        )}
      </div>
      
    </div>
  );
};

export default ListItem;
