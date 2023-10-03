/* npm run build → npx next start -p 4000（ポート番号）*/

import { GetServerSideProps, NextPage } from "next";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import { useFetchImage } from "@/hooks/useFetchImage";

// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};

// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  // const { fetchImage } = useFetchImage();

  const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
  // const [imageUrl, setImageUrl] = useState(""); // 初期値を渡す
  const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく
  useEffect(() => {
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
    <div>
      <button onClick={handleClick} className={styles.button}>他のにゃんこも見る</button>
      <div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img} />}</div>
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
  // const { fetchImage } = useFetchImage();
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