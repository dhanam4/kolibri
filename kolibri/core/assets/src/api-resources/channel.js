import { Resource } from '../api-resource';

/**
 * @example Delete a channel
 * ChannelResource.deletModel({ id: channel_id })
 *
 * @example Only get the channels that are "available" (i.e. with resources on device)
 * ChannelResource.fetchCollection({ getParams: { available: true } })
 */
export default new Resource({
  name: 'channel',
});
