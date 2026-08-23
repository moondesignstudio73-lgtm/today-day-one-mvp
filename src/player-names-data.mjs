const COMMON_SURNAMES=["김","이","박","최","정","강","조","윤","장","임"];
const COMMON_GIVEN_NAMES=["민준","서준","도윤","예준","시우","하준","주원","지호","현우","준우","건우","우진","선우","도현","지훈","민재"];
const SHORT_NAMES=["김준","이안","박훈","최혁","정민","강산","조운","윤호","장혁","임준","한결","로운","이든","유건","태오","지안"];
const COMPOUND_NAMES=["제갈탄","독고훈","남궁혁","황보준","사공진","선우찬","동방현","제갈윤","독고진","남궁빈","황보람","사공훈"];
const ENGLISH_NAMES=["Tom","Sam","Leo","Max","Ian","Jay","Ray","Ben","Dan","Joe","Ken","Roy"];

export const PLAYER_NAMES=Object.freeze([
  ...COMMON_SURNAMES.flatMap(surname=>COMMON_GIVEN_NAMES.map(givenName=>`${surname}${givenName}`)),
  ...SHORT_NAMES,...COMPOUND_NAMES,...ENGLISH_NAMES
]);

export function getRandomPlayerName(previous="",random=Math.random){
  const index=Math.floor(Math.max(0,Math.min(.999999,Number(random())||0))*PLAYER_NAMES.length);
  const candidate=PLAYER_NAMES[index];
  return candidate===previous?PLAYER_NAMES[(index+1)%PLAYER_NAMES.length]:candidate;
}
