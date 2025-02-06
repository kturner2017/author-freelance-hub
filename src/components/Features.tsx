import { BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    name: "Professional Writing Tools",
    description: "Write and format your book with our intuitive editor designed specifically for authors.",
    icon: BookOpen,
    link: "/editor/books",
  },
  {
    name: "Expert Freelancers",
    description: "Connect with vetted editors, designers, and marketers to polish your book.",
    icon: Users,
    link: "/professional-network/find",
  },
  {
    name: "Quality Guaranteed",
    description: "Work with the best professionals in the industry, backed by our satisfaction guarantee.",
    icon: Award,
    link: "/publishing-support",
  },
];

export const Features = () => {
  return (
    <div className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center -mt-12">
          <h2 className="text-3xl font-bold text-primary">Everything You Need to Publish</h2>
          <p className="mt-4 text-xl text-gray-500">
            From writing to publishing, we've got you covered.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link 
                to={feature.link} 
                key={feature.name}
                className="pt-6 transition-transform hover:scale-105"
              >
                <div className="flow-root bg-secondary rounded-lg px-6 pb-8 h-full cursor-pointer">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-primary tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};