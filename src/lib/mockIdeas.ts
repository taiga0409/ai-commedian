import type { Idea } from "@/types/idea";

export const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "コンビニで袋を断った話",
    episodeRough:
      "コンビニで袋いらないですと言ったら、店員さんが商品を全部手渡しで積んできて、両手が完全に終わった。",
    episodeMain:
      "昨日コンビニ行ったんですけど、袋いらないですって言ったら、商品を全部手渡しで積まれて、俺だけ万引き直後みたいになったんですよ。",
    punchline: "",
    category: "日常",
    status: "WAITING_PUNCHLINE",
    note: "オチをもう少し短くしたい",

    tags: ["コンビニ", "袋", "店員", "気まずい"],
    talkLength: "SHORT",
    moods: ["AWKWARD", "SELF_DEPRECATION"],
    suitableScenes: ["DRINKING_PARTY", "FRIENDS", "CASUAL_CHAT"],
    audienceTypes: ["CLOSE_FRIENDS", "ANYONE"],
    audienceSize: "SMALL_GROUP",
    audienceComedyLevel: "LOW",

    createdAt: "2026-06-08T10:00:00.000Z",
    updatedAt: "2026-06-08T10:00:00.000Z",
  },
  {
    id: "2",
    title: "電車で席を譲ろうとした話",
    episodeRough:
      "電車で席を譲ろうと立ったら、相手も同時に降りようとしていて、ただ自分だけ急に立ち上がった人になった。",
    episodeMain: "",
    punchline: "優しさが空振りした瞬間、車内で一番元気な人になった。",
    category: "電車",
    status: "STRUCTURING",
    note: "",

    tags: ["電車", "席を譲る", "勘違い", "気まずい"],
    talkLength: "SHORT",
    moods: ["AWKWARD", "RELATABLE"],
    suitableScenes: ["FRIENDS", "CASUAL_CHAT"],
    audienceTypes: ["CLOSE_FRIENDS", "ANYONE"],
    audienceSize: "SMALL_GROUP",
    audienceComedyLevel: "LOW",

    createdAt: "2026-06-08T11:00:00.000Z",
    updatedAt: "2026-06-08T11:00:00.000Z",
  },
  {
    id: "3",
    title: "美容室で会話をミスった話",
    episodeRough:
      "美容師さんに今日はお休みですか？と聞かれて、はい、完全に休みですと言ってしまい、なぜか仕事を全否定した感じになった。",
    episodeMain: "",
    punchline: "",
    category: "日常",
    status: "MATERIAL",
    note: "会話の気まずさを広げられそう",

    tags: ["美容室", "会話", "休日", "気まずい"],
    talkLength: "SHORT",
    moods: ["AWKWARD", "RELATABLE"],
    suitableScenes: ["FRIENDS", "CASUAL_CHAT", "DRINKING_PARTY"],
    audienceTypes: ["CLOSE_FRIENDS", "ANYONE"],
    audienceSize: "SMALL_GROUP",
    audienceComedyLevel: "LOW",

    createdAt: "2026-06-08T12:00:00.000Z",
    updatedAt: "2026-06-08T12:00:00.000Z",
  },
];

export function getMockIdeaById(id: string): Idea | undefined {
  return mockIdeas.find((idea) => idea.id === id);
}