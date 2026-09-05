import { GoogleGenAI } from "@google/genai";
import { Tutor } from "./src/types.js";
import express from "express";
import path from "path";
import fs from "fs";

// Load environment variables natively in Node 20+
try {
  // @ts-ignore
  process.loadEnvFile(path.join(process.cwd(), '.env.local'));
} catch {
  try {
    // @ts-ignore
    process.loadEnvFile(path.join(process.cwd(), '.env'));
  } catch {}
}

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

import { getTutors, getParentRequests, getTutorApplications, addParentRequest, addTutorApplication, approveTutorApplication, rejectTutorApplication, updateParentRequestStatus, getUserByEmail, createUser, getParentRequestsByUserId, getTutorApplicationByUserId, getTutorByUserId, linkParentRequests, linkTutorApplications, addLegacyTutor, getAssignments, createAssignment, getFeeCollections, addFeeCollection, getMonthlyFeeStats, updateAssignment, deleteAssignment, updateFeeCollection, deleteFeeCollection, getParentAssignmentsByUserId, getTutorAssignmentsByUserId, getParentFeeCollectionsByUserId, getTutorFeeCollectionsByUserId } from "./db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// API Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, role, phone } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = {
      id: "usr-" + Math.floor(100000 + Math.random() * 900000),
      email,
      password_hash,
      role,
      status: role === 'TUTOR' ? 'PENDING' : 'ACTIVE',
      createdAt: new Date().toISOString()
    } as any;
    
    await createUser(newUser);

    if (phone) {
      if (role === 'PARENT') {
        await linkParentRequests(newUser.id, phone);
      } else if (role === 'TUTOR') {
        await linkTutorApplications(newUser.id, email, phone);
      }
    }
    
    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role, status: user.status }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", appName: "Teachers At Home" });
});

app.get("/api/user/data", authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    if (role === 'PARENT') {
      const requests = await getParentRequestsByUserId(userId);
      return res.json({ requests });
    } else if (role === 'TUTOR') {
      const application = await getTutorApplicationByUserId(userId);
      const profile = await getTutorByUserId(userId);
      return res.json({ application, profile });
    }
    
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/api/tutors", async (_req, res) => {
  try {
    const tutors = await getTutors();
    res.json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve tutors" });
  }
});

app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { prompt, studentClass, board, subjects, location } = req.body;
    const tutors = await getTutors();

    // Query active tutors database to see if we can find relevant matches to suggest to Gemini
    const queryLower = (prompt || "").toLowerCase();
    const matches = tutors.filter(tutor => {
      const matchSubject = tutor.subjects?.some(s => queryLower.includes(s.toLowerCase()));
      const matchCity = tutor.cities?.some(c => queryLower.includes(c.toLowerCase()));
      const matchBoard = tutor.boards?.some(b => queryLower.includes(b.toLowerCase()));
      const matchClass = tutor.classesHandled?.some(c => queryLower.includes(c.toLowerCase()));
      return matchSubject || matchCity || matchBoard || matchClass;
    });

    // Take top 3 matching tutors or fallback to any 3 verified tutors
    const featuredTutors = (matches.length > 0 ? matches : tutors).slice(0, 3);
    const tutorProfilesContext = featuredTutors.map(t => 
      `- ${t.name}: ${t.title} (${t.experienceYears} yrs exp). Qualification: ${t.qualification}. Teaches: ${t.subjects.join(', ')} in ${t.cities.join(', ')}. Rate: ₹${t.pricePerMonth}/month.`
    ).join("\n");

    const systemInstruction = `You are the friendly AI Education & Home Tuition Advisor for "Teachers At Home" (India's premier 1-on-1 home tuition network serving Jharkhand, Bihar, and major cities across India).
You provide helpful, accurate, and encouraging advice for parents and students looking for home tutors, board syllabus strategies (CBSE, ICSE, JAC, BSEB, IB), exam preparation (Class 10 & 12 Board exams, IIT-JEE, NEET), study schedule planning, and tuition fee guidance in Indian Rupees (₹).
Keep your tone warm, reassuring, highly structured with concise bullet points, and practical. Always encourage taking a 100% Free Demo Class to evaluate tutor compatibility.

CRITICAL: Here are the real, matching verified tutors currently active in our database. When applicable, recommend them specifically by name and summarize their key qualifications:
${tutorProfilesContext}`;

    const userQuery = prompt || `Give me advice for Class ${studentClass || 10} ${board || 'CBSE'} student taking ${subjects || 'Mathematics & Science'} home tuition in ${location || 'Ranchi'}. What should we look for in a home tutor and how many hours/week is recommended?`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userQuery,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Advisor Error:", error);
    res.status(500).json({ error: "Unable to reach AI Advisor right now. Please try again or request a callback!" });
  }
});

