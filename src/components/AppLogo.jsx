import { motion } from "framer-motion";

export default function AppLogo({
  className = "",
  imageClassName = "",
  animated = false,
  alt = "Imposter Who logo",
}) {
  const Wrapper = animated ? motion.div : "div";
  const motionProps = animated
    ? {
        initial: { opacity: 0, y: 10, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.3, ease: "easeOut" },
      }
    : {};

  return (
    <Wrapper className={className} {...motionProps}>
      <img
        src="/imposter-who-logo.png"
        alt={alt}
        className={imageClassName}
      />
    </Wrapper>
  );
}
