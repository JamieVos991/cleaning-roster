import "../../styles/TrashList.css";

export default function TrashList({ weekTrash }) {
  const colorMap = {
    6: "#9ECFD4",
    2: "#B0CE88",
    5: "#FF714B",
  };

  return (
    <li className="li-trash">
      {weekTrash.map((item, i) => (
        <span
          className="trash-span"
          key={i}
          style={{ backgroundColor: colorMap[item.afvalstroom_id] || "#ccc" }}
        >
          <p>
            {new Date(item.ophaaldatum).toLocaleDateString("nl-NL", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p>{item.naam}</p>
        </span>
      ))}
    </li>
  );
}
