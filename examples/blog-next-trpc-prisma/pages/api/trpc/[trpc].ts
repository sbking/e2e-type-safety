import * as trpcNext from "@trpc/server/adapters/next";

import { appRouter } from "../../../server/appRouter";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
