import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDateFilter } from '../../context/DateFilterContext';
import { analyticsApi } from '../../api';

import KpiCard from '../Widgets/KpiCard';
import BarChartWidget from '../Widgets/BarChartWidget';
import LineChartWidget from '../Widgets/LineChartWidget';
import PieChartWidget from '../Widgets/PieChartWidget';
import DataTableWidget from '../Widgets/DataTableWidget';

const WidgetRenderer = ({ widget }) => {
  const { dateRange } = useDateFilter();

  // Fetch real data from the backend specifically for this widget ID based on the global filter
  const { data, isLoading, isError } = useQuery({
    queryKey: ['widgetData', widget._id, dateRange, widget.config],
    queryFn: () => analyticsApi.getWidgetData(widget._id, dateRange, widget.type, widget.config),
  });

  if (isLoading) {
      return (
          <div className="flex h-full w-full items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
      );
  }

  if (isError || !data) {
       return <div className="flex h-full items-center justify-center text-sm font-bold text-red-500 uppercase tracking-widest">Protocol Sync Failure</div>;
  }

  switch(widget.type) {
    case 'kpi': 
      return <KpiCard count={data.value} title={widget.title} />;
    case 'bar': 
      return <BarChartWidget data={data.series} config={widget.config} />;
    case 'pie': 
      return <PieChartWidget data={data.series} config={widget.config} />;
    case 'line': 
      return <LineChartWidget data={data.series} config={widget.config} />;
    case 'table': 
      return <DataTableWidget data={data.rows} columns={widget.config?.columns} />;
    default: 
      return <div className="flex h-full items-center justify-center text-gray-400">Widget Type Not Found</div>;
  }
};

export default WidgetRenderer;
