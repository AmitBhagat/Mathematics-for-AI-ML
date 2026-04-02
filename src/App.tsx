import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Layers, 
  BarChart3, 
  BrainCircuit, 
  ChevronRight, 
  Menu, 
  X, 
  Github, 
  Twitter, 
  ArrowRight,
  Zap,
  Target,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';
import { LinearTransformationPlayground } from './components/LinearTransformationPlayground';
import { MathRenderer } from './components/MathRenderer';
import { GradientDescent3D } from './components/GradientDescent3D';
import { ProbabilityPlayground } from './components/ProbabilityPlayground';
import { LinearRegressionPlayground } from './components/LinearRegressionPlayground';

type ModuleId = 'home' | 'linear-algebra' | 'calculus' | 'probability' | 'ml-algorithms';

interface Module {
  id: ModuleId;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const modules: Module[] = [
  { 
    id: 'linear-algebra', 
    title: 'Linear Algebra', 
    icon: <Layers size={20} />, 
    description: 'Vector spaces, matrix transformations, and eigenvalues.',
    color: 'text-blue-400'
  },
  { 
    id: 'calculus', 
    title: 'Calculus', 
    icon: <Zap size={20} />, 
    description: 'Derivatives, gradients, and optimization surfaces.',
    color: 'text-purple-400'
  },
  { 
    id: 'probability', 
    title: 'Probability & Stats', 
    icon: <BarChart3 size={20} />, 
    description: 'Distributions, Bayes theorem, and CLT.',
    color: 'text-emerald-400'
  },
  { 
    id: 'ml-algorithms', 
    title: 'ML Algorithms', 
    icon: <BrainCircuit size={20} />, 
    description: 'The bridge from math to real-world ML models.',
    color: 'text-rose-400'
  }
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderContent = () => {
    switch (activeModule) {
      case 'home':
        return <LandingPage onStart={() => setActiveModule('linear-algebra')} />;
      case 'linear-algebra':
        return <LinearAlgebraModule />;
      case 'calculus':
        return <CalculusModule />;
      case 'probability':
        return <ProbabilityModule />;
      case 'ml-algorithms':
        return <MLAlgorithmsModule />;
      default:
        return <LandingPage onStart={() => setActiveModule('linear-algebra')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={cn(
          "bg-slate-900/50 border-r border-white/5 flex flex-col z-40 relative backdrop-blur-xl",
          !isSidebarOpen && "pointer-events-none"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <BrainCircuit className="text-white" size={24} />
          </div>
          <h1 className="font-display font-extrabold text-xl tracking-tighter">MATH<span className="text-brand-primary">ML</span></h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem 
            active={activeModule === 'home'} 
            onClick={() => setActiveModule('home')}
            icon={<BookOpen size={20} />}
            label="Introduction"
          />
          <div className="pt-6 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Curriculum</div>
          {modules.map((m) => (
            <SidebarItem 
              key={m.id}
              active={activeModule === m.id}
              onClick={() => setActiveModule(m.id)}
              icon={m.icon}
              label={m.title}
              color={m.color}
            />
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 text-slate-400">
            <Github size={20} className="hover:text-white cursor-pointer transition-colors" />
            <Twitter size={20} className="hover:text-white cursor-pointer transition-colors" />
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            © 2026 MathML Interactive. All rights reserved.
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Header */}
        <header className={cn(
          "sticky top-0 z-30 px-8 py-4 flex items-center justify-between transition-all duration-300",
          scrolled ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        )}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-400">
              <Target size={14} className="text-brand-primary" />
              Progress: {activeModule === 'home' ? '0%' : activeModule === 'linear-algebra' ? '25%' : activeModule === 'calculus' ? '50%' : activeModule === 'probability' ? '75%' : '100%'}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary p-[1px]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold">AB</div>
            </div>
          </div>
        </header>

        <div className="px-8 py-12 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-brand-primary/10 text-white border border-brand-primary/20" 
          : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
      )}
    >
      <span className={cn(
        "transition-transform duration-300 group-hover:scale-110",
        active ? "text-brand-primary" : color || "text-slate-500"
      )}>
        {icon}
      </span>
      <span className="font-medium text-sm">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-indicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary"
        />
      )}
    </button>
  );
}

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest"
        >
          <Sparkles size={14} />
          Interactive Learning Experience
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Master the Math Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">Intelligence.</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Stop memorizing formulas. Start visualizing the geometry of data. 
          MathML is an interactive playground designed to build deep intuition for the foundations of Machine Learning.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-brand-primary rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all hover:scale-105 flex items-center gap-2"
          >
            Start Learning <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 glass-panel rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
            View Curriculum
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Layers className="text-blue-400" />}
          title="Visual Intuition"
          description="See matrix transformations and gradient descent in real-time 3D environments."
        />
        <FeatureCard 
          icon={<Zap className="text-purple-400" />}
          title="Hands-on Playgrounds"
          description="Manipulate parameters and see immediate results. Learn by breaking things."
        />
        <FeatureCard 
          icon={<BrainCircuit className="text-emerald-400" />}
          title="ML-First Approach"
          description="Every concept is tied directly to how it's used in modern neural networks."
        />
      </section>

      {/* Module Overview */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-display font-extrabold">The Curriculum</h2>
          <p className="text-slate-400 mt-2">A structured path from basic vectors to complex architectures.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m) => (
            <div key={m.id} onClick={() => onStart()} className="glass-card p-6 flex flex-col gap-4 group cursor-pointer">
              <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white/10", m.color)}>
                {m.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{m.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{m.description}</p>
              </div>
              <div className="mt-auto pt-4 flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-brand-primary transition-colors">
                Explore Module <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-panel p-8 space-y-4 hover:border-white/20 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function LinearAlgebraModule() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest">
          <Layers size={14} />
          Module 01: Linear Algebra
        </div>
        <h1 className="text-4xl font-display font-extrabold">Visualizing Linear Transformations</h1>
        <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
          Linear transformations are the heartbeat of machine learning. From rotating images to projecting high-dimensional data, 
          understanding how matrices move space is essential.
        </p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-2xl font-bold">What is a Transformation?</h3>
            <p className="text-slate-300 leading-relaxed">
              Think of a transformation as a function <MathRenderer math="T" /> that takes a vector <MathRenderer math="\vec{v}" /> and spits out a new vector <MathRenderer math="\vec{v}'" />.
              For a transformation to be <strong>linear</strong>, it must satisfy two properties:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">1</div>
                <div>
                  <span className="font-bold text-white">Additivity:</span>
                  <MathRenderer math="T(\vec{u} + \vec{v}) = T(\vec{u}) + T(\vec{v})" block />
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">2</div>
                <div>
                  <span className="font-bold text-white">Homogeneity:</span>
                  <MathRenderer math="T(c\vec{v}) = cT(\vec{v})" block />
                </div>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 space-y-4">
            <h3 className="text-xl font-bold">The Basis Vector Secret</h3>
            <p className="text-slate-300 leading-relaxed">
              The most powerful insight in linear algebra is that you only need to know where the <strong>basis vectors</strong> land to know where <em>every</em> point lands.
            </p>
            <MathRenderer math="A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}" block />
          </div>
        </div>

        <div className="sticky top-24">
          <LinearTransformationPlayground />
        </div>
      </section>
    </div>
  );
}

function CalculusModule() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest">
          <Zap size={14} />
          Module 02: Calculus
        </div>
        <h1 className="text-4xl font-display font-extrabold">Gradients & Optimization</h1>
        <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
          Calculus is how we teach machines to learn. By calculating gradients, we find the direction that minimizes error.
        </p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-2xl font-bold">The Gradient Vector</h3>
            <p className="text-slate-300 leading-relaxed">
              The gradient <MathRenderer math="\nabla f" /> is a vector that points in the direction of steepest ascent. 
              In ML, we want to go the <em>opposite</em> way to minimize our loss function.
            </p>
            <MathRenderer math="\nabla f = \begin{bmatrix} \frac{\partial f}{\partial x_1} \\ \frac{\partial f}{\partial x_2} \\ \vdots \end{bmatrix}" block />
            <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <Info className="text-purple-400 mt-1" size={18} />
              <p className="text-sm text-slate-300">
                <strong>Chain Rule:</strong> This is how we propagate errors backward through a neural network (Backpropagation).
              </p>
            </div>
          </div>

          <div className="glass-panel p-8 space-y-4">
            <h3 className="text-xl font-bold">Gradient Descent</h3>
            <p className="text-slate-300 leading-relaxed">
              We update our parameters iteratively by taking small steps in the negative gradient direction:
            </p>
            <MathRenderer math="\theta_{new} = \theta_{old} - \eta \cdot \nabla f(\theta_{old})" block />
            <p className="text-slate-400 text-sm">
              Where <MathRenderer math="\eta" /> is the <strong>learning rate</strong>.
            </p>
          </div>
        </div>

        <div className="sticky top-24">
          <GradientDescent3D />
        </div>
      </section>
    </div>
  );
}

function ProbabilityModule() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <BarChart3 size={14} />
          Module 03: Probability & Stats
        </div>
        <h1 className="text-4xl font-display font-extrabold">Distributions & Uncertainty</h1>
        <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
          Probability allows us to quantify uncertainty. In ML, we use it to model noise and make predictions with confidence.
        </p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-2xl font-bold">Bayes' Theorem</h3>
            <p className="text-slate-300 leading-relaxed">
              How we update our beliefs when we see new data. It's the foundation of Bayesian Inference.
            </p>
            <MathRenderer math="P(A|B) = \frac{P(B|A)P(A)}{P(B)}" block />
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• <span className="text-white font-bold">P(A|B):</span> Posterior (Belief after data)</li>
              <li>• <span className="text-white font-bold">P(B|A):</span> Likelihood (Data given belief)</li>
              <li>• <span className="text-white font-bold">P(A):</span> Prior (Belief before data)</li>
            </ul>
          </div>

