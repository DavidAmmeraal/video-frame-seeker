/* global describe, it */
import { expect } from 'chai';
import createVideoFrame from '../src/createVideoFrame';

import * as constants from '../src/constants';

describe('createVideoFrame', () => {
  const video = document.createElement('video');
  video.id = 'bunnyVideo';

  const frameRate = 30;
  const seekTimeout = 5000;

  it('should create VideoFrame video element and framerate', (done) => {
    const videoFrame = createVideoFrame({ video, frameRate });
    expect(videoFrame.getVideo()).to.equal(video);
    done();
  });

  it('should only create VideoFrame with video element', (done) => {
    try {
      createVideoFrame({ video: document.createElement('div'), frameRate });
    } catch (err) {
      expect(err.message).to.equal(constants.INVALID_ELEMENT_ERROR);
      done();
    }
  });

  it('should only create VideoFrame with numerical framerate', (done) => {
    try {
      createVideoFrame({ video, frameRate: 'thirty' });
    } catch (err) {
      expect(err.message).to.equal(constants.INVALID_FRAME_RATE_ERROR);
      done();
    }
  });

  it('should create VideoFrame with custom seekTimeout', (done) => {
    createVideoFrame({ video, frameRate, seekTimeout });
    done();
  });

  it('should only create VideoFrame with numerical seekTimeout', (done) => {
    try {
      createVideoFrame({ video, frameRate, seekTimeout: 'a while' });
    } catch (err) {
      expect(err.message).to.equal(constants.INVALID_SEEK_TIMEOUT_ERROR);
      done();
    }
  });
});
