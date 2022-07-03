import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./DragDrop.module.css";

const DragDrop = ({ stage, bookingColumns, storeName, tableNum }) => {
  const [items, setItems] = useState([{ id: "0", content: "Test" }]);

  useEffect(() => {
    for (let i = 1; i < tableNum; i++) {
      setItems((current) => [
        ...current,
        { id: i.toString(), content: i.toString(), available: "yes" },
      ]);
    }
    if (stage === "yes") {
      setItems((current) => [...current, { id: "Sahne", content: "Sahne" }]);
    }
  }, [tableNum, stage]);

  const columns9and1 = {
    1: {
      name: "Eşyalar",
      items: items,
    },
    2: {
      name: "",
      items: [],
    },
    3: {
      name: "",
      items: [],
    },
    4: {
      name: "",
      items: [],
    },
    5: {
      name: "",
      items: [],
    },
    6: {
      name: "",
      items: [],
    },
    7: {
      name: "",
      items: [],
    },
    8: {
      name: "",
      items: [],
    },
    9: {
      name: "",
      items: [],
    },
    10: {
      name: "",
      items: [],
    },
  };

  const columns6and1 = {
    1: {
      name: "Eşyalar",
      items: items,
    },
    2: {
      name: "",
      items: [],
    },
    3: {
      name: "",
      items: [],
    },
    4: {
      name: "",
      items: [],
    },
    5: {
      name: "",
      items: [],
    },
    6: {
      name: "",
      items: [],
    },
    7: {
      name: "",
      items: [],
    },
  };

  const columns3and1 = {
    1: {
      name: "Eşyalar",
      items: items,
    },
    2: {
      name: "",
      items: [],
    },
    3: {
      name: "",
      items: [],
    },
    4: {
      name: "",
      items: [],
    },
  };

  const [columns, setColumns] = useState({});
  useEffect(() => {
    if (bookingColumns === 3) {
      setColumns(columns3and1);
    }
    if (bookingColumns === 6) {
      setColumns(columns6and1);
    }
    if (bookingColumns === 9) {
      setColumns(columns9and1);
    }
  }, [items, bookingColumns]);
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };
  return (
    <div>
      <div>
        <div>
          <h3 className={styles.title}>Sütunlar</h3>
          <div className={styles.buttonGroup}>
            <Button variant="outlined" color="primary">
              3
            </Button>
            <Button variant="outlined" color="primary">
              6
            </Button>
            <Button variant="outlined" color="primary">
              9
            </Button>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirectin: "column",
          width: "96%",
          margin: "2rem auto",
          height: "48rem",
          boxShadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "auto",
                  backgroundColor: "lightgray",
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "#fff",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        margin: "0 0 8px 0",
                                        width: "3rem",
                                        height: "3rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default DragDrop;
