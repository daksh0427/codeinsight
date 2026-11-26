import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Clock, Cpu, MessageSquare, Brain, FolderCode, BookmarkCheck,
  ArrowRight, ChevronRight, Upload, Sparkles, BarChart3
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

// Typewriter code samples
const codeSamples = [
  {
    lang: 'Python',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  },
  {
    lang: 'JavaScript',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
  },
  {
    lang: 'C++',
    code: `int maxSubarraySum(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i],
            currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
  },
];

const features = [
  { icon: Clock, title: 'Complexity Analysis', desc: 'Instant time & space complexity with Big-O notation for any code snippet.', color: 'text-cyan-400' },
  { icon: Cpu, title: 'Algorithm Identification', desc: 'Detects 10+ DSA patterns — sliding window, DP, graphs, greedy, and more.', color: 'text-purple-400' },
  { icon: MessageSquare, title: 'Plain-English Explanation', desc: 'Your code explained step by step, as if a senior engineer is teaching you.', color: 'text-pink-400' },
  { icon: Brain, title: 'Interview Q&A', desc: 'AI-generated viva questions with model answers tailored to your code.', color: 'text-green-400' },
  { icon: FolderCode, title: 'Code Storage', desc: 'Save and revisit all your analyzed snippets in a beautiful dashboard.', color: 'text-yellow-400' },
  { icon: BookmarkCheck, title: 'Bookmark & Revise', desc: 'Star important snippets for focused revision before interviews.', color: 'text-orange-400' },
];

const steps = [
  { num: '01', icon: Upload, title: 'Paste Your Code', desc: 'Upload any code snippet in 10+ supported languages.' },
  { num: '02', icon: Sparkles, title: 'AI Analyzes', desc: 'Our AI identifies algorithms, complexity, and patterns instantly.' },
  { num: '03', icon: BarChart3, title: 'Review & Prep', desc: 'Get detailed results and practice interview questions.' },
];

const languages = [
  'Python', 'JavaScript', 'C++', 'Java', 'Go', 'Rust',
  'TypeScript', 'PHP', 'Ruby', 'Swift', 'C', 'C#', 'Kotlin',
];

const Landing = () => {
  const navigate = useNavigate();
  const [currentCode, setCurrentCode] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    const sample = codeSamples[currentCode];
    let charIndex = 0;
    setDisplayedCode('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (charIndex < sample.code.length) {
        setDisplayedCode(sample.code.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        setTimeout(() => {
          setCurrentCode((prev) => (prev + 1) % codeSamples.length);
        }, 2000);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [currentCode]);

  const floatingBadges = [
    { text: 'O(n log n)', x: '-left-8', y: 'top-4', delay: 0 },
    { text: 'Binary Search', x: '-right-6', y: 'top-12', delay: 0.5 },
    { text: 'Merge Sort', x: '-left-4', y: 'bottom-8', delay: 1 },
    { text: 'Two Pointers', x: '-right-8', y: 'bottom-16', delay: 1.5 },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-purple" />
        <div className="orb orb-cyan" />
        <div className="orb orb-pink" />
      </div>

      <Navbar transparent />

      {/* ======== HERO ======== */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center" id="hero">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                  {'Analyze Your Code.'.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br />
                  {'Master Every Interview.'.split(' ').map((word, i) => (
                    <motion.span
                      key={`b-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i + 3) * 0.1 + 0.2 }}
                      className="inline-block mr-3 gradient-text"
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-dark-200 text-lg leading-relaxed mb-8 max-w-xl"
              >
                Upload any code snippet and instantly get complexity analysis, algorithm identification,
                plain-English explanations, and AI-generated interview Q&A — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary text-base py-3 px-8"
                  id="hero-cta-primary"
                >
                  Start Analyzing Free
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-ghost text-base py-3 px-8"
                  id="hero-cta-secondary"
                >
                  See How It Works
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            </div>

            {/* Right — Code Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative glass-card p-6">
                {/* Title bar */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-xs text-dark-300 ml-2 font-mono">{codeSamples[currentCode].lang}</span>
                </div>

                {/* Code */}
                <pre className="font-mono text-sm text-dark-100 leading-relaxed min-h-[220px]">
                  <code>{displayedCode}{isTyping && <span className="inline-block w-2 h-4 bg-accent-purple animate-pulse ml-0.5" />}</code>
                </pre>
              </div>

              {/* Floating Badges */}
              {floatingBadges.map((badge, i) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + badge.delay, type: 'spring' }}
                  className={`absolute ${badge.x} ${badge.y} px-3 py-1.5 rounded-full glass text-xs font-mono text-accent-cyan animate-float`}
                  style={{ animationDelay: `${badge.delay}s` }}
                >
                  {badge.text}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======== FEATURES ======== */}
      <FeaturesSection />

      {/* ======== HOW IT WORKS ======== */}
      <HowItWorksSection />

      {/* ======== LANGUAGES ======== */}
      <section className="py-16 px-4 overflow-hidden" id="languages">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Supported Languages</h2>
          <p className="text-dark-300 text-sm">Analyze code in your favorite programming language</p>
        </div>

        <div className="relative">
          <div className="flex animate-ticker whitespace-nowrap">
            {[...languages, ...languages].map((lang, i) => (
              <div
                key={`${lang}-${i}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 mx-2 rounded-full glass text-sm font-medium text-dark-100 flex-shrink-0"
              >
                {lang}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="features" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to <span className="gradient-text">Ace Your Interviews</span>
          </h2>
          <p className="text-dark-200 text-lg max-w-2xl mx-auto">
            Powered by AI, designed for developers who want to deeply understand their code.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card glass-card-hover p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon size={22} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-dark-300 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section Component
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="how-it-works" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-dark-200 text-lg">Three simple steps to master your code</p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
              className="h-full gradient-bg origin-left rounded-full"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-full gradient-bg mx-auto mb-6 flex items-center justify-center relative z-10 shadow-lg shadow-purple-500/20">
                  <step.icon size={24} className="text-white" />
                </div>
                <span className="text-xs font-mono text-accent-purple font-bold mb-2 block">{step.num}</span>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-dark-300 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
