// @TODO: Customize advice based on OS
// @flow
import * as icons from 'constants/icons';
import * as React from 'react';
// @if TARGET='app'
import { shell } from 'electron';
// @endif
import { Lbry } from 'lbry-redux';
import Native from 'native';
import Button from 'component/button';
import Page from 'component/page';
import BackupSection from 'component/walletBackup';

type DeamonSettings = {
  data_dir: string | any,
};

type Props = {
  deamonSettings: DeamonSettings,
  accessToken: string,
  fetchAccessToken: () => void,
  doAuth: () => void,
  user: any,
};

type VersionInfo = {
  os_system: string,
  os_release: string,
  platform: string,
  lbrynet_version: string,
};

type State = {
  versionInfo: VersionInfo | any,
  lbryId: String | any,
  uiVersion: ?string,
  upgradeAvailable: ?boolean,
  accessTokenHidden: ?boolean,
};

class HelpPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      versionInfo: null,
      lbryId: null,
      uiVersion: null,
      upgradeAvailable: null,
      accessTokenHidden: true,
    };

    (this: any).showAccessToken = this.showAccessToken.bind(this);
    (this: any).openLogFile = this.openLogFile.bind(this);
  }

  componentDidMount() {
    // @if TARGET='app'
    Native.getAppVersionInfo().then(({ localVersion, upgradeAvailable }) => {
      this.setState({
        uiVersion: localVersion,
        upgradeAvailable,
      });
    });
    if (!this.props.accessToken) this.props.fetchAccessToken();
    // @endif

    Lbry.version().then(info => {
      this.setState({
        versionInfo: info,
      });
    });
    Lbry.status().then(info => {
      this.setState({
        lbryId: info.installation_id,
      });
    });
  }

  showAccessToken() {
    this.setState({
      accessTokenHidden: false,
    });
  }

  openLogFile(userHomeDirectory: string) {
    const logFileName = 'lbrynet.log';
    const os = this.state.versionInfo.os_system;
    if (os === 'Darwin' || os === 'Linux') {
      shell.openItem(`${userHomeDirectory}/${logFileName}`);
    } else {
      shell.openItem(`${userHomeDirectory}\\${logFileName}`);
    }
  }

  render() {
    let ver;
    let osName;
    let platform;
    let newVerLink;

    const { accessToken, doAuth, user, deamonSettings } = this.props;
    const { data_dir: dataDirectory } = deamonSettings;

    if (this.state.versionInfo) {
      ver = this.state.versionInfo;
      if (ver.os_system === 'Darwin') {
        osName = parseInt(ver.os_release.match(/^\d+/), 10) < 16 ? 'Mac OS X' : 'Mac OS';

        platform = `${osName} ${ver.os_release}`;
        newVerLink = 'https://lbry.com/get/lbry.dmg';
      } else if (ver.os_system === 'Linux') {
        platform = `Linux (${ver.platform})`;
        newVerLink = 'https://lbry.com/get/lbry.deb';
      } else {
        platform = `Windows (${ver.platform})`;
        newVerLink = 'https://lbry.com/get/lbry.msi';
      }
    } else {
      ver = null;
    }

    return (
      <Page>
        <section className="card card--section">
          <header className="card__header">
            <h2 className="card__title">{__('Read the FAQ')}</h2>
            <p className="card__subtitle">{__('Our FAQ answers many common questions.')}</p>
          </header>

          <div className="card__content">
            <div className="card__actions">
              <Button href="https://lbry.com/faq" label={__('Read the FAQ')} icon={icons.HELP} button="inverse" />
            </div>
          </div>
        </section>

        <section className="card card--section">
          <header className="card__header">
            <h2 className="card__title">{__('Get Live Help')}</h2>

            <p className="card__subtitle">
              {__('Live help is available most hours in the')} <strong>#help</strong>{' '}
              {__('channel of our Discord chat room.')}
            </p>
          </header>

          <div className="card__content">
            <div className="card__actions">
              <Button button="inverse" label={__('Join Our Chat')} icon={icons.CHAT} href="https://chat.lbry.com" />
            </div>
          </div>
        </section>
        <section className="card card--section">
          <header className="card__header">
            <h2 className="card__title">{__('Report a Bug or Suggest a New Feature')}</h2>

            <p className="card__subtitle">
              {__('Did you find something wrong? Think LBRY could add something useful and cool?')}{' '}
              <Button button="link" label={__('Learn more')} href="https://lbry.com/faq/support" />.
            </p>
          </header>

          <div className="card__content">
            <div className="card__actions">
              <Button
                navigate="/$/report"
                label={__('Submit a Bug Report/Feature Request')}
                icon={icons.REPORT}
                button="inverse"
              />
            </div>

            <div className="help">{__('Thanks! LBRY is made by its users.')}</div>
          </div>
        </section>

        {/* @if TARGET='app' */}
        <section className="card card--section">
          <header className="card__header">
            <h2 className="card__title">{__('View your Log')}</h2>

            <p className="card__subtitle">
              {__('Did something go wrong? Have a look in your log file, or send it to')}{' '}
              <Button button="link" label={__('support')} href="https://lbry.com/faq/support" />.
            </p>
          </header>

          <div className="card__content">
            <div className="card__actions">
              <Button button="inverse" label={__('Open Log')} onClick={() => this.openLogFile(dataDirectory)} />
              <Button button="inverse" label={__('Open Log Folder')} onClick={() => shell.openItem(dataDirectory)} />
            </div>
          </div>
        </section>

        {/* @if TARGET='app' */}
        <BackupSection />
        {/* @endif */}

        <section className="card">
          <header className="table__header">
            <h2 className="card__title">{__('About')}</h2>

            {this.state.upgradeAvailable !== null && this.state.upgradeAvailable ? (
              <p className="card__subtitle">
                {__('A newer version of LBRY is available.')}{' '}
                <Button button="link" href={newVerLink} label={__('Download now!')} />
              </p>
            ) : (
              <p className="card__subtitle">{__('Your LBRY app is up to date.')}</p>
            )}
          </header>

          <div className="card__content">
            <table className="table table--stretch">
              <tbody>
                <tr>
                  <td>{__('App')}</td>
                  <td>{this.state.uiVersion}</td>
                </tr>
                <tr>
                  <td>{__('Daemon (lbrynet)')}</td>
                  <td>{ver ? ver.lbrynet_version : __('Loading...')}</td>
                </tr>
                <tr>
                  <td>{__('Connected Email')}</td>
                  <td>
                    {user && user.primary_email ? (
                      <React.Fragment>
                        {user.primary_email}{' '}
                        <Button
                          button="link"
                          href={`https://lbry.com/list/edit/${accessToken}`}
                          label={__('Update mailing preferences')}
                        />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <span className="empty">{__('none')} </span>
                        <Button button="link" onClick={() => doAuth()} label={__('set email')} />
                      </React.Fragment>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>{__('Reward Eligible')}</td>
                  <td>{user && user.is_reward_approved ? __('Yes') : __('No')}</td>
                </tr>
                <tr>
                  <td>{__('Platform')}</td>
                  <td>{platform}</td>
                </tr>
                <tr>
                  <td>{__('Installation ID')}</td>
                  <td>{this.state.lbryId}</td>
                </tr>
                <tr>
                  <td>{__('Access Token')}</td>
                  <td>
                    {this.state.accessTokenHidden && (
                      <Button button="link" label={__('View')} onClick={this.showAccessToken} />
                    )}
                    {!this.state.accessTokenHidden && accessToken && (
                      <div>
                        <p>{accessToken}</p>
                        <div className="alert-text">
                          {__('This is equivalent to a password. Do not post or share this.')}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* @endif */}
      </Page>
    );
  }
}

export default HelpPage;
