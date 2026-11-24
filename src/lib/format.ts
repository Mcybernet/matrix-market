export function timeAgo(iso?: string | null) {
 if (!iso) return "-";
 const d = new Date(iso).getTime();
 if (Number.isNaN(d)) return "-";
 const sec = Math.max(0, Math.floor((Date.now() - d) / 1000));
 if (sec < 60) return `${sec}s ago`;
 const min = Math.floor(sec / 60);
 if (min < 60) return `${min}m ago`;
 const hr = Math.floor(min / 60);
 if (hr < 24) return `${hr}h ago`;
 const day = Math.floor(hr / 24);
 return `${day}d ago`;
}
