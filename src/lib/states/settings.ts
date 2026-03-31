import { observable } from "@legendapp/state";

import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { auth$ } from "./auth";

const version = 2;

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
  localOptions: {},
});

export const settings$ = observable<{
  leftNavOpen: boolean;
  theme: "light" | "dark" | "system";
  currentLocation: string;
}>({
  leftNavOpen: true,
  theme: "system",
  currentLocation: "",
});

persistObservable(settings$, {
  local: `settings.v${version}`,
});

persistObservable(auth$, {
  local: `auth.v${version}`,
});

enableReactTracking({ auto: true });
