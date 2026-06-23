export default  function Countdown({ endsAt }: { endsAt: string }) {
  const endDate = new Date(endsAt);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return <span className="text-red-400">Ended</span>;
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return <span>{diffHours}h {diffMinutes}m left</span>;
  } else {
    return <span>{diffMinutes}m left</span>;
  }
}