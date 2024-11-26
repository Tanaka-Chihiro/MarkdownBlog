import PostCard from "../../components/PostCard";
import { PostItem } from "../../lib/types";
import { Metadata } from "next";
import {
  PageData,
  createPageData,
  getPostData,
  getTagsData,
} from "../../lib/functions";
import Pagination from "../../components/Pagination";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const {slug} = await params;
  const tag = decodeURIComponent(slug);
  return {
    title: `${tag} | ブログタイトル`,
    description: `${tag}`,
  };
}

export async function generateStaticParams() {
  const allTags = new Set<string>();

  const posts = await getPostData();
  posts.forEach((post: PostItem) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        return allTags.add(encodeURIComponent(tag));
      });
    }
  });

  const params = Array.from(allTags).map((tag) => {
    return {
      path: `/tags/${tag}`,
      slug: tag,
    };
  });

  return params;
}

export default async function TagPage({
  params,
}: {
  params: { slug: string };
}) {
  const {slug} = await params;
  const posts = await getTagsData(slug);

  const pageData: PageData = createPageData(1, posts.length);

  return (
    <>
      <Header />
      <div className="my-8">
        <div className="row">
          {posts.slice(pageData.start, pageData.end).map((post) => (
            <PostCard key={post.title} post={post} />
          ))}
        </div>
        <div className="mb-3">
          <Pagination
            type={`tags/${slug}`}
            pages={pageData.pages}
            currentPage={pageData.currentPage}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
