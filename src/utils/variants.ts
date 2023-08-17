export const fadeInUp = {
 initial: {
  y: 40,
  opacity: 0,
 },
 animate: {
  y: 0,
  opacity: 1,

  transition: {
   duration: 0.5,
   ease: 'easeInOut',
  },
 },
}

export const fadeInDown = {
 initial: {
  y: -60,
  opacity: 0,
 },
 animate: {
  y: 0,
  opacity: 1,

  transition: {
   duration: 0.5,
   ease: 'easeInOut',
  },
 },
}

export const staggerContainer = {
 initial: {},
 animate: {
  transition: {
   staggerChildren: 0.3,
  },
 },
}
