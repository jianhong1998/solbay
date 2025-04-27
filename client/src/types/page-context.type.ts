export type PageContext<Props = {}, SearchParams = {}> = {
  params: Promise<Props>;
  searchParams: Promise<SearchParams>;
};
