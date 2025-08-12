export interface HelpContent {
  title: string;
  content: string;
}

export const helpArticles: Record<string, HelpContent> = {
  gettingStarted: {
    title: "Getting Started",
    content: "Welcome! Your goal is to extract resources from the ground. Start by building a [keyword:miner|Miner] to gather [keyword:stone|Stone]. You will need to connect it to your [keyword:base|Base] using a [keyword:tunnel|Tunnel]."
  },
  stone: {
    title: "Stone",
    content: "A fundamental building resource. [keyword:stone|Stone] is gathered by [keyword:miner|Miners] and is used for most basic constructions. Your income is calculated every second based on the total output of all connected miners."
  },
  miner: {
    title: "Miner",
    content: "An automated drone that extracts resources from the ground. Each miner produces 1 [keyword:stone|Stone] per second at Level 1. It must be connected to the [keyword:base|Base] via a [keyword:tunnel|Tunnel] network to contribute resources."
  },
  tunnel: {
    title: "Tunnel",
    content: "Tunnels create a network path back to your [keyword:base|Base]. Buildings must be adjacent to a tunnel or the base to function."
  },
  base: {
    title: "Base",
    content: "The heart of your operation. All resources flow back to the base. If a building loses its connection to the base, it will stop working."
  }
};
