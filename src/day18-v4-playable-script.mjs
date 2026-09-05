import {day18V4DirectedDialogue as D} from './day18-v4-source-beats.mjs?v=7';
import {DAY18_V4_SOURCE_SCENES} from './day18-v4-source-registry.mjs';
import {getDay18V4Options, validateDay18V4, getDay18V4FollowUpContract} from './day18-v4-state-contract.mjs?v=3';

const n = text => ({type: 'monologue', text, origin: 'route-adaptation'});
const d = (speaker, text) => ({type: 'dialogue', speaker, text, origin: 'route-adaptation'});
const scene = (number, location, time, character = null) => ({type: 'sceneDirection',
  number, title: DAY18_V4_SOURCE_SCENES[number - 1].title, location, time, character});
const msg = steps => steps.map(s => s.type === 'dialogue'
  ? {...s, type: 'message', sender: s.speaker === '나' ? '나' : s.speaker, device: 'phone'} : s);
const call = steps => steps.map(s => s.type === 'dialogue' ? {...s,device:'call'} : s);
const travelPhoto = () => ({type:'cgShow',source:'assets/events/day18-v4/travel-window-sea-v1.png',fit:'contain',duration:3000});
const wallet = state => ({type:'cgShow',source:`assets/events/day18-v4/wallet-${state}-v2.png`,fit:'contain',duration:2800});
const chosen = c => c.choices.at(-1)?.id.replace('day18_v4_', '');
const place = c => c.facts.dinner === 'YURI' ? 'rose-bistro' : c.facts.dinner === 'HAEUN' ? 'alley-pub' : 'gimbap-village';
const companion = c => c.facts.dinner === 'YURI' ? 'yuri' : c.facts.dinner === 'HAEUN' ? 'girlfriend' : null;
const part = (s, from, to) => D(s, `**${from}**`, to ? `**${to}**` : undefined);
const toldHaeunBeforeNight = c => c.input.haeunKnowsAppointment || c.facts.statements.some(s => s.recipient === 'HAEUN' && s.claim === 'YURI_DINNER_PLANNED' && s.truthful);

function jihoonAtNight(c) {
  const f = c.facts;
  const difficultTalk = f.nightRoute === 'UNRESOLVED' || f.contactTonight === 'night_defer' ||
    (f.haeunTopic === 'topic_other' && c.input.otherInterest) || f.statements.some(s => !s.truthful);
  if (difficultTalk) return msg([d('지훈','지금 길게는 어려워.'), ...part(20, '지훈에게 묻는다')]);
  // A quiet night is not evidence of a quarrel. Nor does an earlier meal chat
  // authorize another instant reply from a busy friend.
  return [
    ...msg([d('나', f.soloContact === 'solo_jihoon' ? '아까 밥은 잘 먹었어? 시간 될 때 얘기하자.' : '밥 먹었어? 시간 될 때 잠깐 얘기하자.')]),
    n('답을 기다리며 화면을 계속 켜 두지는 않았다.')
  ];
}

function yuriNightReport(c) {
  const f = c.facts;
  const details = [
    d('나',f.yuriPurpose === 'purpose_past' ? '예전에 둘이 어땠는지 궁금해서 나갔어.' : f.yuriPurpose === 'purpose_present' ? '지금의 유리 씨가 궁금해서 나갔다고 말했어.' : '내가 왜 다시 만나고 싶은지 확인하고 싶었다고 말했어.'),
    d('나',f.yuriNext === 'REQUESTED_NOT_ACCEPTED' ? '다시 만나고 싶다고도 했어. 그쪽에서는 아직 만나겠다고 한 건 아니라고 했고.' : f.yuriNext === 'PAST_CLOSED' ? '과거 이야기는 여기까지 듣고 싶다고 했어.' : '당분간 각자 지내 보자고 했어.')
  ];
  return [
    ...msg([d('나',toldHaeunBeforeNight(c) ? '네가 아는 그 저녁 먹고 왔어. 내가 무슨 말을 했는지 이야기하고 싶어.' : '오늘 유리 씨와 저녁을 먹었어. 내가 무슨 말을 했는지도 이야기하고 싶어.'),
      d('나','지금 통화할 수 있어?'),
      d('하은',f.callDeferred ? '지금 처음 들으니까 바로 길게 이야기하기는 어려워. 짧게 남겨 줘. 내일 이야기하자.' : '응. 지금은 이야기할 수 있어.')]),
    {type:'storyPause',duration:600},
    ...(f.callDeferred ? msg(details) : call(details))
  ];
}