          <div className="glass-panel p-8 space-y-4">
            <h3 className="text-xl font-bold">The Normal Distribution</h3>
            <p className="text-slate-300 leading-relaxed">
              The Central Limit Theorem states that the sum of many independent random variables tends toward a Gaussian distribution.
            </p>
            <MathRenderer math="\mu = \text{Mean}, \sigma = \text{Standard Deviation}" block />
          </div>
        </div>

        <div className="sticky top-24">
          <ProbabilityPlayground />
        </div>
      </section>
    </div>
  );
}

function MLAlgorithmsModule() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest">
          <BrainCircuit size={14} />
          Module 04: ML Algorithms
        </div>
        <h1 className="text-4xl font-display font-extrabold">The Bridge to Intelligence</h1>
        <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
          Now we combine Linear Algebra, Calculus, and Probability to build real algorithms.
        </p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="glass-panel p-8 space-y-6">
            <h3 className="text-2xl font-bold">Linear Regression</h3>
            <p className="text-slate-300 leading-relaxed">
              The simplest ML model. We find the line that minimizes the Mean Squared Error (MSE) between predictions and actual values.
            </p>
            <MathRenderer math="MSE = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2" block />
            <p className="text-slate-400 text-sm italic">
              We use Gradient Descent to find the optimal <MathRenderer math="m" /> and <MathRenderer math="b" />.
            </p>
          </div>

          <div className="glass-panel p-8 space-y-4">
            <h3 className="text-xl font-bold">Neural Networks</h3>
            <p className="text-slate-300 leading-relaxed">
              A neural network is just a massive composition of linear transformations followed by non-linear activation functions.
            </p>
            <MathRenderer math="a^{(l)} = \sigma(W^{(l)}a^{(l-1)} + b^{(l)})" block />
          </div>
        </div>

        <div className="sticky top-24">
          <LinearRegressionPlayground />
        </div>
      </section>
    </div>
  );
}
