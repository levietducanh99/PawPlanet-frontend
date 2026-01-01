// Animation variants cho Motion for React

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  },
  exit: { opacity: 0, y: -20 }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, damping: 25, stiffness: 500 }
  }
};

export const cardHoverVariants = {
  rest: { y: 0, boxShadow: "0px 4px 12px rgba(0,0,0,0.05)" },
  hover: {
    y: -8,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
    transition: { type: "spring" as const, stiffness: 300 }
  }
};

export const fadeInUp = {
  initial: { y: 12, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.45 }
};

