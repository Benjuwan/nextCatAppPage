export const useFetchPost = () => {
    const fetchPost = async (
        url: string
    ): Promise<any> => {
        const res = await fetch(url);
        const data: Array<any> = await res.json();
        console.log(data);
        return data
    }

    return { fetchPost }
}