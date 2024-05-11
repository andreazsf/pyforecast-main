const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      { path: "/", redirect: "/login" },
      { path: "/login", component: () => import("src/pages/LoginPage.vue") },
      // {
      //   path: "/register",
      //   component: () => import("src/pages/RegisterPage.vue"),
      // },
    ],
    meta: { auth: false },
  },
  {
    path: "/pyforecast",
    name: "pyforecast",
    redirect: { name: "dashboard" },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("src/pages/Dashboard.vue"),
      },
      {
        path: "/accounts-mgmt",
        name: "accounts-mgmt",
        component: () => import("src/pages/AccountsMgmt/AccountsMgmt.vue"),
      },
      {
        path: "/inventory-mgmt/:inventory_name",
        name: "inventory-mgmt",
        component: () => import("src/pages/InventoryMgmt/InventoryMgmt.vue"),
      },
      {
        path: "/sales-mgmt",
        name: "sales-mgmt",
        component: () => import("src/pages/SalesMgmt/SalesMgmt.vue"),
      },
      {
        path: "/forecast-sales",
        name: "forecast-sales",
        component: () => import("src/pages/SalesMgmt/ForecastSales.vue"),
      },
      {
        path: "/forecast-inventory",
        name: "forecast-inventory",
        component: () =>
          import("src/pages/InventoryMgmt/ForecastInventory.vue"),
      },
      {
        path: "/forecast-history",
        name: "forecast-history",
        component: () =>
          import("src/pages/ForecastHistory/ForecastHistory.vue"),
      },
    ],
    meta: { auth: true },
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
