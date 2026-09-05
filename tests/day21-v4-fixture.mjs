import {DAY21_V4_SCHEMA,applyDay21V4Choice,getDay21V4Options,validateDay21V4} from '../src/day21-v4-state-contract.mjs';

export function day21State(overrides={}){
  const input={relationshipActive:true,contactAllowed:true,relationshipTone:'CALM',morningMode:'STAYED_MORNING',day20VisitMode:'FACE_TO_FACE',day20StayedOver:true,day20SleepingPlan:'SEPARATE_BEDDING',day20CupChoice:'FITS_HAND',day20BorrowedClothes:false,day20FirstHug:false,day20HeldHands:false,day20SatSideBySide:true,day20EveningExtension:'STAY_LONGER',day20NextInvitation:'OPEN',day20DisclosureRoute:'NONE',day20NightEnd:'STAYED',day19TravelCandidate:'BUSAN_NIGHT',day19ReservationStatus:'CANDIDATE_ONLY',day19BudgetMode:'SPLIT',day19ScheduleTrim:'LIGHT',day19PendingContacts:[],day19ContactHandling:'DONE',day19MinhoReply:null,source:{day20Schema:'day20-notion-v4/1',day20Choice13:'day20_v4_c13_x',day20Choice14:'day20_v4_c14_x'},...overrides};
  const chapter={schema:DAY21_V4_SCHEMA,input,choices:[],phase:'morning',complete:false,facts:{morningChoice:null,breakfastChoice:null,conversationMode:null,conversationAccepted:false,heardHaeunStory:false,heardLunchStory:false,heardWorkStory:false,heardAngerStory:false,heardSocksStory:false,listeningApproach:null,afternoonResponse:null,stayingResponse:null,storyContinuation:null,feelingStatement:null,opennessPlan:null,contactIntent:null,todayContact:null,dinnerPlan:null,travelDiscussion:false,travelIntent:null,travelResult:null,lodgingRequest:null,lodgingAgreement:null,travelChecks:null,bookingConfirmed:false,travelPaymentMade:false,preparationPlan:null,bagPlan:null,finalMessage:null,deferredReflection:null,deferredExplanation:null,deferredTomorrow:null,deferredTask:null,deferredGoodnight:null}};
  if(!validateDay21V4(chapter))throw new Error('INVALID_DAY21_TEST_FIXTURE');
  return {storyFlags:{day21V4:chapter}};
}

export function chooseDay21(state,index=0){return applyDay21V4Choice(state,getDay21V4Options(state.storyFlags.day21V4)[index].id);}
