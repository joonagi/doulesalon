export type ContentFormat =
  | "Interview"
  | "Essay"
  | "Review"
  | "Guide"
  | "Playlist"
  | "Event";

export type ContentCategory =
  | "Film"
  | "Art"
  | "Music"
  | "Books"
  | "Church & Culture"
  | "People"
  | "Events"
  | "Thought";

export type Person = {
  id: string;
  name: string;
  role: string;
  field: ContentCategory;
  bio: string;
  portrait: string;
  portraitAlt: string;
  signatureQuestion: string;
  interviewIds: string[];
  recommendedWorks: string[];
};

export type Content = {
  slug: string;
  title: string;
  subtitle: string;
  category: ContentCategory;
  format: ContentFormat;
  summary: string;
  body: string[];
  heroImage: string;
  imageAlt: string;
  caption: string;
  author: string;
  guestId?: string;
  publishedAt: string;
  readTime?: string;
  videoLength?: string;
  audioLength?: string;
  tags: string[];
  relatedContent: string[];
  quotes?: string[];
  recommendations?: string[];
  discussionQuestions?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  audience: string;
  season: string;
  estimatedTime: string;
  summary: string;
  image: string;
  imageAlt: string;
  contentIds: string[];
  discussionQuestions: string[];
  downloadableAsset: string;
};

export type Newsletter = {
  issueTitle: string;
  editorialQuestion: string;
  highlights: string[];
  subscribeCta: string;
  deliveryNote: string;
};

export type Support = {
  supporterBenefits: string[];
  readingKit: string;
  salon: string;
  behindNotes: string;
};

export const people: Person[] = [
  {
    id: "han-seojin",
    name: "한서진",
    role: "독립영화 감독",
    field: "Film",
    bio: "낮은 예산과 긴 기다림 속에서 인간의 표정을 찍어 온 감독. 최근작은 작은 도시의 청년부와 오래된 극장을 배경으로 한다.",
    portrait:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    portraitAlt: "창가 옆에서 카메라를 바라보는 여성 창작자",
    signatureQuestion: "믿음은 영화의 주제인가, 시선인가?",
    interviewIds: ["waiting-face-film"],
    recommendedWorks: ["영화 <퍼스트 리폼드>", "책 <예술과 성육신>", "음반 <Seven Psalms>"]
  },
  {
    id: "lee-daniel",
    name: "이다니엘",
    role: "음악 프로듀서",
    field: "Music",
    bio: "예배음악 밖에서 신앙의 언어를 탐색하는 프로듀서. 사운드스케이프와 합창의 경계를 다룬다.",
    portrait:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
    portraitAlt: "작업실에서 생각에 잠긴 남성 음악가",
    signatureQuestion: "노래는 고백이 아니어도 기도가 될 수 있을까?",
    interviewIds: ["songs-outside-worship"],
    recommendedWorks: ["Arvo Part", "Sufjan Stevens", "현대 합창 녹음집"]
  },
  {
    id: "park-harin",
    name: "박하린",
    role: "현대미술 작가",
    field: "Art",
    bio: "버려진 사물과 낡은 종이를 통해 기억과 회복의 이미지를 만든다. 공동체 워크숍을 함께 운영한다.",
    portrait:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    portraitAlt: "밝은 작업실에서 미소 짓는 여성 작가",
    signatureQuestion: "상처 입은 재료는 어떻게 새 형상이 되는가?",
    interviewIds: [],
    recommendedWorks: ["전시 <다시 붙인 표면>", "책 <예술가의 기도>"]
  },
  {
    id: "cho-minwoo",
    name: "조민우",
    role: "번역가 / 편집자",
    field: "Books",
    bio: "신학, 문학, 예술 비평을 번역하며 교회 독자와 문화 독자 사이의 언어를 다듬는다.",
    portrait:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    portraitAlt: "책장 앞에 서 있는 남성 편집자",
    signatureQuestion: "번역은 신앙의 언어를 어떻게 넓히는가?",
    interviewIds: [],
    recommendedWorks: ["책 <상상력과 신앙>", "책 <Theology and the Arts>"]
  },
  {
    id: "kim-yewon",
    name: "김예원",
    role: "큐레이터",
    field: "Art",
    bio: "교회 공간과 지역 갤러리를 잇는 전시를 기획한다. 관람 후 대화가 남는 전시를 중요하게 여긴다.",
    portrait:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    portraitAlt: "갤러리 벽 앞에 서 있는 여성 큐레이터",
    signatureQuestion: "교회는 작품을 어디까지 환대할 수 있을까?",
    interviewIds: [],
    recommendedWorks: ["전시 산책 노트", "동네 갤러리 지도"]
  }
];

