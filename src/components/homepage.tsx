"use client";

import {
  Bot,
  CheckCircle,
  Database,
  FileText,
  GitBranch,
  Lock,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Centralized Repository",
      description:
        "Store and manage all automation scripts, utilities, and code modules in one secure location",
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Version Control",
      description:
        "Track changes, manage releases, and maintain code history with enterprise-grade version control",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Assistant",
      description:
        "Natural language queries to find scripts, explain code, and get optimization suggestions",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Improved Security and Code Quality",
      description:
        "Built-in best practices and automated security scanning for all submissions",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="relative">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-lg">
          <div className="space-y-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                  currentFeature === index
                    ? "bg-blue-50 border-blue-200"
                    : "bg-slate-50 border-slate-200 hover:border-blue-200"
                }`}
                onClick={() => setCurrentFeature(index)}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      currentFeature === index
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
