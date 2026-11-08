import type { Listing } from '../types';
import { LISTINGS_FETCHED_AT, LISTINGS_SOURCE, LIVE_LISTINGS } from './live-listings';

export { LISTINGS_FETCHED_AT, LISTINGS_SOURCE };

/** 苹果官网翻新页抓到的在售机器。每条 linkUrl 是对应商品页。 */
export const LISTINGS: Listing[] = LIVE_LISTINGS.map((item) => ({ ...item }));