export const contents: Content[] = [
  {
    slug: "waiting-face-film",
    title: "나는 복음을 설명하기보다 기다림의 얼굴을 찍고 싶었다",
    subtitle: "독립영화 감독 한서진 인터뷰",
    category: "Film",
    format: "Interview",
    summary:
      "신앙, 실패, 제작비, 교회와 영화의 거리, 그리고 창작자의 소명에 대해 나눈 긴 대화.",
    body: [
      "한서진 감독은 영화가 정답을 말하는 장르라고 생각하지 않는다. 그에게 영화는 오래 바라보는 일이고, 쉽게 판단하지 않기 위해 카메라를 낮추는 일이다.",
      "이번 인터뷰에서 그는 기독교 창작자가 작품 속에 신앙을 넣는 방식보다, 세계를 바라보는 태도가 먼저 바뀌어야 한다고 말했다. 그래서 그의 영화에는 설교보다 침묵이 많고, 결론보다 얼굴이 오래 남는다.",
      "우리는 작은 제작비로 장편을 완성하는 일, 교회 공동체 안에서 예술가로 살아가는 어려움, 그리고 실패를 견디는 법에 대해 물었다."
    ],
    heroImage:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "어두운 상영관에서 영화 카메라와 조명이 놓인 현장",
    caption: "늦은 밤 촬영 현장. 그는 인물의 침묵을 가장 오래 기다리는 순간이라고 말했다.",
    author: "둘레살롱 편집부",
    guestId: "han-seojin",
    publishedAt: "2026-05-24",
    readTime: "9분 읽기",
    videoLength: "46분 영상",
    audioLength: "42분 오디오",
    tags: ["독립영화", "창작자의 소명", "기다림", "교회와 영화"],
    relatedContent: ["films-about-forgiveness", "how-to-watch-nonchristian-film"],
    quotes: [
      "믿음은 제 영화의 주제가 아니라 제가 세상을 바라보는 방식입니다.",
      "설명하고 싶은 마음이 커질수록 카메라는 사람을 덜 보게 됩니다.",
      "실패를 견디는 힘은 결과보다 공동체가 먼저 기억해 줄 때 생깁니다.",
      "교회가 예술가에게 줄 수 있는 가장 큰 선물은 빠른 평가가 아니라 긴 환대입니다.",
      "저는 복음을 증명하기보다, 복음이 필요한 얼굴을 오래 바라보고 싶습니다."
    ],
    recommendations: ["영화 <퍼스트 리폼드>", "책 <예술과 성육신>", "음반 <Seven Psalms>"],
    discussionQuestions: [
      "작품이 신앙을 직접 말하지 않아도 신앙적일 수 있는가?",
      "우리가 누군가를 빠르게 판단하지 않기 위해 필요한 시선은 무엇인가?",
      "교회 공동체는 창작자의 실패를 어떻게 함께 견딜 수 있을까?"
    ]
  },
  {
    slug: "films-about-forgiveness",
    title: "용서가 불가능한 세계에서 영화는 무엇을 보여주는가",
    subtitle: "죄책감과 회복을 다룬 영화 다섯 편",
    category: "Film",
    format: "Essay",
    summary:
      "복수와 죄책감으로 가득한 이야기 속에서 용서가 어떤 형식으로 나타나는지 읽는다.",
    body: [
      "영화 속 용서는 대개 너무 늦게 찾아온다. 인물들은 이미 많은 것을 잃은 뒤에야 자신이 붙들고 있던 분노의 모양을 알아차린다.",
      "기독교적 시선으로 영화를 본다는 것은 작품을 안전한 교훈으로 줄이는 일이 아니다. 오히려 영화가 드러내는 인간의 불가능성을 끝까지 바라보고, 그곳에서 은혜가 필요한 이유를 묻는 일이다.",
      "이 글은 다섯 편의 영화를 통해 죄책감, 보상, 화해, 침묵, 기다림이라는 키워드로 용서의 서사를 살핀다."
    ],
    heroImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "붉은 좌석이 이어지는 비어 있는 영화관",
    caption: "비어 있는 상영관은 아직 말해지지 않은 화해의 자리를 닮았다.",
    author: "정은서",
    publishedAt: "2026-05-23",
    readTime: "7분 읽기",
    tags: ["영화 읽기", "용서", "소그룹"],
    relatedContent: ["waiting-face-film", "how-to-watch-nonchristian-film"],
    recommendations: ["<맨체스터 바이 더 씨>", "<밀양>", "<어느 가족>", "<사일런스>", "<세 가지 색: 블루>"]
  },
  {
    slug: "gallery-five-this-week",
    title: "이번 주 볼 만한 전시 5개",
    subtitle: "서울의 작은 갤러리에서 만나는 회복의 장면",
    category: "Art",
    format: "Review",
    summary:
      "작업실의 재료, 지역의 기억, 공동체의 질문을 다루는 전시를 골랐다.",
    body: [
      "이번 주 전시는 큰 미술관보다 작은 공간에서 오래 머무를 만한 작업을 중심으로 골랐다.",
      "작가의 설명보다 작품 앞에서 생기는 질문을 따라가면, 신앙의 언어가 어디서 멈추고 다시 시작되는지 보인다."
    ],
    heroImage:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "갤러리 벽에 걸린 작품을 바라보는 사람",
    caption: "작은 전시 공간은 작품과 관람자의 속도를 천천히 맞춘다.",
    author: "둘레살롱 편집부",
    publishedAt: "2026-05-22",
    readTime: "5분 읽기",
    tags: ["전시", "서울", "아트"],
    relatedContent: ["small-gallery-guide"]
  },
  {
    slug: "songs-outside-worship",
    title: "예배음악 밖에서 만난 신앙의 노래",
    subtitle: "음악가 이다니엘과의 짧은 대화",
    category: "Music",
    format: "Interview",
    summary:
      "찬양의 형식 밖에서도 기도처럼 들리는 사운드와 가사를 이야기했다.",
    body: [
      "이다니엘 프로듀서는 예배음악과 대중음악을 엄격히 나누는 방식보다, 소리가 사람을 어떻게 기다리게 하는지에 관심이 있다.",
      "그에게 신앙적 음악은 특정 단어보다 청자가 머물 수 있는 공간을 여는 방식에 가깝다."
    ],
    heroImage:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "마이크와 악기가 놓인 녹음실",
    caption: "녹음실의 조용한 오후. 그는 여백을 가장 중요한 악기라고 불렀다.",
    author: "둘레살롱 편집부",
    guestId: "lee-daniel",
    publishedAt: "2026-05-21",
    readTime: "6분 읽기",
    videoLength: "18분 영상",
    audioLength: "16분 오디오",
    tags: ["음악", "기도", "예배 밖의 노래"],
    relatedContent: ["waiting-face-film"],
    quotes: [
      "고백의 언어가 없어도, 어떤 소리는 우리를 기도의 자리로 데려갑니다.",
      "좋은 음악은 설명을 이기려 하지 않고, 듣는 사람에게 시간을 줍니다."
    ]
  },
  {
    slug: "books-for-makers",
    title: "창작자에게 권하는 신앙과 예술의 책 5권",
    subtitle: "이번 달 문화 리딩 키트",
    category: "Books",
    format: "Guide",
    summary:
      "창작자의 소명, 노동, 실패, 상상력을 함께 읽을 수 있는 책을 골랐다.",
    body: [
      "창작자는 자기 안의 질문만으로 오래 버티기 어렵다. 좋은 책은 작업의 언어를 넓히고, 실패를 혼자 감당하지 않게 만든다.",
      "이번 달 리딩 키트는 예술을 사치나 도구로 보지 않고, 소명과 공동체의 관점에서 읽을 수 있는 책들로 구성했다."
    ],
    heroImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "나무 책상 위에 펼쳐진 책과 노트",
    caption: "읽기는 창작자의 작업실을 조용히 넓히는 일이다.",
    author: "조민우",
    publishedAt: "2026-05-20",
    readTime: "6분 읽기",
    tags: ["책", "창작자", "리딩 키트"],
    relatedContent: ["waiting-face-film"],
    recommendations: ["<예술과 성육신>", "<상상력과 신앙>", "<작업실의 기도>", "<창작자의 노동>", "<공동체와 아름다움>"]
  },
  {
    slug: "how-to-watch-nonchristian-film",
    title: "기독교인은 비기독교 영화를 어떻게 볼 것인가",
    subtitle: "소그룹을 위한 영화 대화의 첫 원칙",
    category: "Church & Culture",
    format: "Essay",
    summary:
      "검열과 소비 사이에서, 영화가 던지는 질문을 신앙으로 대화하는 법.",
    body: [
      "기독교 관객에게 영화는 종종 위험하거나 유익한 것으로만 분류된다. 그러나 문화는 그렇게 단순한 기준으로만 다룰 수 없다.",
      "비기독교 영화를 본다는 것은 믿음을 내려놓는 일이 아니라, 믿음으로 인간의 욕망과 두려움과 사랑을 더 정직하게 바라보는 훈련이 될 수 있다.",
      "좋은 소그룹 대화는 작품을 정죄하거나 소비하는 데서 끝나지 않는다. 인물이 무엇을 사랑했고, 무엇을 잃었고, 무엇을 구원으로 착각했는지 묻는다."
    ],
    heroImage:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "영화관 스크린을 바라보는 관객들의 뒷모습",
    caption: "함께 보는 일은 같은 장면 앞에서 다른 질문을 배우는 일이다.",
    author: "강유진",
    publishedAt: "2026-05-18",
    readTime: "8분 읽기",
    tags: ["교회와 문화", "영화", "소그룹"],
    relatedContent: ["films-about-forgiveness", "waiting-face-film"],
    discussionQuestions: [
      "작품 속 인물은 무엇을 구원으로 믿고 있었나?",
      "내가 불편하게 느낀 장면은 무엇이며, 그 이유는 무엇인가?",
      "이 영화를 보고 공동체가 함께 기도할 수 있는 지점은 어디인가?"
    ]
  },
  {
    slug: "friday-cultural-letter",
    title: "금요 문화 편지: 창작자는 무엇을 믿고 만드는가",
    subtitle: "이번 주 질문과 큐레이션",
    category: "Thought",
    format: "Playlist",
    summary:
      "이번 주 인터뷰, 볼 영화, 들을 음악, 읽을 책, 소그룹 질문을 한 통의 편지로 엮었다.",
    body: [
      "이번 주 문화 편지는 창작자의 기다림을 중심으로 엮었다. 한 편의 인터뷰, 두 편의 영화, 세 곡의 음악, 그리고 공동체가 함께 나눌 질문을 담았다.",
      "편지는 매주 금요일 오전 발송된다. 빠른 소식보다 오래 남는 질문을 우선한다."
    ],
    heroImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "노트북과 커피, 노트가 놓인 책상",
    caption: "편집실의 금요일 아침. 한 주의 문화 질문을 편지로 정리한다.",
    author: "둘레살롱 편집부",
    publishedAt: "2026-05-17",
    readTime: "4분 읽기",
    tags: ["뉴스레터", "큐레이션", "금요일"],
    relatedContent: ["waiting-face-film", "books-for-makers"]
  }
];