function reaction(c) {
  const key = chosen(c), f = c.facts, i = c.input;
  if (!key) return [];
  switch (key) {
    case 'morning_keep': return [...msg(i.appointment === 'YURI' ? [d('유리', '응. 늦으면 먼저 말해 줘. 나도 그러고.')]
      : [d('하은', '나 오늘 일찍 끝날 줄 알고 밀린 것까지 잡으면 안 되겠다.'), d('나', '그럼 내가 일찍 끝나는 쪽을 응원할게.'), d('하은', '일이 끝나는 쪽. 내가 끝나는 쪽 말고.')]),
      {type:'cgShow',source:'assets/events/day18-v4/morning-clothes-v1.png',fit:'contain',duration:2800},
      n('약속을 지킨다는 건 아침부터 멋진 사람으로 완성되어 있어야 한다는 뜻은 아니었다.')];
    case 'morning_change': return [...msg([d('나', '가서 계속 시계만 볼 것 같아서요. 미리 말하고 싶었어요.'),
      d(i.appointment === 'YURI' ? '유리' : '하은', i.appointment === 'YURI' ? '오늘 저녁은 취소하자. 다음을 정할지는 서로 생각해 보고.' : '알겠어. 오늘은 나도 집으로 갈게.')]),
      n('날짜 하나가 저절로 옮겨지지는 않았다.'),
      ...(i.appointment === 'HAEUN' ? [n('실망하지 않았다는 말까지 덧붙이지는 않았다.'),
        n('취소한 사람이 먼저 상대의 기분을 달래 달라고 할 뻔하다가 멈췄다.')] : [])];
    case 'morning_solo': return [...(f.appointmentCancelled ? msg([d('나', '오늘은 못 만나겠어. 미안해.')])
      : [n('오늘 저녁이 혼자라는 사실이 누군가에게 보여 줄 선언일 필요도 없었다.')]),
      {type:'cgShow',source:'assets/events/day18-v4/fridge-open-morning-v1.png',fit:'contain',duration:2800},
      n('혼자 먹는다고 저녁까지 없어지는 건 아니었다.')];
    case 'disclose_yuri': return [...(i.haeunKnowsAppointment ? [] : [{type:'storyPause',duration:1200}]),
      ...msg(i.haeunKnowsAppointment ? [d('나', '오늘 어떤 마음으로 나가는지도 이야기하고 싶어.'), d('하은', '밥 먹는다는 것보다, 네가 어떤 마음으로 나가는지 알고 싶었어.')]
      : [d('하은', '언제 정했어?'), d('나', '어제.'), d('하은', '나한테는 오늘 말하고 싶어진 거야?'), d('나', '어제도 말할 수 있었어. 내가 미뤘어.')]),
      ...(!i.haeunKnowsAppointment ? [n('걱정할까 봐, 라는 덧말이 없어도 말이 끝났다.')] : [])];
    case 'disclose_withhold': return [...msg(part(2, '말하기 어렵다고 한다', '혼자 먹는다고 한다')),
      {type:'storyPause',duration:600}, ...msg([d('하은','나는 이제 점심 먹으러 갈게.')]), n('그녀의 오후가 내 답장 옆에서 멈추지는 않았다.')];
    case 'disclose_solo': return [...msg([d('하은', '따뜻한 거 먹어.')]),
      ...(f.dinner === 'YURI' ? [n('하은은 내 거짓말을 알아맞히지 못했다. 그게 안심되면서, 안심하는 내가 불편했다.')]
        : [{type:'cgShow',source:'assets/events/day18-v4/leftover-rice-check-v1.png',fit:'contain',duration:2800}])];
    case 'disclose_together': return [n('저녁에 만나기로 한 대화 아래에 답을 남겼다.')];
    case 'menu_each': case 'menu_share': case 'menu_wait':
      if (f.dinner === 'YURI') {
        const steps=D(4, `**${key === 'menu_each' ? '각자 고른다' : key === 'menu_share' ? '나눠 먹자고 한다' : '조금 더 본다'}**`, key === 'menu_each' ? '**나눠 먹자고 한다**' : key === 'menu_share' ? '**조금 더 본다**' : '하은과 함께 — 같은 선택');
        return steps.flatMap(step => key === 'menu_each' && step.text === '같은 것을 고르지 않았는데도 한 끼가 시작됐다.'
          ? [{type:'sfx',sfxId:'SFX_DOCUMENT_RECEIVE'},{type:'storyPause',duration:180},{type:'sfx',sfxId:'SFX_DOCUMENT_RECEIVE'},step]
          : key === 'menu_wait' && step.text === '메뉴 기다리는 사람이 둘이나 더 생긴 줄.'
            ? [step,{type:'cgShow',source:'assets/events/day18-v4/yuri-menu-wait-water-v5.png',fit:'contain',duration:3000}] : [step]);
      }
      return key === 'menu_each' ? [d('하은', '네 거 맛있으면 한 입만 구경할게.')]
        : key === 'menu_share' ? [d('하은', '먼저 먹어 보고, 내가 싫으면 네가 책임지는 건 아니야.')]
        : [{type:'cgShow',source:'assets/events/day18-v4/haeun-menu-wait-water-v1.png',fit:'contain',duration:2800},
          d('하은', '나도 고민 중이야. 빨리 고르는 얼굴만 하고 있었어.'), d('나', '그 얼굴 좀 알려 줘.'), d('하은', '지금 네 얼굴.')];
    case 'menu_familiar': case 'menu_new': case 'menu_later': return [n('오늘의 배고픔을 과거의 취향으로 맞히려 하지는 않았다.'), n('주문한 한 줄이 나오자 따뜻한 끝부분부터 먹었다.')];
    case 'purpose_past': return part(5, '과거가 궁금하다', '현재의 유리가 궁금하다');
    case 'purpose_present': return part(5, '현재의 유리가 궁금하다', '내 마음을 확인하고 싶다');
    case 'purpose_self': return part(5, '내 마음을 확인하고 싶다');
    case 'apology_thanks': return part(7, '고맙다고 한다', '외로웠겠다고 한다');
    case 'apology_lonely': return part(7, '외로웠겠다고 한다', '다 잘못했다고 한다');
    case 'apology_all': return part(7, '다 잘못했다고 한다');
    case 'relationship_haeun': return part(9, '관계를 이어 간다고 한다', '흔들리는 마음을 말한다');
    case 'relationship_wavering': return [{type:'storyActionCue',status:'yuri-gaze-lower',actionLabel:'유리가 잠시 시선을 내림',duration:650},...part(9, '흔들리는 마음을 말한다', '자유롭게 지낸다고 한다')];
    case 'relationship_free': return i.relationshipActive && i.yuriKnowsRelationship ? []
      : [d('유리', '그렇구나.'), ...(i.relationshipActive ? [n('그녀가 묻지 않은 질문을 나까지 없애 버릴 수 있는 건 아니었다.')] : [])];
    case 'yuri_correct': return [d('유리', '그러면 자유롭다고 하지는 마.')];
    case 'yuri_lie_breakup': return [n('그녀는 내가 헤어졌다는 말을 믿었다. 믿어 주는 표정이 보상을 주는 표정처럼 보이지는 않았다.')];
    case 'next_time': return part(10, '시간을 둔다', '과거 이야기를 마친다');
    case 'next_end': return part(10, '과거 이야기를 마친다', '다시 만나고 싶다고 한다');
    case 'next_ask': return [...D(10, '**다시 만나고 싶다고 한다**', '현재 연애가 있다는 말을 들었다면'),
      ...(f.yuriRelationshipClaim !== 'relationship_free' ? [d('유리', '네가 누구와 어떤 관계인지 흐린 채로, 나한테 다음을 물어보지는 않았으면 해.')] : []),
      n('유리 씨가 혼자라는 사실만으로 내 다음 저녁이 예약되는 건 아니었다.')];
    case 'pay_split': return [{type:'sfx',sfxId:'SFX_DOCUMENT_RECEIVE'}];
    case 'pay_offer': return part(11, '한 끼를 사고 싶다고 한다', '마음 편하려고 낸다');
    case 'pay_debt': return D(11, '**마음 편하려고 낸다**', '밖으로 나오자').flatMap(step =>
      step.text==='그 마음은 네가 조금 들고 가면 안 돼?' ? [step,wallet('closed')] : [step]);
    case 'topic_good': return [{type:'storyActionCue',status:'haeun-expression-soften',actionLabel:'하은이 눈을 조금 가늘게 뜨고 먹는 표정을 지음',duration:700},...part(13, '지금 좋은 마음을 말한다', '다른 마음을 말한다')];
    case 'topic_other': return i.otherInterest ? [d('나','다른 사람을 더 알고 싶은 마음이 있어. 네가 기다려 주기로 한 것처럼 생각하고 싶지는 않아.'), ...D(13, '**다른 마음을 말한다**', '실제 관심이 없다면'),
      {type:'storyActionCue',status:'meal-decision-pause',actionLabel:'두 사람이 각자 접시와 자리를 살피며 더 먹을지 일어날지 따로 정함',duration:850}]
      : [d('나', '아니, 지금 있는 마음은 너랑 더 만나고 싶다는 거야. 없는 고민까지 말하려 했네.'), d('하은', '없는 사람까지 저녁에 초대하지는 말자.')];
    case 'topic_score': return part(13, '확인받고 싶다고 한다').flatMap(step => step.text === '그럼 오늘은 안 나눠 줄게.'
      ? [step,{type:'storyActionCue',status:'napkin-pull',actionLabel:'하은이 빈 냅킨을 자기 쪽으로 당김',duration:650}] : [step]);
    case 'close_seat': return part(14, '옆자리를 묻는다', '산책을 제안한다').flatMap(step => step.text === '와.'
      ? [{type:'cgShow',source:'assets/events/day18-v4/haeun-bag-cleared-v1.png',fit:'contain',duration:2400}, step, scene(14, 'day18-haeun-beside', 'evening')]
      : step.text === '아니. 괜히 작은 소리로 말하게 돼.'
        ? [step, {type:'cgShow',source:'assets/events/day18-v4/shoulder-contact-v1.png',fit:'contain',duration:3000}]
        : step.text === '큰 사건은 아니었는데 물잔을 드는 손이 조금 조심스러워졌다.'
          ? [{type:'cgShow',source:'assets/events/day18-v4/shoulder-water-glass-v1.png',fit:'contain',duration:2800}]
        : [step]);
    case 'close_walk': return [...part(14, '산책을 제안한다', '여기서 마친다'), scene(16, 'neighborhood-day', 'evening'),
      {type:'cgShow',source:f.heldHands ? 'assets/events/day18-v4/haeun-walk-holding-hands-v1.png' : 'assets/events/day18-v4/haeun-walk-close-v1.png',fit:'contain',duration:3200}];
    case 'close_home': return part(14, '여기서 마친다');
    case 'solo_jihoon': return msg(part(15, '지훈에게 연락한다', '하은에게 연락한다'));
    case 'solo_haeun': return msg(part(15, '하은에게 연락한다', '혼자 먹는 데 집중한다'));
    case 'solo_food': return [n('마지막 한 입을 천천히 먹었다. 지금은 그냥 내가 먹는 날이었다.')];
    case 'return_walk': return [scene(16, 'neighborhood-day', 'evening'),
      {type:'storyActionCue',status:'crosswalk-wait',actionLabel:'건널 수 있는 신호를 보내고 다음 신호를 기다림',duration:900},
      n('옆에 서 있던 사람이 먼저 건넜다. 같이 출발한 적도 없는 사람에게 뒤처졌다고 생각하고 있었다.'),
      {type:'storyActionCue',status:'crosswalk-cross',actionLabel:'다음 신호에 길을 건넘',duration:750},
      n('집에 도착하는 시간이 몇 분 늦어졌을 뿐이었다.')];
    case 'return_home': return [scene(16, 'home-evening', 'evening'),
      {type:'roomActionCue',status:'entry-shoes',actionLabel:'현관에서 신발을 벗음',duration:650},
      n('외출을 잘 끝냈다는 느낌은 생각보다 여기서 왔다.'),
      {type:'roomActionCue',status:'wardrobe-hang',actionLabel:'의자 대신 옷걸이에 오늘 입은 옷을 걸어 둠',duration:850},
      n('내일 아침의 내가 오늘 저녁을 조금 덜 치워도 되게 해 놓았다.')];
    case 'return_food': return [scene(16, 'home-evening', 'evening'),
      {type:'roomActionCue',status:'fridge-check',actionLabel:'냉장고를 열어 남은 음식을 앞쪽으로 옮기고 문을 닫음',duration:1000},
      n('지금 당장 살 필요가 없는 것은 사지 않았다. 계획이라고 부르기에는 작았지만 내일 한 번 덜 망설일 수는 있겠다 싶었다.')];
    case 'night_good': return msg(f.comfortableDinner ? D(17, '**좋았다고 말한다**', '**생각이 남았다고 말한다**')
      : [d('하은', '같이 먹은 시간이 다 싫었던 건 아니야. 그래도 아까 들은 마음은 아직 생각하고 있어.'), d('나', '응. 좋았다는 말로 그 이야기를 없애려는 건 아니야.')]);
    case 'night_thought': return [...msg(part(17, '생각이 남았다고 말한다', '짧게 인사한다')),
      ...msg(f.comfortableDinner ? [d('나','같이 먹어서 좋았어. 그 마음도 빠뜨리고 이야기할 뻔했네.')] : [d('나','아까 말한 다른 마음이 사라졌다고 할 수는 없어.')])];
    case 'night_rest': return msg(D(17, '**짧게 인사한다**', '이 세 갈래에서는'));
    case 'night_tell': return f.dinner === 'YURI' ? yuriNightReport(c)
      : msg([d('나', '김밥 한 줄 먹고, 결국 더 시켰어.')]);
    case 'schedule_after_dinner': return msg([d('하은','응. 내일 저녁 먹고 나서 이야기하자.'),
      d('나','먹고 나면 먼저 연락할게.'),d('하은','응. 오늘은 좀 쉴게.')]);
    case 'schedule_ask_tomorrow': return msg([d('하은','응. 지금 시간을 정하기는 어렵네. 내일 물어봐 줘.'),
      d('나','알겠어. 오늘은 쉬어.')]);
    case 'night_defer': return msg(part(17, '시간을 요청한다', '혼자 먹었다고 한다'));
    case 'night_solo': return f.dinner === 'SOLO' ? msg([d('하은', '뭐 먹었어?'), d('나', '김밥. 한 줄 먹고 더 시켰어.')]) : [n('맞은편에 앉았던 사람은 말하지 않았다.')];
    case 'night_correct': return msg([d('하은', '왜 지금 혼자라고 했어?'), d('나', '네가 무슨 생각 할지 무서워서. 그런데 거짓말을 했어.'), d('하은', '오늘은 여기까지 이야기하자.')]);
    case 'night_lie_cancel': return [n('한 문장을 덮으려고 다음 문장을 썼다는 사실을 알고 있었다.')];
    case 'future_continue': return call(part(18, '관계를 이어 가고 싶다고 한다', '확신을 꾸미지 않는다'));
    case 'future_unsure': return call(part(18, '확신을 꾸미지 않는다', '다른 사람을 더 만나고 싶다고 한다'));
    case 'future_others': return call(part(18, '다른 사람을 더 만나고 싶다고 한다')).flatMap(step =>
      step.text === '내가 지금 널 이해하는 말을 해 주기는 어려워.'
        ? [step,{type:'phoneCallCue',status:'ended',speaker:'하은'}] : [step]);
    case 'calm_trip': return msg(part(19, '하루 나가고 싶다', '쉬는 모습을 보고 싶다'));
    case 'calm_rest': return msg(part(19, '쉬는 모습을 보고 싶다', '같은 저녁을 원한다'));
    case 'calm_dinner': return msg(part(19, '같은 저녁을 원한다')).flatMap(step => step.text === '그건 꼭 바꾸자.'
      ? [step,{type:'storyActionCue',status:'phone-smile',actionLabel:'주인공이 오늘 먹은 음식을 떠올리며 웃음',duration:700},
        n('다음에도 같은 사람과 다른 음식을 고를 수 있다는 게 생각보다 설렜다.')]
      : [step]);
    case 'alone_stop': return [{type:'sfx',sfxId:'SFX_PHONE_SOFT_DROP'},
      {type:'cgShow',source:'assets/events/day18-v4/washing-cup-night-v2.png',fit:'contain',duration:3200},
      n(f.nightRoute==='UNRESOLVED'||f.callDeferred||f.contactTonight==='night_defer'
        ? '뭔가를 씻는다고 대화가 깨끗해지지는 않았다. 그래도 컵은 내일 쓸 수 있게 됐다.'
        : '씻은 컵은 내일 쓸 수 있게 됐다. 오늘은 그걸로 충분했다.')];
    case 'alone_note': {
      const previous={...c,choices:c.choices.slice(0,-1)};
      const lines=reaction(previous).filter(step => ['dialogue','message'].includes(step.type)&&step.speaker==='나').map(step=>step.text);
      const last=previous.choices.at(-1);
      if(!lines.length&&['night','night_correction','night_schedule'].includes(last?.phase)) {
        const spoken=getDay18V4Options({...previous,phase:last.phase}).find(option=>option.id===last.id);
        if(spoken)lines.push(spoken.label);
      }
      return [{type:'privateNote',lines},n('메모를 누구에게도 보내지 않았다. 오늘 작성한 문장을 곧바로 성실함의 증거로 보여 주고 싶지 않았다.')];
    }
    case 'alone_jihoon': return jihoonAtNight(c);
    case 'travel_near': return [n('돌아오고 싶으면 돌아올 수 있다는 생각도 여행을 망치는 말은 아니었다.')];
    case 'travel_busan': return [travelPhoto(),n('역에서 이동하고, 먹고, 쉬고, 다시 돌아와야 했다. 사진 아래의 시간을 내 하루로 옮겨 봐야 했다.')];
    case 'travel_life': return [{type:'sfx',sfxId:'SFX_PHONE_SCREEN_OFF'},
      {type:'roomActionCue',status:'wardrobe-check',actionLabel:'화면을 끄고 내일 입을 옷을 확인함',duration:900},
      n('먼 데 가지 않는다고 오늘의 생활이 예행연습으로 남는 것은 아니었다. 지금 사는 방도 계속 살 곳이었다.')];
    default: throw new Error(`DAY18_REACTION_MISSING:${key}`);
  }
}

