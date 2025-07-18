export type CreateCustomLinkModel = {
  surveyId: string;
  companyId: string;
  customLinkPayload: {
    isActive: boolean;
    name: string;
    usageLimit: number;
  };
};
