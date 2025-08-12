import { helpArticles } from "@/data/helpContent";
import { Keyword } from "./Keyword";

const parseContent = (text: string) => {
  const parts = text.split(/(\[keyword:[a-zA-Z0-9|]+\])/);
  return parts.map((part, index) => {
    const match = part.match(/\[keyword:([a-zA-Z0-9]+)(?:\|([a-zA-Z0-9\s]+))?\]/);
    if (match) {
      const keyword = match[1];
      const displayText = match[2] || keyword;
      return <Keyword key={index} keyword={keyword} displayText={displayText} />;
    }
    return part;
  });
};

export function HelpTab() {
  const article = helpArticles.gettingStarted;

  return (
    <div className="pt-4">
      <h3 className="text-lg font-semibold tracking-tight">{article.title}</h3>
      <p className="text-sm text-muted-foreground pt-2 leading-relaxed">
        {parseContent(article.content)}
      </p>
    </div>
  );
}
