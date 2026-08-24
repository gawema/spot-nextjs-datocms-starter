'use client';

import { generateRealtimeComponent } from '@/lib/datocms/realtime/generateRealtimeComponent';
import { PageQuery } from '@/lib/query/pageQuery';
import Content from './Content';

/*
 * The draft-mode variant of the route: subscribes to the Real-time Updates API
 * and re-renders `Content` on every change. It lives in its own file because it
 * is a Client Component, and 'use client' applies to a whole module.
 */
export default generateRealtimeComponent({
  query: PageQuery,
  contentComponent: Content,
});
