'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ListChecks } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
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
  const [totalItems, setTotalItems] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchChecklists = useCallback(async () => {
    if (dataLoaded && !open) return; // Don't fetch if data is already loaded and dialog is not open

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<Checklist[]>(`/api/cards/${cardId}/checklists`);
      setChecklists(response.data);

      // Calculate total number of checklist items
      const itemCount = response.data.reduce((total, checklist) => {
        return total + checklist.checkItems.length;
      }, 0);

      setTotalItems(itemCount);
      setDataLoaded(true);
    } catch (err) {
      console.error('Error fetching checklists:', err);
      setError(dictionary.errorLoading);
    } finally {
      setIsLoading(false);
    }
  }, [cardId, dictionary.errorLoading, dataLoaded, open]);

  // Fetch checklists on initial load
  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  // Refresh checklists when dialog opens if needed
  useEffect(() => {
    if (open) {
      fetchChecklists();
    }
  }, [open, fetchChecklists]);

  // Handle click on the trigger to prevent accordion from toggling
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the accordion from toggling
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          id={`checklist-button-${cardId}`}
          onClick={handleTriggerClick}
          className="ml-2 cursor-pointer inline-flex items-center justify-center gap-1.5 h-8 rounded-md px-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          title={dictionary.checklistButton}
        >
          <ListChecks id={`checklist-icon-${cardId}`} className="h-4 w-4" />
          <span id={`checklist-text-${cardId}`} className="flex items-center">
            {dataLoaded && totalItems > 0 && (
              <span id={`checklist-count-${cardId}`} className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                {totalItems}
              </span>
            )}
          </span>
        </div>
      </DialogTrigger>

      <DialogContent
        id={`checklist-content-${cardId}`}
        className="sm:max-w-md flex flex-col"
        style={{ maxHeight: '50vh' }}
      >
        <DialogTitle id={`checklist-title-${cardId}`} className="mb-2">{dictionary.checklistTitle}: {cardName}</DialogTitle>
        <DialogHeader id={`checklist-header-${cardId}`} className="flex-shrink-0 mt-0 pt-0">
          <VisuallyHidden>
            <DialogDescription id={`checklist-description-${cardId}`}>
              {dictionary.checklistTitle} {cardName}
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

          <div id={`checklist-scrollable-content-${cardId}`} className="overflow-y-auto flex-grow pr-2" style={{ maxHeight: 'calc(50vh - 80px)' }}>
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
          </div>
        </DialogContent>
    </Dialog>
  );
}
