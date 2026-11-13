export function ActionPanel({ title, amount, onAmount, onPrimary, onSecondary, primary, secondary, disabled }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <input value={amount} onChange={(e) => onAmount(e.target.value)} />
      <div className="row">
        <button disabled={disabled} onClick={onPrimary}>{primary}</button>
        <button disabled={disabled} onClick={onSecondary}>{secondary}</button>
      </div>
    </section>
  );
}
