import { formatScore } from '../format';

export function ScoreRing({ value, label }: { value: number; label?: string }) {
  const rounded = Math.max(0, Math.min(100, value));
  return (
    <div
      className="ring"
      style={{ background: `conic-gradient(#8be4ff ${rounded * 3.6}deg, rgba(139, 228, 255, 0.16) 0deg)` }}
      role="img"
      aria-label={`${label ?? '综合分'} ${formatScore(value)}`}
    >
      <span>{formatScore(value)}</span>
    </div>
  );
}
