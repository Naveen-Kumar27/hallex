const Dashboard = require('../models/Dashboard');
const Widget = require('../models/Widget');

// @desc    Get all dashboards
// @route   GET /api/dashboards
// @access  Public
exports.getDashboards = async (req, res) => {
  try {
    const dashboards = await Dashboard.find().populate('widgets');
    res.json(dashboards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single dashboard by ID
// @route   GET /api/dashboards/:id
// @access  Public
exports.getDashboardById = async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id).populate('widgets');
    if (dashboard) {
      res.json(dashboard);
    } else {
      res.status(404).json({ message: 'Dashboard not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new dashboard
// @route   POST /api/dashboards
// @access  Public
exports.createDashboard = async (req, res) => {
  try {
    const { name, layouts } = req.body;

    const dashboard = new Dashboard({
      name,
      layouts: layouts || { lg: [], md: [], sm: [] }
    });

    const createdDashboard = await dashboard.save();
    res.status(201).json(createdDashboard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update dashboard layout
// @route   PUT /api/dashboards/:id
// @access  Public
exports.updateDashboard = async (req, res) => {
  try {
    const { name, layouts, widgets: widgetsData } = req.body;

    let dashboard = await Dashboard.findById(req.params.id);

    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    // 1. Update basic info
    if (name) dashboard.name = name;
    if (layouts) dashboard.layouts = layouts;

    // 2. Handle Widgets Synchronization if provided
    if (widgetsData) {
      const currentWidgetIds = dashboard.widgets.map(id => id.toString());
      const incomingWidgetIds = widgetsData
        .filter(w => w._id && !w._id.startsWith('new_widget_'))
        .map(w => w._id.toString());

      // Find widgets to delete (in DB but not in incoming data)
      const widgetsToDelete = currentWidgetIds.filter(id => !incomingWidgetIds.includes(id));
      if (widgetsToDelete.length > 0) {
        await Widget.deleteMany({ _id: { $in: widgetsToDelete } });
      }

      // Process incoming widgets
      const finalWidgetIds = await Promise.all(widgetsData.map(async (wData) => {
        if (!wData._id || wData._id.startsWith('new_widget_')) {
          // It's a brand new widget from drag-drop
          const newWidget = new Widget({
            dashboardId: dashboard._id,
            title: wData.title || 'Untitled Widget',
            type: wData.type || 'bar',
            config: wData.config || {}
          });
          const saved = await newWidget.save();
          return saved._id;
        } else {
          // It's an existing widget, update its title/config if changed
          await Widget.findByIdAndUpdate(wData._id, {
            title: wData.title,
            config: wData.config
          });
          return wData._id;
        }
      }));

      dashboard.widgets = finalWidgetIds;
    }

    const updatedDashboard = await dashboard.save();
    
    // Return fully populated dashboard
    const populatedDashboard = await Dashboard.findById(updatedDashboard._id).populate('widgets');
    res.json(populatedDashboard);

  } catch (error) {
    console.error('Update Dashboard Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete dashboard
// @route   DELETE /api/dashboards/:id
// @access  Public
exports.deleteDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(req.params.id);

    if (dashboard) {
      // Also delete all widgets associated with this dashboard
      await Widget.deleteMany({ dashboardId: dashboard._id });
      await dashboard.deleteOne();
      res.json({ message: 'Dashboard removed' });
    } else {
      res.status(404).json({ message: 'Dashboard not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
