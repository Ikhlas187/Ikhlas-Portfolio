import Lottie from 'lottie-react';

/**
 * LottiePlayer — wrapper pour animations LottieFiles
 *
 * import animData from '../assets/lottie/mon-animation.json';
 * <LottiePlayer animation={animData} loop autoplay />
 */
export default function LottiePlayer({
  animation,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
  onComplete,
}) {
  if (!animation) return null;
  return (
    <Lottie
      animationData={animation}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
      onComplete={onComplete}
      rendererSettings={{
        preserveAspectRatio: 'xMidYMid slice',
        progressiveLoad: true,
      }}
    />
  );
}
