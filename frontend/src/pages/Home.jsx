/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle, Star, Users, Zap, Shield } from "lucide-react"

const Home = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create and manage invoices in seconds with our intuitive interface.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security measures.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together with your team to manage customers and invoices.",
    },
  ]

  const benefits = [
    "Free 14-day trial",
    "No setup fees",
    "Cancel anytime",
    "Swedish & English support",
    "Automatic backups",
    "Mobile responsive",
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Modern Invoice Management Made Simple
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Create professional invoices, manage customers, and track payments with our easy-to-use platform. Start
                your free trial today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn btn-secondary text-primary">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/terms" className="btn btn-ghost border border-blue-300 hover:bg-blue-700">
                  View Terms
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Monthly Plan</span>
                    <span className="text-3xl font-bold">99 kr</span>
                  </div>
                  <div className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-300" />
                        <span className="text-blue-100">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-6">Why Choose 123Fakturera?</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              We've built the most intuitive invoice management system that grows with your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-6">Trusted by Businesses</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              See what our customers have to say about their experience with 123Fakturera.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Anna Svensson",
                company: "Design Studio AB",
                rating: 5,
                text: "Incredibly easy to use! I went from manual invoicing to automated billing in just one day.",
              },
              {
                name: "Erik Johansson",
                company: "Consulting Group",
                rating: 5,
                text: "The customer support is outstanding. They helped me migrate all my data seamlessly.",
              },
              {
                name: "Maria Lindberg",
                company: "Freelance Developer",
                rating: 5,
                text: "Perfect for small businesses. The pricing is fair and the features are exactly what I need.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-text">{testimonial.name}</p>
                  <p className="text-sm text-text-secondary">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using 123Fakturera to streamline their invoicing process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-secondary text-primary">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/pricelist" className="btn btn-ghost border border-blue-300 hover:bg-blue-700">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
