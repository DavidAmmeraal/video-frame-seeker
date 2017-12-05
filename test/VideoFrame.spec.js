/* global describe, it */

import { expect } from 'chai';

import * as constants from '../src/constants';
import VideoFrame from '../src/VideoFrame';

describe('VideoFrame', () => {
  const video = document.createElement('video');
  video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
  video.id = 'bunnyVideo';

  const frameRate = 25;
  const seekTimeout = 5000;

  it('getVideo() return video element passed', (done) => {
    const videoFrame = new VideoFrame(video, frameRate, seekTimeout);
    expect(videoFrame.getVideo()).to.equal(video);
    done();
  });

  it('get() should return valid frame', (done) => {
    const videoFrame = new VideoFrame(video, frameRate, seekTimeout);
    expect(videoFrame.get()).to.equal(0);

    const times = [2, 2.03, 2.05, 99999];

    times.forEach((time) => {
      video.currentTime = time;
      expect(videoFrame.get()).to.equal(Math.floor(time * frameRate));
    });

    done();
  });
});
