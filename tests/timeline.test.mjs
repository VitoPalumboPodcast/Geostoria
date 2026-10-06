import test from 'node:test';
import assert from 'node:assert/strict';
import {timelineScrollLimits,clampTimelinePosition} from '../timeline.js';
const minYear=-3100,maxYear=2030;
test('primo e ultimo anno centrabili anche con asse più stretto del viewport',()=>{
 for(const width of [390,900,1280,1920])for(const scale of [.15,.35,1,4]) {
  const timelineWidth=(maxYear-minYear)*scale;
  for(const year of [minYear,-3000,1914,1960,2010,maxYear]) {
   const yearX=(year-minYear)*scale;
   const offset=clampTimelinePosition(width/2-yearX,width,timelineWidth);
   assert.equal(offset+yearX,width/2,`anno ${year}, viewport ${width}, scala ${scale}`);
  }
  const limits=timelineScrollLimits(width,timelineWidth);
  assert.equal(clampTimelinePosition(1e6,width,timelineWidth),limits.max);
  assert.equal(clampTimelinePosition(-1e6,width,timelineWidth),limits.min);
 }
});
test('zoom consecutivi mantengono il 2010 al centro fino alla scala massima',()=>{
 for(const width of [390,1280]) {
  let scale=.35,offset=width/2-(2010-minYear)*scale;
  for(let i=0;i<20;i++) {
   const centerYear=minYear+(width/2-offset)/scale;
   scale=Math.min(4,scale*1.3);
   offset=clampTimelinePosition(width/2-(centerYear-minYear)*scale,width,(maxYear-minYear)*scale);
   assert.ok(Math.abs(offset+(2010-minYear)*scale-width/2)<1e-8);
  }
 }
});
