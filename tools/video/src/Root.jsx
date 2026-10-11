import { Composition } from 'remotion';
import { MangaLoop, FPS, DURATION } from './MangaLoop';

export const RemotionRoot = () => (
  <>
    <Composition
      id="MangaLoop"
      component={MangaLoop}
      durationInFrames={DURATION}
      fps={FPS}
      width={1280}
      height={720}
      defaultProps={{ invert: true }}
    />
    <Composition
      id="MangaLoopLight"
      component={MangaLoop}
      durationInFrames={DURATION}
      fps={FPS}
      width={1280}
      height={720}
      defaultProps={{ invert: false }}
    />
  </>
);
