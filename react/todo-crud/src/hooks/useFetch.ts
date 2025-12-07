const cache = {};

function useFetch(url) {
    const [data, setData] = React.useState(cache[url] || null);
    const [loading, setLoading] = React.useState(!cache[url]);

    React.useEffect(() => {
        if (cache[url]) return;

        let ignore = false;
        setLoading(true);

        fetch(url)
            .then(res => res.json())
            .then(json => {
                if (!ignore) {
                    cache[url] = json;
                    setData(json);
                    setLoading(false);
                }
            });

        return () => { ignore = true };
    }, [url]);

    return { data, loading };
}
