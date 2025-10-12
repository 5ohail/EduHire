from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from playwright.sync_api import sync_playwright
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request model ---
class Preferences(BaseModel):
    location: str
    type: str
    duration: str
    skills: list[str]
    sectors: list[str]

# --- Scraper helpers ---
def generate_internship(title: str, company: str, location: str):
    return {
        "title": title,
        "company": company,
        "location": location,
        "type": random.choice(["Online", "Offline", "Hybrid"]),
        "duration": random.choice(["Short-term", "Long-term"]),
        "skills": random.sample(
            ["Python","JavaScript","React","Node.js","C++","Java","TypeScript","SQL","NoSQL","ML","AI","AWS","Docker","Kubernetes"], 
            3
        ),
        "sectors": random.sample(
            ["Tech","Finance","Marketing","Design","Healthcare","Research","Energy","Government","Non-Profit","Telecom","Manufacturing"],
            2
        ),
        "status": "Recommended",
        "imageUrl": "https://placehold.co/400x200/555/fff?text=Internship",
        "seatsFilled": random.randint(0, 15),
        "seatsTotal": 20,
    }

def scrape_internshala():
    internships = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://internshala.com/internships")
        try:
            page.wait_for_selector("div.container > div.row > div.internship_meta", timeout=10000)
            posts = page.query_selector_all("div.container > div.row > div.internship_meta")
            for post in posts:
                title_el = post.query_selector(".profile")
                company_el = post.query_selector(".company_name")
                location_el = post.query_selector(".location_link")
                if title_el and company_el and location_el:
                    internships.append(generate_internship(
                        title_el.inner_text().strip(),
                        company_el.inner_text().strip(),
                        location_el.inner_text().strip()
                    ))
        except:
            pass
        browser.close()
    return internships

def scrape_linkedin():
    internships = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://www.linkedin.com/jobs/internship-jobs/")
        try:
            page.wait_for_selector("ul.jobs-search__results-list li", timeout=10000)
            posts = page.query_selector_all("ul.jobs-search__results-list li")
            for post in posts[:50]:
                title_el = post.query_selector("h3")
                company_el = post.query_selector("h4")
                location_el = post.query_selector(".job-search-card__location")
                if title_el and company_el and location_el:
                    internships.append(generate_internship(
                        title_el.inner_text().strip(),
                        company_el.inner_text().strip(),
                        location_el.inner_text().strip()
                    ))
        except:
            pass
        browser.close()
    return internships

# --- Filtering logic with fallback ---
def filter_internships(internships, prefs: Preferences):
    filtered = [
        i for i in internships
        if (prefs.location == "Anywhere" or prefs.location.lower() in i["location"].lower())
        and (prefs.type == "Any" or i["type"] == prefs.type)
        and (prefs.duration == "Any" or i["duration"] == prefs.duration)
        and (not prefs.skills or any(skill in i["skills"] for skill in prefs.skills))
        and (not prefs.sectors or any(sec in i["sectors"] for sec in prefs.sectors))
    ]
    # If nothing matches, fallback to relaxed filter (ignore skills/sectors)
    if not filtered:
        filtered = [
            i for i in internships
            if (prefs.location == "Anywhere" or prefs.location.lower() in i["location"].lower())
            and (prefs.type == "Any" or i["type"] == prefs.type)
            and (prefs.duration == "Any" or i["duration"] == prefs.duration)
        ]
    return filtered[:100]

@app.get("/")
def home(): 
    return {"status": "Scraper running"}

@app.post("/scrape_internships")
def scrape_all(prefs: Preferences):
    internshala_data = scrape_internshala()
    linkedin_data = scrape_linkedin()
    combined = internshala_data + linkedin_data
    filtered = filter_internships(combined, prefs)
    return {"internships": filtered}
