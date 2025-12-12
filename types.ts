export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  color: string;
  size: number;
}

// MediaPipe Hands types
export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface Results {
  multiHandLandmarks: HandLandmark[][];
  image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement;
}

export interface HandData {
  x: number;
  y: number;
  isGripping: boolean;
  isClosedFist: boolean; // New property for "Punch" gesture
  extendedFingers: number; // 0 to 5
  id: number;
}

export interface ContentCardData {
  id: string;
  title: string;
  category: string;
  shortDescription?: string;
  fullContent: string | string[];
  type: 'brand' | 'info' | 'value';
  gridArea?: string;
}

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}