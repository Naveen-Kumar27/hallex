const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  dashboardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dashboard', required: true },
  title: { type: String, required: true },
  description: String,
  type: { 
    type: String, 
    enum: ['kpi', 'bar', 'line', 'area', 'scatter', 'pie', 'table'],
    required: true 
  },
  config: {
    dataSource: { type: String, default: 'orders' },
    xAxisField: String,     
    yAxisField: String,     
    aggregation: { 
      type: String, 
      enum: ['sum', 'average', 'count', 'min', 'max', 'none'], 
      default: 'none' 
    },
    chartConfig: {
      colorPalette: [String],
      showLegend: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Widget', widgetSchema);
