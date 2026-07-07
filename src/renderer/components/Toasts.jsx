export default function Toasts({ items, onDismiss }) {
  return (
    <div className="toast-stack">
      {items.map((item) => (
        <button key={item.id} type="button" className={`toast ${item.kind || "success"}`} onClick={() => onDismiss(item.id)}>
          {item.message}
        </button>
      ))}
    </div>
  );
}
