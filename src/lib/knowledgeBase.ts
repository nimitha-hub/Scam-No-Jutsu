/**
 * Knowledge Base of common phishing scams targeting residents of Kerala, India.
 */

export const KERALA_SCAM_KNOWLEDGE_BASE = {
  categories: [
    {
      name: "Digital Arrest Scams",
      description: "Fraudsters pose as officials from CBI, NCB, or Police via video calls. They claim your ID was used for illegal activities (like drugs or money laundering) and threaten 'Digital Arrest' unless money is paid.",
      redFlags: ["Video calls from unofficial numbers", "Pressure to stay on call", "Demands for immediate bank transfers", "Fake ID cards shown on camera"],
      chakraElement: "⚡",
      chakraLabel: "Chakra of Dangerous Speed"
    },
    {
      name: "KSEB Bill Payment Fraud",
      description: "SMS messages claiming your electricity will be disconnected by 9:30 PM or 10:30 PM due to non-payment of previous month's bill.",
      redFlags: ["Sent from personal mobile numbers", "Urgent disconnection threat", "Request to call a specific mobile number", "Links to unofficial payment apps"],
      chakraElement: "⚡",
      chakraLabel: "Chakra of Dangerous Speed"
    },
    {
      name: "Banking & KYC Scams",
      description: "Phishing messages targeting customers of SBI, Federal Bank, South Indian Bank, etc., claiming account suspension or PAN card update requirements.",
      redFlags: ["Links like bit.ly or tinyurl", "Grammatical errors in Malayalam/English", "Requests for OTP or MPIN", "Sender ID looks like a personal number"],
      chakraElement: "🪨",
      chakraLabel: "Chakra of the Trap"
    },
    {
      name: "MVD / Traffic E-Challan",
      description: "Fake messages claiming you have a pending traffic fine from the Motor Vehicles Department (MVD) Kerala.",
      redFlags: ["Links that don't end in .gov.in", "Urgency to pay to avoid court", "Messages from unknown mobile numbers"],
      chakraElement: "⚡",
      chakraLabel: "Chakra of Dangerous Speed"
    },
    {
      name: "E-commerce & Lucky Draw",
      description: "Messages claiming you won a prize from Amazon, Flipkart, or Meesho, or that your 'order' is stuck in customs.",
      redFlags: ["Requests for 'processing fee'", "Links to spin-the-wheel sites", "Unsolicited winning notifications"],
      chakraElement: "💧",
      chakraLabel: "Chakra of Data Harvest"
    },
    {
      name: "Akshaya / Government Services",
      description: "Fake Akshaya center portals or agents promising fast-tracking of certificates or benefits for a fee.",
      redFlags: ["Unofficial domain names", "Payment via personal UPI IDs", "Requests for Aadhaar OTP"],
      chakraElement: "🪨",
      chakraLabel: "Chakra of the Trap"
    },
    {
      name: "Job & Visa Scams",
      description: "Promises of high-paying jobs in Gulf countries or Europe. Fraudsters ask for 'visa processing fees' or 'security deposits'.",
      redFlags: ["Unsolicited job offers via WhatsApp", "Demands for money before interview", "Unofficial email addresses (Gmail/Yahoo)"],
      chakraElement: "💨",
      chakraLabel: "Chakra of Empty Promises"
    },
    {
      name: "Scholarship & Internship Fraud",
      description: "Fake 'International Scholarships' or 'Remote Internships' that ask for an 'Application Fee', 'Registration Fee', or 'Laptop Security Deposit'.",
      redFlags: ["Paying money to receive a scholarship", "Requests for security deposits for equipment", "Interviews conducted solely on Telegram/WhatsApp"],
      chakraElement: "💨",
      chakraLabel: "Chakra of Empty Promises"
    },
    {
      name: "Gaming & Robux Scams",
      description: "Websites or Discord bots promising 'Free Robux', 'V-Bucks', or 'In-Game Currency' in exchange for taking surveys or providing login credentials.",
      redFlags: ["Requests for game passwords or Discord tokens", "Human Verification surveys that never end", "Promises of impossible amounts of currency"],
      chakraElement: "💧",
      chakraLabel: "Chakra of Data Harvest"
    },
    {
      name: "Crypto & Honeypot Scams",
      description: "Fake 'insider' tips on Telegram about new tokens. You can buy the token, but a 'Honeypot' contract prevents you from ever selling it.",
      redFlags: ["Tokens with 100% buy tax or sell restrictions", "Guaranteed 1000x returns in days", "Anonymous 'Devs' on Telegram/Discord"],
      chakraElement: "🔥",
      chakraLabel: "Chakra of Burning Loss"
    },
    {
      name: "Social Media Spy Apps",
      description: "Links claiming 'See who viewed your profile' or 'Who unfollowed me'. These are phishing portals designed to steal your Instagram/Snapchat login.",
      redFlags: ["Requiring login to a third-party site to see profile views", "Links sent via DM from 'friends' who were hacked", "Apps not available on official Play/App stores"],
      chakraElement: "🪨",
      chakraLabel: "Chakra of the Trap"
    },
    {
      name: "Money Mule / Data Entry",
      description: "Remote 'Data Entry' or 'Task' jobs where you are asked to move money through your account or pay for 'training materials'.",
      redFlags: ["Job involves receiving and transferring money", "High pay for very simple tasks", "Recruiter uses unofficial messaging apps"],
      chakraElement: "💨",
      chakraLabel: "Chakra of Empty Promises"
    },
    {
      name: "OLX / Marketplace QR Scams",
      description: "Fraudsters pose as buyers on OLX. They send a QR code claiming it's for 'receiving payment', but scanning it actually deducts money from your account.",
      redFlags: ["Buyer is in a hurry", "Requests to scan QR code to 'receive' money", "Refusal to meet in person"],
      chakraElement: "🪨",
      chakraLabel: "Chakra of the Trap"
    }
  ],
  emergencyContacts: [
    { name: "National Cyber Crime Helpline", number: "1930", type: "call" },
    { name: "Kerala Police Cyberdome", number: "0471-2305001", type: "call" },
    { name: "Cyber Crime SMS Alert", number: "112", type: "sms" }
  ],
  localContext: [
    "Kerala Police Cyberdome often issues alerts about these scams.",
    "Official KSEB communication always comes from 'KSEB-L' or similar verified IDs.",
    "Banks in India never ask for OTP or passwords over phone/SMS.",
    "Digital Arrest is not a legal procedure in India."
  ]
};