function departure(c) {
  return c.facts.dinner === 'YURI'
    ? [{...scene(11,'neighborhood-day','evening','yuri'),outerwear:true},
      {type:'storyActionCue',status:'yuri-outerwear-close',actionLabel:'유리가 자기 겉옷을 여밈',duration:800},
      d('유리', '잘 들어가.'), d('나', '유리 씨도요.'),
      {type:'storyPause',duration:450},{type:'sfx',sfxId:'SFX_FOOTSTEP_APPROACH'},
      scene(11,'neighborhood-day','evening'),{type:'storyPause',duration:350}]
    : c.facts.dinner === 'HAEUN' ? [
      {type:'storyActionCue',status:'ride-wait',actionLabel:'서로 갈 방향을 확인하고 하은이 탈 차를 함께 기다림',duration:900},
      n('오늘 재미있었던 말을 꺼냈다. 같은 대목에서 웃지 않더라도 같은 저녁을 먹은 건 변하지 않았다.')
    ] : [];
}

function yuriPresentConversation(c) {
  return D(8).flatMap(step => step.text === '아니. 내가 읽는 책. 일이랑 다르다니까.'
    ? [step, c.input.yuriOwnBookKnown ? n('지난번 자기 책 이야기를 할 때와 같은 말이었다. 유리 씨도 웃었다.') : d('나', '아, 그냥 읽는 책.')]
    : [step]);
}

