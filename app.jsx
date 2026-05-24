const React = window.React;
const ReactDOM = window.ReactDOM;
const { useState, useEffect, useRef } = React;

const NexaFlowApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [showCookie, setShowCookie] = useState(true);
  const [faqOpen, setFaqOpen] = useState({});
  const [stats, setStats] = useState({ users: 0, workflows: 0, uptime: 0 });
  const statsRef = useRef(null);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedMode !== null ? savedMode === 'true' : prefersDark;
    setIsDarkMode(shouldBeDark);
    document.body.classList.toggle('light-mode', !shouldBeDark);
  }, []);

  // Load cookie preference
  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieConsent');
    if (cookieAccepted) {
      setShowCookie(false);
    }
  }, []);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && stats.users === 0) {
          animateStats();
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const duration = 2000;
    const start = Date.now();
    const targets = { users: 10000, workflows: 50000, uptime: 99.9 };

    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setStats({
        users: Math.floor(targets.users * progress),
        workflows: Math.floor(targets.workflows * progress),
        uptime: (targets.uptime * progress).toFixed(1)
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle('light-mode', !newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const toggleCookie = (accepted) => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookie(false);
    if (accepted) {
      console.log('Analytics enabled');
    }
  };

  const toggleFAQ = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: 'What is NexaFlow AI?',
      answer: 'NexaFlow AI is an intelligent workflow automation platform that uses artificial intelligence to help teams automate repetitive tasks, streamline processes, and build complex workflows without coding.'
    },
    {
      question: 'Do I need coding skills to use NexaFlow?',
      answer: 'No! NexaFlow is designed to be user-friendly for non-technical users. Our visual workflow builder allows anyone to create automations by dragging and dropping components.'
    },
    {
      question: 'What integrations are supported?',
      answer: 'NexaFlow supports 500+ popular applications including Slack, Salesforce, HubSpot, Shopify, Stripe, Google Workspace, Microsoft 365, and many more through our API.'
    },
    {
      question: 'How secure is my data?',
      answer: 'Security is our top priority. We use enterprise-grade encryption, SOC 2 Type II compliance, regular security audits, and maintain 99.9% uptime with automatic backups.'
    },
    {
      question: 'Can I try NexaFlow for free?',
      answer: 'Yes! Our free Starter plan includes up to 100 workflow runs per month, perfect for testing. You can upgrade to Pro or Enterprise anytime without losing your workflows.'
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'We offer 24/7 customer support via email, chat, and phone for paid plans. Free plan users get community support and documentation.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: ['Up to 100 workflow runs/month', 'Basic integrations', 'Community support', '1 team member']
    },
    {
      name: 'Pro',
      price: { monthly: 29, annual: 290 },
      description: 'For growing teams',
      features: ['Unlimited workflow runs', '500+ integrations', 'Priority support', 'Up to 5 team members', 'Advanced analytics', 'Custom workflows'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: { monthly: null, annual: null },
      description: 'For large organizations',
      features: ['Everything in Pro', 'Unlimited team members', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'On-premise option']
    }
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Product Manager', company: 'TechCorp', avatar: 1, quote: 'NexaFlow cut our manual work by 80%. The AI suggestions are incredibly helpful!' },
    { name: 'Michael Rodriguez', role: 'Operations Lead', company: 'DataFlow Inc', avatar: 2, quote: 'The best workflow tool we\'ve used. Support is phenomenal and the platform is intuitive.' },
    { name: 'Emily Watson', role: 'CEO', company: 'StartupHub', avatar: 3, quote: 'NexaFlow has transformed how our team works. ROI was immediate.' },
    { name: 'James Kim', role: 'Tech Lead', company: 'CloudSync', avatar: 4, quote: 'No code needed. Our non-technical team members can build workflows independently.' },
    { name: 'Lisa Zhang', role: 'CFO', company: 'FinanceFlow', avatar: 5, quote: 'Reduced process time from hours to minutes. Game changer for our finance team.' },
    { name: 'David Thompson', role: 'Team Lead', company: 'AutoScale', avatar: 6, quote: 'The integrations with our existing tools are seamless. Highly recommended!' }
  ];

  const companies = ['stripe', 'notion', 'vercel', 'github', 'figma', 'linear'];

  return (
    <div className="app">
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-content">
            <div className="logo">
              <span>⚡</span>
              NexaFlow
            </div>
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <li><a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a></li>
              <li><a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a></li>
              <li><a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a></li>
              <li><a href="#" onClick={() => setIsMenuOpen(false)}>Blog</a></li>
            </ul>
            <div className="nav-buttons">
              <button className="btn btn-ghost" onClick={toggleDarkMode}>
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              <a href="#" className="btn btn-ghost">Login</a>
              <a href="#" className="btn btn-primary">Get Started</a>
            </div>
            <button 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-blob-1"></div>
        <div className="hero-blob-2"></div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                <span className="gradient-text">Automate Everything.</span><br />
                <span>Build Faster.</span>
              </h1>
              <p>The AI-powered workflow automation platform for teams of all sizes. Eliminate manual work, boost productivity, and scale effortlessly.</p>
              
              <div className="hero-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  aria-label="Email for free trial"
                />
                <button className="btn btn-primary">Start Free Trial</button>
              </div>

              <div className="hero-features">
                <div className="hero-feature-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span>No coding required</span>
                </div>
                <div className="hero-feature-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span>500+ integrations</span>
                </div>
                <div className="hero-feature-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span>99.9% uptime</span>
                </div>
              </div>
            </div>

            <div className="hero-illustration">
              <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="50" width="360" height="400" rx="20" fill="rgba(124,58,237,0.1)" stroke="rgba(124,58,237,0.3)" strokeWidth="2"/>
                <rect x="40" y="70" width="320" height="40" rx="8" fill="rgba(124,58,237,0.2)"/>
                <circle cx="55" cy="90" r="4" fill="rgba(6,182,212,0.6)"/>
                <circle cx="70" cy="90" r="4" fill="rgba(6,182,212,0.4)"/>
                <circle cx="85" cy="90" r="4" fill="rgba(6,182,212,0.2)"/>
                {[0, 1, 2].map(i => (
                  <g key={i}>
                    <rect x="40" y={140 + i * 80} width="320" height="60" rx="8" fill="rgba(124,58,237,0.05)" stroke="rgba(124,58,237,0.2)" strokeWidth="1"/>
                    <circle cx="60" cy={165 + i * 80} r="5" fill="rgba(124,58,237,0.6)"/>
                    <line x1="75" y1={165 + i * 80} x2="340" y2={165 + i * 80} stroke="rgba(6,182,212,0.3)" strokeWidth="1"/>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-icon"></div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="container">
          <div className="social-proof-text">Trusted by teams at leading companies</div>
          <div className="logos-scroll">
            {[...companies, ...companies].map((company, idx) => (
              <div key={idx} className="logo-item">
                <img 
                  src={`https://logo.clearbit.com/${company}.com`}
                  alt={company}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} style={{padding: '6rem 0'}}>
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center'}}>
            <div>
              <h3 style={{fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem'}} className="stats-counter">
                {stats.users.toLocaleString()}+
              </h3>
              <p>Active Users</p>
            </div>
            <div>
              <h3 style={{fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem'}} className="stats-counter">
                {stats.workflows.toLocaleString()}+
              </h3>
              <p>Workflows Created</p>
            </div>
            <div>
              <h3 style={{fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem'}} className="stats-counter">
                {stats.uptime}%
              </h3>
              <p>Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features Built for You</h2>
            <p>Everything you need to automate your workflows and boost team productivity</p>
          </div>

          <div className="features-grid">
            {[
              { icon: '🤖', title: 'AI Automation', desc: 'Intelligent automation that learns from your workflows and suggests optimizations.' },
              { icon: '📊', title: 'Real-time Analytics', desc: 'Monitor workflow performance with detailed analytics and insights.' },
              { icon: '👥', title: 'Team Collaboration', desc: 'Build and manage workflows together with your team in real-time.' },
              { icon: '🔌', title: 'API Integrations', desc: 'Connect to 500+ apps and services seamlessly.' },
              { icon: '⏰', title: 'Smart Scheduling', desc: 'Schedule workflows to run at the perfect time automatically.' },
              { icon: '🔒', title: 'Security & Compliance', desc: 'Enterprise-grade security with SOC 2 Type II compliance.' }
            ].map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="demo">
        <div className="container">
          <div className="demo-content">
            <div className="demo-text">
              <h2>Build Workflows Visually</h2>
              <p>Our intuitive workflow builder makes it easy to create complex automations without writing a single line of code. Connect triggers, actions, and conditions to build powerful workflows.</p>
              <a href="#" className="btn btn-primary">View Demo</a>
            </div>

            <div className="demo-mockup">
              <div className="mockup-header">
                <div className="mockup-title">Workflow Builder</div>
                <button className="theme-toggle" onClick={toggleDarkMode}>
                  {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>

              <div className="workflow-nodes">
                <div className="workflow-node">Trigger</div>
                <svg className="connection-line left" viewBox="0 0 100 2"><line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeWidth="2"/></svg>
                <div className="workflow-node">Process</div>
                <svg className="connection-line right" viewBox="0 0 100 2"><line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeWidth="2"/></svg>
                <div className="workflow-node">Action</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that's right for your team</p>
          </div>

          <div className="pricing-toggle">
            <span>Monthly</span>
            <div 
              className={`toggle-switch ${isAnnual ? 'active' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div className="toggle-slider"></div>
            </div>
            <span>Annual</span>
            {isAnnual && <span className="discount-badge">Save 17%</span>}
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, idx) => {
              const displayPrice = isAnnual ? plan.price.annual : plan.price.monthly;
              return (
                <div key={idx} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <h3>{plan.name}</h3>
                  {displayPrice !== null ? (
                    <>
                      <div className="pricing-amount">${displayPrice}<span className="period">/month</span></div>
                      {isAnnual && <p style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem'}}>Billed annually</p>}
                    </>
                  ) : (
                    <div className="pricing-amount">Custom</div>
                  )}
                  <p className="pricing-description">{plan.description}</p>
                  <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} style={{width: '100%', marginBottom: '1.5rem'}}>
                    Get Started
                  </button>
                  <ul className="pricing-features">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Loved by Thousands of Users</h2>
            <p>See what our customers have to say about NexaFlow</p>
          </div>

          <div className="testimonials-scroll">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${testimonial.avatar}`}
                      alt={testimonial.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <div className="role">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <div className="testimonial-rating">★★★★★</div>
                <p className="testimonial-text">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about NexaFlow</p>
          </div>

          <div className="faq-container">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${faqOpen[idx] ? 'active' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={faqOpen[idx]}
                >
                  <span>{faq.question}</span>
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="footer-logo">⚡ NexaFlow</div>
              <p className="footer-description">The AI-powered workflow automation platform that helps teams work smarter, not harder.</p>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Twitter">𝕏</a>
                <a href="#" className="social-icon" aria-label="GitHub">⚙️</a>
                <a href="#" className="social-icon" aria-label="LinkedIn">💼</a>
                <a href="#" className="social-icon" aria-label="Discord">💬</a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Roadmap</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Newsletter</h4>
              <p style={{fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-secondary)'}}>Subscribe to get updates on new features.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" aria-label="Newsletter email"/>
                <button className="btn btn-primary" style={{minWidth: '100px'}}>Subscribe</button>
              </div>
            </div>
          </div>

          <div className="footer-divider">
            <div className="footer-bottom">
              <p>&copy; 2024 NexaFlow Inc. All rights reserved.</p>
              <div style={{display: 'flex', gap: '2rem'}}>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookie && (
        <div className="cookie-banner">
          <p className="cookie-text">We use cookies to enhance your experience and analyze site usage. By clicking "Accept", you consent to our cookie policy.</p>
          <div className="cookie-buttons">
            <button 
              className="cookie-accept"
              onClick={() => toggleCookie(true)}
            >
              Accept
            </button>
            <button 
              className="cookie-reject"
              onClick={() => toggleCookie(false)}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<NexaFlowApp />, document.getElementById('root'));