import { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  setDoc,
} from "firebase/firestore";

// 6 = papier
// 2 = GFT
// 5 = plastic
const afvalData = [
  { afvalstroom_id: 6, ophaaldatum: "2025-10-17", naam: "Papier" },
  { afvalstroom_id: 2, ophaaldatum: "2025-10-20", naam: "GFT" },
  { afvalstroom_id: 5, ophaaldatum: "2025-10-30", naam: "Plastic" },

  { afvalstroom_id: 2, ophaaldatum: "2025-11-03", naam: "GFT" },
  { afvalstroom_id: 6, ophaaldatum: "2025-11-14", naam: "Papier" },
  { afvalstroom_id: 2, ophaaldatum: "2025-11-17", naam: "GFT" },
  { afvalstroom_id: 5, ophaaldatum: "2025-11-20", naam: "Plastic" },

  { afvalstroom_id: 2, ophaaldatum: "2025-12-01", naam: "GFT" },
  { afvalstroom_id: 5, ophaaldatum: "2025-12-11", naam: "Plastic" },
  { afvalstroom_id: 6, ophaaldatum: "2025-12-12", naam: "Papier" },
  { afvalstroom_id: 2, ophaaldatum: "2025-12-15", naam: "GFT" },
  { afvalstroom_id: 2, ophaaldatum: "2025-12-29", naam: "GFT" },
];

// Helper: get week number
function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

// Helper: get week date range string
function getWeekDateRange(year, week) {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (week - 1) * 7;
  const weekStart = new Date(firstDayOfYear.getTime() + daysOffset * 86400000);

  const day = weekStart.getDay();
  const diff = (day <= 0 ? -6 : 1) - day;
  weekStart.setDate(weekStart.getDate() + diff);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const options = { day: "numeric", month: "long" };
  const startStr = weekStart.toLocaleDateString("nl-NL", options);
  const endStr = weekEnd.toLocaleDateString("nl-NL", options);

  return `${startStr} – ${endStr}`;
}