app.post("/api/parent-request", async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
      } catch (e) {}
    }
    const reqData = { ...req.body, id: "REQ-" + Math.floor(100000 + Math.random() * 900000), createdAt: new Date().toISOString(), status: 'Pending', user_id: userId };
    await addParentRequest(reqData);
    res.json({ success: true, message: "Free demo request submitted successfully! Our Academic Counselor will contact you within 2 hours.", data: reqData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit demo request" });
  }
});

app.post("/api/tutor-apply", async (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
      } catch (e) {}
    }
    const appData = { ...req.body, id: "TUTOR-" + Math.floor(100000 + Math.random() * 900000), createdAt: new Date().toISOString(), status: 'Received', user_id: userId };
    await addTutorApplication(appData);
    res.json({ success: true, message: "Tutor application submitted! Our team will review your qualifications and contact you for verification.", data: appData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit tutor application" });
  }
});

app.post("/api/tutor-approve", async (req, res) => {
  try {
    const { id } = req.body;
    const apps = await getTutorApplications();
    const appData = apps.find(app => app.id === id);
    if (!appData) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Create new Tutor profile based on application data
    const newTutor: Tutor = {
      id: "tut-" + Math.floor(100000 + Math.random() * 900000),
      name: appData.fullName,
      avatar: appData.gender === 'Female' 
        ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      rating: 5.0,
      reviewsCount: 0,
      title: `${appData.subjects?.[0] || 'General'} Specialist`,
      qualification: appData.qualification,
      experienceYears: Number(appData.experienceYears) || 1,
      subjects: appData.subjects || [],
      boards: appData.boards || [],
      cities: appData.cities || [],
      localities: ["Central Area"],
      pricePerHour: 300,
      pricePerMonth: 3000,
      gender: appData.gender || 'Any',
      mode: appData.preferredMode || 'Home Tuition',
      bio: appData.bio || 'Verified academic tutor.',
      verified: true,
      phone: appData.phone,
      badge: "Newly Verified",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      classesHandled: ["All Classes"],
      demoClassAvailable: true
    };

    // Add to tutors and remove from applications
    await approveTutorApplication(id, newTutor);
    res.json({ success: true, tutor: newTutor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve tutor" });
  }
});

app.post("/api/tutor-reject", async (req, res) => {
  try {
    const { id } = req.body;
    await rejectTutorApplication(id);
    res.json({ success: true, message: "Tutor application rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reject tutor" });
  }
});

app.post("/api/admin/legacy-tutor", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const {
    name,
    email,
    phone,
    password,
    qualification,
    experienceYears,
    subjects,
    cities,
    mode,
    gender,
    pricePerHour,
    pricePerMonth,
    boards,
    localities
  } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = "usr-" + Math.floor(100000 + Math.random() * 900000);
    
    const newUser = {
      id: userId,
      email,
      password_hash,
      role: 'TUTOR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    } as any;

    const newTutor = {
      id: "TUTOR-" + Date.now(),
      name,
      phone,
      qualification,
      experienceYears: parseInt(experienceYears) || 0,
      subjects: subjects || [],
      boards: boards || ['CBSE'],
      cities: cities || [],
      localities: localities || [],
      pricePerHour: parseInt(pricePerHour) || 300,
      pricePerMonth: parseInt(pricePerMonth) || 3000,
      gender: gender || 'Female',
      mode: mode || 'Home Tuition',
      bio: "Experienced and verified home tutor.",
      verified: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      rating: 5.0,
      reviewsCount: 0,
      title: "Expert Home Tutor",
      classesHandled: [],
      demoClassAvailable: true,
      user_id: userId
    } as any;

    await addLegacyTutor(newUser, newTutor);
    res.json({ success: true, message: "Legacy tutor added successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to add legacy tutor" });
  }
});

app.post("/api/parent-request-status", async (req, res) => {
  try {
    const { id, status } = req.body;
    await updateParentRequestStatus(id, status);
    res.json({ success: true, message: "Parent request status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update parent request" });
  }
});

app.get("/api/requests", async (_req, res) => {
  try {
    const parentRequests = await getParentRequests();
    const tutorApplications = await getTutorApplications();
    res.json({ parentRequests, tutorApplications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load requests" });
  }
});

app.get("/api/admin/assignments", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    const assignments = await getAssignments();
    res.json(assignments);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

app.post("/api/admin/assignments", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    const newAssignment = {
      id: "ASG-" + Date.now(),
      assigned_date: new Date().toISOString(),
      status: 'Active',
      ...req.body
    };
    await createAssignment(newAssignment);
    res.json({ success: true, assignment: newAssignment });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to create assignment" });
  }
});

app.get("/api/admin/fees", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    const fees = await getFeeCollections();
    res.json(fees);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fees" });
  }
});

