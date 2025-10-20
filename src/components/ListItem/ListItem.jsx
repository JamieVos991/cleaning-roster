import "../../styles/ListItem.css";

export default function ListItem({ item, toggleItemDone, deleteItem }) {
  return (
    <li className="li-listitem">
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          id={`cbx-${item.id}`}
          checked={item.done}
          onChange={() => toggleItemDone(item)}
        />
        <label htmlFor={`cbx-${item.id}`} className="check">
          <svg width="18px" height="18px" viewBox="0 0 18 18">
            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
            <polyline points="1 9 7 14 15 4"></polyline>
          </svg>
        </label>
      </div>

      <article className="article-listitem">
        <p className={item.done ? "done" : ""}>
          {item.text} • {item.name}
        </p>
      </article>
      <button className="delete-btn" onClick={() => deleteItem(item.id)}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H8Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </li>
  );
}
