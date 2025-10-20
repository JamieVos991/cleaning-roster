import ListItem from "../ListItem/ListItem";
import TrashList from "../TrashList/TrashList";
import "../../styles/WeekSection.css";

export default function WeekSection({
  weekKey,
  weekData,
  collapsed,
  toggleCollapse,
  toggleEdit,
  editMode,
  items,
  newItemText,
  newItemName,
  setNewItemText,
  setNewItemName,
  addItem,
  toggleItemDone,
  deleteItem,
  // deleteList,
  weekTrash,
  weekLabel,
}) {
  return (
    <article>
      <h2>
        <button
          className={`collapse-btn ${collapsed ? "collapsed" : ""}`}
          onClick={() => toggleCollapse(weekKey)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <p>
          {weekData[0].name} ({weekLabel})
        </p>
        <button onClick={() => toggleEdit(weekKey)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21.2635 2.29289C20.873 1.90237 20.2398 1.90237 19.8493 2.29289L18.9769 3.16525C17.8618 2.63254 16.4857 2.82801 15.5621 3.75165L4.95549 14.3582L10.6123 20.0151L21.2189 9.4085C22.1426 8.48486 22.338 7.1088 21.8053 5.99367L22.6777 5.12132C23.0682 4.7308 23.0682 4.09763 22.6777 3.70711L21.2635 2.29289ZM16.9955 10.8035L10.6123 17.1867L7.78392 14.3582L14.1671 7.9751L16.9955 10.8035ZM18.8138 8.98525L19.8047 7.99429C20.1953 7.60376 20.1953 6.9706 19.8047 6.58007L18.3905 5.16586C18 4.77534 17.3668 4.77534 16.9763 5.16586L15.9853 6.15683L18.8138 8.98525Z"
              fill="currentColor"
            />
            <path
              d="M2 22.9502L4.12171 15.1717L9.77817 20.8289L2 22.9502Z"
              fill="currentColor"
            />
          </svg>
        </button>
        {/* <button onClick={() => deleteList(weekData[0].id)}>
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
        </button> */}
      </h2>

      {!collapsed && (
        <>
          {weekData.map((list) => (
            <div key={list.id} className="list">
              <ul>
                {(items[list.id] || []).map((item) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    toggleItemDone={toggleItemDone}
                    deleteItem={deleteItem}
                  />
                ))}
              </ul>

              {editMode && (
                <ul className="ul-inputs">
                  <li className="li-input">
                    <div className="select-wrapper">
                      <select
                        value={newItemText[list.id] || ""}
                        onChange={(e) =>
                          setNewItemText({
                            ...newItemText,
                            [list.id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Wat moet er gedaan worden?</option>
                        <option value="Keuken">Keuken</option>
                        <option value="Badkamer">Badkamer</option>
                        <option value="Toilet">Toilet</option>
                      </select>
                    </div>

                    <div className="select-wrapper">
                      <select
                        value={newItemName[list.id] || ""}
                        onChange={(e) =>
                          setNewItemName({
                            ...newItemName,
                            [list.id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecteer een naam</option>
                        <option value="Jamie">Jamie</option>
                        <option value="Tiara">Tiara</option>
                        <option value="Nuala">Nuala</option>
                        <option value="Anna">Anna</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <button onClick={() => addItem(list.id)}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
                          fill="currentColor"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ))}

          {weekTrash.length > 0 && <TrashList weekTrash={weekTrash} />}
        </>
      )}
    </article>
  );
}
