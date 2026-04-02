import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MathRenderer } from './MathRenderer';
import { Settings2, RefreshCcw, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Matrix2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const LinearTransformationPlayground: React.FC = () => {
  const [matrix, setMatrix] = useState<Matrix2x2>({ a: 1, b: 0, c: 0, d: 1 });
  const [showGrid, setShowGrid] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (key: keyof Matrix2x2, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setMatrix((prev) => ({ ...prev, [key]: numValue }));
    }
  };

  const resetMatrix = () => {
    setMatrix({ a: 1, b: 0, c: 0, d: 1 });
  };

  const viewBoxSize = 400;
  const center = viewBoxSize / 2;
  const scale = 40; // Pixels per unit

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const range = 5;
    for (let i = -range; i <= range; i++) {
      // Horizontal
      lines.push({ x1: -range, y1: i, x2: range, y2: i });
      // Vertical
      lines.push({ x1: i, y1: -range, x2: i, y2: range });
    }
    return lines;
  }, []);

  const transformPoint = (x: number, y: number) => {
    // Standard matrix multiplication: [a b; c d] * [x; y] = [ax + by; cx + dy]
    // Note: SVG Y-axis is inverted relative to standard Cartesian
    const tx = matrix.a * x + matrix.b * y;
    const ty = matrix.c * x + matrix.d * y;
    return { x: center + tx * scale, y: center - ty * scale };
  };

  return (
    <div className={cn(
      "glass-panel p-6 transition-all duration-500",
      isExpanded ? "fixed inset-4 z-50 overflow-auto" : "relative w-full max-w-4xl mx-auto"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white">2D Linear Transformations</h3>
          <p className="text-slate-400 text-sm">Manipulate the basis vectors to see how space transforms.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetMatrix}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Reset Matrix"
          >
            <RefreshCcw size={18} />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-4 text-brand-primary">
              <Settings2 size={18} />
              <span className="font-semibold text-sm uppercase tracking-wider">Transformation Matrix</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="text-3xl text-slate-500 font-light">[</div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.1"
                  value={matrix.a}
                  onChange={(e) => handleInputChange('a', e.target.value)}
                  className="w-16 h-10 bg-slate-900 border border-white/10 rounded-md text-center focus:border-brand-primary outline-none transition-colors"
                />
                <input
                  type="number"
                  step="0.1"
                  value={matrix.b}
                  onChange={(e) => handleInputChange('b', e.target.value)}
                  className="w-16 h-10 bg-slate-900 border border-white/10 rounded-md text-center focus:border-brand-primary outline-none transition-colors"
                />
                <input
                  type="number"
                  step="0.1"
                  value={matrix.c}
                  onChange={(e) => handleInputChange('c', e.target.value)}
                  className="w-16 h-10 bg-slate-900 border border-white/10 rounded-md text-center focus:border-brand-primary outline-none transition-colors"
                />
                <input
                  type="number"
                  step="0.1"
                  value={matrix.d}
                  onChange={(e) => handleInputChange('d', e.target.value)}
                  className="w-16 h-10 bg-slate-900 border border-white/10 rounded-md text-center focus:border-brand-primary outline-none transition-colors"
                />
              </div>
              <div className="text-3xl text-slate-500 font-light">]</div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold">Basis Vector î (x)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" min="-2" max="2" step="0.1" 
                    value={matrix.a} onChange={(e) => handleInputChange('a', e.target.value)}
                    className="flex-1 accent-brand-primary"
                  />
                  <span className="text-xs font-mono w-8 text-right">{matrix.a.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase font-bold">Basis Vector ĵ (y)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="range" min="-2" max="2" step="0.1" 
                    value={matrix.d} onChange={(e) => handleInputChange('d', e.target.value)}
                    className="flex-1 accent-brand-secondary"
                  />
                  <span className="text-xs font-mono w-8 text-right">{matrix.d.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-sm font-bold mb-2 text-slate-300">Intuition</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Linear transformations are functions that map vectors to other vectors while preserving the origin and grid lines.
              The columns of the matrix tell you where the basis vectors <MathRenderer math="\hat{i}" /> and <MathRenderer math="\hat{j}" /> land.
            </p>
            <div className="mt-4">
              <MathRenderer math={`T(\\vec{v}) = \\begin{bmatrix} ${matrix.a} & ${matrix.b} \\\\ ${matrix.c} & ${matrix.d} \\end{bmatrix} \\vec{v}`} block />
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-2 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-white/5 relative overflow-hidden min-h-[400px]">
          <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="max-w-full max-h-full">
            {/* Original Grid (Faint) */}
            {showGrid && gridLines.map((line, i) => (
              <line
                key={`orig-${i}`}
                x1={center + line.x1 * scale}
                y1={center - line.y1 * scale}
                x2={center + line.x2 * scale}
                y2={center - line.y2 * scale}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Transformed Grid */}
            {showGrid && gridLines.map((line, i) => {
              const p1 = transformPoint(line.x1, line.y1);
              const p2 = transformPoint(line.x2, line.y2);
              return (
                <motion.line
                  key={`trans-${i}`}
                  initial={false}
                  animate={{ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }}
                  stroke="rgba(59, 130, 246, 0.2)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axes */}
            <line x1="0" y1={center} x2={viewBoxSize} y2={center} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1={center} y1="0" x2={center} y2={viewBoxSize} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Basis Vectors */}
            {/* i-hat */}
            <motion.line
              animate={{ x2: transformPoint(1, 0).x, y2: transformPoint(1, 0).y }}
              x1={center} y1={center}
              stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow-blue)"
            />
            {/* j-hat */}
            <motion.line
              animate={{ x2: transformPoint(0, 1).x, y2: transformPoint(0, 1).y }}
              x1={center} y1={center}
              stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrow-purple)"
            />

            {/* Markers */}
            <defs>
              <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
              </marker>
              <marker id="arrow-purple" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
              </marker>
            </defs>
          </svg>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
              <div className="w-2 h-2 rounded-full bg-brand-primary" />
              î Basis
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-brand-secondary">
              <div className="w-2 h-2 rounded-full bg-brand-secondary" />
              ĵ Basis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
