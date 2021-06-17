import React, { Component } from 'react';
import Navbar from './homepage-component/Navbar/Navbar';
import Player from './homepage-component/Player/Player';
import userIcon from './assets/images/img10.jpg';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import './HomePage.css';

import mainImage from './assets/images/img12.jpg';
import googleIcon from './assets/icons/google-icon.svg';

const axios = require('axios');

const SERVER_ADDRESS = 'http://localhost:8000/';

export default class HomePage extends Component {
  state = {
    currSong: new Audio(),
    songName: 'Rap God',
    songArtist: 'Eminem',
    albumArt:
      'https://jitselemmens.com/newsite/wp-content/uploads/2017/08/rap_godb.jpg',
    streamAddress: '',
    currSongTime: 0,
    currSongDuration: 0,
    currSongVolume: 5,
    isLoggedIn: false,
    profile_pic: userIcon,
  };

  async componentDidMount() {
    try {
      const tempresult = await axios.get(`${SERVER_ADDRESS}music`);
      const result = await axios.get(`${SERVER_ADDRESS}music`);
      const musicResult = result.data;
      console.log(musicResult);

      this.setState({
        currSong: new Audio(musicResult.streamAddress),
        // currSong: new Audio('http://localhost:8080/'),
        songName: musicResult.song,
        songArtist: musicResult.artist,
        albumArt: musicResult.thumbnail.url,
      });

      this.state.currSong.addEventListener('canplaythrough', () => {
        this.setState({
          currSongDuration: this.state.currSong.duration,
        });
        this.state.currSong.volume = 0.5;
      });
      this.state.currSong.ontimeupdate = () => {
        this.setState({
          currSongTime: this.state.currSong.currentTime,
        });
      };
    } catch (err) {
      console.log(err);
    }
  }

  toggleSong = () => {
    if (this.state.currSong.paused) this.state.currSong.play();
    else this.state.currSong.pause();
  };

  changeSongTime = (event) => {
    console.log(event.target.value);
    this.state.currSong.currentTime = `${event.target.value}`;
    console.log(this.state.currSong.currentTime);
  };

  changeSongVolume = (event) => {
    this.state.currSong.volume = event.target.value / 10;
    this.setState({
      currSongVolume: event.target.value,
    });
  };

  loginSuccess = (res) => {
    axios({
      method: 'POST',
      url: `${SERVER_ADDRESS}login`,
      data: {
        tokenId: res.tokenId,
      },
    }).then((response) => {
      console.log('response from backend');
      const data = response.data;
      console.log(data.email_verified);
      console.log(data.picture);
      if (data.email_verified === true) {
        console.log('here');
        this.setState({
          profile_pic: data.picture,
        });
      }
    });
    console.log(res);
  };

  loginFaliure = (res) => {
    // console.log(res);
  };

  logoutSuccess = (res) => {
    console.log('signed out ' + res);
    this.setState({ profile_pic: userIcon });
  };

  logoutFaliure = (err) => {
    console.log(err);
  };

  render() {
    return (
      <div class='wrapper'>
        <Navbar
          userimageUrl={this.state.profile_pic}
          SERVER_ADDRESS='http://localhost:8000/'
          logoutSuccess={this.logoutSuccess}
          logoutFaliure={this.logoutFaliure}
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
                  clientId='390511031158-234aa4gmc6oadsj6inuku9hi9f6ug8vq.apps.googleusercontent.com'
                  onSuccess={this.loginSuccess}
                  onFailure={this.loginFaliure}
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
            </section>
            <section className='main-section-right'>
              <div className='right-section-container'>
                <div className='right-section-popups music-details-container'>
                  <div
                    className='track-icon'
                    style={{
                      backgroundImage: `url(${this.state.albumArt})`,
                    }}
                  ></div>
                  <div className='track-info-container'>
                    <span className='now-playing'>Now Playing</span>
                    <span className='track-name'>{this.state.songName}</span>
                    <span className='artist-name'>{this.state.songArtist}</span>
                  </div>
                </div>
                <div
                  className='main-image-container'
                  style={{
                    backgroundImage: `url(${mainImage})`,
                  }}
                ></div>
                <div className='right-section-popups music-player-container'>
                  <Player
                    clicked={this.toggleSong}
                    currSongTime={this.state.currSongTime}
                    currSongDuration={this.state.currSongDuration}
                    slide={this.changeSongTime}
                    volumeChange={this.changeSongVolume}
                    volume={this.state.currSongVolume}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
