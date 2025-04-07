'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ListChecks } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

// Define interfaces for Trello checklist data
interface CheckItem {
  id: string;
  name: string;
  state: 'complete' | 'incomplete';
  pos: number;
}

interface Checklist {
  id: string;
  name: string;
  checkItems: CheckItem[];
}

interface ChecklistDialogProps {
  cardId: string;
  cardName: string;
  dictionary: {
    checklistButton: string;
    checklistTitle: string;
    noChecklists: string;
    errorLoading: string;
  };
}

export default function ChecklistDialog({ cardId, cardName, dictionary }: ChecklistDialogProps) {
  const [open, setOpen] = useState(false);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChecklists = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<Checklist[]>(`/api/cards/${cardId}/checklists`);
      setChecklists(response.data);
    } catch (err) {
      console.error('Error fetching checklists:', err);
      setError(dictionary.errorLoading);
    } finally {
      setIsLoading(false);
    }
  }, [cardId, dictionary.errorLoading]);

  // Fetch checklists when dialog opens
  useEffect(() => {
    if (open) {
      fetchChecklists();
    }
  }, [open, cardId, fetchChecklists]);

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the accordion from toggling
    setOpen(true);
  };

  return (
    <>
      <div
        id={`checklist-button-${cardId}`}
        onClick={handleOpenDialog}
        className="ml-2 cursor-pointer inline-flex items-center justify-center gap-1.5 h-8 rounded-md px-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
        title={dictionary.checklistButton}
      >
        <ListChecks id={`checklist-icon-${cardId}`} className="h-4 w-4" />
        <span id={`checklist-text-${cardId}`} className="flex items-center">{dictionary.checklistButton}</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          id={`checklist-content-${cardId}`}
          className="sm:max-w-md"
          style={{ maxHeight: '50vh', overflowY: 'auto' }}
          aria-labelledby={`checklist-title-${cardId}`}
        >
          <DialogHeader id={`checklist-header-${cardId}`}>
            <DialogTitle id={`checklist-title-${cardId}`}>{dictionary.checklistTitle}: {cardName}</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div id={`checklist-loading-${cardId}`} className="space-y-4">
              <Skeleton id={`checklist-skeleton-1-${cardId}`} className="h-4 w-3/4" />
              <Skeleton id={`checklist-skeleton-2-${cardId}`} className="h-4 w-full" />
              <Skeleton id={`checklist-skeleton-3-${cardId}`} className="h-4 w-full" />
              <Skeleton id={`checklist-skeleton-4-${cardId}`} className="h-4 w-2/3" />
            </div>
          ) : error ? (
            <p id={`checklist-error-${cardId}`} className="text-destructive">{error}</p>
          ) : checklists.length === 0 ? (
            <p id={`checklist-empty-${cardId}`} className="text-muted-foreground">{dictionary.noChecklists}</p>
          ) : (
            <div id={`checklist-container-${cardId}`} className="space-y-6">
              {checklists.map((checklist) => (
                <div id={`checklist-group-${cardId}-${checklist.id}`} key={checklist.id} className="space-y-3">
                  <h3 id={`checklist-name-${cardId}-${checklist.id}`} className="font-medium text-base">{checklist.name}</h3>
                  <div id={`checklist-items-container-${cardId}-${checklist.id}`} className="space-y-2">
                    {checklist.checkItems.map((item) => (
                      <div id={`checklist-item-${cardId}-${item.id}`} key={item.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`checkbox-${cardId}-${item.id}`}
                          checked={item.state === 'complete'}
                          disabled
                        />
                        <Label
                          id={`label-${cardId}-${item.id}`}
                          htmlFor={`checkbox-${cardId}-${item.id}`}
                          className={`text-sm ${item.state === 'complete' ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
