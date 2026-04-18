const responses: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["hiv", "aids", "antiretroviral", "art", "pep", "prep"],
    reply:
      "HIV is a manageable condition with antiretroviral therapy (ART). If you suspect exposure, PEP must be taken within 72 hours. PrEP is available for ongoing prevention. I strongly recommend booking a confidential consultation with one of our doctors for testing and guidance.",
  },
  {
    keywords: ["sti", "std", "sexually transmitted", "chlamydia", "gonorrhea", "syphilis", "herpes"],
    reply:
      "STIs are common and most are treatable when caught early. Symptoms include unusual discharge, sores, burning during urination, or rashes. Regular testing is important if you are sexually active. Book an appointment with our doctors for confidential and judgment-free testing.",
  },
  {
    keywords: ["condom", "contraception", "contraceptive", "birth control", "pill", "family planning"],
    reply:
      "Contraception helps you plan your reproductive health. Options include condoms (also protect against STIs), oral contraceptive pills, implants, and injections. Our doctors can help you choose the best method for your lifestyle. Would you like to book a family planning consultation?",
  },
  {
    keywords: ["pregnancy", "pregnant", "prenatal", "trimester", "antenatal"],
    reply:
      "Prenatal care is essential for a healthy pregnancy. Regular checkups, proper nutrition, and avoiding alcohol and tobacco are key. If you think you may be pregnant or need prenatal support, our doctors are here to help you — book an appointment today.",
  },
  {
    keywords: ["mental health", "stress", "anxiety", "depression", "sad", "lonely", "overwhelmed", "worried"],
    reply:
      "Your mental health matters as much as your physical health. Feeling stressed, anxious, or depressed is common and there is no shame in seeking help. Our doctors offer confidential mental health support. Talking to someone is the first step — consider booking a consultation.",
  },
  {
    keywords: ["drug", "alcohol", "substance", "addiction", "smoking", "tobacco"],
    reply:
      "Substance use can significantly impact your health and wellbeing. Whether you are looking to quit or just want information, our doctors can provide non-judgmental support and connect you with resources. You are not alone in this journey.",
  },
  {
    keywords: ["nutrition", "diet", "eating", "food", "vitamins", "malnutrition"],
    reply:
      "Good nutrition is the foundation of good health. A balanced diet rich in vegetables, proteins, whole grains, and water supports your body and immune system. If you have concerns about your diet or weight, our doctors can provide personalized nutritional guidance.",
  },
  {
    keywords: ["exercise", "fitness", "workout", "physical activity", "gym"],
    reply:
      "Regular physical activity reduces the risk of many diseases and boosts mental wellbeing. Aim for at least 30 minutes of moderate activity most days. Even walking counts! If you want guidance tailored to your health condition, our doctors can help.",
  },
  {
    keywords: ["book", "appointment", "booking", "schedule", "consultation", "doctor", "how to"],
    reply:
      "Booking an appointment is easy and anonymous — no account required. Just visit the bookings section, choose a service and available doctor, pick a time slot, and provide basic contact info. Your privacy is fully protected.",
  },
  {
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "bonjour", "muraho"],
    reply:
      "Hello! I'm the GenCare Hub health assistant. I'm here to answer your health questions and help you access our services. Feel free to ask me anything about sexual health, mental health, family planning, or how to book an appointment.",
  },
];

export const getChatbotResponse = (message: string): string => {
  const lower = message.toLowerCase();
  for (const { keywords, reply } of responses) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return reply;
    }
  }
  return "Thank you for your question. For accurate and personalized health advice, I recommend consulting one of our doctors. You can book a free, anonymous appointment at any time. Is there a specific health topic you'd like to know more about?";
};
