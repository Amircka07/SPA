export function ResetButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled}>Сбросить</button>;
}
