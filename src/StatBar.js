
const StatBar = ({ name, value, max = 255 }) => {
    const percentage = (value / max) * 100;
    const color = percentage > 75 ? 'bg-green-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <div className="flex items-center gap-4">
        <span className="w-32 text-sm font-medium capitalize text-gray-700">{name}</span>
        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-500 flex items-center justify-end pr-2`}
            style={{ width: `${percentage}%` }}
          >
            <span className="text-xs font-bold text-white">{value}</span>
          </div>
        </div>
      </div>
    );
  };

  export default StatBar