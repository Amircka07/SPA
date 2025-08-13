import React from "react";
import { FixedSizeList as List, type ListOnItemsRenderedProps } from "react-window";

export interface VirtualizedUserListProps {
  users: { id: string; name: string; email: string; country: string }[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
}

export const VirtualizedUserList: React.FC<VirtualizedUserListProps> = ({
  users,
  hasMore,
  loading,
  loadMore
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const user = users[index];
    return (
      <div
        style={{
          ...style,
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderBottom: "1px solid #eee",
          background: index % 2 === 0 ? "#fafafa" : "#fff"
        }}
      >
        {user ? (
          <>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.country}</span>
          </>
        ) : (
          "Загрузка..."
        )}
      </div>
    );
  };

  const handleItemsRendered = ({ visibleStopIndex }: ListOnItemsRenderedProps) => {
    if (visibleStopIndex >= users.length - 1 && hasMore && !loading) {
      loadMore();
    }
  };

  return (
    <List
      height={600} 
      itemCount={users.length}
      itemSize={50} 
      width="100%"
      onItemsRendered={handleItemsRendered}
    >
      {Row}
    </List>
  );
};
