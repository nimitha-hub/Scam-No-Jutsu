# Scam No Jutsu (സ്കാം നോ ജുത്സു) 🦊⚡

## Problem Statement
Digital scams—ranging from fake "Remote Data Entry" jobs to "Crypto Honeypots"—are evolving faster than most users can keep up with. In regions like Kerala, students and non-tech-savvy individuals are frequently targeted by localized fraud. The primary problems are:
1. **Language Barrier:** Technical scam warnings are often in English, making them hard to grasp for local users.
2. **Complexity:** Scams are designed to look legitimate, and users lack a quick way to "Vibe Check" a suspicious message.
3. **Lack of Visualization:** People often don't understand *how* a scam works (the workflow), leading them to fall for the same patterns repeatedly.

## Project Description
**Scam No Jutsu** is an AI-powered "Ninja" scam detector. It uses the power of Google Gemini to strip away the "Gen-Jutsu" (illusions) of scammers. 

**As our Free API expired, Image generation is not possible right now. It will be patched in future updation**

**Key Features:**
- **The Scroll of Truth:** Paste any suspicious text, link, or job offer. The AI provides a **Trust Meter**, a direct analysis in English (**The Tea**), and a simplified "Bro-to-Bro" explanation in **Malayalam**.
- **Scam Diagrams:** Visualizes complex scam workflows (like "Money Mules" or "Rug Pulls") using AI-generated diagrams to help users understand the trap.
- **Ninja Avatar:** Uses AI image generation to create a custom Naruto-themed avatar for every user, making the security tool feel like a game rather than a chore.
- **Local Knowledge Base:** Specifically tuned to detect scams common in Kerala (e.g., fake KSEB bill alerts, Telegram job scams).

## Google AI Usage
### Tools / Models Used
- **`gemini-3-flash-preview`**: Used for ultra-fast, real-time scam analysis and streaming text responses.
- **`gemini-2.5-flash-image`**: Used for generating high-quality, themed user avatars.
- **`gemini-3-flash-preview` (Mermaid Logic)**: Used to generate structured Mermaid.js code for scam visualizations.

### How Google AI Was Used
AI is the core engine of Scam No Jutsu. 
1. **Structured Analysis:** We use Gemini's `responseMimeType: "application/json"` to ensure the scam analysis is perfectly structured into scores, Malayalam explanations, and red flags.
2. **Contextual Awareness:** The AI is provided with a specialized "Knowledge Base" of local Kerala scams, allowing it to identify regional patterns that generic models might miss.
3. **Generative Visuals:** Instead of static icons, we use Gemini to generate unique Ninja avatars and dynamic logic diagrams that explain the "how-to" of a scam.

### Proof of Google AI Usage
Attach screenshots in a `/proof` folder:
- [AI Proof - Gemini API Integration](https://drive.google.com/file/d/124lIGKrGBElhZRa_b9G3cCQx0qgKvdBa/view?usp=drive_link)

## Screenshots
Add project screenshots:
- [Screenshot1 - Main Dashboard](https://drive.google.com/file/d/1ZJ002OU-R1STVi7XNEoC25xEp4aLjrIW/view?usp=drive_link)
- [Screenshot 2 - Safe Link](https://drive.google.com/file/d/1TKbB2PBZZz-bo6W-Yd6ZyiRFGNQEe0us/view?usp=sharing)
- [Screenshot 3 - Malicious Link](https://drive.google.com/file/d/1jedDQrL8iZd7Du8K-0YEROF78bC-bKv3/view?usp=sharing)
- [Screenshot 4 - Resources](https://drive.google.com/file/d/19DG8dwOAAf59QRkn2UANdhnHkKC9kZIV/view?usp=sharing)

## Demo Video
Upload your demo video to Google Drive and paste the shareable link here (max 3 minutes). [Watch Demo](https://drive.google.com/file/d/1Mt2HK89JjrSqBamp5vUMyV_Rab-4c144/view?usp=drive_link)

## Installation Steps
```bash
# Clone the repository
git clone https://github.com/nimitha-hub/Build-with-a

# Go to project folder
cd project

# Install dependencies
npm install

# Run the project
npm start
```
