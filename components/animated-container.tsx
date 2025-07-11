import { motion, useReducedMotion } from "motion/react";

type ViewAnimationProps = {
    delay?: number;
    className?: string;
    children: React.ReactNode;
  };
  
  export function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();
  
    if (shouldReduceMotion) {
      return <div className={className}>{children}</div>;
    }
  
    return (
      <motion.div
        initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
        whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }