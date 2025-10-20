import React from "react";

const App = () => {
  const afvalData = [
    { afvalstroom_id: 6, ophaaldatum: "2025-09-04" },
    { afvalstroom_id: 5, ophaaldatum: "2025-09-10" },
    { afvalstroom_id: 3, ophaaldatum: "2025-09-15" },
    { afvalstroom_id: 6, ophaaldatum: "2025-09-18" },
    { afvalstroom_id: 2, ophaaldatum: "2025-09-22" },
    { afvalstroom_id: 5, ophaaldatum: "2025-09-24" },
    { afvalstroom_id: 6, ophaaldatum: "2025-10-02" },
    { afvalstroom_id: 5, ophaaldatum: "2025-10-08" },
    { afvalstroom_id: 6, ophaaldatum: "2025-10-16" },
    { afvalstroom_id: 2, ophaaldatum: "2025-10-20" },
    { afvalstroom_id: 3, ophaaldatum: "2025-10-20" },
    { afvalstroom_id: 5, ophaaldatum: "2025-10-22" },
    { afvalstroom_id: 6, ophaaldatum: "2025-10-30" },
    { afvalstroom_id: 5, ophaaldatum: "2025-11-05" },
    { afvalstroom_id: 6, ophaaldatum: "2025-11-13" },
    { afvalstroom_id: 2, ophaaldatum: "2025-11-17" },
    { afvalstroom_id: 3, ophaaldatum: "2025-11-17" },
    { afvalstroom_id: 5, ophaaldatum: "2025-11-19" },
    { afvalstroom_id: 6, ophaaldatum: "2025-11-27" },
    { afvalstroom_id: 5, ophaaldatum: "2025-12-03" },
    { afvalstroom_id: 6, ophaaldatum: "2025-12-11" },
    { afvalstroom_id: 2, ophaaldatum: "2025-12-15" },
    { afvalstroom_id: 3, ophaaldatum: "2025-12-15" },
    { afvalstroom_id: 5, ophaaldatum: "2025-12-17" },
    { afvalstroom_id: 6, ophaaldatum: "2025-12-20" },
    { afvalstroom_id: 5, ophaaldatum: "2025-12-31" },
  ];

  return (
    <div>
      <h1>Afval Ophaaldata</h1>
      <ul>
        {afvalData.map((item, index) => (
          <li key={index}>
            Stroom ID: {item.afvalstroom_id}, Datum: {item.ophaaldatum}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
