import sys, json, spacy, os

# Ensure uploads1 folder exists
os.makedirs("uploads1", exist_ok=True)

nlp = spacy.load("en_core_web_sm")
text = sys.stdin.read()

doc = nlp(text)
skills = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT", "SKILL"]]

result = {
    "summary": f"AI analyzed your resume with {len(doc)} words.",
    "skills_detected": skills[:8],
    "suggestion": "Consider adding measurable achievements for better impact."
}

print(json.dumps(result))