export const guides: Guide[] = [
  {
    slug: "small-group-film-guide",
    title: "교회 소그룹 영화 가이드",
    audience: "청년부, 장년부, 부부모임, 독서모임",
    season: "상시",
    estimatedTime: "90-120분",
    summary:
      "영화를 함께 본 뒤 정죄나 감상평을 넘어 신앙의 언어로 대화하도록 돕는 진행안.",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "영화관 객석과 스크린",
    contentIds: ["how-to-watch-nonchristian-film", "films-about-forgiveness"],
    discussionQuestions: [
      "인물이 붙들고 있던 거짓 구원은 무엇인가?",
      "영화가 보여준 인간의 상처와 성경의 언어는 어디서 만나는가?",
      "공동체가 이 이야기 앞에서 할 수 있는 환대는 무엇인가?"
    ],
    downloadableAsset: "PDF 진행안 준비 중"
  },
  {
    slug: "seoul-christian-culture-map",
    title: "서울 기독교 문화 지도",
    audience: "기독 창작자, 문화 사역자, 큐레이터",
    season: "봄/가을 업데이트",
    estimatedTime: "반나절 산책",
    summary:
      "기독교 서점, 독립영화관, 갤러리, 공연장, 북토크 공간을 엮은 도시형 가이드.",
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "도시 거리의 서점과 간판",
    contentIds: ["gallery-five-this-week", "books-for-makers"],
    discussionQuestions: [
      "우리 동네에서 신앙과 문화가 만나는 장소는 어디인가?",
      "교회 공간은 지역 예술가에게 어떤 방식으로 열릴 수 있는가?",
      "문화 공간을 방문한 뒤 공동체가 남길 기록은 무엇인가?"
    ],
    downloadableAsset: "지도형 체크리스트 준비 중"
  },
  {
    slug: "lent-culture-guide",
    title: "절기별 문화 가이드",
    audience: "목회자, 예배 기획자, 소그룹 리더",
    season: "사순절, 부활절, 성탄절",
    estimatedTime: "4주 과정",
    summary:
      "교회력에 맞춰 영화, 책, 음악, 전시를 큐레이션하고 나눔 질문을 제공한다.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "따뜻한 빛이 들어오는 목재 공간과 의자",
    contentIds: ["films-about-forgiveness", "books-for-makers"],
    discussionQuestions: [
      "절기의 신학이 오늘의 문화 경험과 만나는 지점은 어디인가?",
      "작품을 통해 회개, 기다림, 소망을 어떻게 말할 수 있는가?",
      "예배와 일상 사이에서 반복해서 붙들 질문은 무엇인가?"
    ],
    downloadableAsset: "4주 커리큘럼 준비 중"
  }
];

