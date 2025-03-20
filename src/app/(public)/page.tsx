import { getPosts, searchPosts } from '@/lib/post';
import PostCard from '@/components/post/PostCard';
import { Post } from '@/types/post';

type SearchParams = {
    search?: string;
};

export default async function PostsPage({ searchParams } : { searchParams: Promise<SearchParams>}) {
    const resolvedSearchParams = await searchParams;
    console.log('Search Params:', resolvedSearchParams);
    const query = resolvedSearchParams.search || ''; // ���索キー��ードが存在する場合、それを使う
    console.log('Search Query:', query);
    // Databaseから情報を取得
    const posts = query ? await searchPosts(query) : await getPosts(); // 検索キーワードが存在する場合は検索結果を表示する
    console.log('Posts:', posts);
  return (
    <>
        { 
            // mx-auto を使って画面の中にレイアウトを整える センタリング
            // px-4 は横幅の余白を設定するためのクラス
            // py-8 は縦幅の余白を設定するためのクラス
        }
        <div className="container mx-auto px-4 py-8"> 
            {
                // 横方向のカードの数を指定するためのクラス
                // md:grid-cols-2 は、md 以上の画面サイズで 2 列にするためのクラス
                // lg:grid-cols-3 は、lg 以上の画面サイズで 3 列にするためのクラス  画面サイズによって表示するカードの数を変える        
            }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                { 
                    posts.map((post: Post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                }
            </div>
        </div>
      
    </>
  )
}
