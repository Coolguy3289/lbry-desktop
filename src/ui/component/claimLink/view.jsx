// @flow
import * as React from 'react';
import Button from 'component/button';
import PreviewLink from 'component/previewLink';
import ChannelTooltip from 'component/channelTooltip';
import { parseURI } from 'lbry-redux';

type Props = {
  uri: string,
  title: ?string,
  claim: StreamClaim,
  children: React.Node,
  thumbnail: ?string,
  autoEmbed: ?boolean,
  description: ?string,
  currentTheme: ?string,
  isResolvingUri: boolean,
  resolveUri: string => void,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
};

class ClaimLink extends React.Component<Props> {
  static defaultProps = {
    href: null,
    title: null,
    thumbnail: null,
    autoEmbed: false,
    description: null,
    isResolvingUri: false,
  };

  isClaimBlackListed() {
    const { claim, blackListedOutpoints } = this.props;

    if (claim && blackListedOutpoints) {
      let blackListed = false;

      for (let i = 0; i < blackListedOutpoints.length; i += 1) {
        const outpoint = blackListedOutpoints[i];
        if (outpoint.txid === claim.txid && outpoint.nout === claim.nout) {
          blackListed = true;
          break;
        }
      }
      return blackListed;
    }
  }

  componentDidMount() {
    const { isResolvingUri, resolveUri, uri, claim } = this.props;
    if (!isResolvingUri && !claim) {
      resolveUri(uri);
    }
  }

  componentDidUpdate() {
    const { isResolvingUri, resolveUri, claim, uri } = this.props;
    if (!isResolvingUri && uri && !claim) {
      resolveUri(uri);
    }
  }

  render() {
    const { uri, claim, title, description, thumbnail, currentTheme, autoEmbed, children, isResolvingUri } = this.props;
    const isUnresolved = (!isResolvingUri && !claim) || !claim;
    const isBlacklisted = this.isClaimBlackListed();

    if (isBlacklisted || isUnresolved) {
      return <span>{children}</span>;
    }

    const { claim_id: claimId, name: claimName } = claim;
    const { isChannel, path } = parseURI(uri);
    const isChannelClaim = isChannel && !path;
    const showPreview = autoEmbed === true && !isUnresolved;

    const link = (
      <Button
        label={children}
        title={!isChannelClaim ? title || claimName : undefined}
        button={!isChannel ? 'link' : undefined}
        navigate={uri}
        className="button--uri-indicator"
      />
    );

    const wrappedLink = (
      <ChannelTooltip
        uri={uri}
        title={title}
        claimId={claimId}
        channelName={claimName}
        ariaLabel={title || claimName}
        currentTheme={currentTheme}
        thumbnail={thumbnail}
        description={description}
      >
        <span>{link}</span>
      </ChannelTooltip>
    );

    return (
      <React.Fragment>
        {isChannelClaim ? wrappedLink : link}
        {showPreview && <PreviewLink uri={uri} />}
      </React.Fragment>
    );
  }
}

export default ClaimLink;