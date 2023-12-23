/**
 * npm run dev
 * npm run build
 * npm run start or npx next start -p 4000（ポート番号）
 * npm run export（package.json 10行目に記述：参照元 - https://zenn.dev/lclco/articles/1774dc83548079?redirected=1）
*/

import { GetServerSideProps, NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
// import { useFetchImage } from "@/hooks/useFetchImage";
import { useFetchPost } from "@/hooks/useFetchIPost";

// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};

// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  // const { fetchImage } = useFetchImage();
  const { fetchPost } = useFetchPost();

  const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
  // const [imageUrl, setImageUrl] = useState(""); // 初期値を渡す
  const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく
  useEffect(() => {
    /* 外部 API しか（＝内部のデータは）フェッチできない */
    // const post = fetchPost(`${location.origin}/public/posts.json`);
    // const post = fetchPost(`${location.origin}/src/data/posts.json`);
    const post = fetchPost("https://jsonplaceholder.typicode.com/posts");
    console.log(post);

    fetchImage().then((newImage) => {
      setImageUrl(newImage.url);
      setLoading(false);
    });
  }, []);
  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };
  return (
    <div style={{ 'width': 'clamp(320px,calc(100vw/2),640px)', 'margin': 'auto', 'textAlign': 'center' }}>
      <button onClick={handleClick} className={styles.button}>他のにゃんこも見る</button>
      <div className={styles.frame} style={{ 'margin': '1em auto' }}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};

/* export default の記述方法でないと開発モードでエラーが出る */
export default IndexPage;


/**
 * サーバーサイドで実行する処理
 * サーバーコンポーネント（またはサーバー側での処理：getServerSideProps）でカスタムフックは使えない。build 時にエラーが出る。
*/
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  /**
   * 内部データは 500 エラー（サーバーサイドでは DOM API（location）は使用できない：location is not defined）
   * 外部 API は取得できず
  */
  // const { fetchImage } = useFetchImage();
  // const post = fetchPost(`${location.origin}/public/posts.json`);
  // const post = fetchPost(`${location.origin}/src/data/posts.json`);
  // const post = fetchPost("https://jsonplaceholder.typicode.com/posts");
  // console.log(post);

  const image = await fetchImage();

  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};
const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  console.log(images);
  return images[0];
};

const fetchPost = async (
  url: string
): Promise<any> => {
  const res = await fetch(url);
  const data: Array<any> = await res.json();
  console.log(data);
  return data
}