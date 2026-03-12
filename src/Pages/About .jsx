import React, { useEffect, useRef, useState } from 'react';
import { 
  FaUtensils, 
  FaStar,
  FaHeart,
  FaAward,
  FaUsers,
  FaClock,
  FaQuoteRight,
  FaCheckCircle,
  FaLeaf,
  FaWineGlassAlt,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaChevronRight,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { GiChefToque, GiWineGlass, GiGrain, GiOlive } from 'react-icons/gi';
import { MdRestaurantMenu, MdVerified } from 'react-icons/md';

const About = () => {
  const [activeTab, setActiveTab] = useState('story');
  const [counts, setCounts] = useState({
    years: 0,
    dishes: 0,
    chefs: 0,
    awards: 0
  });
  
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Counter animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const targetCounts = {
        years: 15,
        dishes: 250,
        chefs: 25,
        awards: 18
      };

      const duration = 2000;
      const steps = 60;
      const increment = {
        years: targetCounts.years / steps,
        dishes: targetCounts.dishes / steps,
        chefs: targetCounts.chefs / steps,
        awards: targetCounts.awards / steps
      };

      let currentStep = 0;
      const timer = setInterval(() => {
        if (currentStep < steps) {
          setCounts({
            years: Math.min(Math.floor(increment.years * currentStep), targetCounts.years),
            dishes: Math.min(Math.floor(increment.dishes * currentStep), targetCounts.dishes),
            chefs: Math.min(Math.floor(increment.chefs * currentStep), targetCounts.chefs),
            awards: Math.min(Math.floor(increment.awards * currentStep), targetCounts.awards)
          });
          currentStep++;
        } else {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  // Timeline data
  const timeline = [
    {
      year: '2010',
      title: 'The Beginning',
      description: 'Golden Plate opened its doors with a vision to bring fine dining to the community',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      year: '2014',
      title: 'First Michelin Star',
      description: 'Awarded our first Michelin star for culinary excellence',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      year: '2018',
      title: 'Expansion',
      description: 'Opened our second location and introduced our signature tasting menu',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      year: '2023',
      title: 'Today',
      description: 'Recognized as one of the top restaurants in the city',
      image: 'https://images.unsplash.com/photo-1552566624-52f8b3add1be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Team members
  const team = [
    {
      name: 'Marco Rossi',
      role: 'Executive Chef',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'With over 20 years of experience, Marco brings passion and creativity to every dish.',
      social: { instagram: '#', twitter: '#', linkedin: '#' }
    },
    {
      name: 'Sophie Chen',
      role: 'Pastry Chef',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Sophie creates stunning desserts that are as beautiful as they are delicious.',
      social: { instagram: '#', twitter: '#', linkedin: '#' }
    },
    {
      name: 'James Wilson',
      role: 'Sous Chef',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'James ensures every plate meets our high standards of excellence.',
      social: { instagram: '#', twitter: '#', linkedin: '#' }
    },
    {
      name: 'Elena Rodriguez',
      role: 'Sommelier',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Elena curates our wine selection to perfectly complement our cuisine.',
      social: { instagram: '#', twitter: '#', linkedin: '#' }
    }
  ];

  // Values
  const values = [
    {
      icon: <GiOlive className="text-4xl" />,
      title: 'Quality Ingredients',
      description: 'We source only the finest ingredients from local farms and trusted suppliers.'
    },
    {
      icon: <GiChefToque className="text-4xl" />,
      title: 'Expert Craftsmanship',
      description: 'Our chefs combine traditional techniques with innovative approaches.'
    },
    {
      icon: <FaHeart className="text-4xl" />,
      title: 'Passion for Service',
      description: 'Every guest receives personalized attention and care.'
    },
    {
      icon: <FaLeaf className="text-4xl" />,
      title: 'Sustainability',
      description: 'We are committed to sustainable practices and reducing food waste.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <div className="inline-block bg-gold-500/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-gold-400">
              <span className="text-gold-400 font-semibold">Est. 2010</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our <span className="text-gold-400">Story</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              A journey of passion, creativity, and culinary excellence spanning over a decade
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-16 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-4 bg-white rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-20 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {['story', 'timeline', 'team', 'values'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize transition-all relative ${
                  activeTab === tab
                    ? 'text-gold-600'
                    : 'text-gray-600 hover:text-gold-500'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Content Based on Tab */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Story Tab */}
        {activeTab === 'story' && (
          <div className="animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-gold-500 font-semibold tracking-wider uppercase">
                  Our Philosophy
                </span>
                <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-6">
                  Where Culinary Art Meets <span className="text-gold-500">Passion</span>
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Golden Plate was born from a simple idea: to create unforgettable dining experiences 
                  that combine exceptional food, warm hospitality, and elegant ambiance.
                </p>
                <p className="text-gray-600 text-lg mb-8">
                  What started as a dream in 2010 has grown into one of the city's most beloved 
                  restaurants, earning recognition for our innovative cuisine and commitment to excellence.
                </p>
                
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-600">15+</div>
                    <div className="text-sm text-gray-500">Years of Excellence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-600">50k+</div>
                    <div className="text-sm text-gray-500">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-600">18</div>
                    <div className="text-sm text-gray-500">Awards Won</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Restaurant"
                    className="rounded-2xl shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Chef at work"
                    className="rounded-2xl shadow-lg mt-8"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gold-500 text-white p-6 rounded-2xl shadow-xl">
                  <GiChefToque className="text-4xl mb-2" />
                  <p className="font-bold">Michelin Star</p>
                  <p className="text-sm">2014 - Present</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Our <span className="text-gold-500">Journey</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From our humble beginnings to becoming a culinary destination
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gold-200 hidden md:block"></div>

              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                      <span className="text-gold-500 font-bold text-2xl">{item.year}</span>
                      <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10 w-12 h-12 bg-gold-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold my-4 md:my-0">
                    {index + 1}
                  </div>

                  {/* Image */}
                  <div className="md:w-1/2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded-2xl shadow-lg h-48 w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Meet Our <span className="text-gold-500">Culinary Team</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Passionate experts dedicated to creating exceptional dining experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                      <div className="flex gap-3">
                        <a href={member.social.instagram} className="text-white hover:text-gold-400">
                          <FaInstagram />
                        </a>
                        <a href={member.social.twitter} className="text-white hover:text-gold-400">
                          <FaTwitter />
                        </a>
                        <a href={member.social.linkedin} className="text-white hover:text-gold-400">
                          <FaLinkedin />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                    <p className="text-gold-500 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Values Tab */}
        {activeTab === 'values' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Our <span className="text-gold-500">Core Values</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="text-gold-500 mb-4 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div ref={sectionRef} className="bg-gradient-to-r from-gold-500 to-gold-600 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-black">
            <div>
              <div className="text-5xl font-bold mb-2">{counts.years}+</div>
              <div className="text-gold-200">Years of Excellence</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{counts.dishes}+</div>
              <div className="text-gold-200">Signature Dishes</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{counts.chefs}+</div>
              <div className="text-gold-200">Expert Chefs</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{counts.awards}+</div>
              <div className="text-gold-200">Awards Won</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our <span className="text-gold-500">Guests Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl relative">
                <FaQuoteRight className="absolute top-6 right-6 text-4xl text-gold-200" />
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://images.unsplash.com/photo-${i === 0 ? '1494790108777-223d679b22c7' : i === 1 ? '1507003211169-0a1dd7228f2d' : '1438761681033-6461ffad8d80'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80`}
                    alt="Guest"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {i === 0 ? 'Sarah Johnson' : i === 1 ? 'Michael Chen' : 'Emily Rodriguez'}
                    </h4>
                    <div className="flex text-gold-500">
                      {[...Array(5)].map((_, i) => <FaStar key={i} className="text-sm" />)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "An unforgettable dining experience! The attention to detail and flavor combinations are simply outstanding."
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Experience the <span className="text-gold-400">Golden Plate</span> Difference
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join us for an unforgettable culinary journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Make a Reservation
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default About;