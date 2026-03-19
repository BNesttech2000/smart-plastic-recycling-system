import React from 'react';
import { FaRecycle, FaLeaf, FaUsers, FaChartLine, FaHandsHelping, FaGlobeAfrica } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { label: 'Active Users', value: '1,000+', icon: FaUsers },
    { label: 'Plastic Recycled', value: '10,000+ kg', icon: FaRecycle },
    { label: 'CO2 Saved', value: '15,000+ kg', icon: FaLeaf },
    { label: 'Communities', value: '25+', icon: FaGlobeAfrica },
  ];

  const team = [
    {
      name: 'Limpo Gift Lubinda',
      role: 'Project Lead & Developer',
      bio: 'Computer Science student passionate about environmental technology and sustainable solutions.',
      image: '/team/limpo.jpg',
    },
    {
      name: 'Dr. Sarah Mwamba',
      role: 'Environmental Advisor',
      bio: 'Environmental scientist with expertise in waste management and recycling technologies.',
      image: '/team/sarah.jpg',
    },
    {
      name: 'John Banda',
      role: 'Community Manager',
      bio: 'Experienced in community engagement and environmental awareness programs.',
      image: '/team/john.jpg',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About SmartRecycle</h1>
            <p className="text-xl text-primary-100 mb-8">
              We're on a mission to transform plastic waste management in Zambia through technology and community engagement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-primary-600 text-3xl" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-800 mb-6"
            >
              Our Mission
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-gray-600 mb-8"
            >
              To create a sustainable future by incentivizing plastic recycling through innovative technology, 
              making it easy and rewarding for every Zambian to participate in environmental conservation.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card text-center"
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Environmental Impact</h3>
              <p className="text-gray-600">
                Reduce plastic pollution and promote sustainable waste management practices.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Engagement</h3>
              <p className="text-gray-600">
                Build a community of environmentally conscious citizens working together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card text-center"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandsHelping className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Economic Empowerment</h3>
              <p className="text-gray-600">
                Create economic opportunities through recycling incentives and rewards.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Recycling"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                SmartRecycle was born from a simple observation: despite the growing plastic waste problem in Zambia, 
                there was no effective system to encourage and reward proper recycling behavior.
              </p>
              <p className="text-gray-600 mb-4">
                As a student at Cavendish University, Limpo Gift Lubinda saw an opportunity to combine technology 
                with environmental conservation. The result is a platform that makes recycling not just easy, but rewarding.
              </p>
              <p className="text-gray-600">
                Today, SmartRecycle is helping communities across Zambia turn plastic waste into valuable resources, 
                one contribution at a time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            Meet Our Team
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="card text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join our community of recyclers and start earning rewards for your contributions.
            </p>
            <a
              href="/register"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;