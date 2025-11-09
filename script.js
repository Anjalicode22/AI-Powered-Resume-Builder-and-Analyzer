// =========================
// Resume Builder + Analyser
// =========================

// Highlight and select a resume template
function selectTemplate(template) {
  localStorage.setItem("selectedTemplate", template);

  // Highlight selected visually
  const templates = document.querySelectorAll(".template-option");
  templates.forEach((t) => t.classList.remove("selected"));
  const chosen = document.getElementById("template-" + template);
  if (chosen) chosen.classList.add("selected");

  // Update hidden input
  const hiddenTemplate = document.getElementById("template");
  if (hiddenTemplate) hiddenTemplate.value = template;
}

// Save form data and redirect to resume page
function saveAndRedirect() {
  const formData = {
    name: document.getElementById("name")?.value || "",
    email: document.getElementById("email")?.value || "",
    summary: document.getElementById("summary")?.value || "",
    skills: document.getElementById("skills")?.value || "",
    experience: document.getElementById("experience")?.value || "",
    template: document.getElementById("template")?.value || localStorage.getItem("selectedTemplate") || "classic",
  };

  localStorage.setItem("resumeData", JSON.stringify(formData));
  window.location.href = "resume.html";
}

// Generate preview (optional future use)
function generateResume(data, selectedTemplate) {
  let layout = templates[selectedTemplate];
  for (let key in data) {
    layout = layout.replaceAll(`{{${key}}}`, data[key]);
  }
  const preview = document.getElementById("resumePreview");
  if (preview) preview.innerHTML = layout;
}

// Prefill form fields if localStorage data exists
function populateFormIfPresent() {
  const data = JSON.parse(localStorage.getItem("resumeData") || "{}");
  if (!data) return;

  if (document.getElementById("name")) document.getElementById("name").value = data.name || "";
  if (document.getElementById("email")) document.getElementById("email").value = data.email || "";
  if (document.getElementById("summary")) document.getElementById("summary").value = data.summary || "";
  if (document.getElementById("skills")) document.getElementById("skills").value = data.skills || "";
  if (document.getElementById("experience")) document.getElementById("experience").value = data.experience || "";

  if (data.template) {
    selectTemplate(data.template);
  }
}

// Load resume data in resume.html
function loadResume() {
  const data = JSON.parse(localStorage.getItem("resumeData") || "{}");
  const outputDiv = document.getElementById("resume-output");
  if (!data || !outputDiv) return;

  const resumeHTML = `
    <h1>${escapeHTML(data.name || "")}</h1>
    <p><strong>Email:</strong> ${escapeHTML(data.email || "")}</p>
    <h2>Summary</h2>
    <p>${escapeHTML(data.summary || "")}</p>
    <h2>Skills</h2>
    <ul>${(data.skills || "")
      .split(",")
      .map((s) => `<li>${escapeHTML(s.trim())}</li>`)
      .join("")}</ul>
    <h2>Experience</h2>
    <p>${escapeHTML(data.experience || "")}</p>
  `;

  outputDiv.innerHTML = resumeHTML;
  outputDiv.className = data.template || "classic";
}

// Download resume as PDF
function downloadPDF() {
  window.print();
}

// Escape HTML for security
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// =========================
// Resume Analyser
// =========================

// Load resume data for analysis
function loadResumeForAnalysis() {
  const data = JSON.parse(localStorage.getItem("resumeData") || "{}");
  if (data && (data.summary || data.skills || data.experience)) {
    const text = `${data.name}\n${data.email}\n${data.summary}\n${data.skills}\n${data.experience}`;
    analyseResume(text);
  }
}

// Analyse resume content
function analyseResume(passedText) {
  const textarea = document.getElementById("resumeText");
  const text = passedText || textarea?.value || "";
  const reportDiv = document.getElementById("analysisResult"); // ✅ Corrected ID
  if (!reportDiv) return;

  let score = 0;
  const feedback = [];

  // Length check
  if (text.length < 100) {
    feedback.push("❌ Resume seems too short. Add more details.");
  } else {
    score += 20;
    feedback.push("✅ Good content length.");
  }

  // Email
  if (/@/.test(text)) {
    score += 20;
    feedback.push("✅ Contains an email address.");
  } else {
    feedback.push("❌ Missing email address.");
  }

  // Sections
  if (/experience/i.test(text)) {
    score += 15;
    feedback.push("✅ Mentions experience.");
  } else {
    feedback.push("❌ No 'Experience' section found.");
  }

  if (/skills?/i.test(text)) {
    score += 15;
    feedback.push("✅ Skills section found.");
  } else {
    feedback.push("❌ No skills section found.");
  }

  // Quantitative results
  if (/\d+%|\d+\syears?|\d+\sprojects?/.test(text)) {
    score += 20;
    feedback.push("✅ Contains measurable results.");
  } else {
    feedback.push("❌ Add numbers or achievements for stronger impact.");
  }

  // Action verbs
  if (/\b(designed|developed|led|created|implemented|managed)\b/i.test(text)) {
    score += 10;
    feedback.push("✅ Contains strong action verbs.");
  } else {
    feedback.push("❌ Add verbs like 'Led', 'Created', 'Implemented'.");
  }

  reportDiv.innerHTML = `
    <h3>Resume Score: ${score}/100</h3>
    <ul>${feedback.map((f) => `<li>${f}</li>`).join("")}</ul>
  `;

  // Progress bar
  const bar = document.createElement("div");
  bar.style.height = "20px";
  bar.style.width = "100%";
  bar.style.background = "#eee";
  bar.style.marginTop = "10px";

  const fill = document.createElement("div");
  fill.style.height = "100%";
  fill.style.width = score + "%";
  fill.style.background = score >= 70 ? "green" : "orange";

  bar.appendChild(fill);
  reportDiv.appendChild(bar);
}

// =========================
// Auto-run
// =========================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("resume-output")) loadResume();
  if (document.getElementById("analysisResult")) {
    const btn = document.getElementById("analyse-my-resume");
    if (btn) btn.addEventListener("click", loadResumeForAnalysis);
  }
  if (document.getElementById("name")) populateFormIfPresent();
});
