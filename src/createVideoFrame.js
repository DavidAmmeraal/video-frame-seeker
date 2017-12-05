import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

import {
  FRAME_RATES,
  SEEK_TIMEOUT,
  INVALID_ELEMENT_ERROR,
  INVALID_FRAME_RATE_ERROR,
  INVALID_SEEK_TIMEOUT_ERROR,
} from './constants';

import VideoFrame from './VideoFrame';

const isVideoElement = obj => obj instanceof HTMLElement && obj.tagName === 'VIDEO';

export default ({
  video,
  frameRate,
  seekTimeout = SEEK_TIMEOUT,
}) => {
  if (!isVideoElement(video)) throw new Error(INVALID_ELEMENT_ERROR);

  let fps;
  if (isNumber(frameRate)) {
    fps = frameRate;
  } else if (isString(frameRate) && FRAME_RATES[frameRate]) {
    fps = FRAME_RATES[frameRate];
  } else throw new Error(INVALID_FRAME_RATE_ERROR);

  if (!isNumber(seekTimeout)) {
    throw new Error(INVALID_SEEK_TIMEOUT_ERROR);
  }

  return new VideoFrame(video, fps, seekTimeout);
};
