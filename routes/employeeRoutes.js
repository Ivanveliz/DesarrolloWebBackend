const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  renderNewForm,
  renderEditForm,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const { requireAdmin } = require("../middleware/roleMiddleware");

// Todo el módulo empleados queda solo para administradores
router.use(requireAdmin);

router.get("/", getAllEmployees);
router.get("/nuevo", renderNewForm);
router.post("/", createEmployee);

router.get("/:id/editar", renderEditForm);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

router.get("/:id", getEmployeeById);

module.exports = router;