function yuriRelationshipOpening(c) {
  return D(9, undefined, '### 선택 6').map(step => step.text === '그래도 하나는 분명히 듣고 싶어. 지금 만나는 사람하고는 어떻게 지내?' && c.input.yuriKnowsRelationship
    ? d('유리','그래도 하나는 분명히 듣고 싶어. 하은 씨하고는 어떻게 지내?') : step);
}

function haeunTopicOpening(c) {
  const steps=c.input.yuriPastRelevant ? D(13, undefined, '유리와의 접점이 없거나') : D(13, '유리와의 접점이 없거나', '### 선택 9');
  return steps.flatMap(step => step.text === '보여 주는 건 고마운데, 계속 심사받는 얼굴이면 나도 밥을 어떻게 먹어야 할지 모르겠어.'
    ? [{type:'storyActionCue',status:'haeun-napkin-fold',actionLabel:'하은이 냅킨을 접어 두고 식탁을 바라봄',duration:700},step] : [step]);
}

function haeunMealConversation(c) {
  const menu = c.facts.menu;
  return D(12).flatMap(step => {
    if (step.text === '둘 다 먹고 나서 실망하면 억울하지 않잖아.') return [
      step, {type:'cgShow',source:'assets/events/day18-v4/haeun-tasting-v2.png',fit:'contain',duration:2600}
    ];
    if (step.text === '둘 다 맛이 나쁜 건 아니었다. 남의 접시가 처음에는 더 좋아 보였을 뿐이었다.') return [
      step, {type:'cgShow',source:'assets/events/day18-v4/own-meals-v2.png',fit:'contain',duration:2600},
      n('멀쩡한 식사를 두고 굳이 관계에 대한 교훈을 붙이지는 않았다.')
    ];
    if (step.text === '어때?') return [
      {type:'cgShow',source:'assets/events/day18-v4/food-sharing-v2.png',fit:'contain',duration:3000},
      step
    ];
    if (menu === 'menu_wait') return step;
    if (step.text === '메뉴판 앞에서 네 얼굴을 따라 했더니.') {
      return d('나',menu === 'menu_share' ? '나눠 먹자고 하길 잘했네.' : '한 입 먹어 볼래?');
    }
    if (step.text === '기술이 유출됐네.') {
      return d('하은',menu === 'menu_share' ? '칭찬은 먹고 나서 할게.' : '응. 한 입만.');
    }
    return step;
  });
}

