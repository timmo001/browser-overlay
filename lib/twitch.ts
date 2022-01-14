import { ApiClient, HelixStream, HelixTag } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import { ClientCredentialsAuthProvider } from "@twurple/auth";

export class Twitch {
  private apiClient: ApiClient;
  private authProvider: ClientCredentialsAuthProvider;
  private chatClient: ChatClient | undefined;

  constructor(clientId: string, clientSecret: string) {
    this.authProvider = new ClientCredentialsAuthProvider(
      clientId,
      clientSecret
    );
    this.apiClient = new ApiClient({ authProvider: this.authProvider });
  }

  async connectToChat(channels: Array<string>): Promise<void> {
    this.chatClient = new ChatClient({
      authProvider: this.authProvider,
      channels: channels,
    });
    await this.chatClient.connect();
  }

  async getStream(username: string): Promise<HelixStream | null> {
    const user = await this.apiClient.users.getUserByName(username);
    if (!user) {
      return null;
    }
    return await user.getStream();
  }

  async getTagNames(tagsIds: Array<string>): Promise<Array<string> | null> {
    const tags = await this.apiClient.tags.getStreamTagsByIds(tagsIds);
    if (!tags) return null;
    const tagNames: Array<string> = [];
    for (const tag of tags) {
      if (tag) {
        const name = tag.getName("en");
        if (name) tagNames.push();
      }
    }
    return tagNames;
  }
}
