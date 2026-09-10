import { useEffect, useRef } from 'react';

export interface MapAdapter {
  onSelect: (listener: (id: string) => void) => void;
  offSelect: (listener: (id: string) => void) => void;
  remove: () => void;
}
export type MapFactory = (container: HTMLDivElement) => MapAdapter;

/** Factory changes alone do not reset the map. Change instanceKey to explicitly recreate it. */
export function MapCanvas({ createMap, onSelect, instanceKey = 'default' }: { createMap: MapFactory; onSelect: (id: string) => void; instanceKey?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const handler = useRef(onSelect);
  const factory = useRef(createMap);
  useEffect(() => { handler.current = onSelect; factory.current = createMap; }, [onSelect, createMap]);
  useEffect(() => {
    const map = factory.current(container.current!);
    const select = (id: string) => handler.current(id);
    try { map.onSelect(select); } catch (error) { map.remove(); throw error; }
    return () => { try { map.offSelect(select); } finally { map.remove(); } };
  }, [instanceKey]);
  return <div ref={container} aria-label="Synthetic map host" />;
}
