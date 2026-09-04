import {day18V4DirectedDialogue as D} from './day18-v4-source-beats.mjs';
import {DAY18_V4_SOURCE_SCENES} from './day18-v4-source-registry.mjs';
import {getDay18V4Options, validateDay18V4} from './day18-v4-state-contract.mjs';

const n = text => ({type: 'monologue', text, origin: 'route-adaptation'});
const d = (speaker, text) => ({type: 'dialogue', speaker, text, origin: 'route-adaptation'});
const scene = (number, location, time, character = null) => ({type: 'sceneDirection',
  number, title: DAY18_V4_SOURCE_SCENES[number - 1].title, location, time, character});
const msg = steps => steps.map(s => s.type === 'dialogue'
  ? {...s, type: 'message', sender: s.speaker === '나' ? '나' : s.speaker, device: 'phone'} : s);
const chosen = c => c.choices.at(-1)?.id.replace('day18_v4_', '');
const place = c => c.facts.dinner === 'YURI' ? 'rose-bistro' : c.facts.dinner === 'HAEUN' ? 'alley-pub' : 'gimbap-village';
const companion = c => c.facts.dinner === 'YURI' ? 'yuri' : c.facts.dinner === 'HAEUN' ? 'girlfriend' : null;
const part = (s, from, to) => D(s, `**${from}**`, to ? `**${to}**` : undefined);

