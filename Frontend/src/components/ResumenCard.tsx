import type { LucideIcon } from 'lucide-react';

type CardColor = 'red' | 'navy' | 'slate' | 'green' | 'orange' | 'purple';

interface ResumenCardProps {
  title: string;
  value: number;
  Icon: LucideIcon;
  color: CardColor;
  subtitle?: string;
}

const colorStyles: Record<CardColor, { card: string; icon: string; value: string }> = {
  red:    { card: 'bg-brand-red/8 border-brand-red/20',      icon: 'text-brand-red',   value: 'text-brand-red'   },
  navy:   { card: 'bg-brand-navy/8 border-brand-navy/20',    icon: 'text-brand-navy',  value: 'text-brand-navy'  },
  slate:  { card: 'bg-brand-slate/10 border-brand-slate/25', icon: 'text-brand-slate', value: 'text-brand-slate' },
  green:  { card: 'bg-emerald-50 border-emerald-200',        icon: 'text-emerald-600', value: 'text-emerald-700' },
  orange: { card: 'bg-orange-50 border-orange-200',          icon: 'text-orange-500',  value: 'text-orange-600'  },
  purple: { card: 'bg-violet-50 border-violet-200',          icon: 'text-violet-600',  value: 'text-violet-700'  },
};

export const ResumenCard: React.FC<ResumenCardProps> = ({ title, value, Icon, color, subtitle }) => {
  const styles = colorStyles[color];
  return (
    <div className={`border-2 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow ${styles.card}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-brand-slate text-xs font-semibold uppercase tracking-wide leading-tight truncate">{title}</p>
          <p className={`text-3xl md:text-4xl font-bold mt-1 ${styles.value}`}>{value}</p>
          {subtitle && <p className="text-brand-slate/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-white/60 ml-2 shrink-0 ${styles.icon}`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </div>
  );
};
