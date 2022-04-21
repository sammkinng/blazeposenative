import second from '../images/jumping.gif';
import first from '../images/high_knees.gif';
import third from '../images/squats.gif';

import HKintro from '../../Assets/Sound/high_knees/HIGH KNEES_Intro.mp3'
import HKSCM from '../../Assets/Sound/high_knees/high-knees-start_countdown_merged.mp3'

import JJIntro from '../../Assets/Sound/jumping_jacks/Jumping jacks_intro+start.mp3'
import JJIcnt from '../../Assets/Sound/jumping_jacks/Jumping jacks_intro+start+countdown.mp3'

import SIntro from '../../Assets/Sound/squats/squat_tab.mp3'
import SStart from '../../Assets/Sound/squats/SQUAT_start.mp3'

const data = [
  {
    text: 'High Knees',
    image: first,
    description: [
      'Make sure your full body is in the camera frame',
      'Face the camera',
      'Start high knees'
    ],
    // audio: new Audio(HKintro),
    // aud2: new Audio(HKSCM),
    aud2len: 19600,
    reps: 20
  },
  {
    text: 'Jumping Jacks',
    image: second,
    description: [
      'Make sure your full body is in the camera frame',
      'Face the camera',
      'Start jumping jacks'
    ],
    // audio: new Audio(JJIntro),
    // aud2: new Audio(JJIcnt),
    aud2len: 14000,
    reps: 25
  },
  {
    text: 'Squats',
    image: third,
    description: [
      'Make sure your full body is in the camera frame',
      ' Turn to your left or right, so your profile is visible to the camera',
      'Start squatting',
    ],
    // audio: new Audio(SIntro),
    // aud2: new Audio(SStart),
    aud2len: 54000,
    reps: 20
  },
];

export default data;
