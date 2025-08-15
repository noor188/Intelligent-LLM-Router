# LLM Router 

An intelligent LLM Router that automatically directs user prompts to the most cost-effective LLM based on task type and preference needs

## ✨ Features

- A routing function that classifies prompt types and sends them to the most cost effective LLM
- A web app that lets users test prompts and view model selection, latency, and cost per request

## 🛠️ Tech Stack

- React  
- Next.js  
- JavaScript  
- REST APIs  
- LLM (Large Language Models)

## System Design
<img src="https://github.com/noor188/LLM-Router/blob/main/img/System_Design.png">

## 🔐 Environment Variables

Create a `.env` file in the `LLM-Router` directory with the following values:

```env
OPENAI_API_KEY=your_openai_api_key_here
```
## 📦 Installation

Follow these steps to install and run the project locally:

1. Clone the repository:
   
```
git clone https://github.com/noor188/LLM-Router.git
cd LLM-Router
```

2. Install dependencies:
```
npm install
# or
yarn install
```

3. Add environment variables:

Create a .env file in the root directory and copy the environment variable keys from above.

4. Run the development server:

```
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Visit your app:

Open your browser and go to http://localhost:3000

## Demo
<a href="https://youtu.be/4MoRUPKu5jM?si=vQCF0fWWQEO1GOOG"> Youtube Video</a>

## 🧠 Future Improvements
- Add customizable routing rules so users can prioritize cost, latency, or quality depending on their needs
- Run routing function through an evaluation set and optimize performance


