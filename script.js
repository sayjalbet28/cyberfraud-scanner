
const GEMINI_API_KEY = "";




const safeList = [
    "google.com", "youtube.com", "gmail.com", "wikipedia.org",
    "amazon.com", "amazon.in", "microsoft.com", "apple.com",
    "whatsapp.com", "instagram.com", "facebook.com",
    "netflix.com", "flipkart.com", "linkedin.com"
];


// AI CHECK (Gemini)
async function aiCheck(content) {
    try {
        let response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
You are a cyber fraud detection AI.
Return only a number between 0 and 10.

0-2 = Safe  
3-4 = Low risk  
5-6 = Suspicious  
7-10 = Fraud / Dangerous  

DO NOT return text, sentences or symbols.
Return ONLY a single number.

Analyze this: "${content}"
`
                        }]
                    }]
                })
            }
        );

        let data = await response.json();
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "5";
        let num = parseInt(text.match(/\d+/)?.[0] || "5");

        return num;

    } catch (error) {
        console.log("AI ERROR:", error);
        return 5;
    }
}



//  SHOW RESULT
function showResult(score, type) {
    let result = document.getElementById("result");
    let scoreText = document.getElementById("score");

    if (score >= 7) {
        result.innerHTML = `🚨 ${type} FRAUD DETECTED`;
        result.style.color = "red";
    } else if (score >= 4) {
        result.innerHTML = `⚠️ ${type} SUSPICIOUS`;
        result.style.color = "orange";
    } else {
        result.innerHTML = `✅ ${type} SAFE`;
        result.style.color = "lightgreen";
    }

    scoreText.innerHTML = "Risk Score: " + score;
}



// URL SCANNER
async function scanURL() {
    let url = document.getElementById("url").value.trim().toLowerCase();

    // LAYER 1: Known safe → ALWAYS SAFE
    if (safeList.some(domain => url.includes(domain))) {
        showResult(0, "URL");
        return;
    }

    // LAYER 2: AI check for unknown URLs
    let aiScore = await aiCheck("Check if this URL is fraud: " + url);
    showResult(aiScore, "URL");
}



// EMAIL SCANNER
async function scanEmail() {
    let sender = document.getElementById("sender").value.trim();
    let email = document.getElementById("email").value.trim();

    let combined = `Sender: ${sender}. Email: ${email}`;

    let aiScore = await aiCheck(combined);
    showResult(aiScore, "EMAIL");
}



// SMS SCANNER
async function scanSMS() {
    let sms = document.getElementById("sms").value.trim();

    let aiScore = await aiCheck("SMS message: " + sms);
    showResult(aiScore, "SMS");
}

