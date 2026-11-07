import test from 'node:test';
import assert from 'node:assert/strict';
import {scheduleLabelSchema,validateScheduleLabel} from '../lib/schedule.mjs';

test('schedule tool exposes and enforces its label limit with a recoverable error',()=>{
 const label='Mondays 09:00 Europe/London · Last run 7 Nov 2026: 14 checked, 11 fetched, 2 summaries saved, 3 source failures';
 assert.equal(validateScheduleLabel(label),label);
 assert.equal(validateScheduleLabel('x'.repeat(scheduleLabelSchema.maxLength)).length,149);
 for(const invalid of ['x'.repeat(150),'', '   ',null,42]){
  assert.throws(()=>validateScheduleLabel(invalid),/1–149 characters.*do not rerun source checks/);
 }
});