export const newsletter: Newsletter = {
  issueTitle: "금요 문화 편지",
  editorialQuestion: "이번 주의 질문: 창작자는 무엇을 믿고 만드는가",
  highlights: [
    "이번 주 인터뷰 한 편",
    "볼 만한 영화와 전시",
    "읽을 책과 들을 음악",
    "소그룹에서 나눌 짧은 질문"
  ],
  subscribeCta: "금요 문화 편지 받기",
  deliveryNote: "매주 금요일 오전, 빠른 뉴스보다 오래 남는 질문을 보냅니다."
};

export const support: Support = {
  supporterBenefits: ["월간 문화 리딩 키트", "후원자 살롱 초대", "인터뷰 전문 PDF", "비하인드 편집 노트"],
  readingKit: "이번 달 책, 영화, 음악을 한 번에 읽는 큐레이션",
  salon: "창작자와 독자가 함께 만나는 작은 대화 모임",
  behindNotes: "인터뷰에서 다 담지 못한 질문과 편집자의 메모"
};

export const fieldSections: ContentCategory[] = ["Film", "Art", "Music", "Books"];

export function getFeaturedInterview() {
  return contents.find((content) => content.slug === "waiting-face-film") ?? contents[0];
}

export function getContentBySlug(slug: string) {
  return contents.find((content) => content.slug === slug);
}

export function getPersonById(id: string) {
  return people.find((person) => person.id === id);
}

export function getRelatedContent(slugs: string[]) {
  return slugs
    .map((slug) => getContentBySlug(slug))
    .filter((content): content is Content => Boolean(content));
}

export function getContentHref(content: Content) {
  if (content.format === "Interview") {
    return `/interviews/${content.slug}`;
  }

  if (content.format === "Essay") {
    return `/essays/${content.slug}`;
  }

  if (content.format === "Guide") {
    return "/guides";
  }

  if (content.format === "Playlist") {
    return "/newsletter";
  }

  return `/essays/${content.slug}`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(date));
}
