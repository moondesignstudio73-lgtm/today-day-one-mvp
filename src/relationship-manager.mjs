export function getRelationshipState(state) {
  if (state.affection <= 280 || state.conflict >= 80 || state.relationshipStress >= 85) return { id:"crisis", label:"이별 위기", tone:"danger", description:"관계를 회복할 중요한 선택이 필요하다." };
  if (state.affection >= 700 && state.trust <= 380) return { id:"love-with-doubt", label:"사랑하지만 의심", tone:"warning", description:"마음은 크지만 신뢰가 흔들리고 있다." };
  if (state.trust >= 720 && state.excitement <= 350) return { id:"comfortable-rut", label:"편안하지만 권태", tone:"calm", description:"믿음은 단단하지만 새로운 설렘이 필요하다." };
  if (state.affection >= 760 && state.trust >= 700 && state.excitement >= 600) return { id:"deep-love", label:"깊어지는 사랑", tone:"love", description:"사랑과 믿음, 설렘이 고르게 자라고 있다." };
  if (state.relationshipStress >= 55 || state.conflict >= 50) return { id:"tense", label:"불안한 관계", tone:"warning", description:"쌓인 긴장과 갈등을 풀 시간이 필요하다." };
  if (state.affection <= 430) return { id:"distant", label:"멀어지는 마음", tone:"calm", description:"서로에게 쓰는 시간과 관심이 줄고 있다." };
  return { id:"dating", label:"연애 중", tone:"normal", description:"아직 서로를 알아가는 평범한 연애다." };
}
