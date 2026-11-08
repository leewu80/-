export function ReasonList({ reasons }: { reasons: string[] }) {
  return (
    <ul className="reasons">
      {reasons.map((reason, index) => (
        <li key={`${index}-${reason}`}>{reason}</li>
      ))}
    </ul>
  );
}
