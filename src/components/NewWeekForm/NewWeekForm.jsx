import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import "../../styles/NewWeekForm.css";

export default function NewWeekForm({
  editNewWeek,
  newWeekDate,
  setNewWeekDate,
  addWeeklyList,
  toggleEditNewWeek,
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleToggle = () => {
    toggleEditNewWeek();
    setTimeout(() => setShowCalendar(true), 50);
  };

  const handleDayClick = (date) => {
    setNewWeekDate(format(date, "yyyy-MM-dd", { locale: nl }));
    setShowCalendar(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("calendar-overlay")) {
      setShowCalendar(false);
    }
  };

  return (
    <section>
      {/* Always show the main Nieuwe week button if not editing */}
      {!editNewWeek && (
        <button
          onClick={() => {
            toggleEditNewWeek(true);
            setTimeout(() => setShowCalendar(true), 50);
          }}
        >
          Nieuwe week
        </button>
      )}

      {editNewWeek && (
        <div className="new-week-form">
          <input
            type="text"
            readOnly
            value={newWeekDate || ""}
            placeholder="Selecteer datum"
            onClick={() => setShowCalendar(true)}
          />

          {showCalendar && (
            <div
              className="calendar-overlay"
              onClick={(e) => {
                if (e.target.classList.contains("calendar-overlay"))
                  setShowCalendar(false);
              }}
            >
              <div className="calendar-modal">
                <DayPicker
                  mode="single"
                  selected={newWeekDate ? new Date(newWeekDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setNewWeekDate(
                        format(date, "yyyy-MM-dd", { locale: nl })
                      );
                      setShowCalendar(false); // <-- close the calendar after selecting
                    }
                  }}
                  locale={nl}
                />
              </div>
            </div>
          )}

          <button
            onClick={() => {
              addWeeklyList();
              setNewWeekDate(""); // reset date
              toggleEditNewWeek(false); // hide form
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
