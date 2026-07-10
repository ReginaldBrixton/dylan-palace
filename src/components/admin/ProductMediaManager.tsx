import React from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, X } from 'lucide-react';

interface ProductMediaManagerProps {
  images: string[];
  pendingFiles: Array<{ file: File; previewUrl: string }>;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onMoveExisting: (index: number, direction: -1 | 1) => void;
  onMovePending: (index: number, direction: -1 | 1) => void;
}

export default function ProductMediaManager({ images, pendingFiles, onUpload, onRemove, onMoveExisting, onMovePending }: ProductMediaManagerProps) {
  const total = images.length + pendingFiles.length;
  return (
    <section>
      <div className="flex items-end justify-between gap-4"><div><h3 className="text-sm font-semibold">Product gallery</h3><p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">The first image is the catalogue cover. Three to five accurate views are recommended.</p></div><span className="text-xs font-semibold text-[var(--color-muted)]">{total} image{total === 1 ? '' : 's'}</span></div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => <MediaTile key={`${image}-${index}`} image={image} label={index === 0 ? 'Primary' : `View ${index + 1}`} onRemove={() => onRemove(index)} onMoveLeft={index > 0 ? () => onMoveExisting(index, -1) : undefined} onMoveRight={index < images.length - 1 ? () => onMoveExisting(index, 1) : undefined}/>) }
        {pendingFiles.map((item, index) => <MediaTile key={item.previewUrl} image={item.previewUrl} label={`New ${images.length + index + 1}`} onRemove={() => onRemove(images.length + index)} onMoveLeft={index > 0 ? () => onMovePending(index, -1) : undefined} onMoveRight={index < pendingFiles.length - 1 ? () => onMovePending(index, 1) : undefined}/>) }
        <label className="grid aspect-[4/5] cursor-pointer place-items-center border border-dashed border-[var(--color-border-strong)] bg-[var(--color-canvas)] text-center hover:border-[var(--color-ink)]"><span><ImagePlus size={24} className="mx-auto"/><span className="mt-2 block text-xs font-semibold">Add images</span><span className="mt-1 block text-[10px] text-[var(--color-muted)]">JPG, PNG or WebP</span></span><input type="file" accept="image/*" multiple onChange={onUpload} className="hidden"/></label>
      </div>
    </section>
  );
}

function MediaTile({ image, label, onRemove, onMoveLeft, onMoveRight }: { image: string; label: string; onRemove: () => void; onMoveLeft?: () => void; onMoveRight?: () => void }) {
  return <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface-subtle)]"><img src={image} alt="" className="h-full w-full object-cover"/><span className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">{label}</span><button type="button" onClick={onRemove} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90" aria-label="Remove image"><X size={15}/></button><div className="absolute inset-x-2 bottom-2 flex justify-between"><button type="button" onClick={onMoveLeft} disabled={!onMoveLeft} className="grid size-8 place-items-center rounded-full bg-white/90 disabled:invisible" aria-label="Move image earlier"><ArrowLeft size={14}/></button><button type="button" onClick={onMoveRight} disabled={!onMoveRight} className="grid size-8 place-items-center rounded-full bg-white/90 disabled:invisible" aria-label="Move image later"><ArrowRight size={14}/></button></div></div>;
}
