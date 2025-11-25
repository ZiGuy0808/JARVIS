import { type User, type InsertUser, type Conversation, type InsertConversation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addConversation(conversation: InsertConversation): Promise<Conversation>;
  getRecentConversations(limit: number): Promise<Conversation[]>;
  clearConversations(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Conversation[];

  constructor() {
    this.users = new Map();
    this.conversations = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const conversation: Conversation = {
      id: randomUUID(),
      ...insertConversation,
      timestamp: new Date()
    };
    this.conversations.push(conversation);
    return conversation;
  }

  async getRecentConversations(limit: number): Promise<Conversation[]> {
    return this.conversations.slice(-limit);
  }

  async clearConversations(): Promise<void> {
    this.conversations = [];
  }
}

export const storage = new MemStorage();