function reaction(c) {
  const key = chosen(c), f = c.facts, i = c.input;
  if (!key) return [];
  switch (key) {
    case 'morning_keep': return msg(i.appointment === 'YURI' ? [d('유리', '응. 늦으면 먼저 말해 줘. 나도 그러고.')]
      : [d('하은', '나 오늘 일찍 끝날 줄 알고 밀린 것까지 잡으면 안 되겠다.'), d('나', '그럼 내가 일찍 끝나는 쪽을 응원할게.'), d('하은', '일이 끝나는 쪽. 내가 끝나는 쪽 말고.')]);
    case 'morning_change': return [...msg([d('나', '가서 계속 시계만 볼 것 같아서요. 미리 말하고 싶었어요.'),
      d(i.appointment === 'YURI' ? '유리' : '하은', i.appointment === 'YURI' ? '오늘 저녁은 취소하자. 다음을 정할지는 서로 생각해 보고.' : '알겠어. 오늘은 나도 집으로 갈게.')]),
      n('날짜 하나가 저절로 옮겨지지는 않았다.')];
    case 'morning_solo': return [...(f.appointmentCancelled ? msg([d('나', '오늘은 못 만나겠어. 미안해.')]) : []), n('냉장고 문을 열었다. 혼자 먹는다고 저녁까지 없어지는 건 아니었다.')];
    case 'disclose_yuri': return msg(i.haeunKnowsAppointment ? [d('나', '오늘 어떤 마음으로 나가는지도 이야기하고 싶어.'), d('하은', '밥 먹는다는 것보다, 네가 어떤 마음으로 나가는지 알고 싶었어.')]
      : [d('하은', '언제 정했어?'), d('나', '어제.'), d('하은', '나한테는 오늘 말하고 싶어진 거야?'), d('나', '어제도 말할 수 있었어. 내가 미뤘어.')]);
    case 'disclose_withhold': return msg(part(2, '말하기 어렵다고 한다', '혼자 먹는다고 한다'));
    case 'disclose_solo': return [...msg([d('하은', '따뜻한 거 먹어.')]), ...(f.dinner === 'YURI' ? [n('하은은 내 거짓말을 알아맞히지 못했다. 그게 안심되면서, 안심하는 내가 불편했다.')] : [])];
    case 'disclose_together': return [n('저녁에 만나기로 한 대화 아래에 답을 남겼다.')];
    case 'menu_each': case 'menu_share': case 'menu_wait':
      if (f.dinner === 'YURI') return D(4, `**${key === 'menu_each' ? '각자 고른다' : key === 'menu_share' ? '나눠 먹자고 한다' : '조금 더 본다'}**`, key === 'menu_each' ? '**나눠 먹자고 한다**' : key === 'menu_share' ? '**조금 더 본다**' : '하은과 함께 — 같은 선택');
      return key === 'menu_each' ? [d('하은', '네 거 맛있으면 한 입만 구경할게.')]
        : key === 'menu_share' ? [d('하은', '먼저 먹어 보고, 내가 싫으면 네가 책임지는 건 아니야.')]
        : [d('하은', '나도 고민 중이야. 빨리 고르는 얼굴만 하고 있었어.'), d('나', '그 얼굴 좀 알려 줘.'), d('하은', '지금 네 얼굴.')];
    case 'menu_familiar': case 'menu_new': case 'menu_later': return [n('주문한 한 줄이 나오자 따뜻한 끝부분부터 먹었다.')];
    case 'purpose_past': return part(5, '과거가 궁금하다', '현재의 유리가 궁금하다');
    case 'purpose_present': return part(5, '현재의 유리가 궁금하다', '내 마음을 확인하고 싶다');
    case 'purpose_self': return part(5, '내 마음을 확인하고 싶다');
    case 'apology_thanks': return part(7, '고맙다고 한다', '외로웠겠다고 한다');
    case 'apology_lonely': return part(7, '외로웠겠다고 한다', '다 잘못했다고 한다');
    case 'apology_all': return part(7, '다 잘못했다고 한다');
    case 'relationship_haeun': return part(9, '관계를 이어 간다고 한다', '흔들리는 마음을 말한다');
    case 'relationship_wavering': return part(9, '흔들리는 마음을 말한다', '자유롭게 지낸다고 한다');
    case 'relationship_free': return i.relationshipActive && i.yuriKnowsRelationship ? []
      : [d('유리', '그렇구나.'), ...(i.relationshipActive ? [n('그녀가 묻지 않은 질문을 나까지 없애 버릴 수 있는 건 아니었다.')] : [])];
    case 'yuri_correct': return [d('유리', '그러면 자유롭다고 하지는 마.')];
    case 'yuri_lie_breakup': return [n('그녀는 내가 헤어졌다는 말을 믿었다. 믿어 주는 표정이 보상을 주는 표정처럼 보이지는 않았다.')];
    case 'next_time': return part(10, '시간을 둔다', '과거 이야기를 마친다');
    case 'next_end': return part(10, '과거 이야기를 마친다', '다시 만나고 싶다고 한다');
    case 'next_ask': return [...D(10, '**다시 만나고 싶다고 한다**', '현재 연애가 있다는 말을 들었다면'),
      ...(f.yuriRelationshipClaim !== 'relationship_free' ? [d('유리', '네가 누구와 어떤 관계인지 흐린 채로, 나한테 다음을 물어보지는 않았으면 해.')] : [])];
    case 'pay_split': return [n('둘이 정한 만큼 나누고, 영수증은 필요한 사람이 받았다.')];
    case 'pay_offer': return part(11, '한 끼를 사고 싶다고 한다', '마음 편하려고 낸다');
    case 'pay_debt': return D(11, '**마음 편하려고 낸다**', '밖으로 나오자');
    case 'topic_good': return part(13, '지금 좋은 마음을 말한다', '다른 마음을 말한다');
    case 'topic_other': return i.otherInterest ? D(13, '**다른 마음을 말한다**', '실제 관심이 없다면')
      : [d('나', '아니, 지금 있는 마음은 너랑 더 만나고 싶다는 거야. 없는 고민까지 말하려 했네.'), d('하은', '없는 사람까지 저녁에 초대하지는 말자.')];
    case 'topic_score': return part(13, '확인받고 싶다고 한다');
    case 'close_seat': return [...part(14, '옆자리를 묻는다', '산책을 제안한다'), n('맞은편에서 옆으로 옮겼다. 같은 방향으로 식당 안을 보니, 고개를 돌리는 거리가 달라졌다.')];
    case 'close_walk': return [...part(14, '산책을 제안한다', '여기서 마친다'), scene(16, 'neighborhood-day', 'evening', 'girlfriend'),
      n(f.heldHands ? '손이 스친 다음 자연스럽게 이어졌다.' : '나란히 걷는 거리만 조금 좁아졌다.')];
    case 'close_home': return part(14, '여기서 마친다');
    case 'solo_jihoon': return msg(part(15, '지훈에게 연락한다', '하은에게 연락한다'));
    case 'solo_haeun': return msg(part(15, '하은에게 연락한다', '혼자 먹는 데 집중한다'));
    case 'solo_food': return [n('마지막 한 입을 천천히 먹었다. 지금은 그냥 내가 먹는 날이었다.')];
    case 'return_walk': return [scene(16, 'neighborhood-day', 'evening'), n('신호등 앞에서 한 번 멈췄다. 다음 신호를 기다렸다.'), n('같이 출발한 적도 없는 사람에게 뒤처졌다고 생각하고 있었다.')];
    case 'return_home': return [n('현관에서 신발을 벗자 발이 편해졌다. 옷을 의자에 던지려다 옷걸이에 걸었다.')];
    case 'return_food': return [n('냉장고를 열었다. 남은 것을 앞쪽으로 옮기고 문을 닫았다. 지금 당장 살 필요가 없는 것은 사지 않았다.')];
    case 'night_good': return msg(D(17, '**좋았다고 말한다**', '**생각이 남았다고 말한다**'));
    case 'night_thought': return [...msg(part(17, '생각이 남았다고 말한다', '짧게 인사한다')),
      ...msg(f.comfortableDinner ? [d('나','같이 먹어서 좋았어. 그 마음도 빠뜨리고 이야기할 뻔했네.')] : [d('나','아까 말한 다른 마음이 사라졌다고 할 수는 없어.')])];
    case 'night_rest': return msg(D(17, '**짧게 인사한다**', '이 세 갈래에서는'));
    case 'night_tell': return f.dinner === 'YURI' ? msg([d('나', i.haeunKnowsAppointment ? '네가 아는 그 저녁 먹고 왔어. 내가 무슨 말을 했는지 이야기하고 싶어.' : '오늘 유리 씨와 저녁을 먹었어. 내가 무슨 말을 했는지도 이야기하고 싶어.'),
      d('나',f.yuriPurpose === 'purpose_past' ? '예전에 둘이 어땠는지 궁금해서 나갔어.' : f.yuriPurpose === 'purpose_present' ? '지금의 유리 씨가 궁금해서 나갔다고 말했어.' : '내가 왜 다시 만나고 싶은지 확인하고 싶었다고 말했어.'),
      d('나',f.yuriNext === 'REQUESTED_NOT_ACCEPTED' ? '다시 만나고 싶다고도 했어. 그쪽에서는 아직 만나겠다고 한 건 아니라고 했고.' : f.yuriNext === 'PAST_CLOSED' ? '과거 이야기는 여기까지 듣고 싶다고 했어.' : '당분간 각자 지내 보자고 했어.')])
      : msg([d('나', '김밥 한 줄 먹고, 결국 더 시켰어.')]);
    case 'night_defer': return msg(part(17, '시간을 요청한다', '혼자 먹었다고 한다'));
    case 'night_solo': return f.dinner === 'SOLO' ? msg([d('하은', '뭐 먹었어?'), d('나', '김밥. 한 줄 먹고 더 시켰어.')]) : [n('같은 음식을 이야기하면서도, 맞은편에 앉았던 사람은 말하지 않았다.')];
    case 'night_correct': return msg([d('하은', '왜 지금 혼자라고 했어?'), d('나', '네가 무슨 생각 할지 무서워서. 그런데 거짓말을 했어.'), d('하은', '오늘은 여기까지 이야기하자.')]);
    case 'night_lie_cancel': return [n('한 문장을 덮으려고 다음 문장을 썼다는 사실을 알고 있었다.')];
    case 'future_continue': return msg(part(18, '관계를 이어 가고 싶다고 한다', '확신을 꾸미지 않는다'));
    case 'future_unsure': return msg(part(18, '확신을 꾸미지 않는다', '다른 사람을 더 만나고 싶다고 한다'));
    case 'future_others': return msg(part(18, '다른 사람을 더 만나고 싶다고 한다'));
    case 'calm_trip': return msg(part(19, '하루 나가고 싶다', '쉬는 모습을 보고 싶다'));
    case 'calm_rest': return msg(part(19, '쉬는 모습을 보고 싶다', '같은 저녁을 원한다'));
    case 'calm_dinner': return msg(part(19, '같은 저녁을 원한다'));
    case 'alone_stop': return [n('휴대전화를 내려놓고 컵을 씻었다. 물소리 때문에 방이 덜 조용해졌다.')];
    case 'alone_note': return [n('상대의 표정을 추측하는 대신 내가 한 문장을 적었다. 메모를 누구에게도 보내지 않았다.')];
    case 'alone_jihoon': return msg(part(20, '지훈에게 묻는다'));
    case 'travel_near': return [n('돌아오고 싶으면 돌아올 수 있다는 생각도 여행을 망치는 말은 아니었다.')];
    case 'travel_busan': return [n('역에서 이동하고, 먹고, 쉬고, 다시 돌아와야 했다. 사진 아래의 시간을 내 하루로 옮겨 봐야 했다.')];
    case 'travel_life': return [n('화면을 끄고 내일 입을 옷을 봤다. 지금 사는 방도 계속 살 곳이었다.')];
    default: throw new Error(`DAY18_REACTION_MISSING:${key}`);
  }
}

