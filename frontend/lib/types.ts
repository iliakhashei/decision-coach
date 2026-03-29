export type Decision = {
  id: number;
  user_id: number;
  title: string;
  raw_input_text: string;
  category: string | null;
  status: string;
  answers_json: string | null;
  recommendation_json: string | null;
  created_at: string;
  updated_at: string;
};

export type QuestionsResponse = {
  questions: string[];
};

export type RecommendationResponse = {
  summary: string;
  recommendation: string;
  key_risks: string[];
  confidence: string;
  reasoning: string[];
};

export type OutcomeResponse = {
  id: number;
  decision_id: number;
  action_taken: string;
  result_rating: number;
  outcome_text: string;
  lessons_learned: string;
  would_repeat: boolean;
  created_at: string;
};

export type PatternsResponse = {
  patterns: {
    pattern_type: string;
    description: string;
    confidence: string;
    evidence: string[];
  }[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  user_id: number;
  name: string;
  email: string;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};