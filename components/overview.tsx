import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bitcoin } from 'lucide-react';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <Bitcoin size={48} className="text-crypto-bitcoin" />
        </p>
        <p>
          This is a crypto deep research assistant focused on cryptocurrency projects. It collects sources, analyzes Twitter activity, renders Mermaid timelines, and produces structured, investable research outputs.
        </p>
        <p>
          Start by telling me a project name or ticker (e.g., &quot;Analyze ETH&quot;). I will fetch data, show a K-line chart first, summarize key insights, and list sources used.
        </p>
      </div>
    </motion.div>
  );
};
