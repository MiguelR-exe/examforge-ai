export default function Card({ children, className = "", as: Tag = "div", ...props }) {
  return (
    <Tag
      className={`rounded-2xl border border-base-border bg-base-surface ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}