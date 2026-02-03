export interface EventEntity {
  id: string;
  creatorId: string;
  executorId: string | null;
  title: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  time: string | null;
  description: string | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export type Event = Omit<EventEntity, 'time' | 'description'> & {
  time?: string;
  description?: string;
  executorId?: string;
}
