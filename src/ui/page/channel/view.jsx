// @flow
import React from 'react';
import { parseURI } from 'lbry-redux';
import Page from 'component/page';
import SubscribeButton from 'component/subscribeButton';
import ShareButton from 'component/shareButton';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { withRouter } from 'react-router';
import { formatLbryUriForWeb } from 'util/uri';
import ChannelContent from 'component/channelContent';
import ChannelAbout from 'component/channelAbout';
import ChannelThumbnail from 'component/channelThumbnail';

const PAGE_VIEW_QUERY = `view`;
const ABOUT_PAGE = `about`;

type Props = {
  uri: string,
  title: ?string,
  cover: ?string,
  thumbnail: ?string,
  page: number,
  location: { search: string },
  history: { push: string => void },
  match: { params: { attribute: ?string } },
};

function ChannelPage(props: Props) {
  const { uri, title, cover, history, location, page } = props;
  const { channelName, claimName, claimId } = parseURI(uri);
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const currentView = urlParams.get(PAGE_VIEW_QUERY) || undefined;

  // If a user changes tabs, update the url so it stays on the same page if they refresh.
  // We don't want to use links here because we can't animate the tab change and using links
  // would alter the Tab label's role attribute, which should stay role="tab" to work with keyboards/screen readers.
  const tabIndex = currentView === ABOUT_PAGE ? 1 : 0;
  const onTabChange = newTabIndex => {
    let url = formatLbryUriForWeb(uri);
    let search = '?';
    if (newTabIndex !== 0) {
      search += `${PAGE_VIEW_QUERY}=${ABOUT_PAGE}`;
    } else {
      search += `page=${page}`;
    }

    history.push(`${url}${search}`);
  };

  return (
    <Page>
      <div className="card">
        <header className="channel-cover">
          {cover && <img className="channel-cover__custom" src={cover} />}

          <div className="channel__primary-info">
            <ChannelThumbnail className="channel__thumbnail--channel-page" uri={uri} />

            <div>
              <h1 className="channel__title">{title || channelName}</h1>
              <h2 className="channel__url">
                {claimName}
                {claimId && `#${claimId}`}
              </h2>
            </div>
          </div>
        </header>

        <Tabs onChange={onTabChange} index={tabIndex}>
          <TabList className="tabs__list--channel-page">
            <Tab>{__('Content')}</Tab>
            <Tab>{__('About')}</Tab>
            <div className="card__actions">
              <ShareButton uri={uri} />
              <SubscribeButton uri={uri} />
            </div>
          </TabList>

          <TabPanels className="channel__data">
            <TabPanel>
              <ChannelContent uri={uri} />
            </TabPanel>
            <TabPanel>
              <ChannelAbout uri={uri} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Page>
  );
}

export default withRouter(ChannelPage);
