import { BookOpen, Users, Award, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    name: "AI-Powered Writing Tools",
    description: "Write faster and better with our intelligent editor that provides real-time suggestions, grammar checking, and style improvements.",
    icon: BookOpen,
    link: "/editor/books",
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-600",
  },
  {
    name: "Expert Professional Network",
    description: "Connect with vetted editors, designers, marketers, and publishing experts who understand your vision and genre.",
    icon: Users,
    link: "/professional-network/find",
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-600",
  },
  {
    name: "Quality Assurance",
    description: "Every project is backed by our satisfaction guarantee and quality control process to ensure exceptional results.",
    icon: Award,
    link: "/publishing-support",
    color: "from-amber-500/20 to-amber-600/20",
    iconColor: "text-amber-600",
  },
  {
    name: "Lightning Fast Publishing",
    description: "Streamlined workflows and automated processes get your book from manuscript to market in record time.",
    icon: Zap,
    link: "/publishing-support",
    color: "from-green-500/20 to-green-600/20",
    iconColor: "text-green-600",
  },
  {
    name: "Secure & Private",
    description: "Your intellectual property is protected with enterprise-grade security and privacy controls.",
    icon: Shield,
    link: "/publishing-support",
    color: "from-red-500/20 to-red-600/20",
    iconColor: "text-red-600",
  },
  {
    name: "Global Distribution",
    description: "Reach readers worldwide through our partnerships with major bookstores and digital platforms.",
    icon: Globe,
    link: "/publishing-support",
    color: "from-indigo-500/20 to-indigo-600/20",
    iconColor: "text-indigo-600",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            🚀 Everything you need to succeed
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Modern Authors</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From initial draft to bestseller status, our comprehensive platform provides everything you need to bring your story to life.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className={`group relative bg-card border border-border rounded-2xl p-8 shadow-soft hover:shadow-large transition-all duration-300 hover:-translate-y-2 animate-scale-in`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-background to-secondary rounded-xl shadow-medium mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                </div>
                
                <h3 className="text-xl font-bold font-serif text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.name}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                <Link 
                  to={feature.link}
                  className="inline-flex items-center text-primary font-medium hover:text-accent transition-colors duration-200 group-hover:translate-x-1"
                >
                  Learn more →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up animate-slide-up-delay-2">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-border rounded-3xl p-12 backdrop-blur-sm">
            <h3 className="text-3xl font-bold font-serif text-foreground mb-4">
              Ready to Start Your Publishing Journey?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful authors who have transformed their manuscripts into published books.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-large hover:shadow-xl transition-all duration-300"
              >
                <Link to="/editor/books">
                  Get Started Free
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-border hover:bg-secondary shadow-medium hover:shadow-large transition-all duration-300"
              >
                <Link to="/professional-network/find">
                  Browse Professionals
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};