function App() {
  const [lists, setLists] = useState([]);
  const [items, setItems] = useState({});
  const [collapsedWeeks, setCollapsedWeeks] = useState({});
  const [newWeekDate, setNewWeekDate] = useState("");
  const [newItemText, setNewItemText] = useState({});
  const [today, setToday] = useState("");
  const [newItemName, setNewItemName] = useState({});
  const [editWeeks, setEditWeeks] = useState({});
  const [editNewWeek, setEditNewWeek] = useState(false);

  const toggleEditWeek = (weekKey) =>
    setEditWeeks((prev) => ({ ...prev, [weekKey]: !prev[weekKey] }));
  const toggleEditNewWeek = () => setEditNewWeek((prev) => !prev);

  // Fetch cleaning lists
  useEffect(() => {
    const now = new Date();
    setToday(
      now.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    const unsub = onSnapshot(collection(db, "cleaningLists"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLists(data.sort((a, b) => a.date?.seconds - b.date?.seconds));
    });
    return () => unsub();
  }, []);

  // Fetch list items
  useEffect(() => {
    const unsubs = lists.map((list) =>
      onSnapshot(
        query(collection(db, "listItems"), where("listId", "==", list.id)),
        (snapshot) => {
          setItems((prev) => ({
            ...prev,
            [list.id]: snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          }));
        }
      )
    );
    return () => unsubs.forEach((u) => u());
  }, [lists]);

  const toggleItemDone = async (item) => {
    await setDoc(
      doc(db, "listItems", item.id),
      { done: !item.done },
      { merge: true }
    );
  };

  const toggleCollapseWeek = (weekKey) =>
    setCollapsedWeeks((prev) => ({
      ...prev,
      [weekKey]: !prev[weekKey],
    }));

  const addWeeklyList = async () => {
    if (!newWeekDate) return alert("Kies een datum om de week te starten.");
    const selectedDate = new Date(newWeekDate);
    const week = getWeekNumber(selectedDate);
    const year = selectedDate.getFullYear();
    await addDoc(collection(db, "cleaningLists"), {
      name: `Week ${week}`,
      week,
      year,
      date: selectedDate,
      createdAt: serverTimestamp(),
    });
    setNewWeekDate("");
  };

  const deleteList = async (listId) => {
    await deleteDoc(doc(db, "cleaningLists", listId));
    (items[listId] || []).forEach(
      async (item) => await deleteDoc(doc(db, "listItems", item.id))
    );
  };

  const addItem = async (listId) => {
    const text = newItemText[listId];
    const name = newItemName[listId];
    if (!text || !name) return alert("Vul zowel een taak als een naam in.");

    await addDoc(collection(db, "listItems"), {
      listId,
      text,
      name,
      done: false,
      createdAt: serverTimestamp(),
    });

    setNewItemText({ ...newItemText, [listId]: "" });
    setNewItemName({ ...newItemName, [listId]: "" });
  };

  const deleteItem = async (id) => await deleteDoc(doc(db, "listItems", id));

  // Group lists by week
  const groupedLists = lists.reduce((acc, list) => {
    const key = `${list.year}-W${list.week}`;
    acc[key] = acc[key] || [];
    acc[key].push(list);
    return acc;
  }, {});

  return (
    <main>
      <section>
        <h1>
          Schoonmaak Rooster{" "}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 13H14C14 14.1046 13.1046 15 12 15C10.8954 15 10 14.1046 10 13H8C8 15.2091 9.79086 17 12 17C14.2091 17 16 15.2091 16 13Z"
              fill="currentColor"
            />
            <path
              d="M10 10C10 10.5523 9.55228 11 9 11C8.44772 11 8 10.5523 8 10C8 9.44771 8.44772 9 9 9C9.55228 9 10 9.44771 10 10Z"
              fill="currentColor"
            />
            <path
              d="M15 11C15.5523 11 16 10.5523 16 10C16 9.44771 15.5523 9 15 9C14.4477 9 14 9.44771 14 10C14 10.5523 14.4477 11 15 11Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
              fill="currentColor"
            />
          </svg>
        </h1>
        <h2>
          Datum: <span>{today}</span>
        </h2>
      </section>

      <section>
        <article>
          {Object.entries(groupedLists).map(([key, weekLists]) => {
            const weekYear = weekLists[0].year;
            const weekNum = weekLists[0].week;

            // Trash for this week
            const weekTrash = afvalData.filter((item) => {
              const date = new Date(item.ophaaldatum);
              return (
                date.getFullYear() === weekYear &&
                getWeekNumber(date) === weekNum
              );
            });

            return (
              <div key={key} className="week-section">
                <h2>
                  <button
                    onClick={() => toggleCollapseWeek(key)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transform: collapsedWeeks[key]
                        ? "rotate(-90deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  {weekLists[0].name} ({getWeekDateRange(weekYear, weekNum)})
                  <button onClick={() => toggleEditWeek(key)}>
                    <svg
                      width="18"
                      height="18"
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
                  <button onClick={() => deleteList(weekLists[0].id)}>
                    <svg
                      width="18"
                      height="18"
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
                </h2>
                {!collapsedWeeks[key] && (
                  <>
                    {weekLists.map((list) => (
                      <div key={list.id} className="list">
                        <ul>
                          {(items[list.id] || []).map((item) => (
                            <li
                              key={item.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => toggleItemDone(item)}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                    textDecoration: item.done
                                      ? "line-through"
                                      : "none",
                                  }}
                                >
                                  {item.text}
                                </p>
                                {item.name && (
                                  <small
                                    style={{
                                      color: "#666",
                                      textAlign: "center",
                                    }}
                                  >
                                    {item.name}
                                  </small>
                                )}
                              </div>

                              <button
                                onClick={() => deleteItem(item.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H8Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>

                        {editWeeks[key] && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                          >
                            <input
                              type="text"
                              value={newItemText[list.id] || ""}
                              onChange={(e) =>
                                setNewItemText({
                                  ...newItemText,
                                  [list.id]: e.target.value,
                                })
                              }
                              placeholder="Wat moet er gedaan worden..."
                            />
                            <input
                              type="text"
                              value={newItemName[list.id] || ""}
                              onChange={(e) =>
                                setNewItemName({
                                  ...newItemName,
                                  [list.id]: e.target.value,
                                })
                              }
                              placeholder="Naam of verantwoordelijke..."
                            />
                            <button onClick={() => addItem(list.id)}>
                              ➕ Toevoegen
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {weekTrash.length > 0 && (
                      <div
                        className="trash-list"
                        style={{ marginTop: "0.5rem" }}
                      >
                        <ul>
                          {weekTrash.map((item, index) => {
                            let bgColor;
                            switch (item.afvalstroom_id) {
                              case 6:
                                bgColor = "#9ECFD4";
                                break;
                              case 2:
                                bgColor = "#B0CE88";
                                break;
                              case 5:
                                bgColor = "#FF714B";
                                break;
                              default:
                                bgColor = "#ccc";
                            }

                            return (
                              <span
                                key={index}
                                style={{
                                  backgroundColor: bgColor,
                                  display: "flex",
                                  flexDirection: "column",
                                  padding: ".9rem 0.5rem",
                                  borderRadius: "4px",
                                  fontSize: "90%",
                                  fontWeight: "400",
                                }}
                              >
                                <div>
                                  <p>
                                    {new Date(
                                      item.ophaaldatum
                                    ).toLocaleDateString("nl-NL", {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                    })}
                                  </p>
                                  <p style={{ fontWeight: "600" }}>
                                    {item.naam}
                                  </p>
                                </div>
                              </span>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {editNewWeek && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <input
                type="date"
                value={newWeekDate}
                onChange={(e) => setNewWeekDate(e.target.value)}
              />
              <button onClick={addWeeklyList}>➕ Nieuwe week toevoegen</button>
            </div>
          )}
          <button onClick={toggleEditNewWeek} style={{ marginTop: "0.5rem" }}>
            ✏️ Edit Week Input
          </button>
        </article>
      </section>
    </main>
  );
}

export default App;