app.post("/api/admin/fees", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    const newFee = {
      id: "FEE-" + Date.now(),
      payment_date: new Date().toISOString(),
      ...req.body
    };
    await addFeeCollection(newFee);
    res.json({ success: true, fee: newFee });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to add fee" });
  }
});

app.get("/api/admin/fees/stats", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    const stats = await getMonthlyFeeStats();
    res.json(stats);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fee stats" });
  }
});

app.put("/api/admin/assignments/:id", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    const { fee_agreed, status } = req.body;
    await updateAssignment(req.params.id, fee_agreed, status);
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to update assignment" });
  }
});

app.delete("/api/admin/assignments/:id", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    await deleteAssignment(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
});

app.put("/api/admin/fees/:id", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    const { amount, payment_mode, month_year, txn_id } = req.body;
    await updateFeeCollection(req.params.id, amount, payment_mode, month_year, txn_id);
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to update fee" });
  }
});

app.delete("/api/admin/fees/:id", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized" });
  try {
    await deleteFeeCollection(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete fee" });
  }
});

app.get("/api/parent/assignments", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'PARENT') return res.status(403).json({ error: "Unauthorized" });
  try {
    const assignments = await getParentAssignmentsByUserId(userReq.user.id);
    res.json(assignments);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

app.get("/api/tutor/assignments", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'TUTOR') return res.status(403).json({ error: "Unauthorized" });
  try {
    const assignments = await getTutorAssignmentsByUserId(userReq.user.id);
    res.json(assignments);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

app.get("/api/parent/fees", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'PARENT') return res.status(403).json({ error: "Unauthorized" });
  try {
    const fees = await getParentFeeCollectionsByUserId(userReq.user.id);
    res.json(fees);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fees" });
  }
});

app.get("/api/tutor/fees", authenticateToken, async (req, res) => {
  const userReq = req as any;
  if (userReq.user.role !== 'TUTOR') return res.status(403).json({ error: "Unauthorized" });
  try {
    const fees = await getTutorFeeCollectionsByUserId(userReq.user.id);
    res.json(fees);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fees" });
  }
});

// Static assets & Vite middleware setup
const distPath = path.join(process.cwd(), "dist");

// Serve static files from dist directory
app.use(express.static('dist'));
app.use(express.static(distPath));

if (process.env.NODE_ENV !== "production" && !fs.existsSync(path.join(distPath, "index.html"))) {
  console.log("Starting Vite development server middleware");
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  console.log(`Serving static production build from ${distPath}`);
  // SPA fallback for client-side routing
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Teachers At Home Server running on http://0.0.0.0:${PORT}`);
});
