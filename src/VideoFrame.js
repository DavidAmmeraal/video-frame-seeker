import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';

import {
  SEEK_TYPES,
} from './constants';

const wrap = n => `${n}`.padStart('0', 2);

class VideoFrame {
  constructor(video, frameRate, seekTimeout) {
    this.seeking = false;
    this.seekingTimeout = null;
    this.video = video;
    this.frameRate = frameRate;
    this.seekTimeoutLength = seekTimeout;
  }

  get() {
    return Math.floor(this.video.currentTime * this.frameRate);
  }

  getVideo() {
    return this.video;
  }

  __seek(direction, frames) {
    if (!this.video.paused) this.video.pause();
    const frame = this.get();

    const newFrame = direction === 'backward' ? frame - frames : frame + frames;
    const newTime = (newFrame / this.frameRate) + 0.00001;
    this.video.currentTime = newTime;
  }

  seekForward(frames = 1) {
    const nFrames = Number(frames);
    this.__seek('forward', nFrames);
  }

  seekBackward(frames = 1) {
    const nFrames = Number(frames);
    this.__seek('backward', nFrames);
  }

  toTime(frames) {
    const time = !isNumber(frames) ? this.video.currentTime : frames;
    const fps = this.frameRate;
    const dt = new Date();
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    dt.setMilliseconds(time * 1000);
    const format = `hh:mm:ss${(frames ? ':ff' : '')}`;

    return format.replace(/hh|mm|ss|ff/g, (f) => {
      switch (f) {
        case 'hh': return wrap(dt.getHours() < 13 ? dt.getHours() : (dt.getHours() - 12));
        case 'mm': return wrap(dt.getMinutes());
        case 'ss': return wrap(dt.getSeconds());
        case 'ff': return wrap(Math.floor(((time % 1) * fps)));
        default: return null;
      }
    });
  }

  toSeconds(SMPTE) {
    if (!SMPTE) return Math.floor(this.video.currentTime);
    const time = SMPTE.split(':');
    return (((Number(time[0]) * 60) * 60) + (Number(time[1]) * 60) + Number(time[2]));
  }

  toMilliseconds(SMPTE = this.toSMTPE()) {
    const frames = Number(SMPTE.split(':')[3]);
    const milliseconds = (1000 / this.frameRate) * (!isNumber(frames) ? 0 : frames);
    return Math.floor(((this.toSeconds(SMPTE) * 1000) + milliseconds));
  }

  toSMPTE(frame) {
    if (!frame) return this.toTime(this.video.currentTime);
    const frameNumber = Number(frame);
    const fps = this.frameRate;

    const minute = fps * 60;
    const hour = minute * 60;

    const hours = wrap(`${(Math.floor(frameNumber / hour))}`);
    const minutesNo = Number(`${(frameNumber / minute)}`.split('.')[0]) % 60;
    const secondsNo = Number(`${(frameNumber / fps)}`.split('.')[0]) % 60;
    const minutes = wrap(`${minutesNo}`);
    const seconds = wrap(`${secondsNo}`);
    const frames = wrap(`${(frameNumber % fps)}`);

    const SMPTE = `${hours}:${minutes}:${seconds}:${frames}`;
    return SMPTE;
  }

  toFrames(SMPTE = this.toSMPTE()) {
    const time = SMPTE.split(':');
    const fps = this.frameRate;

    const hh = (((Number(time[0]) * 60) * 60) * fps);
    const mm = ((Number(time[1]) * 60) * fps);
    const ss = (Number(time[2]) * fps);
    const ff = Number(time[3]);
    return Math.floor((hh + mm + ss + ff));
  }

  smoothSeek(timeId, force) {
    return new Promise((resolve) => {
      if (!this.seeking || force) {
        this.seeking = true;
        this.seekTo(timeId).then(() => {
          this.seeking = false;
          resolve({
            type: 'QUICK_SEEK_SUCCESS',
            time: timeId,
          });
        });
      } else {
        resolve({
          type: 'QUICK_SEEK_SKIPPED',
          time: timeId,
        });
      }
    });
  }

  seek(timeId) {
    clearTimeout(this.seekingTimeout);
    this.seekingTimeout = null;

    let seekFrame;

    const fps = this.frameRate;

    if (isNumber(timeId)) {
      seekFrame = timeId * fps;
    } else if (isObject(timeId)) {
      const type = Object.keys(timeId)[0];
      const val = timeId[type];

      if (!SEEK_TYPES.indexOf(type) === -1) return Promise.reject(new Error('Invalid time identifier!'));

      switch (type) {
        case 'frame':
          seekFrame = Number(val);
          break;
        case 'seconds':
          seekFrame = Number(val) * fps;
          break;
        case 'milliseconds':
          seekFrame = (Number(val) / 1000) * fps;
          break;
        default: seekFrame = NaN;
      }
    }


    if (isNumber(seekFrame)) {
      const seekTime = (this.toMilliseconds(this.toSMPTE(seekFrame)) / 1000) + 0.001;
      this.video.currentTime = seekTime;
      return new Promise((resolve) => {
        this.seekingTimeout = setTimeout(() => {
          resolve({
            type: 'SEEK_TIMEOUT',
            frame: seekFrame,
          });
        }, this.seekTimeoutLength);

        const checkTime = () => {
          if (this.get() === seekFrame) {
            resolve({
              type: 'SEEK_SUCCESS',
              frame: seekFrame,
            });
            clearTimeout(this.seekingTimeout);
            this.video.removeEventListener('timeupdate', checkTime);
          }
        };

        this.video.addEventListener('timeupdate', checkTime);
      });
    }

    return Promise.reject(new Error('Invalid time identifier!'));
  }
}

export default VideoFrame;
