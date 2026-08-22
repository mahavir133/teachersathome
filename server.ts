import { GoogleGenAI } from "@google/genai";
import { Tutor } from "./src/types.js";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

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

import { getDb, writeDb } from "./db.js";

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", appName: "Teachers At Home" });
});

app.get("/api/tutors", async (_req, res) => {
  try {
    const db = await getDb();
    res.json(db.tutors);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tutors" });
  }
});

app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { prompt, studentClass, board, subjects, location } = req.body;
    const db = await getDb();

    // Query active tutors database to see if we can find relevant matches to suggest to Gemini
    const queryLower = (prompt || "").toLowerCase();
    const matches = db.tutors.filter(tutor => {
      const matchSubject = tutor.subjects.some(s => queryLower.includes(s.toLowerCase()));
      const matchCity = tutor.cities.some(c => queryLower.includes(c.toLowerCase()));
      const matchBoard = tutor.boards.some(b => queryLower.includes(b.toLowerCase()));
      const matchClass = tutor.classesHandled?.some(c => queryLower.includes(c.toLowerCase()));
      return matchSubject || matchCity || matchBoard || matchClass;
    });

    // Take top 3 matching tutors or fallback to any 3 verified tutors
    const featuredTutors = (matches.length > 0 ? matches : db.tutors).slice(0, 3);
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
    const db = await getDb();
    const reqData = { ...req.body, id: "REQ-" + Math.floor(100000 + Math.random() * 900000), createdAt: new Date().toISOString() };
    db.parentRequests.unshift(reqData);
    await writeDb(db);
    res.json({ success: true, message: "Free demo request submitted successfully! Our Academic Counselor will contact you within 2 hours.", data: reqData });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit demo request" });
  }
});

app.post("/api/tutor-apply", async (req, res) => {
  try {
    const db = await getDb();
    const appData = { ...req.body, id: "TUTOR-" + Math.floor(100000 + Math.random() * 900000), createdAt: new Date().toISOString() };
    db.tutorApplications.unshift(appData);
    await writeDb(db);
    res.json({ success: true, message: "Tutor application submitted! Our team will review your qualifications and contact you for verification.", data: appData });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit tutor application" });
  }
});

app.post("/api/tutor-approve", async (req, res) => {
  try {
    const { id } = req.body;
    const db = await getDb();
    const index = db.tutorApplications.findIndex(app => app.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Application not found" });
    }

    const appData = db.tutorApplications[index];
    
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
    db.tutors.unshift(newTutor);
    db.tutorApplications.splice(index, 1);
    
    await writeDb(db);
    res.json({ success: true, tutor: newTutor });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve tutor" });
  }
});

app.get("/api/requests", async (_req, res) => {
  try {
    const db = await getDb();
    res.json({ parentRequests: db.parentRequests, tutorApplications: db.tutorApplications });
  } catch (error) {
    res.status(500).json({ error: "Failed to load requests" });
  }
});

// Vite middleware setup
async function startServer() {
  const PORT = 3000;
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Teachers At Home Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
