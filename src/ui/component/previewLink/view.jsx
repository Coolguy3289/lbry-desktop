// @flow
import * as React from 'react';
import DateTime from 'component/dateTime';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import MarkdownPreview from 'component/common/markdown-preview';
import { withRouter } from 'react-router-dom';
import { formatLbryUriForWeb } from 'util/uri';

type Props = {
  uri: string,
  title: ?string,
  thumbnail: ?string,
  description: ?string,
  history: { push: string => void },
};

class PreviewLink extends React.PureComponent<Props> {
  handleClick = () => {
    const { uri, history } = this.props;
    history.push(formatLbryUriForWeb(uri));
  };

  render() {
    const { uri, title, description, thumbnail } = this.props;
    const placeholder = 'static/img/placeholder.png';

    const thumbnailStyle = {
      backgroundImage: `url(${thumbnail || placeholder})`,
    };

    return (
      <span className={'preview-link'} role="button" onClick={this.handleClick}>
        <span className={'media-tile media-tile--small card--link'}>
          <span style={thumbnailStyle} className={'preview-link--thumbnail media__thumb'} />
          <span className={'preview-link--text media__info'}>
            <span className={'preview-link--title media__title'}>
              <TruncatedText text={title} lines={1} />
            </span>
            <span className={'preview-link--description media__subtext'}>
              <span className={'truncated-text'}>
                {__('Published to')} <UriIndicator uri={uri} link /> <DateTime timeAgo uri={uri} />
              </span>
            </span>
            <span className={'preview-link--description media__subtext'}>
              <TruncatedText lines={2} showTooltip={false}>
                <MarkdownPreview content={description} promptLinks strip />
              </TruncatedText>
            </span>
          </span>
        </span>
      </span>
    );
  }
}

export default withRouter(PreviewLink);