function departure(c) {
  return c.facts.dinner === 'YURI'
    ? [d('유리', '잘 들어가.'), d('나', '유리 씨도요.'), n('그녀가 돌아서는 방향과 내가 가는 방향은 달랐다.')]
    : c.facts.dinner === 'HAEUN' ? [n('서로 집으로 가는 방향을 확인했다.')] : [];
}

function yuriPresentConversation(c) {
  return D(8).flatMap(step => step.text === '아니. 내가 읽는 책. 일이랑 다르다니까.'
    ? [step, c.input.yuriOwnBookKnown ? n('지난번 자기 책 이야기를 할 때와 같은 말이었다. 유리 씨도 웃었다.') : d('나', '아, 그냥 읽는 책.')]
    : [step]);
}

function opening(c) {
  const f = c.facts, i = c.input;
  switch (c.phase) {
    case 'morning': return [scene(1, 'home-morning', 'morning'), n('알람을 끄고 나서도 잠깐 누워 있었다.'), n('식탁에 놓인 물을 마셨다. 휴대전화에는 어제 내가 보낸 답이 남아 있었다.'),
      n(i.appointment === 'YURI' ? '유리 씨와 장소와 시간을 확인한 두 줄.' : i.appointment === 'HAEUN' ? '하은과 퇴근하고 만나자는 짧은 대화.' : '저녁 칸은 비어 있었다.')];
    case 'disclosure': return [scene(2, 'home-morning', 'afternoon'), ...msg([d('하은', '점심 먹었어? 나는 지금 먹으러 나왔어.'),
      ...(f.dinner === 'YURI' && i.haeunKnowsAppointment ? [d('하은', '오늘 너무 늦지는 않을 거지?')] : [])])];
    case 'menu': return [scene(3, place(c), 'evening', f.dinner === 'YURI' ? null : companion(c)),
      ...(f.dinner === 'YURI' ? [n('유리 씨는 아직 오지 않았다. 메뉴를 한 번 다 읽었는데 아무것도 고르지 않았다.'), scene(3,place(c),'evening','yuri'), ...D(3, undefined, '하은과 약속한 저녁')]
        : f.dinner === 'HAEUN' ? D(3, '하은과 약속한 저녁', '혼자 먹는 저녁')
        : [n('배고픈 것보다 눈이 바쁘다는 걸 깨달았다.'), ...D(3, '혼자 먹는 저녁')]),
      scene(4, place(c), 'evening', companion(c)), ...(f.dinner === 'YURI' ? D(4, undefined, '### 선택 3') : [])];
    case 'yuri_purpose': return [scene(5, place(c), 'evening', 'yuri'), ...D(5, undefined, '### 선택 4')];
    case 'yuri_apology': return [scene(6, place(c), 'evening', 'yuri'), ...D(6), scene(7, place(c), 'evening', 'yuri'), ...D(7, undefined, '### 선택 5')];
    case 'yuri_relationship': return [scene(8, place(c), 'evening', 'yuri'), ...yuriPresentConversation(c), scene(9, place(c), 'evening', 'yuri'), ...D(9, undefined, '### 선택 6')];
    case 'yuri_correction': return [d('유리', '지난번에는 여자친구가 있다고 했잖아. 그사이 헤어졌다는 뜻이야?')];
    case 'yuri_next': return [scene(10, place(c), 'evening', 'yuri'), ...D(10, undefined, '### 선택 7')];
    case 'payment': return [scene(11, place(c), 'evening', 'yuri'), ...D(11, undefined, '### 선택 8')];
    case 'haeun_topic': return [scene(12, place(c), 'evening', 'girlfriend'), ...D(12), scene(13, place(c), 'evening', 'girlfriend'),
      ...(i.yuriPastRelevant ? D(13, undefined, '유리와의 접점이 없거나') : D(13, '유리와의 접점이 없거나', '### 선택 9'))];
    case 'closeness': return [scene(14, place(c), 'evening', 'girlfriend'), ...D(14, undefined, '### 선택 10')];
    case 'solo_contact': return [scene(15, place(c), 'evening'), n('김밥 한 줄을 다 먹었을 때 휴대전화를 한 번 봤다.'), n('아직 배가 고픈지 보기 전에 누가 연락했는지 먼저 보고 있었다.'), n('휴대전화를 뒤집었다. 조금 생각한 뒤 작은 식사를 하나 더 주문했다.')];
    case 'return': return [scene(16, place(c), 'evening'), n('다 먹은 뒤에야 휴대전화를 들었다.')];
    case 'night': return [...departure(c), scene(17, 'home-evening', 'night'), n('현관 불을 켜고 물을 한 잔 마셨다.')];
    case 'night_correction': return msg([d('하은', '약속 취소됐어?')]);
    case 'relationship_future': return [scene(18, 'home-evening', 'night'), ...msg([
      d('하은', '듣고 있어.'), d('하은', f.dinner === 'YURI' ? '너는 얘기하고 와서 정리가 조금 됐을 수도 있는데, 나는 지금 처음 듣는 마음이 있어.' : '아까 들은 마음을 아직 생각하고 있어. 같이 밥을 먹었다고 바로 괜찮아지는 건 아니잖아.'),
      ...(f.dinner === 'YURI' && f.yuriPurpose === 'purpose_past' && f.yuriNext !== 'REQUESTED_NOT_ACCEPTED'
        ? [d('나', '오늘은 그 사람 얘기를 들었어. 나한테 좋았던 사람인지 나빴던 사람인지 답을 받으려 했는데, 그렇게 끝낼 수는 없었어.'), d('하은', '그건 나도 대신 말할 수 없지.')]
        : [d('하은', '그럼 나는 네 마음이 돌아올 때까지 기다리고 있어야 해?'), d('나', '그렇게 부탁할 수는 없어.'), d('하은', '그 말만 하면 내가 다 정해야 하는 것 같아. 네가 나랑 어떻게 지내고 싶은지도 말해 줘.')])])];
    case 'calm_future': return [scene(19, 'home-evening', 'night'), ...msg([
      ...(f.dinner === 'HAEUN' ? D(19, undefined, '같이 먹지 않고') : [d('나', '나는 오늘 김밥 먹었어. 너는 뭐 먹었어?'), d('하은', '나는 내 쪽에서 먹었지. 따뜻한 거 먹었어.')]),
      ...D(19, '**주인공** “다음에는', '### 평온한 경로의 선택 12')])];
    case 'alone_end': return [...(!i.contactAllowed ? departure(c) : []), scene(20, 'home-evening', 'night'),
      n(f.nightRoute === 'UNRESOLVED' ? '화면을 보고 있었다. 한 번 더 누르면 말을 조금 더 잘할 수 있을 것 같았다.' : '휴대전화를 내려놓았다. 남은 밤에는 내가 할 수 있는 작은 일이 있었다.')];
    case 'travel': return [scene(21, 'home-evening', 'night'), n('파란 바다와 창가의 테이블. 사진 바깥에는 이동 시간도, 돌아와서 쌓인 빨래도 없었다.'),
      ...(f.travelTogetherDiscussed ? msg(D(21, undefined, '같이 갈 마음이 아직')) : [n('사진을 보내며 누군가의 미래를 정해 놓지는 않았다.')])];
    case 'ending': return ending(c);
    default: throw new Error(`DAY18_OPENING_MISSING:${c.phase}`);
  }
}

