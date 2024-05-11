<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-white text-grey-8 q-pb-md q-pt-xs" height-hint="64">
      <!--
      style="box-shadow: 0px 10px 10px -15px #111" -->
      <q-toolbar class="q__toolbar q-pb-xs">
        <!-- BTN to toggle left menu on mobile -->
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
          :class="$q.screen.width <= 1023 ? '' : 'hidden'"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          class="row items-center no-wrap hidden"
        >
          <img src="" />
          <span class="q-ml-sm">PyForecast</span>
        </q-toolbar-title>

        <q-space />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-white"
      :width="280"
    >
      <q-scroll-area class="fit">
        <q-list
          padding
          class="text-grey-8 wrap q-pa-lg q-gutter-y-md jutify-between window-height"
          :class="$q.screen.height <= 460 ? '' : 'column'"
        >
          <!-- <q-list
          padding
          class="text-grey-8 wrap q-pa-lg q-gutter-y-md"
          :class="$q.screen.width <= 768 ? 'col' : 'column'"
          style="height: 100vh"
        > -->
          <q-item class="my-list q-mr-xs row">
            <q-item-section top avatar rounded>
              <!-- <q-avatar class="q-mt-xs bg-primary">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                <q-icon
                  name="person"
                  class="material-symbols"
                  size="sm"
                  color="white"
                  outline
                />
              </q-avatar> -->
              <q-avatar
                rounded
                color="primary"
                text-color="white"
                class="q-mt-xs"
              >
                <span>
                  {{ currentUserInfo.first_name.charAt(0)
                  }}{{ currentUserInfo.last_name.charAt(0) }}
                </span>
              </q-avatar>
            </q-item-section>

            <q-item-section class="q-ml-sm">
              <q-item-label style="margin-left: -8px !important">
                <div
                  style="
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    width: 128px;
                  "
                >
                  {{
                    currentUserInfo.prefix +
                    " " +
                    currentUserInfo.first_name +
                    " " +
                    currentUserInfo.last_name
                  }}
                </div>
              </q-item-label>
              <q-item-label
                style="
                  margin-left: -8px !important;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  width: 128px;
                "
                caption
              >
                {{ currentUserInfo.email_address }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            class="q__drawer-item my-list row"
            v-for="link in filteredLinks"
            :key="link.text"
            @click="
              router.push({ path: link.path });
              linkActive = link.path;
            "
            :active="linkActive === link.path"
            active-class="my-active-list"
            clickable
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" class="material-symbols-outlined" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm hidden" />

          <q-space />

          <q-item
            class="q__drawer-item items-end items-center row-auto q-mb-md"
            v-ripple
            clickable
            @click="logout"
          >
            <!-- <q-item-section>
              <q-item-label
                >{{ link.text }} <q-icon v-if="link.icon" :name="link.icon"
              /></q-item-label>
            </q-item-section> -->
            <!-- <q-item-section avatar>
              <q-icon :name="link.icon" class="material-symbols-outlined" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section> -->
            <q-item-section avatar>
              <q-icon name="logout" class="material-symbols-outlined" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            class="q__drawer-item items-end items-center hidden"
            v-ripple
            clickable
          >
            <q-item-section avatar>
              <q-icon name="light_mode" class="material-symbols-outlined" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Light mode</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { ref, computed } from "vue";
import { LocalStorage } from "quasar";
import { linkActive } from "src/composables/References";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const leftDrawerOpen = ref(false);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    const logout = () => {
      // currentUserType.value = "Admin";
      // LocalStorage.set("Admin");
      // LocalStorage.remove(currentUserType.value);
      LocalStorage.remove("token");
      LocalStorage.remove("userType");
      LocalStorage.remove("userSession");
      LocalStorage.remove("userData");
      LocalStorage.remove("Admin");
      LocalStorage.remove("Staff");
      router.push("/login");
    };

    const links1 = [
      { icon: "home", text: "Dashboard", path: "/dashboard", class: "" },
      { icon: "group", text: "Accounts", path: "/accounts-mgmt", class: "" },
      { icon: "currency_ruble", text: "Sales", path: "/sales-mgmt", class: "" },
      {
        icon: "inventory",
        text: "Inventory",
        path: "/inventory-mgmt/Books",
        class: "",
      },
      { icon: "query_stats", text: "Forecasts", path: "/forecast-history" },
    ];

    // Reference for active class
    linkActive.value = `${route.path}`;

    const userType = LocalStorage.getItem("userSession");
    const checkIfAdmin = Boolean(userType.isAdmin === true);

    // Computed property to filter links based on checkIfAdmin
    const filteredLinks = computed(() => {
      if (checkIfAdmin) {
        return links1;
      } else {
        // Return filtered array excluding 'Accounts'
        return links1.filter(
          (link) => link.text !== "Accounts" && link.text !== "Forecasts"
        );
      }
    });

    // console.log(currentUserInfo);
    const currentUserInfo = LocalStorage.getItem("userData");

    return {
      router,
      route,
      leftDrawerOpen,
      toggleLeftDrawer,
      logout,
      links1,
      linkActive,
      checkIfAdmin,
      filteredLinks,
      currentUserInfo,
    };
  },
};
</script>

<style lang="sass">
.q

  &__toolbar
    height: 64px

  &__toolbar-input
    // width: 55%
    width: 20%
    border-radius: 12px
    background-color: #f5f5f5
    padding: 2px 8px
    font-size: 16px
    margin-top: 16px !important
    margin-right: 8px

  &__toolbar-input:active
    background-color: transparent !important

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: 16px !important
      // font-weight: 500
      line-height: 1.25rem

    // &:hover
    //   color: #000

  // &__drawer-item:hover
  //   border-radius: 12px !important

  &__drawer-item:active
    color: $primary !important
    border-left: 2px solid $primary
</style>
