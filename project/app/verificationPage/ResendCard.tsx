import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import ResendForm from "./ResendForm";

const colorMap = {
  yellow: {
    ring: "bg-yellow-500/10 border-yellow-500/30",
    icon: "text-yellow-400",
  },
  red: {
    ring: "bg-red-500/10 border-red-500/30",
    icon: "text-red-400",
  },
};

interface ResendCardProps {
  color: "yellow" | "red";
  icon: IconDefinition;
  title: string;
  description: string;
  defaultEmail?: string;
}

export default function ResendCard({
  color,
  icon,
  title,
  description,
  defaultEmail = "",
}: ResendCardProps) {
  const c = colorMap[color];
  return (
    <>
      <div
        className={`w-14 h-14 rounded-full ${c.ring} border flex items-center justify-center mb-4`}
      >
        <FontAwesomeIcon icon={icon} className={`w-7 h-7 ${c.icon}`} />
      </div>
      <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
      <p className="text-neutral-400 text-sm mt-1.5">{description}</p>
      <ResendForm defaultEmail={defaultEmail} />
    </>
  );
}
