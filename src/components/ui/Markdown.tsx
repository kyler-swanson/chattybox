import { ClassAttributes, ImgHTMLAttributes } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownProps = {
  content: string;
};

function ParagraphRenderer(
  props: JSX.IntrinsicAttributes & ClassAttributes<HTMLParagraphElement> & React.HTMLAttributes<HTMLParagraphElement>
) {
  return <p {...props} className='m-0' />;
}

function ImageRenderer(
  props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>
) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...props} className='block max-w-[200px] my-1' />;
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <span className='prose dark:prose-invert'>
      <ReactMarkdown components={{ p: ParagraphRenderer, img: ImageRenderer }} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </span>
  );
}
