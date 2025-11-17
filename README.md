
# ✨ AuraCare Assistant

**Humanizing Healthcare Administration with the Power of Generative AI**

---

<p align="center">
  <a href="https://auracare-assistant-597762679776.us-west1.run.app/" target="_blank">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-Launch%20AuraCare-06b6d4?style=for-the-badge&logo=google-cloud" alt="Live Demo" />
  </a>
</p>

---

## 🚀 Elevator Pitch

**AuraCare Assistant** is an intelligent, AI-powered platform designed to revolutionize the patient experience. We tackle the administrative friction in healthcare—from tedious intake forms to the confusing process of finding the right specialist. Our application automates routine tasks, provides intelligent recommendations, and empowers patients to take control of their healthcare journey, allowing providers to focus on what truly matters: delivering care.

## 🎯 The Problem

The initial steps of seeking medical care are often fragmented, stressful, and inefficient. Patients struggle with:
- **Repetitive Paperwork**: Filling out the same information on endless forms.
- **Uncertainty**: Not knowing which medical specialty is appropriate for their symptoms.
- **Difficulty Finding Care**: The challenge of locating and choosing a suitable, highly-rated doctor nearby.
- **Lack of Engagement**: Static, impersonal digital health platforms that fail to provide real-time, valuable information.

This administrative burden creates a poor patient experience and consumes valuable time for both patients and healthcare providers.

## ✨ Key Features

AuraCare Assistant is packed with cutting-edge features powered by the **Google Gemini API**:

#### 1. **Multi-Modal AI Patient Intake**
- **📝 Smart Web Form**: A clean, intuitive digital form.
- **🗣️ Real-Time Voice Intake**: A fully conversational intake process using the **Gemini Live API**. Patients can simply talk to Aura, our AI assistant, which understands, transcribes, and fills out the intake form in real-time.
- **📸 AI Image Analysis**: Users can upload a medical image (e.g., a skin rash), and our multimodal AI provides a descriptive analysis to assist with symptom reporting.

#### 2. **Intelligent Symptom Analysis**
- Our AI analyzes the patient's reported symptoms and medical history to provide a **recommended medical specialty**, along with a detailed explanation for the suggestion.

#### 3. **Geolocation-Aware Doctor Discovery**
- Leveraging Gemini with **Google Maps Grounding**, the platform finds real, highly-rated specialists near the user's current location.
- It displays a curated list of doctors with their clinic name, address, rating, and bio, complete with data sources for transparency.

#### 4. **Dynamic Content Feeds with Google Search**
- **📰 Health & Wellness Blog**: A multi-language blog with articles on healthy living, nutrition, and sleep hygiene. Features a simulated comment section for user engagement.
- **🗓️ Latest Healthcare Events**: A real-time feed of upcoming medical conferences, fetched dynamically using Gemini with **Google Search Grounding**, ensuring the content is always current and relevant.

#### 5. **Comprehensive Patient Portal**
- **🗓️ Appointment Management**: A personal dashboard for patients to view their upcoming and past appointments.
- **💳 Simulated Payments**: An integrated payment modal to simulate settling dues for past appointments.

#### 6. **Superior UI/UX & Accessibility**
- **🎨 Dual-Theme Interface**: Seamlessly switch between a sleek dark mode and a clean, bright light mode.
- **🌐 Full Internationalization (i18n)**: Full support for **English, German, and Arabic**, including right-to-left (RTL) layout adjustments for Arabic.
- **💨 Polished Experience**: Enhanced with fluid page transitions, skeleton loading screens, and animated user feedback to create a premium, modern feel.

## 🛠️ Tech Stack & Architecture

AuraCare Assistant is a modern web application built with a focus on leveraging the full power of Google's Generative AI.

- **Frontend**: **React**, **TypeScript**, **Tailwind CSS**
- **Core AI Engine**: **Google Gemini API**
  - **`gemini-2.5-flash`**: Used for symptom analysis, doctor discovery, event fetching, and chatbot responses.
  - **`gemini-2.5-flash-native-audio-preview-09-2025`**: Powers the real-time, low-latency conversational voice intake via the **Live API**.
- **Key Gemini API Features Used**:
  - **Text & JSON Generation**: For structured data extraction (specialty, doctor lists, events).
  - **Real-time Audio Streaming (Live API)**: For the conversational voice assistant, including input/output audio transcription.
  - **Function Calling**: The voice assistant uses function calling to submit the completed intake form.
  - **Grounding with Google Tools**:
    - **Google Search**: To fetch real-time data on medical events.
    - **Google Maps**: To find real doctors and clinics based on geolocation.
  - **Multimodal Input**: To analyze user-uploaded images.
- **Deployment**: Deployed on **Google Cloud Run** for scalable, serverless hosting.

## 🔧 How It Works: A Patient's Journey

1.  **Landing**: The user arrives at the home page, which features dynamic content like the latest healthcare events.
2.  **Authentication**: The user logs in or registers.
3.  **Intake Method**: The user chooses their preferred intake method: filling the form, starting a voice conversation with Aura, or analyzing an image.
4.  **AI Analysis**: Based on the intake data, the AI recommends a medical specialty (e.g., "Cardiology").
5.  **Find a Doctor**: With the user's permission, the app uses their location to find and display a list of top-rated cardiologists nearby.
6.  **Confirmation**: The user selects a doctor, and a confirmation screen summarizes the (simulated) appointment details.
7.  **Patient Portal**: The new appointment appears in the user's "My Portal" dashboard.

## 🔮 Future Roadmap

- [ ] **Direct Appointment Booking**: Integrate with clinic APIs to book appointments directly.
- [ ] **Real Payment Integration**: Implement Stripe or another payment gateway.
- [ ] **Telehealth Integration**: Add video consultation capabilities.
- [ ] **Provider Dashboard**: Create a portal for doctors and clinics to manage patient intake and schedules.
- [ ] **Personalized Health Insights**: Leverage long-term patient data (with consent) to provide proactive health tips and reminders.
