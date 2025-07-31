import React from "react";

export default function About() {
  return (
    <div
      className="pt-24 w-full min-h-screen relative flex flex-col items-center py-12"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Light overlay */}
      <div className="absolute inset-0 bg-white opacity-80"></div>

      <div className="relative z-10 max-w-7xl w-full px-6 space-y-20">
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-5xl sm:text-6xl text-yellow-800 font-extrabold mb-4 font-serif tracking-wider drop-shadow-lg animate-pulse">
            🌿 Welcome to Plantos
          </h1>
          <p className="text-yellow-700 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed mb-4">
            Your smart, eco-friendly plant companion
          </p>
        </section>

        {/* Feature Cards */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "🌐 Frontend",
              desc: "Built using React.js and Tailwind CSS for a fast, responsive UI.",
            },
            {
              title: "🧠 AI & CNN",
              desc: "Trained a CNN model using MobileNetV2 and PyTorch over 50,000+ plant images.",
            },
            {
              title: "🔒 Authentication",
              desc: "Secure login system using JWT-based authentication.",
            },
            {
              title: "🚀 AI Deployment",
              desc: "Model deployed via FastAPI (Python) to serve real-time predictions.",
            },
            {
              title: "☁️ Image Storage",
              desc: "Plant images uploaded via multer and stored securely on Cloudinary.",
            },
            {
              title: "📦 Backend",
              desc: "Built using Express.js and PostgreSQL for scalable data storage.",
            },
            {
              title: "🌤️ Dynamic Care",
              desc: "Used WeatherAPI + GenAI to generate adaptive 3-day care schedules per plant keeping weather in mind.",
            },
            {
              title: "📲 Reminders",
              desc: "Automated daily SMS reminders using Twilio and node-cron at 6:00 AM.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg p-6 hover:scale-[1.02] transition-transform duration-300"
            >
              <h2 className="text-yellow-800 text-xl font-bold mb-2">{card.title}</h2>
              <p className="text-yellow-700 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </section>

        {/* Developer Info */}
        <section className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-4xl font-bold text-yellow-800">About the Developer</h2>
          <p className="text-yellow-700">
            Hi, I’m <span className="font-bold">Yash Sinha</span>
          </p>
          <p className="text-yellow-600 text-sm">
            Email:{" "}
            <a
              className="underline hover:text-yellow-800"
              href="mailto:vyash382@gmail.com"
            >
              vyash382@gmail.com
            </a>
          </p>
          <p className="text-yellow-600 text-sm">
            GitHub:{" "}
            <a
              className="underline hover:text-yellow-800"
              href="https://github.com/vyash382"
              target="_blank"
              rel="noreferrer"
            >
              vyash382
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
