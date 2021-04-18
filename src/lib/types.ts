export interface Script {
    id: number;
    name: string;
    slug: string;
    tags: string[];
    description?: string;
    duration: number;
    thumbnail: string;
    funscripts: string[];
    sourceUrl?: string;
    streamingUrl?: string;
    studio?: string;
    talent: string[];
    active: boolean;
    likeCount: number;
    thumbsUp: number;
    thumbsDown: number;
    views: number;
    created: Date;
    modified: Date;
    creatorName: string;
    userId: string;
    categoryName: string;
}
