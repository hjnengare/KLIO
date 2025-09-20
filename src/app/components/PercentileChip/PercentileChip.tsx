interface PercentileChipProps {
  label: string;
  value: number;
}

const getIconForLabel = (label: string) => {
  switch (label.toLowerCase()) {
    case 'speed':
      return 'flash';
    case 'hospitality':
      return 'heart';
    case 'quality':
      return 'star';
    default:
      return 'checkmark-circle';
  }
};

export default function PercentileChip({ label, value }: PercentileChipProps) {
  const icon = getIconForLabel(label);

  return (
    <div className="flex items-center gap-1 rounded bg-gradient-to-r from-cultured-2 to-cultured-1 px-3 py-1.5 shadow-sm border border-white/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-105">
      <ion-icon name={icon} class="text-sage" style={{fontSize: '14px'}} />
      <span className="font-urbanist text-sm font-700 text-sage">{value}%</span>
    </div>
  );
}