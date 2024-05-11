import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { LocalStorage } from "quasar";

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const isAdmin = LocalStorage.has("Admin");
    const isStaff = LocalStorage.has("Staff");
    const isLoggedIn = isAdmin || isStaff;

    if (to.meta.auth && !isLoggedIn) {
      return next("/login");
    }

    if (!to.meta.auth && isLoggedIn) {
      return next("/dashboard");
    }

    // Check if the route requires Admin access
    if (
      (to.path === "/forecast-sales" && isAdmin) ||
      (to.path === "/forecast-inventory" && isAdmin) ||
      (to.path === "/forecast-history" && isAdmin) ||
      (to.path === "/accounts-mgmt" && isAdmin)
    ) {
      return next();
    }

    // Redirect to unauthorized page if not Admin
    if (
      (to.path === "/forecast-sales" && !isAdmin) ||
      (to.path === "/forecast-inventory" && !isAdmin) ||
      (to.path === "/forecast-history" && !isAdmin) ||
      (to.path === "/accounts-mgmt" && !isAdmin)
    ) {
      return next("/dashboard");
    }

    return next();
  });

  // Add a global afterEach hook to store session data
  Router.afterEach((to, from) => {
    const isAdmin = LocalStorage.has("Admin");
    const isStaff = LocalStorage.has("Staff");
    const isLoggedIn = isAdmin || isStaff;

    if (isLoggedIn) {
      // Store session data in local storage
      const sessionData = {
        isAdmin,
        isStaff,
      };
      LocalStorage.set("userSession", sessionData);
    } else {
      // Clear session data from local storage
      LocalStorage.remove("userSession");
    }
  });

  return Router;
});
