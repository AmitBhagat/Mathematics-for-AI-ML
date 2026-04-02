import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ math, block = false }) => {
  return block ? (
    <div className="my-4 overflow-x-auto">
      <BlockMath math={math} />
    </div>
  ) : (
    <span className="math-inline">
      <InlineMath math={math} />
    </span>
  );
};
