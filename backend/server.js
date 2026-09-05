const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amdox_erp';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Employee', 'HR Manager'], default: 'Employee' },
});

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  head: { type: String, required: true },
  count: { type: Number, default: 0 },
});

const AttendanceSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const Department = mongoose.model('Department', DepartmentSchema);
const Attendance = mongoose.model('Attendance', AttendanceSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'Employee' });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Departments API
app.get('/api/departments', authenticateToken, async (req, res) => {
  try {
    const docs = await Department.find();
    res.json(docs.map((d) => ({ id: d._id.toString(), name: d.name, head: d.head, count: d.count })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

app.post('/api/departments', authenticateToken, async (req, res) => {
  try {
    const { name, head } = req.body;
    const newDept = new Department({ name, head, count: 0 });
    await newDept.save();
    res.status(201).json({ id: newDept._id.toString(), name: newDept.name, head: newDept.head });
  } catch (err) {
    res.status(500).json({ message: 'Error adding department' });
  }
});

// Attendance API
app.get('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const docs = await Attendance.find();
    res.json(docs.map((d) => ({ id: d._id.toString(), employeeName: d.employeeName, date: d.date, status: d.status })));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

app.post('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const { employeeName, date, status } = req.body;
    const newAtt = new Attendance({ employeeName, date, status });
    await newAtt.save();
    res.status(201).json({ id: newAtt._id.toString(), employeeName: newAtt.employeeName, date: newAtt.date, status: newAtt.status });
  } catch (err) {
    res.status(500).json({ message: 'Error recording attendance' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
