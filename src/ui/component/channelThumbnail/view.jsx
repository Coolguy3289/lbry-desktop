// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import classnames from 'classnames';
import Gerbil from './gerbil.png';

type Props = {
  thumbnail: ?string,
  uri: string,
  className?: string,
};

function ChannelThumbnail(props: Props) {
  const { thumbnail, uri, className } = props;

  // Generate a random color class based on the first letter of the channel name
  const { channelName } = parseURI(uri);
  const initializer = channelName.charCodeAt(0) - 65; // will be between 0 and 57
  const colorClassName = `channel-thumbnail__default--${initializer % 4}`;

  return (
    <div
      className={classnames('channel-thumbnail', className, {
        [colorClassName]: !thumbnail,
      })}
    >
      {!thumbnail && <img className="channel-thumbnail__default" src={Gerbil} />}
      {thumbnail && <img className="channel-thumbnail__custom" src={thumbnail} />}
    </div>
  );
}

export default ChannelThumbnail;
