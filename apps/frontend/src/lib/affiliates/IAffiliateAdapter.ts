export interface IAffiliateAdapter {
  generateDeepLink(originalUrl: string, advertiserId?: string): Promise<string>;
}
