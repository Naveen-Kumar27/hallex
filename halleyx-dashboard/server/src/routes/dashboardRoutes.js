const express = require('express');
const router = express.Router();
const {
  getDashboards,
  getDashboardById,
  createDashboard,
  updateDashboard,
  deleteDashboard
} = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/').get(getDashboards).post(createDashboard);
router.route('/:id').get(getDashboardById).put(updateDashboard).delete(deleteDashboard);

module.exports = router;