function opening(c) {
  const f = c.facts, i = c.input;
  switch (c.phase) {
    case 'morning': return [scene(1, 'day4-bedroom-morning', 'morning'),
      {type:'alarmAction',source:'assets/events/day18-v4/morning-alarm-off-v2.png',fit:'contain',sfxId:'SFX_DAY18_PHONE_ALARM',actionLabel:'눌러서 알람 끄기'},
      ...['rest','flex','rest'].map(pose=>({type:'cgShow',source:`assets/events/day18-v4/morning-feet-${pose}-v1.png`,fit:'contain',duration:1000})),
      n('어제보다 몸이 가벼운지, 지금 누워 있는 것만으로 오늘을 다 알 수는 없었다.'),
      scene(1, 'home-morning', 'morning'),
      {type:'cgShow',source:'assets/events/day18-v4/morning-water-v1.png',fit:'contain',duration:2800},
      ...(i.appointment === 'SOLO' ? [] : [n('휴대전화에는 어제 내가 보낸 답이 남아 있었다.')]),
      n(i.appointment === 'YURI' ? '유리 씨와 장소와 시간을 확인한 두 줄.' : i.appointment === 'HAEUN' ? '하은과 퇴근하고 만나자는 짧은 대화.' : '저녁 칸은 비어 있었다.'),
      ...(i.appointment === 'SOLO' ? [n('빈칸을 보고 나니 묘하게 늦은 것 같았다. 누구보다 늦었는지는 알 수 없었다.')] : [])];
    case 'disclosure': return [scene(2, 'home-morning', 'afternoon'), ...msg([d('하은', '점심 먹었어? 나는 지금 먹으러 나왔어.'),
      ...(f.dinner === 'YURI' && i.haeunKnowsAppointment ? [d('하은', '오늘 너무 늦지는 않을 거지?')] : [])]),
      {type:'messageDraft',text:'저녁'}, {type:'messageDraft',text:''}];
    case 'menu': return [scene(3, place(c), 'evening', null),
      ...(f.dinner === 'YURI' ? [n('유리 씨는 아직 오지 않았다.'), n('상대를 기다리는 일에도 오래 해 본 사람 같은 자세가 있을까 싶었다.'),
        ...[['closed',650],['open',2400],['closed',650],['open',1400]].map(([frame,duration]) =>
          ({type:'cgShow',source:`assets/events/day18-v4/menu-${frame}-v2.png`,fit:'contain',duration})),
        {...scene(3,place(c),'evening','yuri'),outerwear:true},
        ...D(3, undefined, '하은과 약속한 저녁').flatMap(step => step.text==='지금 제목을 다 아는 단계예요.'
          ? [step,{type:'cgShow',source:'assets/events/day18-v4/yuri-jacket-chair-v1.png',fit:'contain',duration:3000},scene(3,place(c),'evening','yuri')] : [step])]
        : f.dinner === 'HAEUN' ? [n('밖에서 기다리려던 마음이 바람 앞에서는 오래가지 못했다.'), scene(3,place(c),'evening','girlfriend'),
          d('나','밖에서 기다리려다가 바람이 불어서 먼저 들어왔어.'), d('하은','잘했네.'), ...D(3, '하은과 약속한 저녁', '혼자 먹는 저녁')]
        : [n('배고픈 것보다 눈이 바쁘다는 걸 깨달았다.'), ...D(3, '혼자 먹는 저녁'), n('대단한 허락을 받은 것도 아닌데 마음이 편해졌다. 처음부터 저녁 전체를 맞힐 필요는 없었다.'),
          {type:'cgShow',source:'assets/events/day18-v4/solo-bag-seat-move-v2.png',fit:'contain',duration:3000}]),
      scene(4, place(c), 'evening', companion(c)), ...(f.dinner === 'YURI' ? D(4, undefined, '### 선택 3') : [])];
    case 'yuri_purpose': return [scene(5, place(c), 'evening', 'yuri'), ...D(5, undefined, '### 선택 4')];
    case 'yuri_apology': return [scene(6, place(c), 'evening', 'yuri'), ...D(6), scene(7, place(c), 'evening', 'yuri'), ...D(7, undefined, '### 선택 5')];
    case 'yuri_relationship': return [scene(8, place(c), 'evening', 'yuri'), ...yuriPresentConversation(c), scene(9, place(c), 'evening', 'yuri'),
      {type:'storyActionCue',status:'yuri-napkin-fold',actionLabel:'유리가 웃음을 가라앉히며 냅킨을 접음',duration:700},...yuriRelationshipOpening(c),
      {type:'storyActionCue',status:'cup-square',actionLabel:'주인공이 컵을 식탁에 바로 놓음',duration:650}];
    case 'yuri_correction': return [{type:'storyActionCue',status:'yuri-hand-stop',actionLabel:'유리의 손이 멈춤',duration:600},d('유리', '지난번에는 여자친구가 있다고 했잖아. 그사이 헤어졌다는 뜻이야?')];
    case 'yuri_next': return [scene(10, place(c), 'evening', 'yuri'), ...D(10, undefined, '### 선택 7')];
    case 'payment': return [scene(11, place(c), 'evening', 'yuri'), wallet('open'), ...D(11, undefined, '### 선택 8')];
    case 'haeun_topic': return [scene(12, place(c), 'evening', 'girlfriend'), ...haeunMealConversation(c), scene(13, place(c), 'evening', 'girlfriend'),...haeunTopicOpening(c)];
    case 'closeness': return [scene(14, place(c), 'evening', 'girlfriend'), ...D(14, undefined, '### 선택 10')];
    case 'solo_contact': return [scene(15, place(c), 'evening'),
      n('아직 배가 고픈지 보기 전에 누가 연락했는지 먼저 보고 있었다.'),
      {type:'sfx',sfxId:'SFX_PHONE_SCREEN_OFF'}, {type:'storyPause',duration:240},
      {type:'cgShow',source:'assets/events/day18-v4/solo-phone-down-extra-food-v1.png',fit:'contain',duration:3000},
      n('다른 사람과 먹었다면 그 사람의 속도에 맞춰 배부른 척했을 수도 있었다.'),
      {type:'sfx',sfxId:'SFX_DOCUMENT_RECEIVE'}, {type:'storyPause',duration:180}, {type:'sfx',sfxId:'SFX_DOCUMENT_RECEIVE'},
      {type:'cgShow',source:'assets/events/day18-v4/solo-bag-mimic-v1.png',fit:'contain',duration:2200},
      n('누가 보면 바쁜 사람의 손 연습 같았을 것이다.')];
    case 'return': return [scene(16, place(c), 'evening'), n('다 먹은 뒤에야 휴대전화를 들었다.')];
    case 'night': return [...departure(c), scene(17, 'home-evening', 'night'),
      n(f.dinner==='SOLO'&&['return_home','return_food'].includes(f.returnAction)
        ? '물을 한 잔 마셨다.' : '현관 불을 켜고 물을 한 잔 마셨다.')];
    case 'night_schedule': return [scene(17, 'home-evening', 'night'),
      ...(f.dinner === 'HAEUN' ? msg([d('하은','오늘은 좀 피곤해서 길게 듣기는 어려울 것 같아. 내일 이야기해도 될까?')]) : [])];
    case 'night_correction': return msg([d('하은', '약속 취소됐어?')]);
    case 'relationship_future': return [scene(18, 'home-evening', 'night'),
      ...(f.dinner !== 'YURI' ? msg([d('나','지금 통화할 수 있어?'),d('하은','응. 지금은 이야기할 수 있어.')]) : []),
      {type:'phoneCallCue',status:'silence',speaker:'하은'}, ...call([
      d('하은', '듣고 있어.'), n('내가 침묵을 고장처럼 확인했다는 게 민망했다.'), d('하은', f.dinner === 'YURI' ? '너는 얘기하고 와서 정리가 조금 됐을 수도 있는데, 나는 지금 처음 듣는 마음이 있어.' : '아까 들은 마음을 아직 생각하고 있어. 같이 밥을 먹었다고 바로 괜찮아지는 건 아니잖아.'),
      ...(f.dinner === 'YURI' && f.yuriPurpose === 'purpose_past' && f.yuriNext !== 'REQUESTED_NOT_ACCEPTED'
        ? [d('나', '오늘은 그 사람 얘기를 들었어. 나한테 좋았던 사람인지 나빴던 사람인지 답을 받으려 했는데, 그렇게 끝낼 수는 없었어.'), d('하은', '그건 나도 대신 말할 수 없지.')]
        : [d('하은', '그럼 나는 네 마음이 돌아올 때까지 기다리고 있어야 해?'), d('나', '그렇게 부탁할 수는 없어.'), d('하은', '그 말만 하면 내가 다 정해야 하는 것 같아. 네가 나랑 어떻게 지내고 싶은지도 말해 줘.')])]),
      {type:'phoneCallCue',status:'grip-shift',speaker:'하은'},
      n('남의 선택을 존중한다는 말 뒤에 내 선택을 숨길 수는 없었다.')];
    case 'calm_future': return [scene(19, 'home-evening', 'night'), ...msg([
      ...(f.dinner === 'HAEUN' ? D(19, undefined, '같이 먹지 않고') : [d('나', '나는 오늘 김밥 먹었어. 너는 뭐 먹었어?'), d('하은', '나는 내 쪽에서 먹었지. 따뜻한 거 먹었어.')]),
      ...D(19, '**주인공** “다음에는', '### 평온한 경로의 선택 12')]).flatMap(step => step.text === '그럼 현관 앞은 빼고.'
        ? [step,{type:'storyActionCue',status:'phone-smile',actionLabel:'주인공이 휴대전화 화면을 보며 웃음',duration:700}]
        : [step])];
    case 'alone_end': return [...(!i.contactAllowed ? departure(c) : []), scene(20, 'home-evening', 'night'),
      n(f.nightRoute === 'UNRESOLVED' ? '화면을 보고 있었다. 한 번 더 누르면 말을 조금 더 잘할 수 있을 것 같았다.' : '휴대전화를 내려놓았다. 남은 밤에는 내가 할 수 있는 작은 일이 있었다.')];
    case 'travel': return [scene(21, 'home-evening', 'night'), travelPhoto(), n('파란 바다와 창가의 테이블. 사진 바깥에는 이동 시간도, 돌아와서 쌓인 빨래도 없었다.'),
      ...(f.travelTogetherDiscussed ? msg(D(21, undefined, '같이 갈 마음이 아직')) : [n('사진을 보내며 누군가의 미래를 정해 놓지는 않았다.')])];
    case 'ending': return ending(c);
    default: throw new Error(`DAY18_OPENING_MISSING:${c.phase}`);
  }
}