function ending(c) {
  const f = c.facts;
  const hasLie = f.statements.some(s => !s.truthful);
  return [n('오늘은 어느 쪽도 결제하지 않았다. 누군가와 함께 가려면 그 사람의 내일도 물어야 했다.'),
    scene(22, 'home-evening', 'night'),
    n(f.dinner === 'YURI' ? '유리 씨가 나를 어떻게 기억하는지는 조금 더 들었다. 그렇다고 내가 그 기억 속 사람의 표정을 따라 하면 오늘 저녁이 완성되는 건 아니었다.'
      : f.dinner === 'HAEUN' ? '하은이 파일 이름 때문에 웃던 얼굴이 떠올랐다. 나를 안심시키려고 지은 얼굴이 아니었다.'
      : '한 줄을 다 먹고 한 번 더 주문한 일이 떠올랐다. 누군가와 함께할 준비가 끝나야 나를 먹일 수 있는 건 아니었다.'),
    scene(23, 'home-evening', 'night'),
    n(hasLie ? '내가 실제로 보낸 문장을 다시 보았다. 이미 말한 마음을, 몰랐다는 말로 지우지는 않기로 했다.'
      : f.appointmentCancelled ? '약속을 바꾼 사실과 그때 보낸 말을 다시 보았다. 취소를 없던 일로 만들지 않는 것도 오늘 내가 할 수 있는 일이었다.'
        : f.dinner === 'SOLO' ? '혼자 보내기로 한 저녁을 누구에게 벌처럼 돌리지 않은 것. 그 정도로 끝나는 날도 있었다.'
          : '오늘 내가 한 약속을 지킨 것. 나와 먹고 싶다는 사람에게 나도 먹고 싶다고 말한 것. 그 정도로 끝나는 날도 있었다.'),
    scene(24, 'home-evening', 'night'),
    ...(f.travelTogetherDiscussed ? msg(D(24, undefined, '생각할 시간을 둔 밤')) : f.followUpContact
      ? [n('내일 연락하기로 한 약속을 남겼다. 여행 사진은 아직 보내지 않았다. 먼 풍경으로 오늘의 대답을 대신하고 싶지 않았다.')]
      : [n('알람을 맞추고 휴대전화를 내려놓았다. 내일은 내 돈과 내 시간부터 볼 생각이었다.')]),
    n('오늘 저녁에 누구와 앉았는지만으로는 내 마음을 설명할 수 없었다. 그래도 내가 무슨 말을 했는지는 남았다.'),
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
  relationship_future: '하은과의 다음을 어떻게 말할까', calm_future: '같이 해 보고 싶은 것', alone_end: '남은 밤에 할 일',
  travel: '내일 살펴볼 하루'
};
