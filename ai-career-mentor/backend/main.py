from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json

app = FastAPI(title="AI Career Mentor API", description="Backend for the Autonomous Career Mentor system")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Models ===
class Task(BaseModel):
    id: int
    title: str
    description: str
    time: str
    status: str # "pending", "active", "completed"

class ProfileIntelRequest(BaseModel):
    profile_url: str
    platform: str # "github", "linkedin"

class MockInterviewRequest(BaseModel):
    question: str
    user_answer: str

# === Agent 1: Resume Analyzer Endpoint ===
@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    """
    Extracts skills, projects, and weak areas from uploaded PDF.
    This will use GenAI to parse and evaluate.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported.")
    
    # Placeholder for actual parsing and LLM logic
    return {
        "status": "success",
        "feedback": "You lack backend experience for target roles.",
        "skills_found": ["Python", "HTML", "CSS", "JS"],
        "weak_areas": ["System Design", "Cloud/AWS", "Databases"]
    }

# === Agent 2: Skill Gap Analyzer ===
@app.get("/api/skill-gaps")
async def get_skill_gaps(target_role: str = "Senior Backend Engineer"):
    """
    Compares user's skills vs market for a role and outputs missing skills prioritized.
    """
    # Placeholder response
    return {
        "target_role": target_role,
        "current_score": 70,
        "radar_data": {
            "labels": ['Backend (Python)', 'Frontend', 'System Design', 'ML/AI', 'Cloud/DevOps', 'Data Structs'],
            "user_data": [85, 40, 30, 60, 45, 75],
            "target_data": [90, 30, 85, 40, 75, 80]
        },
        "critical_gaps": [
            {"skill": "System Design", "priority": "High"},
            {"skill": "Cloud Architecture", "priority": "High"}
        ]
    }

# === Agent 3: Market Intelligence ===
@app.get("/api/market-trends")
async def market_trends():
    """
    Tracks job roles and trending tech.
    """
    return {
        "trends": [
            {"tech": "FastAPI", "growth": "32%", "status": "positive"},
            {"tech": "GenAI / LLMs", "growth": "Hot", "status": "massive"},
            {"tech": "Cloud Architecture", "growth": "15%", "status": "positive"}
        ],
        "insight": "GenAI integrated with Cloud solutions is currently the most requested combination."
    }

# === Agent 4: Daily Planner ===
@app.get("/api/daily-plan")
async def get_daily_plan():
    """
    Generates a daily schedule based on weak areas and tracks completion.
    """
    return {
        "date": "2026-03-31",
        "overall_progress": "Ongoing",
        "tasks": [
            {"id": 1, "time": "09:00 AM", "title": "DSA Practice: Dynamic Programming", "description": "Solved 3 Medium Grinds", "status": "completed"},
            {"id": 2, "time": "02:00 PM", "title": "Build API Project", "description": "Implement JWT Auth in FastAPI", "status": "active"},
            {"id": 3, "time": "08:00 PM", "title": "System Design Mock Interview", "description": "Design Uber (Focus: Scalability)", "status": "pending"}
        ]
    }

@app.post("/api/daily-plan/update-task")
async def update_task_status(task_id: int, status: str):
    """Update a planner task (completed, active, etc.)"""
    return {"message": f"Task {task_id} updated to {status}"}


# === Agent 5: Mock Interview ===
@app.post("/api/mock-interview/evaluate")
async def evaluate_interview(data: MockInterviewRequest):
    """
    Takes a question and user answer and analyzes confidence/correctness via LLM.
    """
    # Placeholder LLM evaluation logic
    return {
        "score": 7.5,
        "verdict": "Solid Performance",
        "strengths": "Great confidence. Basic concepts are clear.",
        "weaknesses": "Struggled with the specific internal optimizations.",
        "action_plan": "Adding a 15 min review session to tomorrow's planner."
    }

# === Agent 6: Profile Intelligence (Competitor Analysis) ===
@app.post("/api/profile-intelligence")
async def analyze_profile(data: ProfileIntelRequest):
    """
    Analyzes another person's profile to suggest project ideas for user.
    """
    # Placeholder for scraping and LLM insight generation
    return {
        "target_profile": data.platform,
        "their_strength": "Strong in ML + Backend",
        "suggestion_for_you": "Build an AI-powered API system combining ML + FastAPI to close this gap."
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
