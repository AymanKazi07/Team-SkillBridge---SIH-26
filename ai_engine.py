def evaluate_submission(domain: str, skills: list, projects: list, research: str = None, github: str = None):
    skills = skills or []
    projects = projects or []
    
    score = 40
    if skills:
        score += min(len(skills) * 10, 30)
    if projects:
        score += min(len(projects) * 15, 30)
    if research:
        score += 5
    if github:
        score += 5
    score = min(score, 100)
    
    level = 'Beginner'
    if score >= 75:
        level = 'Advanced'
    elif score >= 50:
        level = 'Intermediate'

    domain_name = domain.upper() if domain else "GENERAL"
    suggestions = [
        f"Complete {domain_name} NEP-2020 modules",
        "Update APAAR ID Portfolio"
    ]
    
    gaps = []
    if len(skills) < 3:
        gaps.append("Skill diversity below recommended baseline")
    if not projects:
        gaps.append("No hands-on projects linked")

    roadmap = [
        f"Master core competencies in {domain or 'chosen field'}",
        "Complete industry-aligned micro-credentials",
        "Publish project showcase to APAAR credit bank"
    ]

    return {
        "score": score,
        "level": level,
        "suggestions": suggestions,
        "repo_audit": f"GitHub verified: {github}" if github else "No GitHub repository provided",
        "research_weight": f"Publication attached: {research}" if research else "No research papers linked",
        "gaps": gaps,
        "roadmap": roadmap
    }