import { useEffect, useMemo } from 'react';

export function useInfiniteObserver({ parentNodeId, onIntersection }: { parentNodeId: string; onIntersection: () => void }) {
  const targetParentNode = document.getElementById(parentNodeId);

  const intersectionObserver = useMemo(
    () =>
      new IntersectionObserver(
        ([intersection]) => {
          const { isIntersecting } = intersection;
          isIntersecting && onIntersection();
        },
        { threshold: 0.1 }
      ),
    [parentNodeId]
  );

  const mutationObserver = useMemo(
    () =>
      new MutationObserver((mutations) => {
        const [lastNode] = mutations.pop()!.addedNodes;

        intersectionObserver.disconnect();
        intersectionObserver.observe(lastNode as Element);
      }),
    [parentNodeId]
  );

  const disconnect = () => {
    mutationObserver.disconnect();
    intersectionObserver.disconnect();
  };

  useEffect(() => {
    if (targetParentNode === null) {
      return;
    }

    mutationObserver.observe(document.getElementById(parentNodeId)!, { childList: true });
    intersectionObserver.observe(document.getElementById(parentNodeId)!.lastElementChild || document.getElementById(parentNodeId)!);

    return () => disconnect();
  }, [targetParentNode, mutationObserver, intersectionObserver]);

  return { disconnect };
}
