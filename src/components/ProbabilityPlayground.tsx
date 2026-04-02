import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { MathRenderer } from './MathRenderer';
import { Sliders, Info } from 'lucide-react';

export const ProbabilityPlayground: React.FC = () => {
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);

  const data = useMemo(() => {
    const points = [];
    const step = 0.1;
    for (let x = -5; x <= 5; x += step) {
      // Normal distribution formula: (1 / (σ * sqrt(2π))) * exp(-0.5 * ((x - μ) / σ)^2)
      const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      points.push({ x: parseFloat(x.toFixed(1)), y });
    }
    return points;
  }, [mean, stdDev]);

  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Gaussian Distribution</h3>
          <p className="text-slate-400 text-sm">The "Normal" distribution that appears everywhere in ML.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="space-y-6">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold flex justify-between">
                  Mean (μ) <span>{mean.toFixed(1)}</span>
                </label>
                <input 
                  type="range" min="-3" max="3" step="0.1" 
                  value={mean} onChange={(e) => setMean(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-brand-primary"
                />
                <p className="text-[10px] text-slate-500 mt-1">Shifts the center of the curve.</p>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold flex justify-between">
                  Std Dev (σ) <span>{stdDev.toFixed(1)}</span>
                </label>
                <input 
                  type="range" min="0.2" max="2" step="0.1" 
                  value={stdDev} onChange={(e) => setStdDev(parseFloat(e.target.value))}
                  className="w-full mt-2 accent-brand-secondary"
                />
                <p className="text-[10px] text-slate-500 mt-1">Controls the spread or "width".</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-brand-primary mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                In ML, we often assume errors are normally distributed. This allows us to use <strong>Maximum Likelihood Estimation</strong> to find optimal parameters.
              </p>
            </div>
          </div>

          <MathRenderer math="f(x | \mu, \sigma) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}" block />
        </div>

        <div className="lg:col-span-2 h-[350px] bg-slate-900/30 rounded-2xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="x" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10} 
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10} 
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area 
                type="monotone" 
                dataKey="y" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorY)" 
                animationDuration={500}
              />
              <ReferenceLine x={mean} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'top', value: 'μ', fill: '#f43f5e', fontSize: 12 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
