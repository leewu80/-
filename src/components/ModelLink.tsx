import { linkLabel } from '../data/links';
import { LINK_PLACEHOLDER } from '../format';
import type { Listing } from '../types';

/** 有地址就新开页面直达该机型；手工报价没填地址时才保留占位。 */
export function ModelLink({ listing }: { listing: Listing }) {
  if (!listing.linkUrl) {
    return <span className="link-placeholder">{LINK_PLACEHOLDER}</span>;
  }
  return (
    <a
      className="real-link"
      href={listing.linkUrl}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(event) => event.stopPropagation()}
    >
      {linkLabel(listing.channel)}
    </a>
  );
}
