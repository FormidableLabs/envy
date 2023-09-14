import sanityClient, { SanityClient } from '@sanity/client';
import { BaseQuery, makeSafeQueryRunner } from 'groqd';

export default class Sanity {
  private client: SanityClient;

  constructor() {
    this.client = sanityClient({
      apiVersion: '2021-10-21',
      projectId: '5bsv02jj', // "Formidable Boulangerie" Sanity project
      dataset: 'production',
      useCdn: true,
      useProjectHostname: true,
    });
  }

  async runQuery(query: BaseQuery<any>, params?: Record<string, unknown>) {
    const runSafeQuery = makeSafeQueryRunner((query, params) => {
      return this.client.fetch(query, params);
    });

    return runSafeQuery(query, params);
  }
}
