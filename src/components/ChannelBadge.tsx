import { channelOf } from '../data/channels';
import type { ChannelId } from '../types';

export function ChannelBadge({ id }: { id: ChannelId }) {
  const channel = channelOf(id);
  return (
    <span className={`badge channel-${id}`} title={channel.name}>
      {channel.shortName}
    </span>
  );
}
