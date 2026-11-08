import { LINK_PLACEHOLDER } from '../format';
import type { Listing } from '../types';

/** 有地址就新开页面。推荐卡用「去看看」，配置清单用「直达」。手工报价没填地址时才占位。 */
export function ModelLink({ listing, tone = 'look' }: { listing: Listing; tone?: 'look' | 'go' }) {
  if (!listing.linkUrl) {
    return <span className="link-placeholder">{LINK_PLACEHOLDER}</span>;
  }
  return (
    <a
      className={tone === 'go' ? 'go-link go-link-line' : 'go-link'}
      href={listing.linkUrl}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(event) => event.stopPropagation()}
    >
      {tone === 'go' ? '直达' : '去看看'}
    </a>
  );
}
