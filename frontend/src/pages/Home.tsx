import { Link } from "react-router-dom";

const FeatureCard = ({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <Link
      to={link}
      className="group relative bg-gray-800 border border-gray-700 rounded-2xl p-6 transition hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition" />

      <h3 className="text-xl font-semibold text-white mb-2 relative z-10">
        {title}
      </h3>
      <p className="text-gray-400 relative z-10">{description}</p>
    </Link>
  );
};

const Home = () => {
  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          AI Career Toolkit
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Supercharge your job search with AI-powered tools that craft tailored
          cover letters, optimize resumes, and generate powerful interview
          responses.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          title="Resume Optimizer"
          description="Transform your resume into a results-driven, modern document optimized for recruiters and AI scanners."
          link="/resume-optimize"
        />
        <FeatureCard
          title="Tailored Cover Letters"
          description="Generate personalized cover letters instantly based on your resume and job description."
          link="/cover-letter"
        />
        <FeatureCard
          title="Interview Answer Helper"
          description="Craft strong, structured interview responses using proven frameworks like STAR."
          link="/interview-helper"
        />
      </div>
    </div>
  );
};

export default Home;
