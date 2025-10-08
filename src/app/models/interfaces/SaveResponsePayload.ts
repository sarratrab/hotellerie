export interface SaveResponsePayload {
  templateId?: string;      // optionnel
  surveyId:   string;       // <-- string (comme ta DB)
  employeeId: number;       // <-- tu mets l’ID choisi à la main
  answers: { fieldId: string; type: string; value: string }[];
  finalize: boolean;
}
// app/models/interfaces/save-response.dto.ts
export interface AnswerItem {
  fieldId: string;
  type: string;
  value: string;   // pour checkbox -> JSON stringifié "[]"
}

export interface SaveResponseDto {
  templateId?: string;
  surveyId: string;      // chez toi c’est une string
  employeeId: number;    // id choisi à la main
  answers: AnswerItem[];
  finalize: boolean;
}
