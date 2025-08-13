import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { USERS_QUERY } from "./graphql/queries";
import type { User } from "./types/user";
import type { Filters } from "./types/filters";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { UsersTable } from "./components/UsersTable";
import { FiltersBar } from "./components/Filters";

const PAGE = 20;
const COUNTRIES = [
  "USA",
  "Canada",
  "Kyrgyzstan",
  "Kazakhstan",
  "Germany",
  "UK",
  "France",
  "Japan",
  "Brazil",
  "India",
];

export default function App() {
  const [filters, setFilters] = useState<Filters>({
    name: "",
    email: "",
    country: [],
    registeredFrom: null,
    registeredTo: null,
  });

  const debounced = {
    ...filters,
    name: useDebouncedValue(filters.name),
    email: useDebouncedValue(filters.email),
  };

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const prevFilters = useRef(debounced);
  if (prevFilters.current !== debounced) {
    prevFilters.current = debounced;
  }

  const variables = useMemo(
    () => ({
      name: debounced.name || null,
      email: debounced.email || null,
      country: debounced.country.length ? debounced.country : null,
      registeredFrom: debounced.registeredFrom || null,
      registeredTo: debounced.registeredTo || null,
      offset,
      limit: PAGE,
    }),
    [debounced, offset]
  );

  const { data, loading, error, fetchMore } = useQuery<{ users: User[] }>(
    USERS_QUERY,
    { variables, notifyOnNetworkStatusChange: true }
  );

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchMore({
      variables: { ...variables, offset: offset + PAGE },
    })
      .then((res: { data: { users: string | unknown[] } }) => {
        const fetched = res.data?.users?.length ?? 0;
        setOffset((o) => o + (fetched ? PAGE : 0));
        if (fetched < PAGE) setHasMore(false);
      })
      .catch(() => {});
  }, [fetchMore, variables, offset, loading, hasMore]);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  const onChangeFilters = (next: Filters) => {
    setFilters(next);
    setOffset(0);
    setHasMore(true);
  };

  const onReset = () => {
    onChangeFilters({
      name: "",
      email: "",
      country: [],
      registeredFrom: null,
      registeredTo: null,
    });
  };

  const rows = data?.users ?? [];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <h1>Каталог пользователей</h1>

      <FiltersBar
        value={filters}
        onChange={onChangeFilters}
        onReset={onReset}
        countries={COUNTRIES}
      />

      {error && (
        <div style={{ marginBottom: 12, color: "crimson" }}>
          Ошибка загрузки: {error.message}
          <button
            style={{ marginLeft: 8 }}
            onClick={() => window.location.reload()}
          >
            Обновить
          </button>
        </div>
      )}

      <UsersTable rows={rows} loading={loading && offset === 0} />

      {loading && offset > 0 && (
        <div style={{ padding: 12, textAlign: "center" }}>Догружаю…</div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />

      {!loading && rows.length > 0 && !hasMore && (
        <div style={{ padding: 12, textAlign: "center", opacity: 0.7 }}>
          Это всё 🎉
        </div>
      )}
    </div>
  );
}
