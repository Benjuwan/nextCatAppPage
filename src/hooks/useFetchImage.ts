/* index.tsx - 44行目：サーバーコンポーネント（またはサーバー側での処理：getServerSideProps）でカスタムフックは使えない。build 時にエラーが出る */

type Image = {
    url: string;
};

export const useFetchImage = () => {
    const fetchImage = async (
        url: string
    ): Promise<Image> => {
        const res = await fetch(url);
        const images: Array<Image> = await res.json();
        console.log(images);
        return images[0];
    }

    return { fetchImage }
}