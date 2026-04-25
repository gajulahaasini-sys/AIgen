import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;

// Using reliable public domain/wikimedia audio for dummy tracks to ensure they load
export const AUDIO_TRACKS: Track[] = [
  {
    id: 'TRK_01',
    title: 'SYS.INIT_SEQ_01 // NEURAL_BOOT',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
    duration: '0:11'
  },
  {
    id: 'TRK_02',
    title: 'MEM.LEAK_DETECTED // CORRUPTION',
    url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/b/bb/Test_ogg_mp3_48kbps.wav/Test_ogg_mp3_48kbps.wav.ogg',
    duration: '0:05'
  },
  {
    id: 'TRK_03',
    title: 'KERNEL.PANIC_OVERRIDE // OVERCLOCK',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Tromboon-sample.ogg',
    duration: '0:08'
  }
];
