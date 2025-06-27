// Simple in-memory storage for mock discussion posts
// This is shared across API routes for development purposes
const mockPosts: { [discussionId: string]: any[] } = {};

export function addMockPost(discussionId: string, post: any) {
  if (!mockPosts[discussionId]) {
    mockPosts[discussionId] = [];
  }
  mockPosts[discussionId].push(post);
  console.log(`✅ Added mock post to discussion ${discussionId}. Total: ${mockPosts[discussionId].length}`);
}

export function getMockPosts(discussionId: string): any[] {
  return mockPosts[discussionId] || [];
}

export function getAllMockPosts(): { [discussionId: string]: any[] } {
  return mockPosts;
}

export function clearMockPosts(discussionId?: string) {
  if (discussionId) {
    delete mockPosts[discussionId];
  } else {
    Object.keys(mockPosts).forEach(key => delete mockPosts[key]);
  }
} 