import PostCard from "../../../components/PostCard";
import { PostItem } from "../../../lib/types";
import { Metadata } from "next";
import {
  PageData,
  createPageData,
  getPostData,
  getTagsData,
} from "../../../lib/functions";
import Pagination from "../../../components/Pagination";
import Header from "../../../components/Header";
import Footer from "@/app/components/Footer";

type Props = {
  params: Promise<{ slug: string; page: number }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const {slug} = await params;
  const tag = decodeURIComponent(slug);
  const title = `${tag} - ${(await params).page}ページ目 | Nemutai`;
  return {
    title: title,
    description: `${tag}`,
  };
}

export async function generateStaticParams() {
  const tagMaps: Record<string, number> = {};
  const posts = await getPostData();
  posts.forEach((post: PostItem) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        tag = encodeURIComponent(tag);
        if (tagMaps[tag]) {
          tagMaps[tag]++;
        } else {
          tagMaps[tag] = 1;
        }
      });
    }
  });

  const params: { path: string; slug: string; page: string }[] = [];

  for (const key in tagMaps) {
    if (tagMaps.hasOwnProperty(key)) {
      const totalPages = Math.ceil(tagMaps[key] / 1);
      for (let i = 1; i <= totalPages; i++) {
        const routes = {
          path: `/tags/${key}/${i}`,
          slug: `${key}`,
          page: `${i}`,
        };
        params.push(routes);
      }
    }
  }

  return params;
}

export default async function TagPage(
  props: {
    params: Promise<{ slug: string; page: number }>;
  }
) {
  const params = await props.params;
  const {slug} = await params;
  const posts = await getTagsData(slug);

  const pageData: PageData = createPageData(params.page, posts.length);

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
