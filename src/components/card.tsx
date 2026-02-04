import { ReactNode, ComponentType } from "react";

type IconType = ComponentType<{ className?: string }>;

type CardProps = {
  icon: IconType;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

const Card = ({
  icon: Icon,
  title,
  description,
  children,
  className = "",
}: CardProps) => (
  <div
    className={`break-inside-avoid rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-xl mb-4 ${className}`}
  >
    <div className="flex flex-col items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
    </div>

    <div>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs opacity-70 leading-snug">{description}</p>
    </div>

    {children && <div className="mt-4">{children}</div>}
  </div>
);

export default Card;
