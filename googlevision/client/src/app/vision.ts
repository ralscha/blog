export interface VisionResult {
  error?: string;
  labels: Label[];
  safeSearch: SafeSearch;
  logos: Logo[];
  landmarks: Landmark[];
  texts: Text[];
  faces: Face[];
  web: Web;
}

export type Likelihood = 'UNKNOWN' | 'VERY_UNLIKELY' | 'UNLIKELY' | 'POSSIBLE' | 'LIKELY' | 'VERY_LIKELY' | 'UNRECOGNIZED';

export interface Face {
  rollAngle: number;
  panAngle: number;
  tiltAngle: number;
  detectionConfidence: number;
  landmarkingConfidence: number;

  joy: Likelihood;
  sorrow: Likelihood;
  anger: Likelihood;
  surprise: Likelihood;
  underExposed: Likelihood;
  blurred: Likelihood;
  headwear: Likelihood;

  joyRating: number;
  sorrowRating: number;
  angerRating: number;
  surpriseRating: number;
  underExposedRating: number;
  blurredRating: number;
  headwearRating: number;

  boundingPoly: Vertex[];
  fdBoundingPoly: Vertex[];
  landmarks: FaceLandmark[];
}

export interface FaceLandmark {
  type: 'UNKNOWN_LANDMARK' | 'LEFT_EYE' | 'RIGHT_EYE' | 'LEFT_OF_LEFT_EYEBROW' | 'RIGHT_OF_LEFT_EYEBROW' | 'LEFT_OF_RIGHT_EYEBROW'
    | 'RIGHT_OF_RIGHT_EYEBROW' | 'MIDPOINT_BETWEEN_EYES' | 'NOSE_TIP' | 'UPPER_LIP' | 'LOWER_LIP' | 'MOUTH_LEFT' | 'MOUTH_RIGHT'
    | 'MOUTH_CENTER' | 'NOSE_BOTTOM_RIGHT' | 'NOSE_BOTTOM_LEFT' | 'NOSE_BOTTOM_CENTER' | 'LEFT_EYE_TOP_BOUNDARY'
    | 'LEFT_EYE_RIGHT_CORNER' | 'LEFT_EYE_BOTTOM_BOUNDARY' | 'LEFT_EYE_LEFT_CORNER' | 'RIGHT_EYE_TOP_BOUNDARY'
    | 'RIGHT_EYE_RIGHT_CORNER' | 'RIGHT_EYE_BOTTOM_BOUNDARY' | 'RIGHT_EYE_LEFT_CORNER' | 'LEFT_EYEBROW_UPPER_MIDPOINT'
    | 'RIGHT_EYEBROW_UPPER_MIDPOINT' | 'LEFT_EAR_TRAGION' | 'RIGHT_EAR_TRAGION' | 'LEFT_EYE_PUPIL' | 'RIGHT_EYE_PUPIL'
    | 'FOREHEAD_GLABELLA' | 'CHIN_GNATHION' | 'CHIN_LEFT_GONION' | 'CHIN_RIGHT_GONION' | 'UNRECOGNIZED';
  x: number;
  y: number;
  z: number;
}

export interface Label {
  description: string;
  score: number;
}

export interface Landmark {
  description: string;
  score: number;
  boundingPoly: Vertex[];
  locations: LngLat[];
}

export interface LngLat {
  lng: number;
  lat: number;
}

export interface Logo {
  description: string;
  score: number;
  boundingPoly: Vertex[];
}

export interface SafeSearch {
  adult: Likelihood;
  spoof: Likelihood;
  medical: Likelihood;
  violence: Likelihood;
  adultRating: number;
  spoofRating: number;
  medicalRating: number;
  violenceRating: number;
}

export interface Text {
  description: string;
  boundingPoly: Vertex[];
}

export interface Vertex {
  x: number;
  y: number;
}

export interface Web {
  webEntities: WebEntity[];
  fullMatchingImages: WebUrl[];
  partialMatchingImages: WebUrl[];
  pagesWithMatchingImages: WebUrl[];
}

export interface WebUrl {
  url: string;
  score: number;
}

export interface WebEntity {
  entityId: string;
  score?: number;
  description: string;
}
