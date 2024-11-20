import { useEffect, useRef, useState } from 'react';
import GridUI from './grid-ui';
import styles from '../style.module.css';
import { areItemsFromSingleGroup } from '../utils/helper';
import { StatusOptions } from '../utils/types';

function Game({ itemGroups, allItems, columns = 2, groupSize }) {
  const [items, setItems] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState(null);
  const gridUIRef = useRef(null);

  // Reset the game whenever items change
  useEffect(() => {
    setItems(allItems);
    setAttempts(0);
    setStatus(null);
    gridUIRef.current?.clearSelection();
  }, [allItems]);

  // Handle selection completion
  function onSelection(selected) {
    if (selected.length === groupSize) {
      setAttempts(attempts + 1);
      const newStatus = areItemsFromSingleGroup(itemGroups, selected)
        ? StatusOptions.Success
        : StatusOptions.Failure;
      setStatus(newStatus);
      const timeoutId = setTimeout(() => unHighlight(selected, newStatus), 1000);
      return () => clearTimeout(timeoutId);
    }
  }

  function unHighlight(itemsForRemoval, status) {
    // Remove items if the selection was successful
    if (status === StatusOptions.Success) {
      setItems(items.filter((item) => !itemsForRemoval.includes(item)));
    }
    setStatus(null);
    gridUIRef.current?.clearSelection();
  }

  return (
    <>
      {items.length ? (
        <GridUI
          items={items}
          cols={columns}
          onSelection={onSelection}
          status={status}
          ref={gridUIRef}
        />
      ) : (
        <p className={styles.center}>Well done. Reset to play again!</p>
      )}

      <p className={styles.center}>
        Attempts: <strong>{attempts}</strong>
      </p>
    </>
  );
}

export default Game;
