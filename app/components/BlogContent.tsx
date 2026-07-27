import DOMPurify from "isomorphic-dompurify";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  id: string;
  content: string;
  published: boolean;
}

export function BlogContent({ content }: Props) {
  const cleanContent = DOMPurify.sanitize(content);

  return (
    <Card>
      <CardContent>
        <div
          dangerouslySetInnerHTML={{
            __html: cleanContent,
          }}
        />
      </CardContent>
      {}
    </Card>
  );
}
