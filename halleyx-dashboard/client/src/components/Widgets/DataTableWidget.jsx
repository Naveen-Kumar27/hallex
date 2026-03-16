import React from 'react';
import { Terminal } from 'lucide-react';

const DataTableWidget = ({ data }) => {
  if (!data || data.length === 0) {
      return (
        <div className="text-textTertiary flex items-center justify-center p-4 text-sm h-full font-mono bg-surfaceHover/20 rounded-xl">
            <Terminal className="h-4 w-4 mr-2" /> Awaiting telemetry data...
        </div>
      );
  }

  // Pick keys from first row for columns dynamically
  const columns = Object.keys(data[0]).filter(k => k !== '_id' && k !== '__v' && k !== 'customer' && k !== 'orderInfo');

  // Hardcoded expansion if schema is nested (specifically for dashboard use)
  let flatData = [...data];
  if (data[0].orderInfo) {
      flatData = data.map(d => ({
         _id: d._id,
         Date: new Date(d.orderInfo.orderDate).toLocaleDateString(),
         Product: d.orderInfo.product,
         Price: `$${d.orderInfo.unitPrice}`,
         Status: d.orderInfo.status
      }));
  }

  const finalColumns = Object.keys(flatData[0]).filter(k => k !== '_id' && k !== '__v');

  return (
    <div className="relative overflow-auto h-full rounded-2xl scrollbar-hide">
      <table className="w-full text-sm text-left text-textSecondary font-sans border-collapse">
        <thead className="text-[10px] text-textTertiary uppercase tracking-[0.2em] sticky top-0 bg-surface/50 backdrop-blur-md z-10 border-b border-borderLight/30">
          <tr>
            {finalColumns.map(col => (
               <th key={col} className="px-6 py-4 font-black">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-borderLight/10">
            {flatData.map((row, i) => (
                <tr key={i} className="hover:bg-surfaceHover transition-colors group">
                    {finalColumns.map(col => (
                        <td key={`${i}-${col}`} className="px-5 py-3 truncate max-w-[150px] group-hover:text-primary transition-colors">
                            {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableWidget;
