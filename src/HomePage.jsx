import React, { Component } from 'react';
import Navbar from './homepage-component/Navbar/Navbar';
import Player from './homepage-component/Player/Player';
import userIcon from './assets/images/img10.jpg';
import { GoogleLogin } from 'react-google-login';
import history from './history';
import { GoogleLogout } from 'react-google-login';
import './HomePage.css';

import mainImage from './assets/images/img12.jpg';
import googleIcon from './assets/icons/google-icon.svg';
import loaderIcon from './assets/icons/loader.svg';

const axios = require('axios');

const SERVER_ADDRESS = 'http://localhost:8000/api';
const CLIENT_ID =
  '390511031158-234aa4gmc6oadsj6inuku9hi9f6ug8vq.apps.googleusercontent.com';

export default class HomePage extends Component {
  state = {
    currSong: new Audio(),
    hasSongLoaded: false,
    isSongPlaying: false,
    songName: '',
    songArtist: '',
    albumArt: '',
    streamAddress: '',
    songTimeElapsed: 0,
    songDuration: 0,
    songVolume: 5,
    isLoggedIn: false,
    userIcon: userIcon,
    loginButton_style: { display: 'block' },
    playerButton_style: { display: 'none' },
    streamAddress: '',
  };

  loader = (
    <div className='loader-container'>
      <img src={loaderIcon} alt='Loader Icon' />
    </div>
  );

  async componentDidMount() {
    try {
      const result = await axios.get(`${SERVER_ADDRESS}/random`);
      const songData = result.data;

      this.setState({
        currSong: new Audio(songData.streamAddress),
        // currSong: new Audio('http://localhost:8080/'),
        songName: songData.song,
        songArtist: songData.artist,
        albumArt: songData.thumbnail.url,
        streamAddress: songData.streamAddress,
      });

      this.state.currSong.addEventListener('canplaythrough', () => {
        this.setState({
          songDuration: this.state.currSong.duration,
          hasSongLoaded: true,
        });
        this.state.currSong.volume = 0.5;
      });
      this.state.currSong.ontimeupdate = () => {
        this.setState({
          songTimeElapsed: this.state.currSong.currentTime,
        });
      };
    } catch (err) {
      console.log(err);
    }
  }

  // Event Handler to toggle the song.
  toggleSong = (event) => {
    const toggleButton = event.target;

    if (this.state.currSong.paused) {
      toggleButton.classList.remove('play');
      toggleButton.classList.add('pause');
      this.state.currSong.play();
      this.setState({
        isSongPlaying: true,
      });
    } else {
      toggleButton.classList.remove('pause');
      toggleButton.classList.add('play');
      this.state.currSong.pause();
      this.setState({
        isSongPlaying: false,
      });
    }
  };

  // Event Handler to change song time.
  changeSongTime = (event) => {
    const seekSlider = event.target;
    this.state.currSong.currentTime = `${seekSlider.value}`;
    this.setState({ songTimeElapsed: this.state.currSong.currentTime });
    // this.state.currSong.ontimeupdate = () => {
    //   this.setState({
    //     songTimeElapsed: this.state.currSong.currentTime,
    //   });
  };

  // Event Handler to change song volume.
  changeSongVolume = (event) => {
    this.state.currSong.volume = event.target.value / 10;
    this.setState({
      currSongVolume: event.target.value,
    });
  };

  onLoginSuccess = async (res) => {
    try {
      const loginResponse = await axios({
        method: 'POST',
        url: `${SERVER_ADDRESS}/login`,
        data: {
          tokenId: res.tokenId,
        },
      });
      const data = loginResponse.data;
      console.log(data);

      if (data.isEmailVerified === true) {
        this.setState({
          userIcon: data.userIcon,
          isLoggedIn: true,
        });
      }
    } catch (err) {
      console.log(`Login Error from our server: ${err}`);
    }
  };

  onLoginFaliure = (err) => {
    console.log(err);
  };

  onLogoutSuccess = (res) => {
    console.log('signed out ' + res);
    this.setState({
      isLoggedIn: false,
    });
  };

  onLogoutFaliure = (err) => {
    console.log(err);
  };

  openPlayer = () => {
    history.push('/player');
  };

  render() {
    return (
      <>
        <div class='wrapper' style={this.state.landingPage_style}>
          <Navbar
            isLoggedIn={this.state.isLoggedIn}
            userIcon={this.state.userIcon}
            clientId={CLIENT_ID}
            onLoginSuccess={this.onLoginSuccess}
            onLoginFaliure={this.onLoginFaliure}
            onLogoutSuccess={this.onLogoutSuccess}
            onLogoutFaliure={this.onLogoutFaliure}
          />
          <div className='container'>
            <div className='main-section'>
              <section className='main-section-left'>
                <div className='homepage-heading'>Listen to AD free music </div>
                <div className='homepage-subheading'>
                  All your favourite artists at one spot.
                </div>
                <div className='signin-button'>
                  <GoogleLogin
                    className='google-login-button'
                    clientId={CLIENT_ID}
                    onSuccess={this.onLoginSuccess}
                    onFailure={this.onLoginFaliure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    icon={false}
                  >
                    <img
                      src={googleIcon}
                      alt='Google Icon'
                      className='google-icon'
                    />
                    <span>Sign In With Google</span>
                  </GoogleLogin>
                </div>
                <div className='player-button'>
                  <button
                    onClick={this.openPlayer}
                    style={this.state.playerButton_style}
                  >
                    Go to Player
                  </button>
                </div>
              </section>
              <section className='main-section-right'>
                <div className='right-section-container'>
                  <div className='right-section-popups music-details-container'>
                    {this.state.hasSongLoaded ? (
                      <div className='music-details'>
                        <div
                          className='track-icon'
                          style={{
                            backgroundImage: `url(${this.state.albumArt})`,
                          }}
                        ></div>
                        <div className='track-info-container'>
                          <span className='now-playing'>Now Playing</span>
                          <span className='track-name'>
                            {this.state.songName}
                          </span>
                          <span className='artist-name'>
                            {this.state.songArtist}
                          </span>
                        </div>
                      </div>
                    ) : (
                      this.loader
                    )}
                  </div>
                  <div
                    className='main-image-container'
                    style={{
                      backgroundImage: `url(${mainImage})`,
                    }}
                  ></div>
                  <div className='right-section-popups music-player-container'>
                    {this.state.hasSongLoaded ? (
                      <Player
                        songTimeElapsed={this.state.songTimeElapsed}
                        songDuration={this.state.songDuration}
                        volume={this.state.songVolume}
                        onPlayPause={this.toggleSong}
                        onSongSeek={this.changeSongTime}
                        onVolumeChange={this.changeSongVolume}
                      />
                    ) : (
                      this.loader
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </>
    );
  }
}
