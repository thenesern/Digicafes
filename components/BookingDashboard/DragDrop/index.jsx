import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./DragDrop.module.css";

const finalSpaceCharacters = [
  {
    id: "1",
    name: "Gary Goodspeed",
  },
  {
    id: "2",
    name: "Little Cato",
  },
  {
    id: "3",
    name: "KVN",
  },
  {
    id: "4",
    name: "Mooncake",
  },
  {
    id: "5",
    name: "Quinn Ergon",
  },
];
const DragDrop = () => {
  const [characters, updateCharacters] = useState(finalSpaceCharacters);
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(characters);
    console.log(items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCharacters(items);
  }
  return (
    <div className={styles.App}>
      <header className={styles["App-header"]}>
        <h1>Masa Düzeni</h1>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className={styles.characters}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {characters.map(({ id, name, thumb }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{name}</p>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </header>
    </div>
  );
};

export default DragDrop;
