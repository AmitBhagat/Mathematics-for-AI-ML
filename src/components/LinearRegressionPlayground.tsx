import React, { useState, useMemo, useEffect } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  ComposedChart,
  Cell
} from 'recharts';
import { MathRenderer } from './MathRenderer';
import { Play, RotateCcw, Sliders, BrainCircuit } from 'lucide-react';

export const LinearRegressionPlayground: React.FC = () => {
  const [points, setPoints] = useState<{ x: number, y: number }[]>([]);
  const [m, setM] = useState(0);
  const [b, setB] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [learningRate, setLearningRate] = useState(0.01);

  // Initialize random points
  useEffect(() => {
    const initialPoints = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 10;
      const y = 2 * x + 5 + (Math.random() - 0.5) * 5;
      initialPoints.push({ x, y });
    }
    setPoints(initialPoints);
  }, []);

  const lineData = useMemo(() => {
    const data = [];
    for (let x = 0; x <= 10; x += 1) {
      data.push({ x, lineY: m * x + b });
    }
    return data;
  }, [m, b]);

  const mse = useMemo(() => {
    if (points.length === 0) return 0;
    const sum = points.reduce((acc, p) => acc + Math.pow(p.y - (m * p.x + b), 2), 0);
    return sum / points.length;
  }, [points, m, b]);

  const trainStep = () => {
    let dm = 0;
    let db = 0;
    const n = points.length;

    points.forEach(p => {
      const error = p.y - (m * p.x + b);
      dm += -2 * p.x * error;
      db += -2 * error;
    });

    setM(prev => prev - (dm / n) * learningRate);
    setB(prev => prev - (db / n) * learningRate);
  };

  useEffect(() => {
    let interval: any;
    if (isTraining) {
      interval = setInterval(trainStep, 50);
    }
    return () => clearInterval(interval);
  }, [isTraining, m, b, learningRate, points]);

  const reset = () => {
    setM(0);
    setB(0);
    setIsTraining(false);
  };

  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Linear Regression</h3>
          <p className="text-slate-400 text-sm">Fitting a line to data using Gradient Descent.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsTraining(!isTraining)}
            className={`p-2 rounded-lg transition-colors ${isTraining ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}
          >
            {isTraining ? 'Stop Training' : 'Start Training'}
          </button>
          <button 
            onClick={reset}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold flex justify-between">
                  Slope (m) <span>{m.toFixed(2)}</span>
                </label>
                <input 
                  type="range" min="-5" max="5" step="0.1" 
                  value={m} onChange={(e) => setM(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-brand-primary"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold flex justify-between">
                  Intercept (b) <span>{b.toFixed(2)}</span>
                </label>
                <input 
                  type="range" min="-10" max="10" step="0.1" 
                  value={b} onChange={(e) => setB(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-brand-secondary"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold flex justify-between">
                  Learning Rate <span>{learningRate.toFixed(3)}</span>
                </label>
                <input 
                  type="range" min="0.001" max="0.1" step="0.001" 
                  value={learningRate} onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-brand-accent"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-sm font-bold mb-2 text-slate-300">Loss Function (MSE)</h4>
            <div className="text-2xl font-mono text-brand-accent font-bold">
              {mse.toFixed(4)}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              The goal is to minimize this value by adjusting <MathRenderer math="m" /> and <MathRenderer math="b" />.
            </p>
          </div>

          <MathRenderer math="y = mx + b" block />
        </div>

        <div className="lg:col-span-2 h-[400px] bg-slate-900/30 rounded-2xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="x" 
                type="number" 
                domain={[0, 10]} 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10} 
              />
              <YAxis 
                type="number" 
                domain={[0, 30]} 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Scatter name="Data" data={points} fill="#3b82f6" />
              <Line 
                name="Prediction" 
                data={lineData} 
                dataKey="lineY" 
                stroke="#f43f5e" 
                strokeWidth={3} 
                dot={false} 
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
