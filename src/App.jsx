import { useEffect, useState } from "react";
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

import Header from "./components/Header/Header";
import WeekSection from "./components/WeekSection/WeekSection";
import NewWeekForm from "./components/NewWeekForm/NewWeekForm";

import { getWeekNumber, getWeekDateRange } from "./helpers/dateUtils";
import { afvalData } from "./helpers/afvalData";

import "./styles/App.css";

function App() {
  const [lists, setLists] = useState([]);
  const [items, setItems] = useState({});
  const [collapsedWeeks, setCollapsedWeeks] = useState({});
  const [editWeeks, setEditWeeks] = useState({});
  const [editNewWeek, setEditNewWeek] = useState(false);
  const [newWeekDate, setNewWeekDate] = useState("");
  const [newItemText, setNewItemText] = useState({});
  const [newItemName, setNewItemName] = useState({});
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    setToday(
      now.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cleaningLists"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sorted = data.sort((a, b) => a.date?.seconds - b.date?.seconds);
      setLists(sorted);

      const now = new Date();
      const currentWeek = getWeekNumber(now);
      const currentYear = now.getFullYear();
      const newCollapsed = {};
      sorted.forEach((list) => {
        const key = `${list.year}-W${list.week}`;
        newCollapsed[key] = !(
          list.week === currentWeek && list.year === currentYear
        );
      });
      setCollapsedWeeks(newCollapsed);
    });
    return () => unsub();
  }, []);

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
    setCollapsedWeeks((prev) => ({ ...prev, [weekKey]: !prev[weekKey] }));

  const toggleEditWeek = (weekKey) =>
    setEditWeeks((prev) => ({ ...prev, [weekKey]: !prev[weekKey] }));

  const toggleEditNewWeek = () => setEditNewWeek((prev) => !prev);

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

  const groupedLists = lists.reduce((acc, list) => {
    const key = `${list.year}-W${list.week}`;
    acc[key] = acc[key] || [];
    acc[key].push(list);
    return acc;
  }, {});

  return (
    <main>
      <Header today={today} />

      <section className="weeks-section">
        {Object.entries(groupedLists).map(([key, weekLists]) => {
          const weekYear = weekLists[0].year;
          const weekNum = weekLists[0].week;
          const weekLabel = getWeekDateRange(weekYear, weekNum);

          const weekTrash = afvalData.filter((item) => {
            const date = new Date(item.ophaaldatum);
            return (
              date.getFullYear() === weekYear && getWeekNumber(date) === weekNum
            );
          });

          return (
            <WeekSection
              key={key}
              weekKey={key}
              weekData={weekLists}
              collapsed={collapsedWeeks[key]}
              toggleCollapse={toggleCollapseWeek}
              toggleEdit={toggleEditWeek}
              editMode={editWeeks[key]}
              items={items}
              newItemText={newItemText}
              newItemName={newItemName}
              setNewItemText={setNewItemText}
              setNewItemName={setNewItemName}
              addItem={addItem}
              toggleItemDone={toggleItemDone}
              deleteItem={deleteItem}
              deleteList={deleteList}
              weekTrash={weekTrash}
              weekLabel={weekLabel}
            />
          );
        })}
      </section>
      <NewWeekForm
        editNewWeek={editNewWeek}
        newWeekDate={newWeekDate}
        setNewWeekDate={setNewWeekDate}
        addWeeklyList={addWeeklyList}
        toggleEditNewWeek={toggleEditNewWeek}
      />
    </main>
  );
}

export default App;
