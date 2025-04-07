'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface SkeletonAccordionProps {
    listCount?: number;
    cardCount?: number;
}

export function SkeletonAccordion({ listCount = 3, cardCount = 5 }: SkeletonAccordionProps) {
    return (
        <div id="skeleton-accordion-container" className="w-full space-y-4">
            <Accordion id="skeleton-list-accordion" type="multiple" value={Array.from({ length: listCount }).map((_, i) => `skeleton-list-${i}`)}>
                {Array.from({ length: listCount }).map((_, listIndex) => (
                    <AccordionItem id={`skeleton-list-item-${listIndex}`} key={`skeleton-list-${listIndex}`} value={`skeleton-list-${listIndex}`} className="border rounded bg-muted/30">
                        <AccordionTrigger id={`skeleton-list-trigger-${listIndex}`} className="p-3 text-base font-bold hover:no-underline rounded-t">
                            <div id={`skeleton-list-content-${listIndex}`} className="flex justify-between items-center w-full">
                                <Skeleton id={`skeleton-list-title-${listIndex}`} className="h-6 w-40" />
                                <Skeleton id={`skeleton-list-stats-${listIndex}`} className="h-5 w-32" />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent id={`skeleton-list-content-container-${listIndex}`} className="p-2 pl-4 border-t border-b">
                            <Accordion id={`skeleton-card-accordion-${listIndex}`} type="multiple" value={[]}>
                                {Array.from({ length: cardCount }).map((_, cardIndex) => (
                                    <AccordionItem
                                        id={`skeleton-card-item-${listIndex}-${cardIndex}`}
                                        key={`skeleton-card-${listIndex}-${cardIndex}`}
                                        value={`skeleton-card-${listIndex}-${cardIndex}`}
                                        className="border rounded mb-2 bg-background"
                                    >
                                        <AccordionTrigger id={`skeleton-card-trigger-${listIndex}-${cardIndex}`} className="p-2 text-sm font-semibold hover:no-underline group rounded-t">
                                            <div id={`skeleton-card-title-container-${listIndex}-${cardIndex}`} className="flex items-center h-full flex-grow mr-2 overflow-hidden">
                                                <Skeleton id={`skeleton-card-label-${listIndex}-${cardIndex}`} className="w-3 h-3 mr-2 rounded-sm flex-shrink-0" />
                                                <Skeleton id={`skeleton-card-title-${listIndex}-${cardIndex}`} className="h-5 w-48" />
                                            </div>
                                            <div id={`skeleton-card-stats-container-${listIndex}-${cardIndex}`} className="flex items-center">
                                                <Skeleton id={`skeleton-card-stats-${listIndex}-${cardIndex}`} className="h-4 w-32" />
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent id={`skeleton-card-content-${listIndex}-${cardIndex}`} className="border-t pt-0">
                                            <div id={`skeleton-card-details-${listIndex}-${cardIndex}`} className="p-4 space-y-3">
                                                <Skeleton id={`skeleton-card-row1-${listIndex}-${cardIndex}`} className="h-6 w-full" />
                                                <Skeleton id={`skeleton-card-row2-${listIndex}-${cardIndex}`} className="h-6 w-full" />
                                                <Skeleton id={`skeleton-card-row3-${listIndex}-${cardIndex}`} className="h-6 w-3/4" />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
