type Props = {
 data: number[];
 width?: number;
 height?: number;
 className?: string;
 positive?: boolean;
};

export function Sparkline({ data, width = 120, height = 36, className = "", positive = true }: Props) {
 if (!data || data.length < 2) return <div style={{ width, height }} className={className} />;
 const min = Math.min(...data);
 const max = Math.max(...data);
 const range = max - min || 1;
 const points = data
  .map((v, i) => {
   const x = (i / (data.length - 1)) * width;
   const y = height - ((v - min) / range) * (height - 4) - 2;
   return `${x.toFixed(2)},${y.toFixed(2)}`;
  })
  .join(" ");
 const last = data[data.length - 1];
 const prev = data[0];
 const up = last >= prev || positive;
 const stroke = up ? "var(--up)" : "var(--down)";
 const fill = up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";
 const area = `0,${height} ${points} ${width},${height}`;
 return (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
   <polygon points={area} fill={fill} />
   <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
 );
}