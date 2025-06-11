export type CreateCompanyModel = {
  legalName: string;
  document: string;
  fantasyName: string;
  logoUrl?: string;
  addressLine: string;
  theme?: {
    primary: string;
  };
  settings?: {
    always_display_logo?: boolean;
  };
};
