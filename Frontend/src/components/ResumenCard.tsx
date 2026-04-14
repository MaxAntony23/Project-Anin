type CardColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';

interface ResumenCardProps {
  title: string;
  value: number;
  icon: string;
  color: CardColor;
  subtitle?: string;
}

const colorStyles: Record<CardColor, { card: string; value: string }> = {
  blue:   { card: 'bg-blue-50 border-blue-200',   value: 'text-blue-700'   },
  green:  { card: 'bg-green-50 border-green-200',  value: 'text-green-700'  },
  yellow: { card: 'bg-yellow-50 border-yellow-200', value: 'text-yellow-700' },
  red:    { card: 'bg-red-50 border-red-200',      value: 'text-red-700'    },
  purple: { card: 'bg-purple-50 border-purple-200', value: 'text-purple-700' },
  orange: { card: 'bg-orange-50 border-orange-200', value: 'text-orange-700' },
};

export const ResumenCard: React.FC<ResumenCardProps> = ({ title, value, icon, color, subtitle }) => {
  const styles = colorStyles[color];
  return (
    <div className={`border-2 rounded-xl p-3 md:p-5 shadow-sm hover:shadow-md transition-shadow ${styles.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide leading-tight">{title}</p>
          <p className={`text-3xl md:text-4xl font-bold mt-1 ${styles.value}`}>{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <span className="text-2xl md:text-3xl opacity-80">{icon}</span>
      </div>
    </div>
  );
};
