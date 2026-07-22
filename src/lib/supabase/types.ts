/*
  Placeholder database types. Once the Supabase schema is applied, regenerate
  the real types with:
    npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
  Until then this permissive type keeps the typed clients compiling.
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
