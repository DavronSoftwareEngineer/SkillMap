import { SOFTWARE_WORKSHOPS } from './workshops-software';
import { GEOSPATIAL_WORKSHOPS } from './workshops-geospatial';
import { LANGUAGE_WORKSHOPS } from './workshops-languages';
import { DECISION_WORKSHOPS } from './workshops-decisions';
import { BUSINESS_TRACKS } from './business';
import { SYSTEM_DESIGN_TRACK } from './system-design';
import type { LearningTrack, LearningCase } from './types';
import type { ModuleWorkshop } from './workshop-types';

function fromIndividualCases(track:LearningTrack) {
  return Object.fromEntries(track.cases.map((c:LearningCase)=>[c.modules[0],{
    concept:c.outcome,input:c.scenario,answer:c.worked.join('\n\n'),
    variation:c.transfer,acceptance:c.rubric.join(' '),
  }]));
}
export const MODULE_WORKSHOPS:Record<string,Record<string,ModuleWorkshop>>={
  ...SOFTWARE_WORKSHOPS,webgis:GEOSPATIAL_WORKSHOPS,...LANGUAGE_WORKSHOPS,
  ...DECISION_WORKSHOPS,founder:fromIndividualCases(BUSINESS_TRACKS.founder),
  systemdesign:fromIndividualCases(SYSTEM_DESIGN_TRACK),
};
