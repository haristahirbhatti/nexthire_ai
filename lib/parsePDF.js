/**
 * parsePDF.js
 * Client-side helper that calls the /api/parse-cv route.
 * Sends the uploaded CV file and returns extracted text.
 */

/**
 * Upload a CV file to the server and return its extracted text.
 * @param {File} file - The CV file (PDF or plain text)
 * @returns {Promise<string>} - Extracted text content
 */
export async function parseCVFile(file) {
  const formData = new FormData();
  formData.append("cv", file);

  const response = await fetch("/api/parse-cv", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to parse CV.");
  }

  return data.text;
}

/**
 * Generate interview questions from CV text and job title.
 * @param {string} cvText - Raw text extracted from CV
 * @param {string} jobTitle - Target job title
 * @param {string} language - Interview language (default: English)
 * @returns {Promise<Array>} - Array of question objects
 */
export async function generateInterviewQuestions(cvText, jobTitle, language = "English") {
  const response = await fetch("/api/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cvText, jobTitle, language }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate questions.");
  }

  return data.questions;
}

/**
 * Evaluate a single candidate answer.
 * @param {object} params
 * @param {string} params.question - The interview question
 * @param {string} params.idealAnswer - The ideal answer outline
 * @param {string} params.candidateAnswer - The candidate's spoken/typed answer
 * @param {string} params.jobTitle - Target job title
 * @returns {Promise<object>} - { score, feedback, ideal, passed }
 */
export async function evaluateAnswer({ question, idealAnswer, candidateAnswer, jobTitle }) {
  const response = await fetch("/api/evaluate-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, idealAnswer, candidateAnswer, jobTitle }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to evaluate answer.");
  }

  return data;
}
