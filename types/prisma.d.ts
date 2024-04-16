declare global {
  namespace PrismaJson {
    type CredentialMetadata = {
      scopes?: string[];
    };

    type IntegrationMetadata = {
      webhooks?: {
        url: string;
        topics: string[];
      }[];
    };
  }
}
