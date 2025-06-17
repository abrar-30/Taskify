import React from 'react';
import { Smartphone, Zap, Shield, Globe, Palette, Code } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Responsive Design',
      description: 'Beautiful interfaces that work perfectly on all devices, from mobile to desktop.',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Optimized performance with modern build tools and best practices.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Reliable',
      description: 'Built with security in mind, ensuring your data and users are protected.',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Ready',
      description: 'Internationalization support and CDN delivery for worldwide accessibility.',
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: 'Customizable',
      description: 'Flexible theming system that adapts to your brand and design requirements.',
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'Developer Friendly',
      description: 'Clean code architecture with comprehensive documentation and examples.',
    },
  ];

  return (
    <section id="features" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to build modern, scalable applications with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-8 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;