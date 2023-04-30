import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownProps = {
  content: string;
};

export default function Markdown({ content }: MarkdownProps) {
  return (
    <span className='prose dark:prose-invert'>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </span>
  );
}
