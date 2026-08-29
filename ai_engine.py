def evaluate_submission(domain: str, skills: list, projects: list):
    score = 40
    if skills: score += min(len(skills) * 10, 30)
    if projects: score += min(len(projects) * 15, 30)
    score = min(score, 100)
    
    level = 'Beginner'
    if score >= 75: level = 'Advanced'
    elif score >= 50: level = 'Intermediate'

    suggestions = [f"Complete {domain.upper()} NEP-2020 modules", "Update APAAR ID Portfolio"]
    
    return {
        "score": score,
        "level": level,
        "suggestions": suggestions
    }