function ending(c) {
  const f = c.facts;
  const followUp = getDay18V4FollowUpContract(c);
  const hasLie = f.statements.some(s => !s.truthful);
  return [n('오늘은 어느 쪽도 결제하지 않았다. 누군가와 함께 가려면 그 사람의 내일도 물어야 했다.'),
    scene(22, 'home-evening', 'night'),
    {type:'sfx',sfxId:'SFX_PHONE_SCREEN_OFF'},
    {type:'roomActionCue',status:'phone-close',actionLabel:'오늘 나눈 말이 있는 화면을 닫음',duration:700},
    n(f.dinner === 'YURI' ? '유리 씨가 나를 어떻게 기억하는지는 조금 더 들었다. 그렇다고 내가 그 기억 속 사람의 표정을 따라 하면 오늘 저녁이 완성되는 건 아니었다.'
      : f.dinner === 'HAEUN' ? '하은이 파일 이름 때문에 웃던 얼굴이 떠올랐다. 나를 안심시키려고 지은 얼굴이 아니었다.'
      : '한 줄을 다 먹고 한 번 더 주문한 일이 떠올랐다. 누군가와 함께할 준비가 끝나야 나를 먹일 수 있는 건 아니었다.'),
    scene(23, 'home-evening', 'night'),
    {type:'roomActionCue',status:'desk-reset',actionLabel:'컵을 제자리에 두고 의자를 밀어 넣음',duration:1000},
    ...(f.yuriNext === 'REQUESTED_NOT_ACCEPTED' && c.input.contactAllowed && f.contactTonight !== 'night_tell'
      ? [n('다시 만나고 싶다고 한 말은 아직 하은에게 전하지 않았다. 내가 말하지 않았다고 그 마음이 없던 일이 되지는 않았다.')] : []),
    n(hasLie ? '내가 실제로 보낸 문장을 다시 보았다. 이미 말한 마음을, 몰랐다는 말로 지우지는 않기로 했다.'
      : f.callDeferred && f.dinner === 'YURI' ? '하은이 지금은 길게 듣기 어렵다고 한 말을 다시 떠올렸다. 내가 말할 준비가 됐다고 상대도 바로 들을 수 있는 건 아니었다.'
      : f.relationshipIntent || (f.haeunTopic === 'topic_other' && !f.comfortableDinner) ? '아직 모르는 마음을 억지로 정리하지는 않았다. 다만 이미 말한 마음을, 몰랐다는 말로 지우지는 않기로 했다.'
      : f.appointmentCancelled ? '약속을 바꾼 사실과 그때 보낸 말을 다시 보았다. 취소를 없던 일로 만들지 않는 것도 오늘 내가 할 수 있는 일이었다.'
        : f.dinner === 'SOLO' ? '혼자 보내기로 한 저녁을 누구에게 벌처럼 돌리지 않은 것. 그 정도로 끝나는 날도 있었다.'
          : '오늘 내가 한 약속을 지킨 것. 나와 먹고 싶다는 사람에게 나도 먹고 싶다고 말한 것. 그 정도로 끝나는 날도 있었다.'),
    {type:'roomActionCue',status:'sleep-ready',actionLabel:'의자 위에 옷이 남아 있지 않은 방에서 침대에 누움',duration:1100},
    scene(24, 'home-evening', 'night'),
    ...(f.travelTogetherDiscussed ? msg(D(24, undefined, '생각할 시간을 둔 밤')) : f.followUpContact
      ? [n(followUp.status === 'TIME_WINDOW_AGREED'
        ? '내일 저녁을 먹은 뒤 이야기하기로 했다. 지금 길게 듣기 어렵다는 말을 더 붙잡지는 않았다. 여행 사진은 아직 보내지 않았다.'
        : followUp.status === 'CONTACT_PROMISED'
        ? '내일 연락하기로 한 약속을 남겼다. 여행 사진은 아직 보내지 않았다. 먼 풍경으로 오늘의 대답을 대신하고 싶지 않았다.'
        : '여행 사진은 아직 보내지 않았다. 다시 이야기할 시간을 함께 정해야 했다. 먼 풍경으로 오늘의 대답을 대신하고 싶지 않았다.')]
      : [{type:'roomActionCue',status:'alarm-set',actionLabel:'알람을 맞추고 휴대전화를 내려놓음',duration:850},
        n('내일은 내 돈과 내 시간부터 볼 생각이었다.')]),
    {type:'finalFadeCue',duration:1400,actionLabel:'방의 불빛이 천천히 어두워짐'},
    n('오늘 저녁에 누구와 앉았는지만으로는 내 마음을 설명할 수 없었다. 그래도 내가 무슨 말을 했는지는 남았다.'),
    n('내일의 약속은 그 말 다음에서 시작해야 했다.'),
    {type: 'chapterCompletionCue', day: 18, finalSceneReached: true}];
}

export function getDay18V4PlayableSegment(chapter) {
  if (!validateDay18V4(chapter)) throw new Error('DAY18_INVALID_SAVE');
  if (chapter.complete) return [{type: 'sceneEnd'}];
  const steps = [...reaction(chapter), ...opening(chapter)];
  const options = getDay18V4Options(chapter);
  if (options.length) steps.push({type: 'choice', choiceKey: chapter.phase,
    prompt: chapter.phase === 'menu' && chapter.facts.dinner === 'SOLO' ? '오늘 먹을 것을 고른다' : PROMPTS[chapter.phase], options});
  return steps;
}

const PROMPTS = {
  morning: '오늘 저녁을 어떻게 맞을까', disclosure: '하은에게 보내는 답', menu: '함께 먹을 것을 고른다',
  yuri_purpose: '유리를 다시 만난 이유', yuri_apology: '지금 할 수 있는 말', yuri_relationship: '지금 관계에 대해 말한다',
  yuri_correction: '방금 한 말을 바로잡을까', yuri_next: '이 저녁 다음에 바라는 것', payment: '계산대 앞에서',
  haeun_topic: '하은과 나누고 싶은 이야기', closeness: '조금 더 같이 있고 싶다', solo_contact: '이 저녁에 더하고 싶은 것',
  return: '돌아가는 길', night: '저녁 뒤에 남는 말', night_correction: '약속이 취소됐냐는 질문 앞에서',
  night_schedule: '다시 이야기할 시간',
  relationship_future: '하은과의 다음을 어떻게 말할까', calm_future: '같이 해 보고 싶은 것', alone_end: '남은 밤에 할 일',
  travel: '내일 살펴볼 하루'
};
